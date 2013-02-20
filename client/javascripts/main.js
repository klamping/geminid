(function () {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
}());

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

function setUnreadCount () {
    var lastViewed = Session.get("lastViewTime");

    var unread = Messages.find({ time: { $gt: lastViewed }}).count();

    var text = "";

    if (unread > 0 && Session.get('isWindowFocused') === false) {
        text = " (" + unread + ")";
    }

    document.title = "Chat" + text;
}

function scrollChat () {
    var chat = $('.messages');
    chat.prop("scrollTop", chat.prop("scrollHeight"));
}

function setLastRead () {
    Session.set("lastViewTime", Date.now());
}

function setActive (isActive) {
    Meteor.users.update(Meteor.user(), { $set: { profile : { active: isActive } }});
}
setActive(true);
$(document).idleTimer();
$(document).on("active.idleTimer", function () { setActive(true); });
$(document).on("idle.idleTimer", function () { setActive(false); });

Template.loginPanel.loggedOut = function () {
    return Meteor.user() === null ? "logged-out" : "";
};

Template.allUsers.users = function() {
    return Meteor.users.find();
};

Template.userProfile.email = function() {
    var displayName = "";
    if ("username" in this) {
        displayName = this.username;
    }
    else if ("emails" in this) {
        displayName = this.emails[0].address;
    }
    return displayName;
};
Template.userProfile.status = function () {
    var isFocused = this.profile ? this.profile.active : false;
    return isFocused ? "" : " (idle)";
};


Template.chatBox.events = {
    'keydown #add-message-form .chatInputBox': function(ev) {
        if (ev.which == 13) {
            newMessage();
        }
    },
    'click #add-message-form .chatInputAction': function(ev) {
        ev.preventDefault();
        newMessage();
    }
};

Template.chatBox.created = function () {
    scrollChat();
    setLastRead();
};

Template.chatBox.rendered = function () {
    if (Session.get('autoScrollChat')) {
        scrollChat();
    }
};

Template.chatBox.messages = function () {
    return Messages.find({}, { sort: { time: 1 }, limit: 500 });
    //return Messages.find({}, { sort: { time: 1 } });
};

Template.chatBox.unreadStatus = function () {
    var isNew = this.time > Session.get("lastViewTime");
    return isNew ? "unread" : "read";
};

function onchange () {
    var state = this.visibilityState || this.webkitVisibilityState || this.mozVisibilityState;

    Session.set('lastViewTime', Date.now());
    if (state === "visible") {
        Session.set('isWindowFocused', true);
        setActive(true, Meteor.user());
        setUnreadCount();
    }
    else {
        Session.set('isWindowFocused', false);
        setActive(false, Meteor.user());
        setUnreadCount();
    }
}

Template.chatBox.messenger = function () {
    var user = Meteor.users.findOne({ _id: this.author._id});
    var username = "";

    if (this.author._id === Meteor.user()._id) {
        username = "Me";
    } else if ("username" in user) {
        username = user.username;
    } else if ("emails" in this.author) {
        username = this.author.emails[0].address;
    }


    return username;
};

Template.chatBox.user = function () {
    return this.author._id === Meteor.user()._id ? "user" : "";
};

Messages.find({}).observe({
    added: function () {
        if (Session.get("isWindowFocused") === false) {
            setUnreadCount();
        }

        var chat = $('.messages');
        var scrollHeight = chat.prop("scrollHeight");
        var scrollTop = chat.prop("scrollTop");
        var height = chat.height();
        Session.set('autoScrollChat', (height + scrollTop === scrollHeight));
    }
});

var newMessage = function() {
    var input = document.getElementById('message-input');

    if(input.value !== '') {
        Messages.insert({
            author: Meteor.user(),
            body: input.value,
            time: Date.now()
        });
        setLastRead();
    }

    input.value = '';
};