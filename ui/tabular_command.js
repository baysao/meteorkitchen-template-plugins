Template['[[= it.name]]'].events({
        [[? it.buttons]] [[~ it.buttons :button]]
        [[? button.events]] [[~ button.events :event]]
        "[[= event.name]]": function (event,template) {
                [[= event.code]]
        },
        [[~]][[?]]
        [[~]][[?]]
});