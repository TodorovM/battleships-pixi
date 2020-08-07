import {
    Application
} from 'pixi.js'
import config from './config/config'
import GameBoard from "./modules/GameBoard";

/**
 * The app controller
 */
export default class App extends Application {
    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: config.colors.background,
        });
        this.gameBoard;
        this._players = ['player', 'computer']
        this._counter = 0;
        document.body.appendChild(this.view);
    }

    init() {
        this.gameBoard = new GameBoard();
        this.stage.addChild(this.gameBoard);
        this._size();
        window.onresize = () => this._size();
        this._gameOn();
    }

    /**
     * Resize the board according to the screen size
     */
    _size() {
        const scaleRatio = (window.innerHeight) / (this.gameBoard.height + 2 * config.board.padding);
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.gameBoard.height *= scaleRatio;
        this.gameBoard.width *= scaleRatio;
        this.gameBoard.position.set((this.screen.width / 2) - (this.gameBoard.width / 2), config.board.padding);
    }

    /**
     * Start the game
     */
    _gameOn() {
        this.gameBoard.emitter.on('turn_end', async e => {
            ++this._counter;
            const opponent = this._players.find(p => p !== e)
            if (this.gameBoard.checkHitTiles(opponent)) {
                await this.gameBoard.showText(`${e} has won the game in ${this._counter} turns`, true);
                this.stage.removeChildren();
                this.init();
            } else {
                this.gameBoard.turn = opponent;
                if (opponent === 'player') this.gameBoard.attachListeners()
                else {
                    this.gameBoard.removeListeners();
                    this.gameBoard.opponentTurn();
                }
            }
        })
    }


}