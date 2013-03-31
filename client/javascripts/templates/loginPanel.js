Template.loginPanel.meteor_status = function () {
    var icon;
    switch (Meteor.status().status) {
        case 'connecting':
            icon = "refresh";
            break;
        case 'connected':
            icon = "ok";
            break;
        case 'disconnected':
        default:
            icon = "remove";
    }
    return icon;
};

Template.loginPanel.loggedOut = function () {
    return Meteor.user() === null ? "logged-out" : "";
};