import { Application } from 'pixi.js'
import config from './config/config'
import GameBoard from "./modules/GameBoard";

export default class App extends Application {
    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: config.colors.background,
          });
          this._gameBoard = new GameBoard();
    }

    init() {
        document.body.appendChild(this.view);
        this.stage.addChild(this._gameBoard);
        this._size();
        window.onresize = () => this._size();
    }

    _size() {
        const scaleRatio = (window.innerHeight) / (this._gameBoard.height + 2 * config.board.paddingTop);
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this._gameBoard.height *= scaleRatio; 
        this._gameBoard.width *= scaleRatio; 
        this._gameBoard.position.set((this.screen.width / 2) - (this._gameBoard.width / 2), config.board.paddingTop);
    }
}
