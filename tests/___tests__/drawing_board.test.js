const { describe, test, expect, beforeEach } = require('@jest/globals'); 
const { DrawingBoard, DrawType } = require('../../public/js/drawing_board');
const { Character } = require('../../src/js/character');

describe('DrawingBoard Class Tests', () => {
    let board;

    beforeEach(() => {
        board = new DrawingBoard(10, 5);
        board.setDrawColor("#FF0000");
        board.setDrawCharacter('@');
    });

    test('should initialize the board with the correct size', () => {
        expect(board.boardMatrix.length).toBe(10);
        expect(board.boardMatrix[0].length).toBe(5);
    });

    test('should reset board to default character', () => {
        board.resetBoard();
        expect(board.boardMatrix.every(row => row.every(cell => cell.character === ' '))).toBe(true);
    });

    test('should set draw character and color correctly', () => {
        expect(board.drawCharacter).toBe('@');
        expect(board.drawColor).toBe("#FF0000");
    });

    test('should return true for valid positions within the board', () => {
        expect(board.isPositionValid(0, 0)).toBe(true); 
        expect(board.isPositionValid(9, 4)).toBe(true); 
        expect(board.isPositionValid(2, 3)).toBe(true); 
    });

    test('should return false for positions outside the board', () => {
        expect(board.isPositionValid(-1, 0)).toBe(false); 
        expect(board.isPositionValid(0, -1)).toBe(false); 
        expect(board.isPositionValid(10, 0)).toBe(false);
        expect(board.isPositionValid(0, 5)).toBe(false);
    });

    test('should fill the board with a specific character', () => {
        board.fillBoardWithCharacter('#');
        expect(board.boardMatrix.every(row => row.every(cell => cell.character === '#'))).toBe(true);
    });

    test('should draw characters within the mouse circle radius', () => {
        board.setMouseRadius(1);
        board.drawCharacterOnPoint(2, 2);

        expect(board.boardMatrix[2][2].character).toBe('@');
        expect(board.boardMatrix[2][2].color).toBe("#FF0000");

        // Check adjacent cells within radius
        expect(board.boardMatrix[1][2].character).toBe('@');
        expect(board.boardMatrix[3][2].character).toBe('@');
        expect(board.boardMatrix[2][1].character).toBe('@');
        expect(board.boardMatrix[2][3].character).toBe('@');
        
        expect(board.boardMatrix[1][2].color).toBe("#FF0000");
        expect(board.boardMatrix[3][2].color).toBe("#FF0000");
        expect(board.boardMatrix[2][1].color).toBe("#FF0000");
        expect(board.boardMatrix[2][3].color).toBe("#FF0000");
    });

    test('should color a valid cell correctly', () => {
        board.boardMatrix[1][1] = new Character('A', '#000000');
        board.colorCell(1, 1);

        expect(board.boardMatrix[1][1].character).toBe('@');
        expect(board.boardMatrix[1][1].color).toBe("#FF0000");
    });

    test('should handle invalid colorCell positions gracefully', () => {
        board.colorCell(-1, -1); // Invalid position
        expect(board.boardMatrix.every(row => row.every(cell => cell.character !== '@'))).toBe(true);
    });

    test('should export and import board as JSON correctly', () => {
        board.fillBoardWithCharacter('X');
        const exportedData = board.exportBoardAsJSON();

        const newBoard = new DrawingBoard(10, 5);
        newBoard.importBoardFromJSON(exportedData);

        expect(JSON.stringify(newBoard.boardMatrix)).toEqual(JSON.stringify(board.boardMatrix));
    });

    // TODO
    // test('should handle invalid board import gracefully', () => {
    //     const invalidData = '{"invalid": "data"}';
    //     expect(() => board.importBoardFromJSON(invalidData)).toThrow(SyntaxError);
    // });
});



describe('DrawingBoard bucketOnPosition', () => {
    let board;

    beforeEach(() => {
        board = new DrawingBoard(5, 5);
        board.boardMatrix = [
            [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('A', 'red'), new Character('A', 'red'), new Character('B', 'blue'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
            [new Character('D', 'yellow'), new Character('D', 'yellow'), new Character('E', 'purple'), new Character('C', 'green'), new Character('C', 'green')],
        ];

        // Mock colorCell
        board.colorCell = jest.fn();
    });

    test('should color all connected cells with the same character and color', () => {
        board.bucketOnPosition(0, 0); 

        expect(board.colorCell).toHaveBeenCalledTimes(4);
        expect(board.colorCell).toHaveBeenCalledWith(0, 0);
        expect(board.colorCell).toHaveBeenCalledWith(0, 1);
        expect(board.colorCell).toHaveBeenCalledWith(1, 0);
        expect(board.colorCell).toHaveBeenCalledWith(1, 1);
    });

    test('should not color cells with a different character or color', () => {
        board.bucketOnPosition(2, 0);

        expect(board.colorCell).toHaveBeenCalledTimes(6);
        expect(board.colorCell).toHaveBeenCalledWith(2, 0);
        expect(board.colorCell).toHaveBeenCalledWith(2, 1);
        expect(board.colorCell).toHaveBeenCalledWith(3, 0);
        expect(board.colorCell).toHaveBeenCalledWith(3, 1);
        expect(board.colorCell).toHaveBeenCalledWith(4, 0);
        expect(board.colorCell).toHaveBeenCalledWith(4, 1);
    });

    test('should do nothing if starting position is invalid', () => {
        board.bucketOnPosition(-1, 0);

        expect(board.colorCell).not.toHaveBeenCalled();
    });
});