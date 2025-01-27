import { TextBoard } from '../../public/src/js/text_board.js';
import { Character } from '../../public/src/js/character.js';
import { defaultColor } from '../../public/src/js/utils.js';

const { describe, test, expect, beforeEach, jest } = require('@jest/globals');

describe('TextBoard Class Tests', () => {
    let board;
    let mockContainer;
    let spy;

    beforeEach(() => {
        document.body.innerHTML = `<pre class="draw-board"></pre>`;
        board = new TextBoard(5, 5);
        mockContainer = document.querySelector('.draw-board');
        board.initialiseContainer(mockContainer);
    });

    test('should initialize container and fill it with board HTML', () => {
        expect(mockContainer.innerHTML).toContain('span');
        expect(mockContainer.innerHTML).toContain('id="cell-0-0"');
    });

    test('should update cell tag when a cell is colored', () => {
        board.colorCell(0, 0, 'X', 'red');

        const cell = document.getElementById('cell-0-0');
        expect(cell.style.color).toBe('red');
        expect(cell.textContent).toBe('X');
    });

    test('should handle invalid positions gracefully when coloring cells', () => {
        expect(() => board.colorCell(-1, -1, 'X', 'red')).not.toThrow();
    });

    test('should reset and update container when board size changes', () => {
        board.setBoardSize(3, 3);

        expect(board.rows).toBe(3);
        expect(board.cols).toBe(3);
        expect(mockContainer.innerHTML).toContain('id="cell-2-2"');
        expect(mockContainer.innerHTML).not.toContain('id="cell-4-4"');
    });

    test('should fill board with characters and update tags', () => {
        board.fillBoardWithCharacter('A', 'blue');

        board.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                const cellTag = document.getElementById(`cell-${rowIndex}-${colIndex}`);
                expect(cellTag.style.color).toBe('blue');
                expect(cellTag.textContent).toBe('A');
            });
        });
    });

    test('should properly create and maintain the board structure after initialization', () => {
        expect(board.boardMatrix.length).toBe(5);
        expect(board.boardMatrix[0].length).toBe(5);
    });
});