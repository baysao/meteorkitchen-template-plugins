# meteorkitchen-template-plugins
===
[Meteor Kitchen](http://www.meteorkitchen.com/)  plugins for generate custom component by using [doT](http://olado.github.io/doT/) template engine

Plugin help generate custom code of component without create new plugin for new type of component
Beside that, we can create ui library and reuse it. 

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
There is 2 main properties:
- type: "template
- template_data: json data structure of your component

In template_data JSON, you can describe **template** name (template name will search in template directories) and **json data** that will apply for context of template. Beside that, you can break you component in smaller ones by using property *components*

Template name will search in order and return first found. Here is the list
```js
  var default_templates_dirs = [
    path.join(env['PWD']),
    path.join(env['PWD'], 'files', 'templates'),
    path.join(env['HOME'], '.meteor-kitchen', 'plugins', 'template', 'ui'),
    path.join(env['HOME'], '.meteor-kitchen', 'templates', 'ui', 'bootstrap3', 'components')
];
```

Please view example [here](https://github.com/baysao/meteorkitchen-template-plugins/tree/master/examples/tabs) 
Ex: 
```json
 "template_data": {
        "name": "tabsComponent", // name of template
        "template": "tabs", // name of templates, this name will search in templates directory default file tabs.html and tabs.js 
        "data":"{{> contentTab2}}"
        "components": [  // more nested components, mainly use as a partial of component
              {
                "name": "contentTab2",
                "template": "simple",
                "data": "content of Tab2"
              }
          ]
  }
```
