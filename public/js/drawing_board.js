const { Character } = require('../../src/js/character'); /** TODO: fix pathing */

const emptyCharacter = ' '

const DrawType = {
    SQUARE: 'square',
    CIRCLE: 'circle',
};

Object.freeze(DrawType);

class DrawingBoard {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.mouseRadius = 1;
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.drawColor = "#FFFFFF"
        this.drawCharacter = '0'
        this.defaultCharacter = emptyCharacter
        this.drawType = DrawType.CIRCLE
        this.resetBoard();
    }

    setMouseRadius(mouseRadius) {
        this.mouseRadius = mouseRadius;
    }

    setDrawType(drawType) {
        this.drawType = drawType;
    }

    setBoardSize(sizeX, sizeY) {
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.resetBoard();
    }

    fillBoardWithCharacter(character) {
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                this.boardMatrix[rowIndex][colIndex] = new Character(character, this.drawColor);
            });
        });
    }

    clearBoard() {
        this.fillBoardWithCharacter(emptyCharacter);
    }

    resetBoard() {
        this.fillBoardWithCharacter(this.defaultCharacter);
    }

    setDefaultCharacter(character) {
        this.defaultCharacter = character
    }

    redrawBoard(container) {
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

    updateCell(row, col) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (cell) {
            const character = this.boardMatrix[row][col];
            cell.style.color = character.color;
            cell.textContent = character.character;
        }
    }

    /* pass string color in format "#XXXXXX" */
    setDrawColor(color) {
        this.drawColor = color
    }

    setDrawCharacter(character) {
        this.drawCharacter = character
    }


    drawCharacterOnPoint(x, y) {
        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = x + i;
                const coloredCol = y + j;
                if (this.drawType == DrawType.CIRCLE &&
                    (coloredRow - x)**2 + (coloredCol - y)**2 > this.mouseRadius**2
                )
                {
                    continue;
                }
                if (
                    coloredRow >= 0 && coloredRow < this.boardMatrix.length &&
                    coloredCol >= 0 && coloredCol < this.boardMatrix[0].length
                ) {
                    this.boardMatrix[coloredRow][coloredCol].character = this.drawCharacter;
                    this.boardMatrix[coloredRow][coloredCol].color = this.drawColor;
                    this.updateCell(coloredRow, coloredCol);
                }
            }
        }
    }

    drawLine(fromX, fromY, toX, toY) {
        let dx = Math.abs(toX - fromX);
        let dy = Math.abs(toY - fromY);
        let sx = fromX < toX ? 1 : -1;
        let sy = fromY < toY ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.drawCharacterOnPoint(fromX, fromY);

            if (fromX === toX && fromY === toY) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                fromX += sx;
            }
            if (e2 < dx) {
                err += dx;
                fromY += sy;
            }
        }
    }

    exportBoardAsJSON() {
        return JSON.stringify(this.boardMatrix);
    }

    importBoardFromJSON(boardData) {
        this.boardMatrix = JSON.parse(boardData);
    }
}



module.exports = { DrawingBoard, DrawType, emptyCharacter };