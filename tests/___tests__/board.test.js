const { describe, test, expect, beforeEach } = require('@jest/globals'); 
import { Board, emptyCharacter, visibilityRank, create_some_board } from '../../public/js/board.js';
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
        board.colorCell(1, 1, '@', '#FF0000');

        expect(board.boardMatrix[1][1].character).toBe('@');
        expect(board.boardMatrix[1][1].color).toBe('#FF0000');
    });

    test('should handle invalid colorCell positions gracefully', () => {
        board.colorCell(-1, -1, '@', '#FF0000'); // Invalid position
        expect(board.boardMatrix.every(row => row.every(cell => cell.character !== '@'))).toBe(true);
    });

    test('should embold a cell correctly', () => {
        board.boardMatrix[2][2] = new Character('-', '#000000');
        board.emboldCell(2, 2);

        const character = board.boardMatrix[2][2].character;
        const expectedCharacter = visibilityRank[visibilityRank.indexOf('-') + 1];
        expect(character).toBe(expectedCharacter);
    });

    test('should not embold a cell if already at maximum visibility rank', () => {
        board.boardMatrix[3][3] = new Character('@', '#000000');
        board.emboldCell(3, 3);

        const character = board.boardMatrix[3][3].character;
        expect(character).toBe('@');
    });

    test('should fade a cell correctly', () => {
        board.boardMatrix[4][4] = new Character('o', '#000000');
        board.fadeCell(4, 4);

        const character = board.boardMatrix[4][4].character;
        const expectedCharacter = visibilityRank[visibilityRank.indexOf('o') - 1];
        expect(character).toBe(expectedCharacter);
    });

    test('should not fade a cell if already at minimum visibility rank', () => {
        board.boardMatrix[0][0] = new Character(emptyCharacter, '#000000');
        board.fadeCell(0, 0);

        const character = board.boardMatrix[0][0].character;
        expect(character).toBe(emptyCharacter);
    });

    test('should handle embold on invalid positions gracefully', () => {
        expect(() => board.emboldCell(-1, -1)).not.toThrow();
    });

    test('should handle fade on invalid positions gracefully', () => {
        expect(() => board.fadeCell(10, 10)).not.toThrow();
    });

    test('should export and import board as JSON correctly', () => {
        board.fillBoardWithCharacter('A', '#FFFFFF');
        const exportedData = board.exportBoardAsJSON();

        const newBoard = new Board(10, 5);
        newBoard.importBoardFromJSON(exportedData);

        expect(JSON.stringify(newBoard.boardMatrix)).toEqual(JSON.stringify(board.boardMatrix));
        expect(newBoard.boardMatrix).toEqual(board.boardMatrix)
        
    });


    test('Resizing baord to a smaller one should keep the inital characters and colors', () => {
        const oldBoard = create_some_board();
        board = create_some_board();
        board.setBoardSize(3, 3);

        expect(board.boardMatrix.length).toEqual(3)
        expect(board.boardMatrix[0].length).toEqual(3)

        board.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                expect(element).toEqual(oldBoard.boardMatrix[rowIndex][colIndex]);
            });
        });
    });

    // TODO
    // test('should handle invalid board import gracefully', () => {
    //     const invalidData = '{"invalid": "data"}';
    //     expect(() => board.importBoardFromJSON(invalidData)).toThrow(SyntaxError);
    // });
});
