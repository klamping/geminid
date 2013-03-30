var chai = require("chai");
chai.should();

var messageUtils = require("../../client/javascripts/message-formatting.js").messageUtils;
var timeUtils = require("../../client/javascripts/time-formatting.js");
var domUtils = require("../../client/javascripts/dom-utils.js").domUtils;

describe('Geminid', function () {
    // message formatting
    describe('#replaceURLWithHTMLLinks()', function (){
        it('should replace a plain url with markdown format', function(){
            messageUtils.replaceURLWithHTMLLinks("http://www.url.com").should.equal('[http://www.url.com](http://www.url.com)');
        });
        it('should replace a plain url in text with an  HTML link', function(){
            messageUtils.replaceURLWithHTMLLinks("This http://www.url.com is my website").should.equal('This [http://www.url.com](http://www.url.com) is my website');
        });
        it('should replace multiple plain urls in text with an  HTML link', function(){
            messageUtils.replaceURLWithHTMLLinks("This http://www.url.com is my website and this http://www.urla.com is yours").should.equal('This [http://www.url.com](http://www.url.com) is my website and this [http://www.urla.com](http://www.urla.com) is yours');
        });
        it('should not change Markdown links', function(){
            var markdownLink = "This is [an example](http://example.com/) inline link.";
            messageUtils.replaceURLWithHTMLLinks(markdownLink).should.equal(markdownLink);
        });
        it('should replace some links but not others', function(){
            var multiLink = "This is [an example](http://example.com/) inline link and here's a plain one http://example.com/.";
            var multiLinkResult = "This is [an example](http://example.com/) inline link and here's a plain one [http://example.com/](http://example.com/).";
            messageUtils.replaceURLWithHTMLLinks(multiLink).should.equal(multiLinkResult);
        });
    });
    describe('#predictUser()', function() {
        // create mock users object (TODO replace with mock MongoDB)
        var users = {
            findOne: function () {
                // this function just returns a default username... need to update to test regEx
                return {
                    username: "username"
                };
            }
        };

        function createInputBox (value, cursorPos) {
            return {
                value: value,
                selectionStart: cursorPos
            };
        }

        it("should replace the beginning of a username with the full name", function () {
            var input = createInputBox("this is user", 12);
            var text = messageUtils.predictUser(input, users);
            text.should.equal("this is username");

            var middleContent = createInputBox("this is user which has cursor in middle", 12);
            var middleContentText = messageUtils.predictUser(middleContent, users);
            middleContentText.should.equal("this is username which has cursor in middle");
        });

        it("should not replace if text before cursor doesn't match", function () {
            var input = createInputBox("this is user", 8);
            var text = messageUtils.predictUser(input, users);
            text.should.equal("this is user");
        });
    });
    describe('#hasUsersName()', function() {
        it("should match if text matches name", function () {
            messageUtils.hasUsersName("username", "username").should.equal(true);
        });
        it("should not match a name that's not a whole word", function () {
            messageUtils.hasUsersName("user", "username").should.equal(false);
            messageUtils.hasUsersName("username", "user").should.equal(false);
        });
        it("should match a name at the beginning of the text", function () {
            messageUtils.hasUsersName("user with text", "user").should.equal(true);
        });
        it("should match a name at the end of the text", function () {
            messageUtils.hasUsersName("text with user", "user").should.equal(true);
        });
        it("should match a name in the middle of the text", function () {
            messageUtils.hasUsersName("text with user with text", "user").should.equal(true);
        });
        it("should match a name regardless of case", function () {
            messageUtils.hasUsersName("User", "user").should.equal(true);
        });
    });

    // time formatting
    describe('#formatTime()', function(){
        it('should state time before noon as AM', function(){
            var oneAm = new Date(01, 01, 01, 01);
            timeUtils.formatTime(oneAm).should.equal("1:00 AM");
        });

        it('should format time after or on noon as PM', function(){
            var noon = new Date(01, 01, 01, 12);
            var onePm = new Date(01, 01, 01, 13);
            var fourTwenty = new Date(01, 01, 01, 16, 20);

            timeUtils.formatTime(noon).should.equal("12:00 PM");
            timeUtils.formatTime(onePm).should.equal("1:00 PM");
            timeUtils.formatTime(fourTwenty).should.equal("4:20 PM");
        });

        it('should format time in HH:MM MERIDIAN format', function(){
            var threeFourteenAm = new Date(01, 01, 01, 03, 14);
            timeUtils.formatTime(threeFourteenAm).should.equal("3:14 AM");
        });
    });

    // Dom Utils
    // create a mock of jquery behavior
    var createContainer = function (scrollHeight, scrollTop, height) {
        return {
            scrollHeight: scrollHeight,
            scrollTop: scrollTop,
            contHeight: height,
            length: 1,
            prop : function (attr, value) {
                if (typeof value !== "undefined") {
                    this[attr] = value;
                }

                return this[attr];
            },
            height: function () {
                return this.contHeight;
            }
        };
    };

    describe("#shouldAutoScroll", function () {
        it("should scroll when scrolled to the bottom of the container", function () {
            var cont = createContainer(800, 600, 200);
            domUtils.shouldAutoScroll(cont).should.equal(true);
        });
        it("should not scroll when not scrolled to the bottom of the container", function () {
            var cont = createContainer(800, 588, 200);
            domUtils.shouldAutoScroll(cont).should.equal(false);
        });
    });

    describe("#scrollToBottom", function () {
        it("should scroll to bottom of container if not there", function () {
            var cont = createContainer(800, 0, 200);
            domUtils.scrollToBottom(cont);
            cont.scrollTop.should.equal(800);
        });
        it("should scroll to bottom of container if already there", function () {
            var cont = createContainer(800, 800, 200);
            domUtils.scrollToBottom(cont);
            cont.scrollTop.should.equal(800);
        });
    });

    describe("#scrollTo", function () {
        it("should scroll to position", function () {
            var cont = createContainer(800, 0, 200);
            domUtils.scrollTo(cont, 200);
            cont.scrollTop.should.equal(200);
        });
    });
});