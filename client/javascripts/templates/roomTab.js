Template.roomTab.events = {
    "click .room": function (ev) {
        Session.set("activeRoom", this._id);
        unreadCount[this._id] = 0;
        ev.preventDefault();
    }
};

Template.roomTab.isActive = function () {
    return Session.get("activeRoom") == this._id ? "active" : "";
};

Template.roomTab.missedMessages = function () {
    var count = 0;
    if (typeof unreadCount[this._id] !== "undefined") {
        count = unreadCount[this._id];
    }
    return count;
};