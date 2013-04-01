Template.chatBox.events = {
    'keydown .chatInputBox': function(ev) {
        var messageBox = ev.target;
        if (ev.which == 13 && !ev.ctrlKey &&  !ev.shiftKey) {
            newMessage(messageBox);
            ev.preventDefault();
        } else if (ev.which == 9 && !ev.ctrlKey &&  !ev.shiftKey) {
            var user = MessageUtils.predictUser(messageBox, Meteor.users);
            if (user.length > 0) {
                messageBox.value = user;
            }
            ev.preventDefault();
        }
    },
    'click #add-message-form .chatInputAction': function(ev) {
        ev.preventDefault();
        newMessage(ev.target);
    },
    'click .deleteRoom': function (ev) {
        Rooms.remove(Session.get("activeRoom"));
        setDefaultRoom(true);
    },
    'click .dismissDelete': function (ev) {
        $(".closeRoom").popover("hide");
    }
};

Template.chatBox.created = function () {
    setLastRead();
};

// Rendered is called after a new message is added to the list (since it has to re-render itself)
Template.chatBox.rendered = function () {
    var messageContainer = $('.messages');
    if (Session.get("shouldScroll")) {
        domUtils.scrollToBottom(messageContainer);
    } else {
        domUtils.scrollTo(messageContainer, Session.get("prevScroll"));
    }

    // initialize room creation popover
    $(".closeRoom").popover({
        html: true,
        placement: "left",
        content: "<button class='btn btn-danger deleteRoom'>Yes, Delete it</button> <button class='btn dismissDelete'>Nevermind</button>"
    });


    previousPostedTime = null;
};

Template.chatBox.messages = function () {
    //var messages = Messages.find({}, { sort: { time: 1 }});
    var messageLimit = Session.get("MessageCountLimit");

    return Messages.find({room: Session.get("activeRoom")}, { sort: { time: -1 }, limit: messageLimit }).fetch().reverse();
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
    body = MessageUtils.replaceURLWithHTMLLinks(body);

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


var previousPostedTime = null;
Template.chatBox.newDay = function () {
    var isNewDay = false;

    // convert time for message to day
    var postedTime = new Date(this.time);

    // compare against previous time
    if (previousPostedTime === null || !isSameDay(postedTime, previousPostedTime)) {
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


// Utility Functions
function newMessage (input) {
    if(input.value !== '') {
        Messages.insert({
            author: Meteor.user(),
            body: input.value,
            time: Date.now(),
            room: Session.get("activeRoom")
        });
        setLastRead();
        input.value = '';
    }
}
