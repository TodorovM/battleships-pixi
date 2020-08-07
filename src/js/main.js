import App from './App';

const app = new App();

app.init();

global.show = () => {
    app.gameBoard.toggleEnemyShips();
}


