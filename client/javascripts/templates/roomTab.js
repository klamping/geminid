Template.roomTab.events = {
    "click .room": function (ev) {
        Session.set("activeRoom", this._id);
        ev.preventDefault();
    }
};

Template.roomTab.isActive = function () {
    return Session.get("activeRoom") == this._id ? "active" : "";
};