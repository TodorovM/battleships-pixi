import { Application } from 'pixi.js'
import config from './config/config'
import GameBoard from "./modules/GameBoard";

export default class App extends Application {
    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerWidth,
            backgroundColor: config.colors.background,
            resolution: window.devicePixelRatio || 1
          });
          this._gameBoard = new GameBoard(this.rendere);
    }

    init() {
        document.body.appendChild(this.view);
        this.stage.addChild(this._gameBoard);
        this._gameBoard.position.set((window.innerWidth / 2) - (this._gameBoard.width / 2), 0)
    }
}
