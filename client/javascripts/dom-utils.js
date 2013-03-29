function shouldAutoScroll (container) {
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
}

function scrollToBottom (container) {
    if (container.length > 0) {
        scrollTo(container, container.prop("scrollHeight"));
    }
}

function scrollTo (container, scrollPos) {
    container.prop("scrollTop", scrollPos);
}


if (typeof exports !== "undefined") {
    exports.shouldAutoScroll = shouldAutoScroll;
    exports.scrollToBottom = scrollToBottom;
}