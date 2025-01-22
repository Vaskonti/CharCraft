import { Character } from './character.js';
import { CharacterBoard } from './character_board.js';
import { defaultColor } from './utils.js';


export class TextBoard extends CharacterBoard {
    constructor(sizeX, sizeY) {
        super(sizeX, sizeY);
        this.container = undefined;
        this.cellTagElements = undefined;
    }

    _setCell(row, col, character, color) {
        super._setCell(row, col, character, color);
        this.updateCellTag(row, col);
    }

    initialiseContainer(container) {
        this.container = container;
        this.#fillBoardContainer(container);
    }

    setBoardSize(sizeX, sizeY) {
        super.setBoardSize(sizeX, sizeY);

        if (this.container)
        {
            this.#fillBoardContainer(this.container);
        }
    }

    fillBoardWithCharacter(character, color = defaultColor) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.boardMatrix[row][col] = new Character(character, color);
                this.updateCellTag(row, col);
            }
        }
    }

    #fillBoardContainer(container) {
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
        this.cellTagElements = this.boardMatrix.map((row, rowIndex) =>
            row.map((_, colIndex) => document.getElementById(`cell-${rowIndex}-${colIndex}`))
        );
    }

    updateCellTag(row, col) {
        if (!this.cellTagElements) {
            return;
        }
        const cell = this.cellTagElements[row][col];

        if (cell) {
            const character = this.boardMatrix[row][col];
            cell.style.color = character.color;
            cell.textContent = character.character;
        }
    }

}



/* This function is for testing purposes */
export function create_some_text_board() {
    let board = new TextBoard(5, 5);
    board.boardMatrix = [
        [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
    ];
    return board;
}