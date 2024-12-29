const { describe, test, expect, beforeEach } = require('@jest/globals'); 
const { DrawingBoard, DrawType } = require('../../public/js/drawing_board');

describe('DrawingBoard Class Tests', () => {
    let board;

    beforeEach(() => {
        board = new DrawingBoard(10, 5);
        board.setDrawColor("#FF0000");
        board.setDrawCharacter('@');
    });

    test('should initialize the board with the correct size', () => {
        expect(board.boardMatrix.length).toBe(5);
        expect(board.boardMatrix[0].length).toBe(10);
    });

    test('should reset board to default character', () => {
        board.resetBoard();
        expect(board.boardMatrix.every(row => row.every(cell => cell.character === ' '))).toBe(true);
    });

    test('should set draw character and color correctly', () => {
        expect(board.drawCharacter).toBe('@');
        expect(board.drawColor).toBe("#FF0000");
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