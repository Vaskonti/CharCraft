const { describe, test, expect, beforeEach } = require('@jest/globals'); 
import { Board } from '../../public/js/board.js';
import { Character } from '../../src/js/character.js';

describe('Board Class Tests', () => {
    let board;

    beforeEach(() => {
        board = new Board(10, 5);
        board.setDefaultCharacter('@');
    });

    test('should initialize the board with the correct size', () => {
        expect(board.boardMatrix.length).toBe(10);
        expect(board.boardMatrix[0].length).toBe(5);
    });

    test('should reset board to default character', () => {
        board.resetBoard();
        expect(board.boardMatrix.every(row => row.every(cell => cell.character === '@'))).toBe(true);
    });

    test('should set default character correctly', () => {
        board.setDefaultCharacter('#');
        expect(board.defaultCharacter).toBe('#');
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

    test('should color a valid cell correctly', () => {
        board.boardMatrix[1][1] = new Character('A', '#000000');
        board.colorCell(1, 1, '@', '#FF0000'); // updated to include color

        expect(board.boardMatrix[1][1].character).toBe('@');
        expect(board.boardMatrix[1][1].color).toBe('#FF0000');
    });

    test('should handle invalid colorCell positions gracefully', () => {
        board.colorCell(-1, -1, '@', '#FF0000'); // Invalid position
        expect(board.boardMatrix.every(row => row.every(cell => cell.character !== '@'))).toBe(true);
    });

    test('should export and import board as JSON correctly', () => {
        board.fillBoardWithCharacter('X');
        const exportedData = board.exportBoardAsJSON();

        const newBoard = new Board(10, 5);
        newBoard.importBoardFromJSON(exportedData);

        expect(JSON.stringify(newBoard.boardMatrix)).toEqual(JSON.stringify(board.boardMatrix));
    });

    // TODO
    // test('should handle invalid board import gracefully', () => {
    //     const invalidData = '{"invalid": "data"}';
    //     expect(() => board.importBoardFromJSON(invalidData)).toThrow(SyntaxError);
    // });
});
