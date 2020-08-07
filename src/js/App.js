import {
    Application,
    utils
} from 'pixi.js'
import config from './config/config'
import GameBoard from "./modules/GameBoard";

export default class App extends Application {
    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: config.colors.background,
        });
        this.gameBoard = new GameBoard();
        this._players = ['player', 'computer']
        this._currentTurn = this._players[0];
    }

    init() {
        document.body.appendChild(this.view);
        this.stage.addChild(this.gameBoard);
        this._size();
        window.onresize = () => this._size();
        this._gameOn();
    }

    _size() {
        const scaleRatio = (window.innerHeight) / (this.gameBoard.height + 2 * config.board.padding);
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.gameBoard.height *= scaleRatio;
        this.gameBoard.width *= scaleRatio;
        this.gameBoard.position.set((this.screen.width / 2) - (this.gameBoard.width / 2), config.board.padding);
    }

    _gameOn(){
        this.gameBoard.emitter.on('turn_end', e => {
            const opponent = this._players.find(p => p !== e)
            if(this.gameBoard.checkHitTiles(opponent)) {
                console.log(e)
            }
        })
    }

  
}