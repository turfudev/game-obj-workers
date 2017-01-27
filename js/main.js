(function () {

    // worker
    var worker = new Worker("js/worker.js");

    var mapProperties = {
        row: 32,
        col: 32
    };

    worker.postMessage({mapProperties : mapProperties});

    // event trigger pour alimenter le worker
    $("#viewport").on('keydown keyup mousemove', function (e) {

        e.preventDefault(), e.stopPropagation();
        // une demande de deplacement
        var moveRequest = {
            top: 0,
            left: 0
        };

        if ([37, 38, 39, 40].indexOf(e.which) != -1) {
            switch (e.which) { // ou e.keyCode
                case 37:
                    moveRequest.left = (e.type == "keydown") ? 1 : 0;
                    break;
                case 38:
                    moveRequest.top = (e.type == "keydown") ? 1 : 0;
                    break;
                case 39:
                    moveRequest.left = (e.type == "keydown") ? -1 : 0;
                    break;
                case 40:
                    moveRequest.top = (e.type == "keydown") ? -1 : 0;
                    break;
            }
        }


        worker.postMessage({moveRequest: moveRequest});
    });

    var constructMap = function(mapArray){

        mapArray.forEach((value, index) => {
            $("#map").append("<div class='row row-" + index + "'></div>");

            value.forEach((valueIn, key) => {
                $(".row-" + index).append("<div class='col-" + key + " " + valueIn.properties.type+"'></div>");
            });

        });

    };

    var changeDecor = function(decorArray, counter){
        decorArray.forEach((value, index) => {
            value.forEach((valueIn, key) => {
                if(valueIn.properties.taken == true) {
                    $(".row-" + index + " .col-" + key).addClass("hide");
                }
            });

        });
    };

    worker.onmessage = function(event) {

        let entity = event.data.player;
        let decor = event.data.decor;
        let decorIn = event.data.decorIn;

        if(decor != undefined) constructMap(decor.mapArray);

        if(entity != undefined) {

            if($("#"+ entity.id).length == 0){
                $('#map').append($('<div id="'+ entity.id +'" class="'+ entity.class +'">'));
            }

            $("#"+ entity.id).css('transform', 'translate(' + entity.x*32 + 'px,' + entity.y*32 + 'px)');
        }

        if(decorIn != undefined) changeDecor(decorIn.mapArray);

    };

    worker.onerror = function(error) {
        throw error;
    };


})(jQuery);