/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Game = __webpack_require__(3);
	
	$(function () {
	  var $ttt = $(".ttt");
	  new View(new Game(), $ttt);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(2);
	
	var View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	
	  this.setupBoard();
	  this.bindEvents();
	};
	
	View.prototype.bindEvents = function () {
	  this.$el.on("click", "li", function (e) {
	    this.makeMove($(e.currentTarget));
	  }.bind(this));
	};
	
	View.PositionsMap = {
	  0: [0, 0],
	  1: [0, 1],
	  2: [0, 2],
	  3: [1, 0],
	  4: [1, 1],
	  5: [1, 2],
	  6: [2, 0],
	  7: [2, 1],
	  8: [2, 2]
	};
	
	View.prototype.makeMove = function ($square) {
	  var $allTiles = $square.parent().children();
	  var posIdx = $allTiles.index($square);
	  var pos = View.PositionsMap[posIdx]
	
	  if ($square.hasClass("clicked")) {
	    console.log("spot taken");
	  } else {
	    $square.addClass("clicked");
	    $square.append(this.game.currentPlayer);
	    this.game.playMove(pos);
	  }
	
	  if (this.game.isOver()) {
	    var winner = this.game.board.winner();
	    var $message = $("<p>");
	    if (winner) {
	      $message.html(winner + " wins!")
	      this.flash();
	    } else {
	      $message.html("It's a draw!");
	    }
	    $('body').append($message);
	
	    this.$el.off('click');
	  }
	};
	
	View.prototype.randomColor = function () {
	  return '#' + Math.floor(Math.random() * 16777215).toString(16)
	}
	
	View.prototype.flash = function () {
	  window.setInterval(function () {
	    $('body').css({"background": this.randomColor})
	  }.bind(this),100)
	
	  window.setInterval(function () {
	    $('*').css({"color": this.randomColor})
	  }.bind(this), 150)
	
	    // $('li').css({"transform": "rotate(" + Math.random() * 360 + "deg)"})
	
	  window.setInterval(function () {
	    $('li').css({
	      "background": this.randomColor,
	      "border-color": this.randomColor,
	      "cursor": "default",
	      "transform": "rotate(" + 1765 + "deg)",
	      "transition": "transform " + 5 + "s"
	    })
	  }.bind(this), 125)
	
	  window.setInterval(function () {
	    $('ul').css({"border-color": this.randomColor})
	  }.bind(this), 175)
	};
	
	View.prototype.setupBoard = function () {
	  var $ul = $("<ul>").addClass("group")
	  for (var i = 0; i < 9; i++) {
	    $ul.append($("<li>"))
	  }
	
	  this.$el.append($ul);
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(4);
	var MoveError = __webpack_require__(2);
	
	function Game () {
	  this.board = new Board();
	  this.currentPlayer = Board.marks[0];
	}
	
	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};
	
	Game.prototype.playMove = function (pos) {
	  this.board.placeMark(pos, this.currentPlayer);
	  this.swapTurn();
	};
	
	Game.prototype.promptMove = function (reader, callback) {
	  var game = this;
	
	  this.board.print();
	  console.log("Current Turn: " + this.currentPlayer);
	
	  reader.question("Enter rowIdx: ", function (rowIdxStr) {
	    var rowIdx = parseInt(rowIdxStr);
	    reader.question("Enter colIdx: ", function (colIdxStr) {
	      var colIdx = parseInt(colIdxStr);
	      callback([rowIdx, colIdx]);
	    });
	  });
	};
	
	Game.prototype.run = function (reader, gameCompletionCallback) {
	  this.promptMove(reader, (function (move) {
	    try {
	      this.playMove(move);
	    } catch (e) {
	      if (e instanceof MoveError) {
	        console.log(e.msg);
	      } else {
	        throw e;
	      }
	    }
	
	    if (this.isOver()) {
	      this.board.print();
	      if (this.winner()) {
	        console.log(this.winner() + " has won!");
	      } else {
	        console.log("NO ONE WINS!");
	      }
	      gameCompletionCallback();
	    } else {
	      // continue loop
	      this.run(reader, gameCompletionCallback);
	    }
	  }).bind(this));
	};
	
	Game.prototype.swapTurn = function () {
	  if (this.currentPlayer === Board.marks[0]) {
	    this.currentPlayer = Board.marks[1];
	  } else {
	    this.currentPlayer = Board.marks[0];
	  }
	};
	
	Game.prototype.winner = function () {
	  return this.board.winner();
	};
	
	module.exports = Game;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(2);
	
	function Board () {
	  this.grid = Board.makeGrid();
	}
	
	Board.isValidPos = function (pos) {
	  return (
	    (0 <= pos[0]) && (pos[0] < 3) && (0 <= pos[1]) && (pos[1] < 3)
	  );
	};
	
	Board.makeGrid = function () {
	  var grid = [];
	
	  for (var i = 0; i < 3; i++) {
	    grid.push([]);
	    for (var j = 0; j < 3; j++) {
	      grid[i].push(null);
	    }
	  }
	
	  return grid;
	};
	
	Board.marks = ["x", "o"];
	
	Board.prototype.isEmptyPos = function (pos) {
	  if (!Board.isValidPos(pos)) {
	    throw new MoveError("Is not valid position!");
	  }
	
	  return (this.grid[pos[0]][pos[1]] === null);
	};
	
	Board.prototype.isOver = function () {
	  if (this.winner() !== null) {
	    return true;
	  }
	
	  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
	    for (var colIdx = 0; colIdx < 3; colIdx++) {
	      if (this.isEmptyPos([rowIdx, colIdx])) {
	        return false;
	      }
	    }
	  }
	
	  return true;
	};
	
	Board.prototype.placeMark = function (pos, mark) {
	  if (!this.isEmptyPos(pos)) {
	    throw new MoveError("Is not an empty position!");
	  }
	
	  this.grid[pos[0]][pos[1]] = mark;
	};
	
	Board.prototype.print = function () {
	  var strs = [];
	  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
	    var marks = [];
	    for (var colIdx = 0; colIdx < 3; colIdx++) {
	      marks.push(
	        this.grid[rowIdx][colIdx] ? this.grid[rowIdx][colIdx] : " "
	      );
	    }
	
	    strs.push(marks.join("|") + "\n");
	  }
	
	  console.log(strs.join("-----\n"));
	};
	
	Board.prototype.winner = function () {
	  var posSeqs = [
	    // horizontals
	    [[0, 0], [0, 1], [0, 2]],
	    [[1, 0], [1, 1], [1, 2]],
	    [[2, 0], [2, 1], [2, 2]],
	    // verticals
	    [[0, 0], [1, 0], [2, 0]],
	    [[0, 1], [1, 1], [2, 1]],
	    [[0, 2], [1, 2], [2, 2]],
	    // diagonals
	    [[0, 0], [1, 1], [2, 2]],
	    [[2, 0], [1, 1], [0, 2]]
	  ];
	
	  for (var i = 0; i < posSeqs.length; i++) {
	    var winner = this.winnerHelper(posSeqs[i]);
	    if (winner !== null) {
	      return winner;
	    }
	  }
	
	  return null;
	};
	
	Board.prototype.winnerHelper = function (posSeq) {
	  for (var markIdx = 0; markIdx < Board.marks.length; markIdx++) {
	    var targetMark = Board.marks[markIdx];
	    var winner = true;
	    for (var posIdx = 0; posIdx < 3; posIdx++) {
	      var pos = posSeq[posIdx];
	      var mark = this.grid[pos[0]][pos[1]];
	
	      if (mark != targetMark) {
	        winner = false;
	      }
	    }
	
	    if (winner) {
	      return targetMark;
	    }
	  }
	
	  return null;
	};
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map