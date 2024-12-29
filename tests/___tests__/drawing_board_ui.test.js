const { describe, test, expect, beforeEach } = require('@jest/globals'); 
const { DrawingBoardUI } = require('../../public/js/drawing_board_ui');
const { DrawingBoard, DrawType } = require('../../public/js/drawing_board');

describe('DrawingBoardUI Tests', () => {
    let board, boardUI;

    beforeEach(() => {
        document.body.innerHTML = `<div class="draw-board"></div>`; // mock
        board = new DrawingBoard(50, 50);
        boardUI = new DrawingBoardUI(board);
        boardUI.init();
    });

    test('should initialize UI on load', () => {
        const drawBoardElement = document.querySelector('.draw-board');
        expect(drawBoardElement).not.toBeNull();
        expect(boardUI.drawBoardElement).not.toBeNull();
    });

    test('should detect clicked cell correctly', () => {
        const fakeEvent = {
            clientX: 50,
            clientY: 50,
        };
        const cell = boardUI.getClickedCellCoordinates(fakeEvent);
        expect(cell).toHaveProperty('clickedRow');
        expect(cell).toHaveProperty('clickedCol');

        const drawBoardRect = this.drawBoardElement.getBoundingClientRect();
        const cellWidth = drawBoardRect.width / this.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / this.drawingBoard.boardMatrix.length;
        const clickedCol = Math.floor((click_event.clientX - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((click_event.clientY - drawBoardRect.top) / cellHeight);
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
        boardUI.mouseDown({ clientX: 20, clientY: 20 });
        const fakeMoveEvent = { clientX: 40, clientY: 40 };
        boardUI.mouseMove(fakeMoveEvent);
        expect(board.boardMatrix[2][2].character).toBe('@');
        expect(board.boardMatrix[3][3].character).toBe('@');
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
        const spy = jest.spyOn(document, 'createElement');
        const downloadSpy = jest.fn();
        spy.mockReturnValue({ click: downloadSpy });
        
        boardUI.saveBoard();
        
        expect(spy).toHaveBeenCalled();
        expect(downloadSpy).toHaveBeenCalled();
    });

    test('should load the board from a file', () => {
        const boardData = JSON.stringify(board.boardMatrix);
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

        const spy = jest.spyOn(boardUI.drawingBoard, 'redrawBoard');
        boardUI.loadBoard(fakeEvent);

        expect(spy).toHaveBeenCalled();
        // Ensure the board's state is updated
        expect(JSON.stringify(board.boardMatrix)).toEqual(boardData);
    });

    test('should redraw the board correctly after loading', () => {
        board.fillBoardWithCharacter('O');
        const boardJSON = board.exportBoardAsJSON();
        const newBoard = new DrawingBoard(10, 5);
        newBoard.importBoardFromJSON(boardJSON);
        const spy = jest.spyOn(newBoard, 'redrawBoard');
        
        newBoard.redrawBoard(document.querySelector('.draw-board'));

        expect(spy).toHaveBeenCalled();
        expect(newBoard.boardMatrix[0][0].character).toBe('O');
    });
});
