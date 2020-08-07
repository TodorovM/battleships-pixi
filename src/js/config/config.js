export default {
    colors: {
        background: 0x006994
    },
    tile: {
        width: 35,
        height: 35
    },
    board: {
        rows: 10,
        columns: 10,
        padding: 50,
        space: 20,
        ships: [
            'destroyer',
            'destroyer',
            'battleship'
        ]
    },
    ship: {
        destroyer: 4,
        battleship: 5
    },
    utils: {
        rotateCounterClockwise: -1.5708
    }
}