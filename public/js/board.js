import { Character } from '../../src/js/character.js'; /** TODO: fix pathing */

export const emptyCharacter = ' '

export class Board {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.boardMatrix = Array(sizeX).fill().map(() => Array(sizeY).fill());
        this.defaultCharacter = emptyCharacter;
        this.resetBoard();
    }

    setBoardSize(sizeX, sizeY) {
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.resetBoard();
    }

    setDefaultCharacter(character) {
        this.defaultCharacter = character;
    }

    fillBoardWithCharacter(character) {
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                this.boardMatrix[rowIndex][colIndex] = new Character(character, this.drawColor);
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
            this.boardMatrix[row][col].color = color;
        }
        this.updateCellTag(row, col);
    }

    exportBoardAsJSON() {
        return JSON.stringify(this.boardMatrix);
    }

    importBoardFromJSON(boardData) {
        this.boardMatrix = JSON.parse(boardData);
    }
}
