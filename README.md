geminid
========

Chat room built off of Meteor JS

Based off of this [Step by step guide to simple meteor.js app](https://github.com/krzysu/berlinjs-meteor)

[Trello task board](https://trello.com/board/chat-room/511f056b314cbe4205000d53)

## Features

 - Tab completion of names. Start typing a name and hit tab. If it recognizes the name, it will auto-fill the rest of it for you. (Note: it will choose the first name if there are multiple matches)

## Browser Support 

Put plainly, browser support right now sucks. This was originally built as a proof-of-concept, so corners were cut to get it running. This means that it only has support for Chrome. 

### Notifications

On the latest versions of Chrome (28+), you can get desktop notifications when your name is mentioned in a chat room.

## Contributing

All contributions are welcome. 

To run, install [Meteor](http://docs.meteor.com/#quickstart) and [Meteorite](https://github.com/oortcloud/meteorite#installing-meteorite). Once installed, in a console, navigate to root directory of repo, then enter the command `mrt`.

To run unit tests, install [Mocha](http://visionmedia.github.com/mocha/#installation) and run `mocha tests/unit/unit.js` in the root directory.

### Ways to contribute

 - **Build more unit tests.** Code coverage still can be improved greatly, so updating code to be unit testable is in high need
 - **Contribute a new feature or fix a bug.** See the Trello task board for feature ideas
 - **Test** More testing is definitely needed. Right now, this only runs in Chrome. 