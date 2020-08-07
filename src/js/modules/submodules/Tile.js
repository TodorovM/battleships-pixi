import {
    Container,
    Sprite,
    utils
} from "pixi.js";
import config from "../../config/config"
import assets from "../../config/assetsConfig"

/**
 * Single Tile Instance
 * @date 2020-08-07
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} row
 * @param {Integer} column
 */
export default class Tile extends Container {

    constructor(x, y, row, column) {
        super();
        this.position.set(x, y);
        this.interactive = true;
        this.occupied = false;
        this.hit = false;
        this.sprites = {
            normal: Sprite.from(assets.tile.normal),
            hit: Sprite.from(assets.tile.hit),
            miss: Sprite.from(assets.tile.miss)
        }
        this.boardPosition = {
            row,
            column
        }
        this.addChild(this.sprites.normal);
        Object.values(this.sprites).forEach(sprite => {
            sprite.width = config.tile.width;
            sprite.height = config.tile.height;
        })
    }


    /**
     * Check the tile when selecting it
     * @returns {Promise}
     */
    checkTile() {
        return new Promise((resolve) => {
            if (!this.hit) {
                this.hit = true;
                this.removeChild(this.sprites.normal)
                if (this.occupied) {
                    this.addChild(this.sprites.hit)
                } else {
                    this.addChild(this.sprites.miss)
                }
                resolve();
            }
        })


    }

}