'use strict';

const MINE = '💣';
const FLAG = '🚩';
const VOID = '';

var gInterval = 0;
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

function setMines(cellI, cellJ, board) {
    var emptyCells = getEmptyCells(cellI, cellJ, board);
    for (var i = 0; i < gLevel.mines; i++) {
        var emptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
        board[emptyCell.i][emptyCell.j].isMine = true;
        // board[emptyCell.i][emptyCell.j].minesAroundCount = 'mine'; // redundant
        var emptyIdx = emptyCells.indexOf(emptyCell);
        emptyCells.splice(emptyIdx, 1);
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNegs(i, j, board);
        }
    }
    return board;
}

function energize(i, j, board) { 
    var cell = gBoard[i][j];
    // gInterval = setInterval(runTime, 10);
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

function expandShown(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = board[i][j];
            if (!cell.isShown) {
                if (cell.minesAroundCount === 0) {
                    if (cell.isMarked) continue;
                    cell.isShown = true;
                    gGame.shownCount++;
                    var elCell = document.querySelector(`.cell-${i}-${j}`);
                    elCell.classList.add('free');
                    expandShown(i, j, gBoard);
                } else {
                    if (cell.isMarked) continue;
                    cell.isShown = true;
                    gGame.shownCount++;
                    elCell = document.querySelector(`.cell-${i}-${j}`);
                    elCell.classList.add('free');
                    elCell.innerText = cell.minesAroundCount; // DRY
                }
            }
        }
    }
}

function cellClicked(i, j, elCell) {  // update
    if (!gGame.isOn) { // DRY
        energize(i, j, gBoard);
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

