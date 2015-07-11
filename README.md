# meteorkitchen-template-plugins
===
[Meteor Kitchen](http://www.meteorkitchen.com/)  plugins for generate custom component by using [doT](http://olado.github.io/doT/) template engine

Plugin help generate custom code of component without create new plugin for new type of component

##Install: 
---
```sh
cd $HOME/.meteor-kitchen/plugins
git clone https://github.com/baysao/meteorkitchen-template-plugins.git template
cd template
npm install
```

##Usage:
----
###Define component:
Type component is "template"
There is 3 properties:

- view_template: template path absolute to doT template file. Template use syntax [[ instead default {{ and ]] instead of }}.
- controller_template: (the same as view_template)
- template_data: json files declare data apply to file in view_template and controller_template

```json
{
  "name": "layoutMenu",
  "type": "template",
  "view_template": "/myproject/files/templates/layoutMenu.html",
  "controller_template": "/myproject/files/templates/layoutMenu.js",
  "template_data": {"name":"myLayout", "content":"<span>hello</span>"}
}
```

example content of /myproject/files/templates/layoutMenu.html
```html
<template name="[[= it.name]]">
   [[= it.content]]
</template>
```
