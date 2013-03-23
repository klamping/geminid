var chai = require("chai");
chai.should();

var utils = require("../../client/javascripts/message-formatting.js");

describe('Geminid', function(){
  describe('#replaceURLWithHTMLLinks()', function(){
    it('should replace a plain url with markdown format', function(){
        utils.replaceURLWithHTMLLinks("http://www.url.com").should.equal('[http://www.url.com](http://www.url.com)');
    });
    it('should replace a plain url in text with an  HTML link', function(){
        utils.replaceURLWithHTMLLinks("This http://www.url.com is my website").should.equal('This [http://www.url.com](http://www.url.com) is my website');
    });
    it('should not change Markdown links', function(){
        var markdownLink = "This is [an example](http://example.com/) inline link.";
        utils.replaceURLWithHTMLLinks(markdownLink).should.equal(markdownLink);
    });
  });
});