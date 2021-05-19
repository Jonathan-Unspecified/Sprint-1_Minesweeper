'use strict';

const MINE_IMG = '💣';
const FLAG_IMG;
const WIN_IMG;
const LOSE_IMG;

var gGame;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 3
};

function init() {

    var gGame = {
        isOn = false,
        shownCount = 0,
        markedCount = 0,
        secsPassed = 0
    };

    buildBoard();

    renderBoard(gBoard);

}

function buildBoard() {
    gBoard = createMat(gLevel.size, gLevel.size);


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currentCell = {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: false,
                    isMarked: false
                }
            gBoard[i][j] = currentCell;
        }
    }
}