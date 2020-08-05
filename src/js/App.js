import { Application } from 'pixi.js'

export default class App extends Application {
    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerWidth,
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio || 1
          });
    }

    init() {
        document.body.appendChild(this.view);
    }
}
