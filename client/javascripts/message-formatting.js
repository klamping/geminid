function replaceURLWithHTMLLinks(text) {
    // Find all URLs
    var exp = /(^|[^\]\(])((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    return text.replace(exp,"$1[$2]($2)");
}

if (typeof exports !== "undefined`") {
    exports.replaceURLWithHTMLLinks = replaceURLWithHTMLLinks;
}