'use strict';

const MINE = '💣';
const FLAG = '🚩';
const VOID = '';
const LIFE = '❤';
const GAME_OVER = '😢';
const STRIKE = '😒';
const START = '😃';
const WIN = '😁';

const WIN_SND = new Audio('media/win.wav');
const LOSE_SND = new Audio('media/lose.wav');
const MINE_SND = new Audio('media/explosion.wav');
const PICK_SND = new Audio('media/pick.wav');

var gIsOver;
var gIsVictory;
var gInterval;
var gIsFirst;
var gGame;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 2
}

function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    };
    gBoard = buildBoard();
    renderBoard(gBoard);
    gIsFirst = true;
    setLives();
    gIsOver = false;
    gIsVictory = false;
    var elStatus = document.querySelector('.status');
    elStatus.innerText = START;
    clearInterval(gInterval);
    gInterval = null;
    reset();
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            strHTML += `\t <td oncontextmenu="cellMarked(${i},${j},this)"
            onclick="cellClicked(${i},${j},this)" class="cell cell-${i}-${j}">`;
            // if (currCell.isShown) {
            //     if (currCell.isMine) {
            //         strHTML += MINE;
            //     } else {  
            //         if (!currCell.minesAroundCount) continue;
            //         strHTML += `${currCell.minesAroundCount}`;
            //     }
            // }
            strHTML += '</td> \n';
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.game');
    elBoard.innerHTML = strHTML;
}

function energize(i, j, board) {
    var cell = gBoard[i][j];
    gInterval = setInterval(runTime, 1000)
    gGame.isOn = true;
    cell.isShown = true;
    gGame.shownCount++;
    setMines(i, j, board);
    setMinesNegsCount(board);
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    if (cell.minesAroundCount === 0) {
        elCell.innerText = VOID;
        elCell.classList.add('free');
        expandShown(i, j, board);
    } else {
        elCell.innerText = cell.minesAroundCount;
        elCell.classList.add('free');
    }
}

function cellClicked(i, j, elCell) {  
    if (!gGame.isOn) {
        energize(i, j, gBoard);
        gIsFirst = false;
        return;
    }
    if (gIsOver) return;
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (cell.isMarked) return;
    if (cell.isMine) {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = MINE;
        elCell.classList.add('boom');
        gLevel.lives--;
        setLives();
        var elStatus = document.querySelector('.status');
        elStatus.innerText = STRIKE;
        MINE_SND.play();
        checkGameOver();
        return;
    }
    if (cell.minesAroundCount === 0) {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = VOID;
        elCell.classList.add('free');
        expandShown(i, j, gBoard);
    } else {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = cell.minesAroundCount; // DRY
        elCell.classList.add('free');
    }
    checkVictory();
}

function cellMarked(i, j, elCell) { 
    if (!gGame.isOn) {
        energize(i, j, gBoard);
        gIsFirst = false;
        return;
    }
    if (gIsVictory) return;
    if (gIsOver) return;
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (cell.isMine && !cell.isMarked) {
        cell.isMarked = true;
        elCell.innerText = FLAG;
        elCell.classList.add('flag');
        gGame.markedCount++;
    } else if (!cell.isMine && !cell.isMarked) {
        cell.isMarked = true;
        elCell.innerText = FLAG;
        elCell.classList.add('flag');
        gGame.markedCount++;
    } else {
        cell.isMarked = false;
        elCell.innerText = VOID;
        elCell.classList.remove('flag');
        gGame.markedCount--;
    }
    checkVictory();
}

function changeLevel(elBtn) {
    var btnStr = elBtn.innerText;
    switch (btnStr) {
        case 'Beginner':
            gLevel.size = 4;
            gLevel.mines = 2;
            gLevel.lives = 2;
            break;
        case 'Intermediate':
            gLevel.size = 8;
            gLevel.mines = 12;
            gLevel.lives = 3;
            break;
        case 'Expert':
            gLevel.size = 12;
            gLevel.mines = 30;
            gLevel.lives = 4;
            break;
    }
    init();
    PICK_SND.play();
}

