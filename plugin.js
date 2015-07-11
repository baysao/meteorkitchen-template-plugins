var kitchen = require("meteor-kitchen");
var component = kitchen.getInput();

var dots = require("dot");
var fs = require('fs');
var loadfile = function (path) {
    return fs.readFileSync(path, "utf8");
};
dots.templateSettings = {
    evaluate: /\[\[([\s\S]+?)]]/g,
    interpolate: /\[\[=([\s\S]+?)]]/g,
    encode: /\[\[!([\s\S]+?)]]/g,
    use: /\[\[#([\s\S]+?)]]/g,
    define: /\[\[##\s*([\w\.$]+)\s*(:|=)([\s\S]+?)#]]/g,
    conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*]]/g,
    iterate: /\[\[~\s*(?:]]|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*]])/g,
    varname: 'it',
    strip: false,
    append: true,
    selfcontained: false
};
component['template_data'] =  component['template_data'] ?  component['template_data']: {};

if(component['view_template']) {
    var view = loadfile(component['view_template']);
    component.html = dots.template(view)(component['template_data']);
} else {
    component.html = '';
}
if(component['controller_template']) {
    var controller = loadfile(component['controller_template']);
    component.js = dots.template(controller)(component['template_data']);
} else {
    component.js = '';
}
// write output
kitchen.setOutput(component);
