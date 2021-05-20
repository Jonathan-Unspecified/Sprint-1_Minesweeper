'use strict';

// function renderCell(location, value) {
//   var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//   elCell.innerHTML = value;
// }

function getEmptyCells(cellI, cellJ, board) {
  var emptyCells = []
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          if (i === cellI && j === cellJ) continue
          var cell = board[i][j]
          var cellIdx = { i, j }
          if (!cell.isMine && !cell.isShown) {
              emptyCells.push(cellIdx)
          }
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function runTime(){

// }
