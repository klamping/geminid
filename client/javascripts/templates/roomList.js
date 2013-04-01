Template.roomList.events = {
    "click .room": function (ev) {
        Session.set("activeRoom", this._id);
        ev.preventDefault();
    },
    "click .addRoom a": function (ev) {
        // pop modal to create room
        $(this).popover('show');
        ev.preventDefault();
    }
};

Template.roomList.created = function () {
    // Set the first room to display
    var firstRoom = Rooms.findOne();
    Session.set("activeRoom", firstRoom._id);
};

Template.roomList.isActive = function () {
    return Session.get("activeRoom") == this._id ? "active" : "";
};