/* DISCLAIMER: This code is in need of some serious clean-up and re-organizing. Right now, all of this is just a POC. A rewrite may be in the future */
Meteor.subscribe("messages");
Meteor.subscribe("allusers");
Meteor.subscribe("rooms");

var timeLoaded = Date.now();
Session.set("MessageCountLimit", 200);

// Set up listeners for window focus change
var hidden = "hidden"; // W3C 'hidden' event name
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
var doc = $(document);
doc.idleTimer();
doc.on("active.idleTimer", function () {
    isIdle = false;
    setActive(true);
});
doc.on("idle.idleTimer", function () {
    isIdle = true;
    setActive(false);
});

/* Functionality for use by templates */
function onFocusChange () {
    Session.set('lastViewTime', Date.now());
    setActive(!document[hidden], Meteor.user());
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
Messages.find({}).observe({
    _suppress_initial: true,
    added: function (message) {
        console.log("This shouldn't run on initial page load");
        message = Messages.findOne(message);

        Session.set("shouldScroll", domUtils.shouldAutoScroll($('.messages')));
        Session.set("prevScroll", $('.messages').prop("scrollTop"));

        if (message.time > timeLoaded) {
            Session.set("MessageCountLimit", Session.get("MessageCountLimit") + 1);
        }
        setUnreadCount();

        // alert if username is mentioned
        if (Meteor.user() && MessageUtils.hasUsersName(message.body, Meteor.user().username)) {
            MessageUtils.alertCurrentUser(message.body);
        }
    }
});