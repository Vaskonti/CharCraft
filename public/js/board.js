import { Character } from '../../src/js/character.js';
import {emptyCharacter, defaultColor, reducedAsciiVisibilityRank, getVisibilityRankIndexOfCharacter } from '../../src/js/utils.js';


export class Board {
    constructor(sizeX, sizeY) {
        this.boardMatrix = Array(sizeX).fill().map(() => Array(sizeY).fill());
        this.defaultCharacter = emptyCharacter;
        this.container = undefined;
        this.resetBoard();
    }

    setBoardSize(sizeX, sizeY) {
        const oldBoard = this.boardMatrix;
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.resetBoard();
        
        oldBoard.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                if (rowIndex >= sizeX || colIndex >= sizeY) {
                    return;
                }
                this.boardMatrix[rowIndex][colIndex] = element;
            });
        }); 

        if (this.container)
        {
            fillBoardContainer(this.container);
        }
    }

    setDefaultCharacter(character) {
        this.defaultCharacter = character;
    }

    fillBoardWithCharacter(character, color) {
        if (!color) {
            color = defaultColor;
        }
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                this.boardMatrix[rowIndex][colIndex] = new Character(character, color);
                this.updateCellTag(rowIndex, colIndex);
            });
        });
    }

    clearBoard() {
        this.fillBoardWithCharacter(emptyCharacter);
    }

    resetBoard() {
        this.fillBoardWithCharacter(this.defaultCharacter);
    }

    fillBoardContainer(container) {
        this.container = container;
        let boardHTML = "";
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellId = `cell-${rowIndex}-${colIndex}`;
                const elementHTML = `<span id="${cellId}" style="color: ${cell.color};">${cell.character}</span>`;
                boardHTML += elementHTML;
            });
            boardHTML += `<br>`;
        });
        container.innerHTML = boardHTML;
    }

    updateCellTag(row, col) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (cell) {
            const character = this.boardMatrix[row][col];
            cell.style.color = character.color;
            cell.textContent = character.character;
        }
    }

    isPositionValid(row, col) {
        return (row >= 0 && row < this.boardMatrix.length &&
            col >= 0 && col < this.boardMatrix[0].length);
    }

    colorCell(row, col, character, color) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        if (character) {
            this.boardMatrix[row][col].character = character;
        }
        if (color) {
            if (this.boardMatrix[row][col].character == emptyCharacter) { // should not be coloring
                return;
            }
            this.boardMatrix[row][col].color = color;
        }
        this.updateCellTag(row, col);
    }

    emboldCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        const character_index = getVisibilityRankIndexOfCharacter(this.boardMatrix[row][col].character);
        if (character_index == reducedAsciiVisibilityRank.length - 1) {
            return;
        }
        this.colorCell(row, col, reducedAsciiVisibilityRank[character_index + 1], null);
    }

    fadeCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        const character_index = getVisibilityRankIndexOfCharacter(this.boardMatrix[row][col].character);
        if (character_index == 0) {
            return;
        }
        this.colorCell(row, col, reducedAsciiVisibilityRank[character_index - 1], null);
    }

    exportBoardAsJSON() {
        return JSON.stringify(this.boardMatrix);
    }

    importBoardFromJSON(boardData) {
        this.boardMatrix = JSON.parse(boardData);
    }
}



/* This function is for testing purposes */
export function create_some_board() {
    let board = new Board(5, 5);
    board.boardMatrix = [
        [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
    ];
    return board;
}