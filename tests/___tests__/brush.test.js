const { describe, test, expect, beforeEach } = require('@jest/globals'); 
import { Board } from '../../public/js/board.js';
import { Brush, BrushType, DrawType } from '../../public/js/brush.js';
import { Character } from '../../src/js/character.js';

describe('Brush Class Tests', () => {
    let board;
    let brush;
    let oldFunction;
    beforeEach(() => {
        board = new Board(5, 5);
        brush = new Brush();
        board.boardMatrix = [
            [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        ];
        
    });

    describe('Brush bounds tests', () => {
        test('should switch brush type correctly', () => {
            brush.setMouseRadius(1);
            board.colorCell = jest.fn();
            brush.setBrushType(BrushType.BUCKET);
            brush.bucketOnPosition(board, 0, 0);
            expect(board.colorCell).toHaveBeenCalledTimes(4);
        
            board.colorCell = jest.fn(); // reset 
            brush.setBrushType(BrushType.NORMAL);
            brush.drawCharacterOnPosition(board, 2, 2); 
            expect(board.colorCell).toHaveBeenCalledTimes(5);
        });

        test('should reset brush color and character correctly', () => {
            brush.setDrawColor('#0000FF');
            brush.setDrawCharacter('@');
            brush.drawCharacterOnPosition(board, 2, 2);
            expect(board.boardMatrix[2][2].color).toBe('#0000FF');
            expect(board.boardMatrix[2][2].character).toBe('@');
            
            // Reset to default color and character
            brush.setDrawColor('#FFFFFF');
            brush.setDrawCharacter('0');
            brush.drawCharacterOnPosition(board, 2, 2);
            expect(board.boardMatrix[2][2].color).toBe('#FFFFFF');
            expect(board.boardMatrix[2][2].character).toBe('0');
        });

        test('should handle drawing out of bounds correctly 1', () => {
            brush.setMouseRadius(2);
            const spy = jest.spyOn(board, 'colorCell');
            board.updateCellTag = jest.fn();

            brush.drawCharacterOnPosition(board, 0, 0);
            expect(spy).toHaveBeenCalledTimes(13);
            expect(board.updateCellTag).toHaveBeenCalledTimes(6); // Should color 6 cells (within radius)
        });

        test('should handle drawing out of bounds correctly 2', () => {
            brush.setMouseRadius(2);
            const spy = jest.spyOn(board, 'colorCell');
            board.updateCellTag = jest.fn();

            brush.drawCharacterOnPosition(board, 3, 3);
            expect(spy).toHaveBeenCalledTimes(13);
            expect(board.updateCellTag).toHaveBeenCalledTimes(11); // same
        });


        test('should draw a line correctly', () => {
            brush.setDrawColor('#FF00FF');
            brush.setDrawCharacter('*');
            
            brush.drawLine(board, 0, 0, 4, 4);
        
            expect(board.boardMatrix[0][0].character).toBe('*');
            expect(board.boardMatrix[1][1].character).toBe('*');
            expect(board.boardMatrix[2][2].character).toBe('*');
            expect(board.boardMatrix[3][3].character).toBe('*');
            expect(board.boardMatrix[4][4].character).toBe('*');
        });
    });

    describe('Brush Bucket Tests', () => {
        test('should color all connected cells with the same character and color', () => {
            board.colorCell = jest.fn();
            brush.bucketOnPosition(board, 0, 0);

            expect(board.colorCell).toHaveBeenCalledTimes(4);
            expect(board.colorCell).toHaveBeenCalledWith(0, 0, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(0, 1, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(1, 0, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(1, 1, "0", "#FFFFFF");
        });

        test('should not color cells with a different character or color', () => {
            board.colorCell = jest.fn();
            brush.bucketOnPosition(board, 2, 0);

            expect(board.colorCell).toHaveBeenCalledTimes(6);
            expect(board.colorCell).toHaveBeenCalledWith(2, 0, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(2, 1, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(3, 0, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(3, 1, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(4, 0, "0", "#FFFFFF");
            expect(board.colorCell).toHaveBeenCalledWith(4, 1, "0", "#FFFFFF");
        });

        test('should do nothing if starting position is invalid', () => {
            board.colorCell = jest.fn();
            brush.bucketOnPosition(board, -1, 0);

            expect(board.colorCell).not.toHaveBeenCalled();
        });
    });

    describe('Brush Draw Tests', () => {
        test('should set and get brush properties correctly', () => {
            brush.setDrawColor("#FF0000");
            brush.setDrawCharacter('@');
            brush.setBrushType(BrushType.BUCKET);
            brush.setMouseRadius(2);
            brush.setDrawType(DrawType.SQUARE);

            expect(brush.drawColor).toBe("#FF0000");
            expect(brush.drawCharacter).toBe('@');
            expect(brush.brushType).toBe(BrushType.BUCKET);
            expect(brush.mouseRadius).toBe(2);
            expect(brush.drawType).toBe(DrawType.SQUARE);
        });

        test('should draw character on point', () => {
            brush.setMouseRadius(1);
            brush.setDrawColor('#FF0000');
            brush.setDrawCharacter('@');
            
            brush.drawCharacterOnPosition(board, 2, 2);

            expect(board.boardMatrix[2][2].character).toBe('@');
            expect(board.boardMatrix[2][2].color).toBe('#FF0000');
            
            expect(board.boardMatrix[1][2].character).toBe('@');
            expect(board.boardMatrix[3][2].character).toBe('@');
            expect(board.boardMatrix[2][1].character).toBe('@');
            expect(board.boardMatrix[2][3].character).toBe('@');

            expect(board.boardMatrix[1][2].color).toBe('#FF0000');
            expect(board.boardMatrix[3][2].color).toBe('#FF0000');
            expect(board.boardMatrix[2][1].color).toBe('#FF0000');
            expect(board.boardMatrix[2][3].color).toBe('#FF0000');
        });

        test('should respect the draw type when drawing a character', () => {
            brush.setDrawType(DrawType.SQUARE);
            brush.setMouseRadius(1);
            brush.setDrawColor('#00FF00');
            brush.setDrawCharacter('*');
            
            brush.drawCharacterOnPosition(board, 2, 2);

            // Square should color the surrounding cells, not just the circle
            expect(board.boardMatrix[2][2].character).toBe('*');
            expect(board.boardMatrix[2][2].color).toBe('#00FF00');
            
            expect(board.boardMatrix[1][2].character).toBe('*');
            expect(board.boardMatrix[3][2].character).toBe('*');
            expect(board.boardMatrix[2][1].character).toBe('*');
            expect(board.boardMatrix[2][3].character).toBe('*');
        });
    });
});
