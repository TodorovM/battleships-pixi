import { Container } from "pixi.js"
import Tile from "./submodules/Tile"
import config from "../config/config"

export default class GameBoard extends Container {

    constructor() {
        super();
        this._boards = {
            player: {
                board: new Container,
                tiles: [],
                ships: []
            },
            computer: {
                board: new Container,
                tiles: [],
                ships: []
            }
        };
        this.init();
    }

    _createTiles(){
        for (let i = 0; i < 2; i++) {
            const board = i % 2 === 0 ? this._boards.computer.tiles : this._boards.player.tiles;
            
            for (let row = 0; row < config.board.rows; row++) {
                for (let col = 0; col < config.board.columns; col++) {
                    const tile = new Tile(row * config.tile.height, col * config.tile.width, row, col);
                    board.push(tile)
                }
                
            }
        }
    }

    _drawBoards(){
        this._createTiles();
        for (let i = 0; i < 2; i++) {
            const name = i % 2 === 0 ? 'computer' : 'player';
            this._boards[name].board.name = name;
            this._boards[name].board.addChild(...this._boards[name].tiles);
            this._boards[name].board.position.set(0, i * this._boards[name].board.height);
            this.addChild(this._boards[name].board);
        }
    }

    init(){
        this._drawBoards();
    }

}