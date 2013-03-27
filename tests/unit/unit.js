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
    it('should replace multiple plain urls in text with an  HTML link', function(){
        utils.replaceURLWithHTMLLinks("This http://www.url.com is my website and this http://www.urla.com is yours").should.equal('This [http://www.url.com](http://www.url.com) is my website and this [http://www.urla.com](http://www.urla.com) is yours');
    });
    it('should not change Markdown links', function(){
        var markdownLink = "This is [an example](http://example.com/) inline link.";
        utils.replaceURLWithHTMLLinks(markdownLink).should.equal(markdownLink);
    });
    it('should replace some links but not others', function(){
        var multiLink = "This is [an example](http://example.com/) inline link and here's a plain one http://example.com/.";
        var multiLinkResult = "This is [an example](http://example.com/) inline link and here's a plain one [http://example.com/](http://example.com/).";
        utils.replaceURLWithHTMLLinks(multiLink).should.equal(multiLinkResult);
    });
  });
});