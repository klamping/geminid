var domUtils = {
    shouldAutoScroll: function (container) {
        if (typeof container !== "undefined") {
            var scrollHeight = container.prop("scrollHeight");
            var scrollTop = container.prop("scrollTop");
            var height = container.height();

            if (height === null) {
                return true;
            }

            return (height + scrollTop) >= scrollHeight;
        }

        return false;
    },
    scrollToBottom: function (container) {
        if (container.length > 0) {
            this.scrollTo(container, container.prop("scrollHeight") + 1000);
        }
    },
    scrollTo: function (container, scrollPos) {
      container.prop("scrollTop", scrollPos);
    }
};


if (typeof exports !== "undefined") {
    exports.domUtils = domUtils;
}