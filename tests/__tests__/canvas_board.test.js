import { CanvasBoard } from '../../src/js/canvas_board.js';
import { Character } from '../../src/js/character.js';
import { defaultColor } from '../../src/js/utils.js';

const { describe, test, expect, beforeEach, jest } = require('@jest/globals');

describe('CanvasBoard Class Tests', () => {
    let board;
    let mockContainer;

    beforeEach(() => {
        board = new CanvasBoard(5, 5);
        mockContainer = {
            appendChild: jest.fn(),
        };
        document.createElement = jest.fn(() => ({
            width: 0,
            height: 0,
            getContext: jest.fn(() => ({
                clearRect: jest.fn(),
                fillRect: jest.fn(),
                fillText: jest.fn(),
                fillStyle: '',
                font: '',
                textBaseline: '',
            })),
        }));
    });

    test('should create a canvas on initialization', () => {
        board.initialiseContainer(mockContainer);

        expect(document.createElement).toHaveBeenCalledWith('canvas');
        expect(mockContainer.appendChild).toHaveBeenCalledWith(board.canvas);
        expect(board.context.font).toContain('16px Georgia'); // Default font
    });

    test('should initialize the canvas size correctly', () => {
        board.setBoardSize(10, 10);

        expect(board.canvas.width).toBe(10 * board.cellWidth);
        expect(board.canvas.height).toBe(10 * board.cellHeight);
    });

    test('should redraw the board when initialized with a container', () => {
        board.initialiseContainer(mockContainer);
        const contextMock = board.context;

        board.redrawBoard();
        expect(contextMock.clearRect).toHaveBeenCalledWith(
            0,
            0,
            board.canvas.width,
            board.canvas.height
        );
        expect(contextMock.fillText).toHaveBeenCalled();
    });

    test('should redraw individual cells correctly', () => {
        board.initialiseContainer(mockContainer);
        const contextMock = board.context;

        board.colorCell(2, 3, 'X', 'blue');
        const x = 3 * board.cellWidth;
        const y = 2 * board.cellHeight;

        expect(contextMock.fillRect).toHaveBeenCalledWith(
            x,
            y,
            board.cellWidth,
            board.cellHeight
        );
        expect(contextMock.fillStyle).toBe('blue');
        expect(contextMock.fillText).toHaveBeenCalledWith('X', x, y, board.cellWidth);
    });

    test('should handle invalid cell positions gracefully in colorCell', () => {
        board.initialiseContainer(mockContainer);
        board.context.fillText.mockClear();
        board.colorCell(-1, -1, 'X', 'red');
        expect(board.context.fillText).not.toHaveBeenCalled();
    });

    test('should redraw the entire board correctly', () => {
        board.initialiseContainer(mockContainer);
        const contextMock = board.context;
        contextMock.fillText.mockClear();
        board.fillBoardWithCharacter('A', 'green');
        expect(contextMock.clearRect).toHaveBeenCalled();
        expect(contextMock.fillText).toHaveBeenCalledTimes(25); // 5x5 grid
    });

    test('should properly handle resizing the board and updating the canvas', () => {
        board.initialiseContainer(mockContainer);
        board.setBoardSize(3, 3);

        expect(board.canvas.width).toBe(3 * board.cellWidth);
        expect(board.canvas.height).toBe(3 * board.cellHeight);
        expect(board.context.clearRect).toHaveBeenCalled();
    });

    test('should redraw the board when resizing', () => {
        board.initialiseContainer(mockContainer);
        const contextMock = board.context;

        contextMock.fillText.mockClear();
        board.setBoardSize(2, 2);
        expect(contextMock.clearRect).toHaveBeenCalled();
        expect(contextMock.fillText).toHaveBeenCalledTimes(4); // 2x2 grid
    });

    test('should create a canvas on initialization', () => {
        board.initialiseContainer(mockContainer);
    
        expect(document.createElement).toHaveBeenCalledWith('canvas');
        expect(mockContainer.appendChild).toHaveBeenCalledWith(board.canvas);
    
        expect(board.canvas.width).toBe(board.cols * board.cellWidth);
        expect(board.canvas.height).toBe(board.rows * board.cellHeight);
        //expect(board.context.font).toContain('16px Georgia');
    });

    test('should clear and redraw the cell when updating its content', () => {
        board.initialiseContainer(mockContainer);
        const contextMock = board.context;

        board.colorCell(1, 1, 'Z', 'orange');
        const x = 1 * board.cellWidth;
        const y = 1 * board.cellHeight;

        expect(contextMock.fillRect).toHaveBeenCalledWith(
            x,
            y,
            board.cellWidth,
            board.cellHeight
        );
        expect(contextMock.fillStyle).toBe('orange');
        expect(contextMock.fillText).toHaveBeenCalledWith('Z', x, y, board.cellWidth);
    });
});