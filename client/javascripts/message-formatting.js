var messageUtils = {
    replaceURLWithHTMLLinks : function(text) {
        // Find all URLs
        var exp = /(^|[^\]\(])((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

        return text.replace(exp,"$1[$2]($2)");
    },
    predictUser : function (input, users) {
        var username = "";

        var text = input.value;

        // get word immediately before the cursor
        var cursorPos = input.selectionStart;

        var preceding = text.substring(0, cursorPos);

        var words = preceding.split(' ');
        var lastWord = words[words.length - 1];

        // make sure it's not a space
        if (lastWord.length > 0) {
            var userRegEx = new RegExp(lastWord, "i");

            // TODO allow for tabbing through names
            var user = users.findOne({"username": userRegEx});

            if (user) {
                text = text.replace(lastWord, user.username);
            }
        }

        return text;
    },
    hasUsersName : function (text, username) {
        // check text for users name
        var regEx = new RegExp("\\b" + username + "\\b", "i");

        return regEx.test(text);
    },
    alertCurrentUser : function () {
        // fire notification api
    }
};


if (typeof exports !== "undefined") {
    exports.messageUtils = messageUtils;
}