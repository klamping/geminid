function formatTime (time) {
    var date = new Date(time);

    var hours = date.getHours();
    var meridian = "AM";

    if (hours === 0) {
        hours = 12;
    } else if (hours >= 12) {
        if (hours > 12) {
            hours -= 12;
        }
        meridian = "PM";
    }

    var minutes = ('0' + date.getMinutes()).slice(-2);

    var output = hours + ":" + minutes /*+ ":" + seconds*/ + " " + meridian;

    return output;
}

if (typeof exports !== "undefined") {
    exports.formatTime = formatTime;
}