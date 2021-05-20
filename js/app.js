'use strict';

const MINE = '💣';
const FLAG = '🚩';
const VOID = '';

var gTimer;
var gInterval;
var isFirst;
var gGame;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 3
}


function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    gBoard = buildBoard();
    renderBoard(gBoard);
    isFirst = true;
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
            //     } else {  // DRY
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
    // gInterval = runTime();
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

function cellClicked(i, j, elCell) {  // update
    if (!gGame.isOn) { // DRY
        energize(i, j, gBoard);
        gTimer = new Date();
        gInterval = setInterval(runTime, 0);
        isFirst = false;
        return;
    }
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (cell.isMarked) return;
    if (cell.minesAroundCount === 0) {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = VOID;
        elCell.classList.add('free');
        expandShown(i, j, gBoard);
    } else if (cell.isMine) {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = MINE;
        elCell.classList.add('boom');
        // checkGameOver()
    } else if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        gGame.shownCount++;
        elCell.innerText = cell.minesAroundCount; // DRY
        elCell.classList.add('free');
    }
}

function cellMarked(i, j, elCell) { //update
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
}

function changeLevel(elBtn) {
    var btnStr = elBtn.innerText;
    switch (btnStr) {
        case 'Beginner':
            gLevel.size = 4;
            gLevel.mines = 2;
            break;
        case 'Intermediate':
            gLevel.size = 8;
            gLevel.mines = 12;
            break;
        case 'Expert':
            gLevel.size = 12;
            gLevel.mines = 30;
            break;
    }
    init();
}

