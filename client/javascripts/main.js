/* DISCLAIMER: This code is in need of some serious clean-up and re-organizing. Right now, all of this is just a POC. A rewrite may be in the future */

Meteor.subscribe("messages");
Meteor.subscribe("allusers");

var timeLoaded = Date.now();
Session.set("MessageCountLimit", 200);

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
    if (Meteor.user()) {
        // check to see if active state has changed since last setting
        if (Meteor.user().profile.active !== isActive) {
            AllUsers.update(Meteor.user(), { $set: { profile : { active: isActive } }});
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

function newMessage (input) {
    if(input.value !== '') {
        Messages.insert({
            author: Meteor.user(),
            body: input.value,
            time: Date.now()
        });
        setLastRead();
        input.value = '';
    }
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

/* Define how user should sign up to website */
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

/* Add message listener to add unread count */
Messages.find({}).observeChanges({
    added: function (message) {
        Session.set("shouldScroll", domUtils.shouldAutoScroll($('.messages')));
        Session.set("prevScroll", $('.messages').prop("scrollTop"));

        if (Messages.findOne(message).time > timeLoaded) {
            Session.set("MessageCountLimit", Session.get("MessageCountLimit") + 1);
        }
        setUnreadCount();

        // alert if username is mentioned
        if (hasUsersName(message, Meteor.user)) {
            alertCurrentUser();
        }
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
    return AllUsers.find();
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
    'keydown .chatInputBox': function(ev) {
        var messageBox = ev.target;
        if (ev.which == 13 && !ev.ctrlKey &&  !ev.shiftKey) {
            newMessage(messageBox);
            ev.preventDefault();
        } else if (ev.which == 9 && !ev.ctrlKey &&  !ev.shiftKey) {
            var user = predictUser(messageBox, Meteor.users);
            if (user.length > 0) {
                messageBox.value = user;
            }
            ev.preventDefault();
        }
    },
    'click #add-message-form .chatInputAction': function(ev) {
        ev.preventDefault();
        newMessage(ev.target);
    }
};

Template.chatBox.created = function () {
    setLastRead();
};

// Rendered is called after a new message is added to the list (since it has to re-render itself)
Template.chatBox.rendered = function () {
    var messageContainer = $('.messages');
    //console.log(messageContainer.prop("scrollTop"));
    if (Session.get("shouldScroll")) {
      //  console.log('scrolling');
        domUtils.scrollToBottom(messageContainer);
    } else {
        domUtils.scrollTo(messageContainer, Session.get("prevScroll"));
    }
};

Template.chatBox.messages = function () {
    //var messages = Messages.find({}, { sort: { time: 1 }});
    var messageLimit = Session.get("MessageCountLimit");

    return Messages.find({}, { sort: { time: -1 }, limit: messageLimit }).fetch().reverse();
};

Template.chatBox.unreadStatus = function () {
    var lastViewTime = Session.get("lastViewTime");
    var isNew = this.time > lastViewTime;
    return isNew ? "unread" : "read";
};

Template.chatBox.messenger = function () {
    var user = AllUsers.findOne({ _id: this.author._id});
    var username = "";

    if (this.author._id === Meteor.user()._id) {
        username = "Me";
    } else if (user && "username" in user) {
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

    var formatted = formatTime(time);

    return formatted;
};

Template.chatBox.user = function () {
    return this.author._id === Meteor.user()._id ? "user" : "";
};

function isSameDay (date1, date2) {
    return ((date1.getFullYear()==date2.getFullYear())&&(date1.getMonth()==date2.getMonth())&&(date1.getDate()==date2.getDate()));
}

previousPostedTime = new Date(0);
Template.chatBox.newDay = function () {
    var isNewDay = false;

    // convert time for message to day
    var postedTime = new Date(this.time);

    // compare against previous time
    if (!isSameDay(postedTime, previousPostedTime)) {
        // if different, post result
        isNewDay = true;
    }

    previousPostedTime = postedTime;

    return isNewDay;
};

Template.chatBox.dayStamp = function () {
    var postedTime = new Date(this.time);

    return $.datepicker.formatDate('DD, MM d, yy', postedTime);
};