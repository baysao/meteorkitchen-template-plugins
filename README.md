# meteorkitchen-template-plugins
Meteorkitchen plugins for generate custom component by using doT template engine

Plugin help generate custom code of component without create new plugin for new type of component

Install: 
```
cd $HOME/.meteor-kitchen/plugins
git clone https://github.com/baysao/meteorkitchen-template-plugins.git template
cd template
npm install
```

Using:
- Define component:
```
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
