const { classof } = require("core-js/fn/object");
import { Container } from "pixi.js";

class Tile extends Container {

    constructor(x, y, occupied){
        super();
        this.position.set(x, y);
        this.occupied = occupied;
    }

}