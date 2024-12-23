
class Character 
{
    constructor(character, color) 
    {
        this.character = character;
        this.color = color;
    }

    displayDetails() 
    {
        console.log(`character: ${this.character}, color: ${this.color}`);
    }
}

const mouse_radius = 0;
const board_size = 100
let draw_board = NaN;
let board_matrix = Array(board_size/2).fill().map(()=>Array(board_size).fill())
let mouse_hold = false

window.addEventListener("load", (_event) =>
{
    const collection = document.getElementsByClassName("draw-board");
    if (collection.length == 0)
    {
        console.log("Board doesn't exist.");
        return;
    }

    draw_board = collection[0];
    init_board_matrix();
    redraw_draw_board();
    document.addEventListener("click", mouse_click_callback);
    document.addEventListener("mouseup", mouse_up_callback);
    document.addEventListener("mousedown", mouse_down_callback);
    document.addEventListener("mousemove", mouse_move_callback);
});

function init_board_matrix()
{
    const text_color = "#FF0000";
    board_matrix.forEach((row, rowIndex) =>
    {   
        row.forEach((_, colIndex) =>
        {
            board_matrix[rowIndex][colIndex] = new Character('a', text_color);
        });
    });
}

function redraw_draw_board()
{
    let end_thing = "";
    board_matrix.forEach((row, rowIndex) =>
    {
        row.forEach((_, colIndex) =>
        {
            const cellId = `cell-${rowIndex}-${colIndex}`;
            const elementHTML = `<span id="${cellId}" style="color: ${board_matrix[rowIndex][colIndex].color};">${board_matrix[rowIndex][colIndex].character}</span>`;
            end_thing = end_thing.concat(elementHTML);
        });
        end_thing = end_thing.concat(`<br>`);
    });
    draw_board.innerHTML = end_thing;
}

function update_cell(row, col)
{
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);

    if (cell)
    {
        const character = board_matrix[row][col];
        cell.style.color = character.color;
        cell.textContent = character.character;
    }
}

function draw_on_mouse(event)
{
    mouse_x = event.clientX;
    mouse_y = event.clientY;

    const draw_board_rect = draw_board.getBoundingClientRect()
    const content_width = draw_board.scrollWidth;
    const content_height = draw_board.scrollHeight;
    
    if (mouse_x >= draw_board_rect.left &&
        mouse_x <= draw_board_rect.left + content_width &&
        mouse_y >= draw_board_rect.top &&
        mouse_y <= draw_board_rect.top + content_height)
    {

        const cell_width = draw_board_rect.width / board_matrix[0].length;
        const cell_height = draw_board_rect.height / board_matrix.length;

        const clicked_col = Math.floor((mouse_x - draw_board_rect.left) / cell_width);
        const clicked_row = Math.floor((mouse_y - draw_board_rect.top) / cell_height);

        for (let i = -mouse_radius; i <= mouse_radius; i++)
        {
            for (let j = -mouse_radius; j <= mouse_radius; j++)
            {
                const colored_row = clicked_row + i;
                const colored_col = clicked_col + j;

                if (
                    colored_row >= 0 && colored_row < board_matrix.length &&
                    colored_col >= 0 && colored_col < board_matrix[0].length
                )
                {
                    board_matrix[colored_row][colored_col].character = '#';
                    board_matrix[colored_row][colored_col].color = "#FFFFFF";
                    update_cell(colored_row, colored_col);
                }
            }
        }
    }
}

function mouse_click_callback(event) 
{
    draw_on_mouse(event);
}


function mouse_down_callback(_event)
{
    mouse_hold = true;
}

function mouse_up_callback(_event)
{
    mouse_hold = false;
}

function mouse_move_callback(event)
{
    if (mouse_hold)
    {
        draw_on_mouse(event);
    }
}

