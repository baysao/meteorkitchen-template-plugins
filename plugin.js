var kitchen = require("meteor-kitchen");
var util = require('util');
var mkdirp = require('mkdirp');
var beautify_js = require('js-beautify').js;
var beautify_html = require('js-beautify').html;
var beautify_css = require('js-beautify').css;
var component = kitchen.getInput();

var dots = require("dot");
var path = require("path");
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');

var env = process.env;
var default_templates_dirs = [
    path.join(env['PWD']),
    path.join(env['PWD'], 'templates'),
    path.join(env['PWD'], 'files', 'templates'),
    path.join(env['HOME'], '.meteor-kitchen', 'plugins', 'template', 'ui'),
    path.join(env['HOME'], '.meteor-kitchen', 'templates', 'ui', 'bootstrap3', 'components')
];


var helpers = {};
helpers = _.extend(helpers, _s);
var loadfile = function (file_path) {
    var mydir;
    if (!fs.existsSync(file_path)) {
        mydir = _.find(default_templates_dirs, function (template_dir) {
            return fs.existsSync(path.join(template_dir, file_path));
        });
    }
    if (mydir) {
        mypath = path.join(mydir, file_path);
        console.log('process file:' + mypath);
        return fs.readFileSync(mypath, "utf8");
    }
    else
        return null;
};
var defs = {
    loadfile: function (mypath) {
        var mydir = _.find(default_templates_dirs, function (template_dir) {
            return fs.existsSync(path.join(template_dir, mypath));
        });
        if (mydir) {
            mypath = path.join(mydir, mypath);
             console.log('process file:' + mypath);
              return fs.readFileSync(mypath);
        } else {
            return '';
        }
       
    }
};
dots.templateSettings = {
    evaluate: /\[\[([\s\S]+?)]]/g,
    interpolate: /\[\[=([\s\S]+?)]]/g,
    encode: /\[\[!([\s\S]+?)]]/g,
    use: /\[\[#([\s\S]+?)]]/g,
    useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
    define: /\[\[##\s*([\w\.$]+)\s*(:|=)([\s\S]+?)#]]/g,
    defineParams: /^\s*([\w$]+):([\s\S]+)/,
    conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*]]/g,
    iterate: /\[\[~\s*(?:]]|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*]])/g,
    varname: 'it,helpers',
    strip: false,
    append: true,
    selfcontained: false,
    doNotSkipEncoded: false
};
var beautifier_options =
{
    "indent_size": 4,
    "indent_char": " ",
    "eol": "\n",
    "indent_level": 0,
    "indent_with_tabs": false,
    "preserve_newlines": false,
    "max_preserve_newlines": 1,
    "jslint_happy": false,
    "space_after_anon_function": false,
    "brace_style": "collapse",
    "keep_array_indentation": false,
    "keep_function_indentation": false,
    "space_before_conditional": true,
    "break_chained_methods": false,
    "eval_code": false,
    "unescape_strings": false,
    "wrap_line_length": 0,
    "wrap_attributes": "auto",
    "wrap_attributes_indent_size": 4,
    "end_with_newline": false
};
var compileFromFile = function (template, data) {
    var out = '';
    if (template) {
        var view = loadfile(template);
        if (view)  out = dots.template(view, null, defs)(data,helpers);
    }
    return out;
}
function processComponent(component) {
    //console.log(util.inspect(component, false, null));
    var htmlArr = [];
    var jsArr = [];
    var cssArr = [];

    var config_file = component['template'] + '.json';
    var config = compileFromFile(config_file, component);

    if (config) {
         config = JSON.parse(config);
         // console.log('------------before------------');
         // console.log(util.inspect(config, false, null));
         // console.log('------------config------------');
        // console.log(config);
        // console.log('------------after------------');
        component = _.defaults(component, config);
         //console.log(util.inspect(component, false, null));
        // console.log('------------------------');
    }
// console.log(util.inspect(component, false, null));
    if (component.components) {
        component.components = _.map(component.components, function (child_component) {
            if (component.root)
                child_component.root = path.join(component.root, child_component.name);

            var child = processComponent(child_component);
            //console.log('child:' + child);
            if (child.html) htmlArr.push(child.html);
            if (child.js) jsArr.push(child.js);
            if (child.css) cssArr.push(child.css);
            return child;
        })
    }

    if (!component.html) {
        var template_file = component['template'] + '.html';
        component.html = compileFromFile(template_file, component);
    }

    if (!component.js) {
        var template_file = component['template'] + '.js';
        component.js = compileFromFile(template_file, component);
    }

    if (!component.css) {
        var template_file = component['template'] + '.css';
        component.css = compileFromFile(template_file, component);
    }

    if (!_.isEmpty(htmlArr)) {
        component.html = component.html + '\n' + htmlArr.join('\n');
    }
    if (!_.isEmpty(jsArr)) {
        component.js = component.js + '\n' + jsArr.join('\n');
    }
    if (!_.isEmpty(cssArr)) {
        component.css = component.css + '\n' + cssArr.join('\n');
    }
    if (component.fileout) {
        var outdir = path.join(process.env['PWD'], component.fileout);
        //console.log('outdir:' + outdir);
        if (component.html && component.html.length > 0) {
            component.html = beautify_html(component.html,beautifier_options);
            fs.writeFile(path.join(outdir, component.name + '.html'), component.html, {flags: 'w'}, function (err) {
                if (err) return console.log(err);
            });
        }
        if (component.js && component.js.length > 0) {
            component.js = beautify_js(component.js,beautifier_options);
            fs.writeFile(path.join(outdir, component.name + '.js'), component.js, {flags: 'w'}, function (err) {
                if (err) return console.log(err);
            });
        }
        if (component.css && component.css.length > 0) {
            component.css = beautify_css(component.css,beautifier_options);
            fs.writeFile(path.join(outdir, component.name + '.css'), component.css, {flags: 'w'}, function (err) {
                if (err) return console.log(err);
            });
        }
        component.html = component.js = component.css = '';
    }

    return component;
}
if (component['template_data']) {
    var mycomponent = component['template_data'];
    mycomponent = processComponent(mycomponent);
    component.js = mycomponent.js;

    component.html = beautify_html(mycomponent.html,beautifier_options);
    component.js = beautify_js(mycomponent.js, beautifier_options);
    component.css = beautify_css(mycomponent.css,beautifier_options);

    if (mycomponent.css && mycomponent.css.length > 0) {
        var cssdir = mycomponent.root ? mycomponent.root : path.join(process.env['PWD'], 'client/styles');
        mkdirp.sync(cssdir);
        fs.writeFile(path.join(cssdir, mycomponent.name + '.css'), component.css, {flags: 'w'}, function (err) {
            if (err) return console.log(err);
        });
    }


} else {
    component.html = '';
    component.js = '';
    component.css = '';
}


// console.log(util.inspect(component, false, null));

// write output
kitchen.setOutput(component);
