let map;
let decor;
let mapProperties;

class Entity {

    constructor(className, posX, posY) {
        this.class = className;
        this.position = [posX, posY];
        this.state = true;
        this.id = "Entity" + Math.round(Math.random() * 65000);
    }

    set position(position) {
        this.x = position[0];
        this.y = position[1];
    }

    get position() {
        return ([this.x, this.y]);
    }

    // return after object with position
    actionEntity(decor, x, y) {

        this.state = true;
        let type = decor.mapArray[y][x].properties.type;

        switch(type){
            case "mur":
                break;
            case "present":
                decor.mapArray[y][x].properties.taken = true;
                console.log(decor.mapArray);
                this.position = [x, y];
                break;
            default:
                this.position = [x, y];
                break;
        }
    }
}

var Objects = {
    mur: {
        type: "mur"
    },
    route: {
        type: "route"
    },
    present: {
        type: "present",
        taken: false
    }
};


class ObjectType {

    constructor(type){
        this.type = type;
        this.energy = 10;
        this.types = Objects;
    }

    randomObj() {
        var result = Math.round((Math.random() * (10 - 1)) + 1);

        switch(result){
            case 1:
                return this.types.mur.type;
            break;
            case 6:
                return this.types.present.type;
            default:
                return this.types.route.type;
        }
    }

}

class MapGenerate {

    constructor(row, col) {

        this.row = row;
        this.col = col;
        this.type = null;
        this.properties = {};
        this.createMap();

    }

    createMap() {

        this.mapArray = [];

        for(var i = 0; i < this.row; i++) {
            this.mapArray.push([]);
            for(var y = 0; y < this.col; y++) {
                this.mapArray[i].push([]);
                this.mapArray[i][y]["properties"] = this.properties;

                this.mapArray[i][y]["posX"] = y;
                this.mapArray[i][y]["posY"] = i;
            }
        }
    }

}

class Decor extends MapGenerate {

    constructor(row, col){
        super(row, col);
        this.properties = {type:null};
        this.type = "Decor";
        this.defineProperties();
    }

    defineProperties() {

        this.mapArray.forEach((e) => {
            e.forEach((event) => {
                let object = new ObjectType;
                let randomObj = object.randomObj();

                event.properties = new ObjectType(randomObj);
            });
        });
    }

}


let player = new Entity('player', 0, 0);

let moveRequest = {
    left: 0,
    top: 0
};

// le tick
onmessage = function (event) {

    mapProperties = event.data.mapProperties;
    moveRequest = event.data.moveRequest;

    if(mapProperties != undefined){
        map = new MapGenerate(32,32);
        decor = new Decor(32,32);
        postMessage({map: map, decor: decor});
    }

};

let gameTick = function () {

    if(moveRequest != undefined) {
        let nextX = player.position[0] - moveRequest.left;
        let nextY = player.position[1] - moveRequest.top;

        player.actionEntity(decor,nextX, nextY);
        postMessage({player: player, decorIn: decor});
    }

    moveRequest = {
        top: 0,
        left: 0
    };
};

self.setInterval(gameTick, 100);