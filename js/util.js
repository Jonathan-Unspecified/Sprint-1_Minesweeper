'use strict';

function getEmptyCells(cellI, cellJ, board) {
  var emptyCells = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (i === cellI && j === cellJ) continue
      var cell = board[i][j]
      var cellIdx = { i, j }
      // if (!cell.isMine && !cell.isShown) {
        emptyCells.push(cellIdx)
      // }
    }
  }
  return emptyCells
}

function countNegs(cellI, cellJ, mat) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine) negsCount++;
    }
  }
  return negsCount;
}

function setMines(cellI, cellJ, board) {
  var emptyCells = getEmptyCells(cellI, cellJ, board);
  for (var i = 0; i < gLevel.mines; i++) {
    var emptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    board[emptyCell.i][emptyCell.j].isMine = true;
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function checkGameOver() {
  if (gLevel.lives === 0) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                cell.isShown = true;
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerText = MINE;
                if (elCell.classList.contains('flag')) {
                    elCell.classList.remove('flag');
                }
                elCell.classList.add('boom');
            }
        }
    }
    gIsOver = true;
    var elStatus = document.querySelector('.status'); 
    elStatus.innerText = GAME_OVER;
    clearInterval(gInterval);
    gInterval = null;

}
}

function checkVictory() {
  if (gIsOver) return;
  var board = gLevel.size ** 2;
  if (gGame.markedCount > gLevel.mines) return;
  if ((gGame.shownCount) + (gGame.markedCount) === board) {
      gIsVictory = true;
      clearInterval(gInterval);
      gInterval = null;
      var elStatus = document.querySelector('.status');
      elStatus.innerText = WIN;
  }
}

function runTime() { 
  var elSec = document.querySelector('.timer span');
    elSec.innerText = gGame.secsPassed++;
  }
  
  function reset() {
  var elSec = document.querySelector('.timer span');
    elSec.innerText = 0;

}

function setLives() {
  var elLives = document.querySelector('.lives span')
  elLives.innerText = '';
  for (var i = 0; i < gLevel.lives; i++) {
      elLives.innerText += LIFE;
  }
}
