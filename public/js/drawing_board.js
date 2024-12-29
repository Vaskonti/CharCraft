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
        this.boardMatrix = Array(sizeX).fill().map(() => Array(sizeY).fill());
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

    colorCell(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }
        this.boardMatrix[row][col].character = this.drawCharacter;
        this.boardMatrix[row][col].color = this.drawColor;
        this.updateCellTag(row, col);
    }

    /* pass string color in format "#XXXXXX" */
    setDrawColor(color) {
        this.drawColor = color
    }

    setDrawCharacter(character) {
        this.drawCharacter = character
    }

    drawCharacterOnPoint(row, col) {
        if (!this.isPositionValid(row, col)) {
            return;
        }

        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = row + i;
                const coloredCol = col + j;
                if (this.drawType == DrawType.CIRCLE &&
                    (coloredRow - row)**2 + (coloredCol - col)**2 > this.mouseRadius**2
                ) {
                    continue;
                }
                this.colorCell(coloredRow, coloredCol);
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
            } // MATH, BABY!
        }
    }

    bucketOnPosition(x, y) {
        if (!this.isPositionValid(x, y)) {
            return;
        }
    
        let queue = [];
        let visited = new Set(); // Set to track visited points
        let point = {x, y};
        queue.push(point);
    
        let characterToBeBucketed = this.boardMatrix[x][y].character;
        let characterColor = this.boardMatrix[x][y].color;
    
        while (queue.length !== 0) {
            let {x, y} = queue.shift();
    
            let key = `${x},${y}`;
            if (visited.has(key)) {
                continue;
            }
            visited.add(key);
    
            if (!this.isPositionValid(x, y)) {
                continue;
            }
            if (
                this.boardMatrix[x][y].character !== characterToBeBucketed ||
                this.boardMatrix[x][y].color !== characterColor
            ) {
                continue;
            }
    
            this.colorCell(x, y);
    
            queue.push({x: x + 1, y});
            queue.push({x: x - 1, y});
            queue.push({x, y: y + 1});
            queue.push({x, y: y - 1});
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