"use strict";

var EASY_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

// Set this variable to true to publicly expose otherwise private functions inside of SudokuSolver
var TESTABLE = true;

var SudokuSolver = function (testable) {
  var solver;

  // PUBLIC FUNCTIONS
  function solve(boardString) {
    var b_matrix = boardString.split("");
    if (boardIsInvalid(b_matrix)) {
      return false;
    }
    return recursiveSolve(boardString);
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS
  function recursiveSolve(boardString) {
    var b_matrix = boardString.split("");
    if (boardIsSolved(b_matrix)) {
      return b_matrix.join("");
    }
    var cellPossibilities = getNextCellAndPossibilities(b_matrix);
    var nextUnsolvedCellIndex = cellPossibilities.index;
    var possibilities = cellPossibilities.choices;
    for (var i = 0; i < possibilities.length; i++) {
      b_matrix[nextUnsolvedCellIndex] = possibilities[i];
      var solvedBoard = recursiveSolve(b_matrix.join(""));
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

  function boardIsInvalid(b_matrix) {
    return !boardIsValid(b_matrix);
  }

  function boardIsValid(b_matrix) {
    return allRowsValid(b_matrix) && allColumnsValid(b_matrix) && allBoxesValid(b_matrix);
  }

  function boardIsSolved(b_matrix) {
    for (var i = 0; i < b_matrix.length; i++) {
      if (b_matrix[i] === "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(b_matrix) {
    for (var i = 0; i < b_matrix.length; i++) {
      if (b_matrix[i] === "-") {
        var existingValues = getAllIntersections(b_matrix, i);
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(function (num) {
          return existingValues.indexOf(num) < 0;
        });
        return { index: i, choices: choices };
      }
    }
  }

  function getAllIntersections(b_matrix, i) {
    return getRow(b_matrix, i).concat(getColumn(b_matrix, i)).concat(getBox(b_matrix, i));
  }

  function allRowsValid(b_matrix) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(b_matrix, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getRow(b_matrix, i) {
    var startingEl = Math.floor(i / 9) * 9;
    return b_matrix.slice(startingEl, startingEl + 9);
  }

  function allColumnsValid(b_matrix) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
      return getColumn(b_matrix, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getColumn(b_matrix, i) {
    var startingEl = Math.floor(i % 9);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return b_matrix[startingEl + num * 9];
    });
  }

  function allBoxesValid(b_matrix) {
    return [0, 3, 6, 27, 30, 33, 54, 57, 60].map(function (i) {
      return getBox(b_matrix, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getBox(b_matrix, i) {
    var boxCol = Math.floor(i / 3) % 3;
    var boxRow = Math.floor(i / 27);
    var startingIndex = boxCol * 3 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
      return b_matrix[startingIndex + num];
    });
  }

  function collectionIsValid(collection) {
    var numCounts = {};
    for(var i = 0; i < collection.length; i++) {
      if (collection[i] != "-") {
        if (numCounts[collection[i]] === undefined) {
          numCounts[collection[i]] = 1;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  function toString(b_matrix) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(b_matrix, i).join(" ");
    }).join("\n");
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = { 
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
      boardIsInvalid: boardIsInvalid,
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      collectionIsValid: collectionIsValid,
      toString: toString };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve,
      solveAndPrint: solveAndPrint };
  }

  return solver;
}(TESTABLE);