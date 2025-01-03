import { Board, defaultColor } from './board.js';

export const BrushShape = {
    CIRCLE: 'circle',
    SQUARE: 'square',
};


export const ToolType = {
    NORMAL: 'normal',
    BUCKET: 'bucket',
};

export const BrushType = {
    NORMAL: 'normal',
    COLOR_ONLY: 'color_only',
    CHARACTER_ONLY: 'character_only',
    EMBOLDEN_CHARACTER: 'embolden_character',
    FADE_CHARACTER: 'fade_character'
};

export class Brush {
    constructor() {
        this.mouseRadius = 0;
        this.drawColor = defaultColor;
        this.drawCharacter = '0';
        this.toolType = ToolType.NORMAL;
        this.brushShape = BrushShape.CIRCLE;
        this.brushType = BrushType.NORMAL;
    }

    setBrushType(brushType) {
        this.brushType = brushType;
    }

    setToolType(toolType) {
        this.toolType = toolType;
    }

    setMouseRadius(radius) {
        this.mouseRadius = radius;
    }

    /* pass string color in format "#XXXXXX" preferably */
    setDrawColor(color) {
        this.drawColor = color;
    }

    setDrawCharacter(character) {
        this.drawCharacter = character;
    }

    setBrushShape(brushShape) {
        this.brushShape = brushShape;
    }


    drawOnPosition(drawingBoard, row, col) {
        if (this.toolType === ToolType.BUCKET) {
            this.bucketOnPosition(drawingBoard, row, col);
        }
        else { // (this.toolType === ToolType.NORMAL)
            this.drawCharacterOnPosition(drawingBoard, row, col);
        }   
    }

    colorCellOnBoard(drawingBoard, row, col) {
        if (this.brushType === BrushType.NORMAL) {
            drawingBoard.colorCell(row, col, this.drawCharacter, this.drawColor);
        }
        else if (this.brushType === BrushType.COLOR_ONLY) {
            drawingBoard.colorCell(row, col, null, this.drawColor);
        }
        else if (this.brushType === BrushType.CHARACTER_ONLY) {
            drawingBoard.colorCell(row, col, this.drawCharacter, null);
        }
        else if (this.brushType === BrushType.EMBOLDEN_CHARACTER) {
            drawingBoard.emboldCell(row, col);
        }
        else if (this.brushType === BrushType.FADE_CHARACTER) {
            drawingBoard.fadeCell(row, col);
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

                if (this.brushShape === BrushShape.CIRCLE &&
                    ((coloredRow - row) ** 2 + (coloredCol - col) ** 2 > this.mouseRadius ** 2)
                ) {
                    continue;
                }

                this.colorCellOnBoard(drawingBoard, coloredRow, coloredCol);
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

            this.colorCellOnBoard(drawingBoard, x, y);

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
