Template.roomsList.events = {
    "click .addRoom .btn": function (ev) {
        // validate that content added
        var name = $("#roomNameInput").val();

        if (name.length > 0) {
            // add room to rooms
            var newRoom = Rooms.insert({
                title: name
            });
            // Set new room to active
            Session.set("activeRoom", newRoom);

            // hide room
            $(".addRoom a").popover('hide');
            // hide alert if it's showing

        } else {
            // throw warning 
            $(".addRoom .alert").alert();
        }
        ev.preventDefault();
    }
};

Template.roomsList.rooms = function() {
    return Rooms.find();
};

Template.roomsList.rendered = function () {
    // Set the first room to display
    var firstRoom = Rooms.findOne();

    if (typeof firstRoom !== "undefined") {
        Session.setDefault("activeRoom", firstRoom._id);
    }

    // initialize room creation popover
    $(".addRoom a").popover({
        html: true,
        placement: "bottom",
        content: '<form class="form-search"><div class="alert alert-error fade in hidden">Gah. Enter a room name.</div>' +
            '<label for="roomNameInput">Room Name: </label>' +
            '<div class="input-append">' +
                '<input type="text" id="roomNameInput" class="span2 search-query" />' +
                '<button type="submit" class="btn">Add</button>' +
            '</div></form>'
    });
};