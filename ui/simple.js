Template['[[= it.name]]'].helpers({
    [[? it.helpers]]
        [[~ it.helpers :helper]]
            [[= helper.name]]: function(event,template){
                [[= helper.code]]
            },
        [[~]]
    [[?]]
})
