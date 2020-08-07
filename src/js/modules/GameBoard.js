import {
    Container,
    utils, 
    Text
} from "pixi.js"
import Tile from "./submodules/Tile"
import Ship from "./submodules/Ship"
import config from "../config/config"

/**
 * Gameboard that contains all the tiles and ships
 */
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
        this.emitter = new utils.EventEmitter();
        this.turn = 'player';
        this.init();
    }

    /**
     * Create tile objects and attach event listeners to them
     */
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

        this.attachListeners();

        
    }


    /**
     * Draw the boards
     */
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

    /**
     * Creates a ship object and places it randomly on the board
     * @param {String} ship
     * @param {Object} board
     */
    _placeShipRandom(ship, board){
        const dir = Math.round(Math.random()); //choose random direction
        const randRow = Math.floor(Math.random() * config.board.rows);
        const randCol = Math.floor(Math.random() * config.board.columns);
        const tiles = [];
        for (let i = 0; i < config.ship[ship]; i++) {
            if (dir === 0) tiles.push(board.tiles.find(r => r.boardPosition.row === randRow + i && r.boardPosition.column === randCol))
            else tiles.push(board.tiles.find(r => r.boardPosition.row === randRow && r.boardPosition.column === randCol + i))
        }

        if (tiles.some(t => !t) || tiles.some(t => t.occupied)) this._placeShipRandom(ship, board) //check if selected cluster of tiles is occupied or out of bounds
        else {
            board.tiles.forEach(tile => {
                if (tiles.includes(tile)) tile.occupied = true;
            })
            const sprite = new Ship(randCol * config.tile.height, randRow * config.tile.width, ship, dir)
            sprite.tiles = tiles;
            board.ships.push(sprite);
            board.board.addChild(sprite);
        }
    }

    /**
     * Adding ships to the boards
     */
    _addShipsToBoard(){
        Object.values(this._boards).forEach(board => {
            config.board.ships.forEach(ship => {
                this._placeShipRandom(ship, board);
            })
        })
    }

    /**
     * Attach the event listeners for the computer tiles
     */
    attachListeners() {
        this._boards.computer.tiles.forEach(tile => {
            tile.interactive = true;
            tile.on('click', () => {
                this.hitTile(tile, 'player');
            })
        })
    }

    /**
     * Remove the event listeners for the computer tiles
     */
    removeListeners() {
        this._boards.computer.tiles.forEach(tile => {
            tile.off('click')
        })
    }
    
    /**
     * Show text on screen
     * @param {String} string
     * @param {Boolean} over
     * @returns {Promise}
     */
    showText(string, over){
        return new Promise((resolve) => {
            const text = new Text(string, {fontFamily: 'Segoe UI', fontSize: 24, fontWeight: 900, fill: 0xFF000})
            over ? text.position.set(this.width / 2 - text.width / 2, this.height / 2 - text.height / 2) : text.position.set(this.width / 2 - text.width / 2, 0)
            this.addChild(text);
            setTimeout(() => {
                this.removeChild(text); //remove the text after 1s
                resolve();
            }, 1000)
        })
    }


    /**
     * Emit event when tile is hit
     * @param {Object} tile
     * @param {String} user
     */
    async hitTile(tile, user) {
        await tile.checkTile();
        this.emitter.emit('turn_end', user)
    }

    /**
     * Hide or show enemy ships on the board
     */
    toggleEnemyShips() {
        this._boards.computer.ships.forEach(ship => {
            ship.alpha = ship.alpha === 1 ? 0 : 1
        })
    }

    /**
     * Select a random tile for the computer
     */
    opponentTurn() {
        const randRow = Math.floor(Math.random() * config.board.rows);
        const randCol = Math.floor(Math.random() * config.board.columns);
        const randTile = this._boards.player.tiles.find(t => t.boardPosition.column === randCol && t.boardPosition.row === randRow)
        if (randTile.hit) this.opponentTurn();
        else setTimeout(() => this.hitTile(randTile, 'computer'), 500)
        
    }

    /**
     * Check if ship is sunk or all ships are sunk on the board
     * @param {String} user
     * @returns {Boolean}
     */
    checkHitTiles(user) {
        const sunkenShip = this._boards[user].ships.find(s => s.tiles.every(t => t.hit))
        if (sunkenShip) {
            this._boards[user].board.removeChild(sunkenShip);
            this._boards[user].ships = this._boards[user].ships.filter(s => s !== sunkenShip)
            this.showText(`1 of ${user}'s ships was sunk`);
        }
        const occupied = this._boards[user].tiles.filter(t => t.occupied && !t.hit)
        if (occupied.length === 0 ) return true
        else return false
    }

    init() {
        this._drawBoards();
        this._addShipsToBoard();
        this.toggleEnemyShips();
    }

    

}