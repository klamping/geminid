Meteor.publish("messages", function () {
  return Messages.find({}, { sort: { time: -1 }, limit: 200 });
});

Meteor.publish("allusers", function () {
    return Meteor.users.find({});
});