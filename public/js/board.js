import { Character } from '../../src/js/character.js'; /** TODO: fix pathing */

export const emptyCharacter = ' '
export const defaultColor = "#FFFFFF"

export const visibilityRank = [emptyCharacter, '.', '-', '=', 'o', 'a', '#', '@'];
const densityCache = {}; // TODO: investigate: is that global for user now, or resets anytime the page is reset????
const densityIndexCache = {};

function precomputeDensityForVisibilityRank() {
    for (let i = 0; i < visibilityRank.length; i += 1) {
        densityCache[visibilityRank[i]] = computeCharacterDensity(visibilityRank[i]);
        densityIndexCache[visibilityRank[i]] = i;
    }
}

/* This function calculates the density of a given character by determining 
    how much of its rendered area is visually "filled" (i.e., has visible pixels) between 0 and 1.
    Stores the character in cache. When called later the function returns immediately.*/
function computeCharacterDensity(character) {
    if (character in densityCache)
    {
        return densityCache[character];
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '10px monospace';
    ctx.fillText(character, 0, 10);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let filledPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3];
        if (alpha > 128) filledPixels++;
    }

    const density = filledPixels / (canvas.width * canvas.height);
    return density;
}


/* This function returns the index of a character in the visibilityRank with the closest density heuristic. NOTE:: the visibility ranks MUST be precomputed. 
    Keeps character in densityIndexCache so it doesn't always compute */
function getVisibilityRankIndexOfCharacter(character) {
    if (character in densityIndexCache)
    {
        return densityIndexCache[character];
    }
    let closest_density_distance = 100;
    let best_rank_index = 0;
    const character_density = computeCharacterDensity(character);
    for (let i = 0; i < visibilityRank.length; i += 1) {
        const density_distance = Math.abs(densityCache[visibilityRank[i]] - character_density);
        if (density_distance < closest_density_distance)
        {
            best_rank_index = i;
            closest_density_distance = density_distance;
        }
    }
    densityIndexCache[character] = best_rank_index;
    return best_rank_index;
}
//window.addEventListener("load", (_) => {
precomputeDensityForVisibilityRank(); // TODO: assess if this function is better left a global call.
//});


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
        if (character_index == visibilityRank.length - 1) {
            return;
        }
        this.colorCell(row, col, visibilityRank[character_index + 1], null);
    }

    fadeCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        const character_index = getVisibilityRankIndexOfCharacter(this.boardMatrix[row][col].character);
        if (character_index == 0) {
            return;
        }
        this.colorCell(row, col, visibilityRank[character_index - 1], null);
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