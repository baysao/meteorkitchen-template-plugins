Template['[[= it.name]]'].events({
    "submit": function (e, t) {
        e.preventDefault();
        Router.go("[[= it.submit_route]]", {});
    },
    "click #form-cancel-button": function(e, t) {
        e.preventDefault();
        Router.go("[[= it.submit_route]]", {});
    }
});
AutoForm.addHooks(['[[= it.name]]'], {
    before: {
        [[? it.before_insert]]
            insert: function(doc){
                [[= it.before_insert]]
            },
        [[?]]

        [[? it.before_update]]
            update: function(modifier){
                [[= it.before_update]]
            },
        [[?]]
        }
});