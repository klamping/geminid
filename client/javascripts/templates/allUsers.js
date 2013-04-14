Template.allUsers.events = {
    "click .toggle-audio": function (ev) {
        var checked = ev.target.checked;
        Session.set("isAudioOn", checked);
    }
};

Template.allUsers.users = function() {
    return AllUsers.find();
};

Template.allUsers.beep = function () {
    var isAudioOn = Session.get("isAudioOn");
    return isAudioOn ? "checked" : "";
};