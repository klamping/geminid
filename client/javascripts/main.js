var hidden = "hidden";

// Set up listeners for window focus change
if (hidden in document){
    document.addEventListener("visibilitychange", onFocusChange);
}
else if ((hidden = "mozHidden") in document) {
    document.addEventListener("mozvisibilitychange", onFocusChange);
}
else if ((hidden = "webkitHidden") in document){
    document.addEventListener("webkitvisibilitychange", onFocusChange);
}
else if ((hidden = "msHidden") in document) {
    document.addEventListener("msvisibilitycha£nge", onFocusChange);
}

var isIdle = false;

// set initial focus state to true
setInterval(function () {
    if (!isIdle) {
        setActive(!document[hidden]);
    }
}, 1500);

function setLastRead () {
    Session.set("lastViewTime", Date.now());
}

function setActive (isActive) {
    // check to see if active state has changed
    if (Meteor.user()) {
        if (Meteor.user().profile.active !== isActive) {
            Meteor.users.update(Meteor.user(), { $set: { profile : { active: isActive } }});
        }
    }
}
setActive(true);
$(document).idleTimer();
$(document).on("active.idleTimer", function () {
    isIdle = false;
    setActive(true);
});
$(document).on("idle.idleTimer", function () {
    isIdle = true;
    setActive(false);
});

/* Functionality for use by templates */
function onFocusChange () {
    Session.set('lastViewTime', Date.now());
    setActive(!document[hidden], Meteor.user());
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"[$1]($1)");
}

function shouldAutoScroll (container) {
    var scrollHeight = container.prop("scrollHeight");
    var scrollTop = container.prop("scrollTop");
    var height = container.height();
    return (height + scrollTop) > scrollHeight - 200;
}

function newMessage () {
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
}

function getUnreadMessageCount(lastViewTime) {
    var unreadCount = 0;

    unreadCount = Messages.find({ time: { $gt: lastViewTime }}).count();

    return unreadCount;
}

function setUnreadCount () {
    var lastViewed = Session.get("lastViewTime");
    var count = getUnreadMessageCount(lastViewed);

    var text = "Chat";

    if (count > 0 && document[hidden]) {
        text = "(" + count + ") " + text;
    }

    document.title = text;
}

function scrollChat () {
    var chat = $('.messages');
    chat.prop("scrollTop", chat.prop("scrollHeight"));
}

/* Define how user should sign up to website */
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

/* Add message listener to add unread count */
Messages.find({}).observe({
    added: function () {
        setUnreadCount();
    }
});

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
    setLastRead();
};

Template.chatBox.rendered = function () {
    if (shouldAutoScroll($('.messages'))) {
        scrollChat();
    }
};

Template.chatBox.messages = function () {
    //return Messages.find({}, { sort: { time: -1 }, limit: 200 });
    return Messages.find({}, { sort: { time: 1 } });
};

Template.chatBox.unreadStatus = function () {
    var isNew = this.time > Session.get("lastViewTime");
    return isNew ? "unread" : "read";
};

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

    var output = hours + ":" + minutes /*+ ":" + seconds*/ + " " + meridian;

    return output;
};

Template.chatBox.user = function () {
    return this.author._id === Meteor.user()._id ? "user" : "";
};