'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, column] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][column] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const currentRow = this.board[r];
      const newRow = this.combineRow(currentRow);

      for (let i = 0; i < this.size; i++) {
        if (currentRow[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const reversedRow = this.board[r].slice().reverse();
      const newRow = this.combineRow(reversedRow).reverse();

      for (let i = 0; i < this.size; i++) {
        if (this.board[r][i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const column = this.board.map((row) => row[c]);
      const newColumn = this.combineRow(column);

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newColumn[r]) {
          moved = true;
          break;
        }
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newColumn[r];
      }
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const column = this.board.map((row) => row[c]).reverse();
      const newColumn = this.combineRow(column).reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newColumn[r]) {
          moved = true;
          break;
        }
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newColumn[r];
      }
    }

    if (moved) {
      this.afterMove();
    }
  }

  combineRow(row) {
    const result = [];
    let i = 0;

    while (i < row.length) {
      if (row[i] === 0) {
        i++;
        continue;
      }

      if (i + 1 < row.length && row[i] === row[i + 1]) {
        const sum = row[i] * 2;

        result.push(sum);
        this.score += sum;
        i += 2;
      } else {
        result.push(row[i]);
        i++;
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  afterMove() {
    this.addRandomTile();

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.board.flat().includes(2048);
  }

  checkLose() {
    return !this.board.flat().includes(0) && !this.canMove();
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
