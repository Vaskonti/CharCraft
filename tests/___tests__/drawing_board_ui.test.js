const { describe, test, expect, beforeEach } = require('@jest/globals'); 
import { DrawingBoardUI } from '../../public/js/drawing_board_ui.js';
import { DrawingBoard, DrawType } from '../../public/js/drawing_board.js';

describe('DrawingBoardUI Tests', () => {
    let board, boardUI, drawBoardElement;

    beforeEach(() => {
        document.body.innerHTML = `<div class="draw-board"></div>`; // mock
        board = new DrawingBoard(20, 20);
        board.setDrawCharacter('@');
        board.setDrawColor("#FF0000");
        boardUI = new DrawingBoardUI(board);
        boardUI.init();
        drawBoardElement = document.querySelector('.draw-board');

        drawBoardElement.getBoundingClientRect = jest.fn(() => ({ // mock getBoundingClientRect since it won't work good with jsDOM
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            right: 200,
            bottom: 200,
        }));

        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    });

    test('should initialize UI on load', () => {
        expect(drawBoardElement).not.toBeNull();
        expect(boardUI.drawBoardElement).not.toBeNull();

        const drawBoardRect = drawBoardElement.getBoundingClientRect();
        expect(drawBoardRect.width).toBeGreaterThan(0);
        expect(drawBoardRect.height).toBeGreaterThan(0);
    });

    test('should detect clicked cell correctly', () => {
        const fakeEvent = {
            clientX: 50,
            clientY: 50,
        };
        const cell = boardUI.getClickedCellCoordinates(fakeEvent);
        expect(cell).toHaveProperty('clickedRow');
        expect(cell).toHaveProperty('clickedCol');

        const drawBoardRect = drawBoardElement.getBoundingClientRect();
        const cellWidth = drawBoardRect.width / boardUI.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / boardUI.drawingBoard.boardMatrix.length;
        const clickedCol = Math.floor((fakeEvent.clientX - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((fakeEvent.clientY - drawBoardRect.top) / cellHeight);
        expect(typeof clickedCol).toBe('number');
        expect(typeof clickedRow).toBe('number');
        expect(cell.clickedCol).toEqual(clickedCol);
        expect(cell.clickedRow).toEqual(clickedRow);

    });

    test('should draw character on click', () => {
        const fakeEvent = {
            clientX: 50,
            clientY: 50,
        };
        boardUI.draw(fakeEvent);
        const rowCol = boardUI.getClickedCellCoordinates(fakeEvent);
        const cell = board.boardMatrix[rowCol.clickedRow][rowCol.clickedCol]; 
        expect(cell.character).toBe('@');
        expect(cell.color).toBe('#FF0000');
    });

    test('should not draw outside board boundaries', () => {
        const fakeEvent = {
            clientX: 9999,  // Out of bounds
            clientY: 9999,  // Out of bounds
        };
        const initialMatrix = JSON.stringify(board.boardMatrix);
        boardUI.draw(fakeEvent);
        expect(JSON.stringify(board.boardMatrix)).toEqual(initialMatrix);  // No change should occur
    });

    test('should draw a line between two points', () => {
        board.setMouseRadius(1);
        boardUI.mouseDown({ clientX: 0, clientY: 0 });
        boardUI.mouseMove({ clientX: 100, clientY: 100 });
        const cell1 = boardUI.getClickedCellCoordinates({ clientX: 0, clientY: 0 });
        const cell2 = boardUI.getClickedCellCoordinates({ clientX: 100, clientY: 100 });
        expect(board.boardMatrix[cell1.clickedRow][cell1.clickedCol].character).toBe('@');
        expect(board.boardMatrix[cell2.clickedRow][cell2.clickedCol].character).toBe('@');
        expect(board.boardMatrix[cell2.clickedRow - 1][cell2.clickedCol - 1].character).toBe('@');
        expect(board.boardMatrix[cell2.clickedRow - 2][cell2.clickedCol - 2].character).toBe('@');
        expect(board.boardMatrix[cell2.clickedRow/2][cell2.clickedCol/2].character).toBe('@');
        
        // Honestly I am too lazy to test it properly
    });

    test('should handle diagonal line drawing', () => {
        board.drawLine(0, 0, 4, 4);
        expect(board.boardMatrix[0][0].character).toBe('@');
        expect(board.boardMatrix[1][1].character).toBe('@');
        expect(board.boardMatrix[2][2].character).toBe('@');
        expect(board.boardMatrix[3][3].character).toBe('@');
        expect(board.boardMatrix[4][4].character).toBe('@');
    });

    test('should save the board to a file', () => {
        board.fillBoardWithCharacter('X');

        global.URL.revokeObjectURL = jest.fn();
        // Mock document.createElement to spy on link creation
        const spy = jest.spyOn(document, 'createElement').mockReturnValue({
            setAttribute: jest.fn(),
            click: jest.fn(),
        });
    
        // Mock Blob URL creation
        const downloadSpy = jest.fn();
        spy.mockReturnValueOnce({
            setAttribute: jest.fn(),
            click: downloadSpy,
            href: 'mocked-url',
        });
        
        boardUI.saveBoard();
        
        expect(spy).toHaveBeenCalled();
        expect(downloadSpy).toHaveBeenCalled();
    });

    test('should load the board from a file', () => {
        const boardData = JSON.stringify(board.boardMatrix);
        
        // Create fake file event
        const fakeEvent = {
            target: {
                files: [{
                    name: 'drawing.json',
                    type: 'application/json',
                    size: boardData.length,
                    text: () => Promise.resolve(boardData),
                }]
            }
        };
    
        // Mock FileReader
        global.FileReader = jest.fn(function() {
            this.readAsText = jest.fn((file) => {
                const reader = this;
                reader.onload({ target: { result: boardData } });
            });
        });
    
        const spy = jest.spyOn(boardUI.drawingBoard, 'fillBoardContainer');

        boardUI.loadBoard(fakeEvent);

        expect(spy).toHaveBeenCalled();
        expect(JSON.stringify(board.boardMatrix)).toEqual(boardData);
        expect(spy.mock.calls[0][0]).toBe(drawBoardElement); // that's cool, lol
    });

    test('should redraw the board correctly after loading', () => {
        board.fillBoardWithCharacter('O');
        const boardJSON = board.exportBoardAsJSON();
        const newBoard = new DrawingBoard(20, 20);
        newBoard.importBoardFromJSON(boardJSON);
        const spy = jest.spyOn(newBoard, 'fillBoardContainer');
        
        newBoard.fillBoardContainer(document.querySelector('.draw-board'));

        expect(spy).toHaveBeenCalled();
        expect(newBoard.boardMatrix[0][0].character).toBe('O');
        expect(newBoard.boardMatrix[19][19].character).toBe('O');
    });
});
