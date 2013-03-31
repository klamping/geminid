Template.userProfile.email = function() {
    var displayName = "";
    if ("username" in this) {
        displayName = this.username;
    }
    else if ("emails" in this) {
        displayName = this.emails[0].address;
    }
    return displayName;
};

Template.userProfile.status = function () {
    if (!this.profile) {
        return '';
    }

    if (this.profile.online === false) {
        return " (offline)";
    } else if (this.profile.active === false) {
        return " (idle)";
    }
    return '';
};