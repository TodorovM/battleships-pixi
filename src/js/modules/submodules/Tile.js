import { Graphics } from "pixi.js";
import config from "../../config/config"

export default class Tile extends Graphics {

    constructor(x, y, row, column){
        super();
        this.lineStyle(2, 0xFFFFFF)
        this._rect = this.drawRect(x, y, config.tile.width, config.tile.height);
        this.interactive = true;
        this.occupied = false;
        this.hit = false;
        this.boardPosition = {row, column}
    }

}