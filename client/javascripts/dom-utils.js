function shouldAutoScroll (container) {
    if (container) {
        var scrollHeight = container.prop("scrollHeight");
        var scrollTop = container.prop("scrollTop");
        var height = container.height();

        if (height === null) {
            return true;
        }

        return (height + scrollTop) >= scrollHeight;
    }

    return false;
}

if (typeof exports !== "undefined") {
    exports.shouldAutoScroll = shouldAutoScroll;
}