import {
    Container,
    Sprite
} from "pixi.js";
import config from "../../config/config"
import assets from "../../config/assetsConfig"

/**
 * Single Ship Instance
 * @constructor
 * @param {Integer} x
 * @param {Integer} y
 * @param {String} ship
 * @param {Integer} dir
 */
export default class Ship extends Container {
    constructor(x, y, ship, dir){
        super();
        this.sprites = {
            destroyer: Sprite.from(assets.ship.destroyer),
            battleship: Sprite.from(assets.ship.battleship),
        }
        Object.keys(this.sprites).forEach(sprite => {
            this.sprites[sprite].width = config.tile.width;
            this.sprites[sprite].height = ship === 'destroyer' ? config.ship.destroyer * config.tile.height : config.ship.battleship * config.tile.height;
        })
        this.sprites[ship].rotation = dir === 0 ? 0 : config.utils.rotateCounterClockwise //sets the sprite to be horizontal or vertical
        this.x = x;
        this.y = dir === 0 ? y : y + config.tile.width //fixing the offset created by rotating
        this.addChild(this.sprites[ship]);
    }
}
