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
    if (!this.profile) {
        return '';
    }

    if (this.profile.online === false) {
        return " (offline)";
    } else if (this.profile.active === false) {
        console.log(this.profile.active)
        return " (idle)";
    }
    return '';
};


Template.chatBox.events = {
    'keydown #add-message-form .chatInputBox': function(ev) {
        if (ev.which == 13 && !ev.ctrlKey &&  !ev.shiftKey) {
            newMessage();
            ev.preventDefault();
        } else {
            // check for autocomplete names
            // get last word being typed
            // does it start with @?
            // does it match against list of names
            // autofill w/ gray screenname
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

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"[$1]($1)");
}

Template.chatBox.body = function () {
    var body = this.body;

    // convert all hyperlinks to html links
    body = replaceURLWithHTMLLinks(body);

    return body;
};

Template.chatBox.timestamp = function () {
    var time = this.time;

    var date = new Date(time);

    var hours = date.getHours();
    var meridian = "AM";

    if (hours > 12) {
        hours -= 12;
        meridian = "PM";
    }

    var minutes = ('0' + date.getMinutes()).slice(-2);
    //var seconds = ('0' + date.getSeconds()).slice(-2);

    var output = hours + ":" + minutes /*+ ":" + seconds*/ + " " + meridian;

    return output;
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