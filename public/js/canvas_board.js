import { Character } from '../../src/js/character.js';
import { CharacterBoard } from '../../src/js/character_board.js';
import { defaultColor, canvasFont } from '../../src/js/utils.js';

export class CanvasBoard extends CharacterBoard {
    constructor(sizeX, sizeY, cellWidth = 10, cellHeight = 16) {
        super(sizeX, sizeY);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = undefined;
        this.context = undefined;
    }

    setBoardSize(sizeX, sizeY) {
        super.setBoardSize(sizeX, sizeY);
        this.#createCanvas();
        this.redrawBoard();
    }

    #createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.cols * this.cellWidth;
        this.canvas.height = this.rows * this.cellHeight;
        this.context = this.canvas.getContext('2d');
        this.context.font = `${this.cellHeight}px ${canvasFont}`; //TODO: find better font
        this.context.textBaseline = 'top';
    }

    initialiseContainer(container) {
        this.#createCanvas();
        container.appendChild(this.canvas);
        this.redrawBoard();
    }

    fillBoardWithCharacter(character, color = defaultColor) {
        super.fillBoardWithCharacter(character, color);
        this.redrawBoard();
    }

    _setCell(row, col, character, color) {
        super._setCell(row, col, character, color);
        this.#drawCell(row, col);
    }

    #drawCell(row, col) {
        const cell = this.boardMatrix[row][col];
        if (!cell) return;

        const x = col * (this.cellWidth);
        const y = row * (this.cellHeight);
        this.context.clearRect(x, y, this.cellWidth, this.cellHeight);
        this.context.fillStyle = cell.color || defaultColor;
        this.context.fillText(cell.character || " ", x, y, this.cellWidth);
    }

    redrawBoard() {
        if (!this.context)
        {
            return
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.#drawCell(row, col);
            }
        }
    }
}