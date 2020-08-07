import {
    Container,
    Sprite
} from "pixi.js";
import config from "../../config/config"
import assets from "../../config/assetsConfig"

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
        this.sprites[ship].rotation = dir === 0 ? 0 : -1.5708
        this.x = x;
        this.y = dir === 0 ? y : y + config.tile.width
        this.addChild(this.sprites[ship]);
    }
}
