var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

var dots = require("dot");
var path = require("path");
var fs = require('fs');
var _ = require('underscore');

var env = process.env;
var default_templates_dirs = [
    path.join(env['PWD']),
    path.join(env['PWD'], 'files', 'templates'),
    path.join(env['HOME'], '.meteor-kitchen', 'plugins', 'template', 'ui'),
    path.join(env['HOME'], '.meteor-kitchen', 'templates', 'ui', 'bootstrap3', 'components')
];

var loadfile = function (file_path) {
    var mydir;
    if (!fs.existsSync(file_path)) {
        mydir = _.find(default_templates_dirs, function (template_dir) {
            return fs.existsSync(path.join(template_dir, file_path));
        });
    }
    if (mydir) {
        mypath = path.join(mydir, file_path);
        return fs.readFileSync(mypath, "utf8");
    }
    else
        return null;
};

dots.templateSettings = {
    evaluate: /\[\[([\s\S]+?)]]/g,
    interpolate: /\[\[=([\s\S]+?)]]/g,
    encode: /\[\[!([\s\S]+?)]]/g,
    use: /\[\[#([\s\S]+?)]]/g,
    useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
    define: /\[\[##\s*([\w\.$]+)\s*(:|=)([\s\S]+?)#]]/g,
    defineParams:/^\s*([\w$]+):([\s\S]+)/,
    conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*]]/g,
    iterate: /\[\[~\s*(?:]]|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*]])/g,
    varname: 'it',
    strip: false,
    append: true,
    selfcontained: false,
    doNotSkipEncoded: false
};
function processComponent(component) {
    var htmlArr = [];
    var jsArr = [];
    if(component.components) {
        component.components = _.map(component.components, function(child_component){
            var child = processComponent(child_component);
            if(child.fileout) {
                var outdir = path.join(process.env['PWD'], child.fileout);
                if (child.html) {
                    fs.writeFile(path.join(outdir, child.name + '.html'), child.html, function (err) {
                        if (err) return console.log(err);
                    });
                }
                if (child.js) {
                    fs.writeFile(path.join(outdir, child.name + '.js'), child.js, function (err) {
                        if (err) return console.log(err);
                    });
                }
            } else {
                if (child.html) htmlArr.push(child.html);
                if (child.js) jsArr.push(child.js);
            }
            return child;
        })
    }
    var view_template, controller_template;
    if (component['template']) {
        view_template = component['template'] + '.html';
        controller_template = component['template'] + '.js';
    }

    if (!component.html) {
        component.html = '';
        if (view_template) {
            var view = loadfile(view_template);
            if (view)
                component.html = dots.template(view)(component);
        }
    }

    if (!component.js) {
        component.js = '';
        if (controller_template) {
            var view = loadfile(controller_template);
            if (view)
                component.js = dots.template(view)(component);
        }
    }
    if(!_.isEmpty(htmlArr)) {
        component.html = component.html + '\n' + htmlArr.join('\n');
    }
    if(!_.isEmpty(jsArr)) {
        component.js = component.js + '\n' + jsArr.join('\n');
    }
    return component;
};

if (component['template_data']) {
    var mycomponent = component['template_data'];
    mycomponent = processComponent(mycomponent);
    component.js = mycomponent.js;
    component.html = mycomponent.html;
} else {
    component.html = '';
    component.js = '';
}

// write output
kitchen.setOutput(component);
