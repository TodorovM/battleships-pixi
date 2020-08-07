import {
    Container
} from "pixi.js"
import Tile from "./submodules/Tile"
import Ship from "./submodules/Ship"
import config from "../config/config"
import { Math } from "core-js";

export default class GameBoard extends Container {

    constructor() {
        super();
        this._boards = {
            player: {
                board: new Container,
                tiles: [],
                ships: [],
            },
            computer: {
                board: new Container,
                tiles: [],
                ships: [],
            }
        };
        this.init();
    }

    _createTiles() {
        for (let i = 0; i < 2; i++) {
            const board = i % 2 === 0 ? this._boards.computer.tiles : this._boards.player.tiles;

            for (let row = 0; row < config.board.rows; row++) {
                for (let col = 0; col < config.board.columns; col++) {
                    const tile = new Tile(col * config.tile.height, row * config.tile.width, row, col);
                    board.push(tile)
                }

            }
        }

        this._boards.computer.tiles.forEach(tile => {
            tile.interactive = true;
            tile.on('click', () => {
                tile.checkTile();
            })
        })
    }

    _drawBoards() {
        this._createTiles();
        for (let i = 0; i < 2; i++) {
            const name = i % 2 === 0 ? 'computer' : 'player';
            this._boards[name].board.name = name;
            this._boards[name].board.addChild(...this._boards[name].tiles);
            this._boards[name].board.position.set(0, i * (this._boards[name].board.height + config.board.space));
            this.addChild(this._boards[name].board);
        }
    }

    _placeShipRandom(ship, board){
        const dir = Math.round(Math.random());
        const randRow = Math.floor(Math.random() * config.board.rows);
        const randCol = Math.floor(Math.random() * config.board.columns);
        const tiles = [];
        for (let i = 0; i < config.ship[ship]; i++) {
            if (dir === 0) tiles.push(board.tiles.find(r => r.boardPosition.row === randRow + i && r.boardPosition.column === randCol))
            else tiles.push(board.tiles.find(r => r.boardPosition.row === randRow && r.boardPosition.column === randCol + i))
        }

        if (tiles.some(t => !t) || tiles.some(t => t.occupied)) this._placeShipRandom(ship, board)
        else {
            board.tiles.forEach(tile => {
                if (tiles.includes(tile)) tile.occupied = true;
            })
            console.log(randRow)
            const sprite = new Ship(randCol * config.tile.height, randRow * config.tile.width, ship, dir)
            board.ships.push(sprite);
            board.board.addChild(sprite);
        }
    }

    _addShipsToBoard(){
        Object.values(this._boards).forEach(board => {
            config.board.ships.forEach(ship => {
               this._placeShipRandom(ship, board)
            })
        })
    }

    toggleEnemyShips() {
        this._boards.computer.ships.forEach(ship => {
            ship.alpha = ship.alpha === 1 ? 0 : 1
        })
    }

    init() {
        this._drawBoards();
        this._addShipsToBoard();
        this.toggleEnemyShips();
    }

    

}