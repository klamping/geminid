Meteor.publish("rooms", function () {
    return Rooms.find({});
});

Meteor.publish("messages", function () {
  return Messages.find({});
});

Meteor.publish("allusers", function () {
    return Meteor.users.find({});
});