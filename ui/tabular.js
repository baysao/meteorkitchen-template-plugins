TabularTables.[[= it.name]] = new Tabular.Table({
    name: "[[= it.name]]",
    collection: [[= it.collection]],
    columns: [
        [[? it.columns]][[~ it.columns :column]]

        [[? column.command_template]]
        { "tmpl": Meteor.isClient && [[= column.command_template]] },
        [[??]]
            { "data": "[[= column.data]]", "title": "[[= column.title]]" },
        [[?]]

        [[~]][[?]]
    ]
});