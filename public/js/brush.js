import { Board } from './board.js';

export const DrawType = {
    CIRCLE: 'circle',
    SQUARE: 'square',
};


export const BrushType = {
    NORMAL: 'normal',
    BUCKET: 'bucket',
};


export class Brush {
    constructor() {
        this.mouseRadius = 0;
        this.drawColor = "#FFFFFF";
        this.drawCharacter = '0';
        this.brushType = BrushType.NORMAL;
        this.drawType = DrawType.CIRCLE;
    }

    setBrushType(brushType) {
        this.brushType = brushType;
    }

    setMouseRadius(radius) {
        this.mouseRadius = radius;
    }

    /* pass string color in format "#XXXXXX" */
    setDrawColor(color) {
        this.drawColor = color;
    }

    setDrawCharacter(character) {
        this.drawCharacter = character;
    }

    setDrawType(drawType) {
        this.drawType = drawType;
    }


    drawOnPosition(drawingBoard, row, col) {
        if (this.brushType === BrushType.BUCKET) {
            this.bucketOnPosition(drawingBoard, row, col);
        }
        else { // (this.brushType === BrushType.NORMAL)
            this.drawCharacterOnPosition(drawingBoard, row, col);
        }   
    }

    drawCharacterOnPosition(drawingBoard, row, col) {
        if (!drawingBoard.isPositionValid(row, col)) {
            return;
        }

        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = row + i;
                const coloredCol = col + j;

                if (this.drawType === DrawType.CIRCLE &&
                    ((coloredRow - row) ** 2 + (coloredCol - col) ** 2 > this.mouseRadius ** 2)
                ) {
                    continue;
                }
                drawingBoard.colorCell(coloredRow, coloredCol, this.drawCharacter, this.drawColor);
            }
        }
    }

    bucketOnPosition(drawingBoard, row, col) {
        if (!drawingBoard.isPositionValid(row, col)) return;

        let queue = [];
        let visited = new Set();
        let startCharacter = drawingBoard.boardMatrix[row][col].character;
        let startColor = drawingBoard.boardMatrix[row][col].color;

        queue.push({ x: row, y: col });

        while (queue.length > 0) {
            let { x, y } = queue.shift();
            let key = `${x},${y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (!drawingBoard.isPositionValid(x, y)) continue;

            let currentCell = drawingBoard.boardMatrix[x][y];
            if (currentCell.character !== startCharacter || currentCell.color !== startColor) continue;

            drawingBoard.colorCell(x, y, this.drawCharacter, this.drawColor);

            queue.push({ x: x + 1, y });
            queue.push({ x: x - 1, y });
            queue.push({ x, y: y + 1 });
            queue.push({ x, y: y - 1 });
        }
    }

    drawLine(drawingBoard, fromX, fromY, toX, toY) {
        let dx = Math.abs(toX - fromX);
        let dy = Math.abs(toY - fromY);
        let sx = fromX < toX ? 1 : -1;
        let sy = fromY < toY ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.drawCharacterOnPosition(drawingBoard, fromX, fromY);
            if (fromX === toX && fromY === toY) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                fromX += sx;
            }
            if (e2 < dx) {
                err += dx;
                fromY += sy;
            }// MATH, BABY!
        }
    }
}
