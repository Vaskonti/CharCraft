const { describe, test, expect, beforeEach } = require('@jest/globals'); 
import { TextBoard, create_some_text_board } from '../../src/js/text_board.js';
import { Brush, ToolType, BrushShape, BrushType } from '../../src/js/brush.js';
import { Character } from '../../src/js/character.js';

describe('Brush Class Tests', () => {
    let board;
    let brush;
    beforeEach(() => {
        board = create_some_text_board();
        brush = new Brush();
    });

    describe('Brush bounds tests', () => {
        test('should switch brush type correctly', () => {
            brush.setMouseRadius(1);
            board.colorCell = jest.fn();
            brush.setToolType(ToolType.BUCKET);
            brush.bucketOnPosition(board, 0, 0);
            expect(board.colorCell).toHaveBeenCalledTimes(4);
        
            board.colorCell = jest.fn(); // reset 
            brush.setToolType(ToolType.NORMAL);
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

        test('BrushType.NORMAL should change both character and color', () => {
            brush.setBrushType(BrushType.NORMAL);
            brush.setDrawColor('#FF0000');
            brush.setDrawCharacter('@');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('@');
            expect(board.boardMatrix[2][2].color).toBe('#FF0000');
        });
    
        test('BrushType.COLOR_ONLY should change only the color', () => {
            brush.setBrushType(BrushType.COLOR_ONLY);
            brush.setDrawColor('#FF0000');
            brush.setDrawCharacter('@');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('E');
            expect(board.boardMatrix[2][2].color).toBe('#FF0000');
        });
    
        test('BrushType.CHARACTER_ONLY should change only the character', () => {
            brush.setBrushType(BrushType.CHARACTER_ONLY);
            brush.setDrawColor('#FF0000');
            brush.setDrawCharacter('@');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('@');
            expect(board.boardMatrix[2][2].color).toBe('purple');
        });
    
        test('BrushType.NORMAL should work with larger radius', () => {
            brush.setBrushType(BrushType.NORMAL);
            brush.setMouseRadius(1);
            brush.setDrawColor('#00FF00');
            brush.setDrawCharacter('*');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('*');
            expect(board.boardMatrix[2][2].color).toBe('#00FF00');
            expect(board.boardMatrix[1][2].character).toBe('*');
            expect(board.boardMatrix[1][2].color).toBe('#00FF00');
            expect(board.boardMatrix[2][1].character).toBe('*');
            expect(board.boardMatrix[2][1].color).toBe('#00FF00');
        });
    
        test('BrushType.COLOR_ONLY should work with larger radius', () => {
            brush.setBrushType(BrushType.COLOR_ONLY);
            brush.setMouseRadius(1);
            brush.setDrawColor('#00FF00');
            brush.setDrawCharacter('*');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('E');
            expect(board.boardMatrix[2][2].color).toBe('#00FF00');
            expect(board.boardMatrix[1][2].character).toBe('B');
            expect(board.boardMatrix[1][2].color).toBe('#00FF00');
            expect(board.boardMatrix[2][1].character).toBe('D');
            expect(board.boardMatrix[2][1].color).toBe('#00FF00');
        });
    
        test('BrushType.CHARACTER_ONLY should work with larger radius', () => {
            brush.setBrushType(BrushType.CHARACTER_ONLY);
            brush.setMouseRadius(1);
            brush.setDrawColor('#00FF00');
            brush.setDrawCharacter('*');
    
            brush.drawCharacterOnPosition(board, 2, 2);
    
            expect(board.boardMatrix[2][2].character).toBe('*');
            expect(board.boardMatrix[2][2].color).toBe('purple');
            expect(board.boardMatrix[1][2].character).toBe('*');
            expect(board.boardMatrix[1][2].color).toBe('blue');
            expect(board.boardMatrix[2][1].character).toBe('*');
            expect(board.boardMatrix[2][1].color).toBe('yellow');
        });

        test('should return correct positions for circular brush shape', () => {
            brush.setBrushShape(BrushShape.CIRCLE);
            brush.setMouseRadius(1);
    
            const positions = brush.getColoringPositionsForPoint(2, 2);
    
            expect(positions).toContainEqual([2, 2]);
            expect(positions).toContainEqual([1, 2]);
            expect(positions).toContainEqual([2, 1]);
            expect(positions).toContainEqual([3, 2]);
            expect(positions).toContainEqual([2, 3]);
            expect(positions).not.toContainEqual([0, 0]);
        });
    
        test('should return correct positions for square brush shape', () => {
            brush.setBrushShape(BrushShape.SQUARE);
            brush.setMouseRadius(1);
    
            const positions = brush.getColoringPositionsForPoint(2, 2);
    
            expect(positions).toContainEqual([2, 2]);
            expect(positions).toContainEqual([1, 1]);
            expect(positions).toContainEqual([1, 2]);
            expect(positions).toContainEqual([1, 3]);
            expect(positions).toContainEqual([2, 1]);
            expect(positions).toContainEqual([2, 3]);
            expect(positions).toContainEqual([3, 1]);
            expect(positions).toContainEqual([3, 2]);
            expect(positions).toContainEqual([3, 3]);
        });
    
        test('should return no positions for radius 0', () => {
            brush.setBrushShape(BrushShape.CIRCLE);
            brush.setMouseRadius(0);
    
            const positions = brush.getColoringPositionsForPoint(2, 2);
    
            expect(positions).toContainEqual([2, 2]);
            expect(positions).toHaveLength(1);
        });
    
        test('should handle edge cases correctly', () => {
            brush.setBrushShape(BrushShape.CIRCLE);
            brush.setMouseRadius(2);
    
            const positions = brush.getColoringPositionsForPoint(0, 0);
    
            expect(positions).toContainEqual([0, 0]);
            expect(positions).toContainEqual([1, 0]);
            expect(positions).toContainEqual([0, 1]);
            expect(positions).toContainEqual([1, 1]);
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
            brush.setToolType(ToolType.BUCKET);
            brush.setMouseRadius(2);
            brush.setBrushShape(BrushShape.SQUARE);

            expect(brush.drawColor).toBe("#FF0000");
            expect(brush.drawCharacter).toBe('@');
            expect(brush.toolType).toBe(ToolType.BUCKET);
            expect(brush.mouseRadius).toBe(2);
            expect(brush.brushShape).toBe(BrushShape.SQUARE);
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
            brush.setBrushShape(BrushShape.SQUARE);
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
