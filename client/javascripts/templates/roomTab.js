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

Template.roomTab.labelType = function () {
    var type = "";
    var count = unreadCount[this._id];

    if (count >= 1000) {
        type = "label-inverse";
    } else if (count >= 100) {
        type = "label-important";
    } else if (count == 42) {
        type = "label-success";
    } else if (count >= 10) {
        type = "label-warning";
    } else if (count > 0) {
        type = "label-info";
    }
    return type;
};