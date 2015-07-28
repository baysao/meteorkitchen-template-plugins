Template['[[= it.name]]'].created = function(){
    [[? it.created]][[= it.created]][[?]]
}
Template['[[= it.name]]'].rendered = function(){
    [[? it.rendered]][[= it.rendered]][[?]]
}
Template['[[= it.name]]'].events({
    [[? it.helpers]]
            [[~ it.events :event]]
        [[= event.name]]: function(event,template){
            [[= event.code]]
        },
        [[~]]
    [[?]]
})
Template['[[= it.name]]'].helpers({
    [[? it.helpers]]
        [[~ it.helpers :helper]]
            [[= helper.name]]: function([[= helper.params]]) {
            [[= helper.code]]
            },
        [[~]]
            [[?]]
}
})
