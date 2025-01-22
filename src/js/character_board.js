import { Character } from './character.js';
import { emptyCharacter, defaultColor, reducedAsciiVisibilityRank, getVisibilityRankIndexOfCharacter } from '../../src/js/utils.js';

export class CharacterBoard {
    constructor(sizeX, sizeY) {
        this.rows = sizeX;
        this.cols = sizeY;
        this.defaultCharacter = emptyCharacter;
        this.defaultColor = defaultColor;
        this.boardMatrix = Array(sizeX).fill().map(() => Array(sizeY).fill());
        this.resetBoard();
    }

    initialiseContainer(container) {
        throw new Error("Subclasses need to define initialiseContainer.");
    }

    resetBoard() {
        this.fillBoardWithCharacter(this.defaultCharacter);
    }

    clearBoard() {
        this.fillBoardWithCharacter(emptyCharacter);
    }

    isPositionValid(row, col) {
        return (
            row >= 0 &&
            row < this.rows &&
            col >= 0 &&
            col < this.cols
        );
    }

    fillBoardWithCharacter(character, color = defaultColor) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.boardMatrix[row][col] = new Character(character, color);
            }
        }
    }

    _setCell(row, col, character, color)
    {
        if (character) {
            this.boardMatrix[row][col].character = character;
        }
        if (color) {
            if (this.boardMatrix[row][col].character == emptyCharacter) { // should not be coloring
                color = defaultColor;
            }
            this.boardMatrix[row][col].color = color;
        }
    }
    
    colorCell(row, col, character, color) {
        if (!this.isPositionValid(row, col)) {
            return;
        }

        this._setCell(row, col, character, color);
    }

    exportBoardAsJSON() {
        return JSON.stringify(this.boardMatrix);
    }

    importBoardFromJSON(boardData) {
        this.boardMatrix = JSON.parse(boardData);
    }

    setBoardSize(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        const oldBoard = this.boardMatrix;
        this.boardMatrix = Array(rows).fill().map(() => Array(cols).fill());
        this.resetBoard();
        
        oldBoard.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                if (rowIndex >= rows || colIndex >= cols) {
                    return;
                }
                this.boardMatrix[rowIndex][colIndex] = element;
            });
        }); 
    }

    emboldCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        const character_index = getVisibilityRankIndexOfCharacter(this.boardMatrix[row][col].character);
        if (character_index == reducedAsciiVisibilityRank.length - 1) {
            return;
        }
        this._setCell(row, col, reducedAsciiVisibilityRank[character_index + 1], null);
    }

    fadeCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        const character_index = getVisibilityRankIndexOfCharacter(this.boardMatrix[row][col].character);
        if (character_index == 0) {
            return;
        }
        this._setCell(row, col, reducedAsciiVisibilityRank[character_index - 1], null);
    }

    static parseCopyBoard(parsedBoard, TargetBoardClass, additionalArgs = []) {
        const rows = parsedBoard.rows;
        const cols = parsedBoard.cols;
        const boardMatrixJSON = parsedBoard.exportBoardAsJSON(); 
        const newBoard = new TargetBoardClass(rows, cols, ...additionalArgs);
        newBoard.importBoardFromJSON(boardMatrixJSON);
    
        return newBoard;
    }
}