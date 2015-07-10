# meteorkitchen-template-plugins
===
Meteorkitchen plugins for generate custom component by using doT template engine

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
There is 4 properties:

- view_template: template path absolute to doT template file. Template use syntax [[ instead default {{ and ]] instead of }}.
- view_data: json files declare data apply to file in view_template
controller_template and controller_data is the same for generate JS blaze template for VIEW

```json
{
  "name": "layoutMenu",
  "type": "template",
  "view_template": "/myproject/files/templates/layoutMenu.html",
  "view_data": {"name":"myLayout", "content":"<span>hello</span>"},
  "controller_template": "/myproject/files/templates/layoutMenu.js",
  "controller_data": {"title":"myLayout"}
}
```

example content of /myproject/files/templates/layoutMenu.html
```
<template name="[[= it.name]]">
   [[= it.content]]
</template>
```
