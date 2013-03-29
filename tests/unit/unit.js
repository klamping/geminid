var chai = require("chai");
chai.should();

var messageUtils = require("../../client/javascripts/message-formatting.js");
var timeUtils = require("../../client/javascripts/time-formatting.js");
var domUtils = require("../../client/javascripts/dom-utils.js");

describe('Geminid', function () {
    // message formatting
    describe('#replaceURLWithHTMLLinks()', function(){
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

    describe("#shouldAutoScroll", function () {

        // create a mock of jquery behavior
        var createContainer = function (scrollHeight, scrollTop, height) {
            return {
                scrollHeight: scrollHeight,
                scrollTop: scrollTop,
                contHeight: height,
                prop : function (attr) {
                    return this[attr];
                },
                height: function () {
                    return this.contHeight;
                }
            };
        };

        it("should scroll when scrolled to the bottom of the container", function () {
            var cont = createContainer(800, 600, 200);
            domUtils.shouldAutoScroll(cont).should.equal(true);
        });
        it("should not scroll when not scrolled to the bottom of the container", function () {
            var cont = createContainer(800, 588, 200);
            domUtils.shouldAutoScroll(cont).should.equal(false);
        });
    });
});