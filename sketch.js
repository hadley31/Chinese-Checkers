
//#region Constants

const TILE_START_INDICES	= [6, 5, 5, 4, 0, 0, 1, 1, 2, 1, 1, 0, 0, 4, 5, 5, 6];
const ROW_SIZES 		= [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];

const CANVAS_WIDTH 		= 750;
const CANVAS_HEIGHT 		= 750;

const GRID_WIDTH 		= 13;
const GRID_HEIGHT 		= 17;

const NO_PIECE 			= 0;
const GREEN_PIECE 		= 1;
const BLUE_PIECE 		= 2;
const BLACK_PIECE 		= 3;
const RED_PIECE 		= 4;
const YELLOW_PIECE 		= 5;
const WHITE_PIECE 		= 6;

const GREEN_START 		= [173, 174, 175, 176, 187, 188, 189, 200, 201, 214];
const BLUE_START 		= [127, 140, 141, 152, 153, 154, 165, 166, 167, 168];
const BLACK_START 		= [61, 62, 63, 64, 74, 75, 76, 88, 89, 101];
const RED_START 		= [6, 18, 19, 31, 32, 33, 43, 44, 45, 46];
const YELLOW_START 		= [52, 53, 54, 55, 65, 66, 67, 79, 80, 92];
const WHITE_START 		= [118, 131, 132, 143, 144, 145, 156, 157, 158, 159];


const sqrt3 = 1.73205080757;

//#endregion

let grid;
let currentTile;
let possibleMoves;

let offsetX;
let offsetY;

let radius = 25;
let pieceRadiusMultiplier = 0.8;

let debugMove = false;
let showDebugCoordinates = false;

let playerCount = 2;
let currentTurn;

function setup ()
{
	createCanvas (CANVAS_WIDTH, CANVAS_HEIGHT);
	
	init();
}

function draw ()
{
	// draw
	
	background(51);

	textSize (25);
	fill (255);
	
	if (debugMove)
	{
		textAlign (LEFT, TOP);
		text ("DEBUG MOVE", 0, 0);
	}
	
	textAlign (RIGHT, TOP);
	text ("PLAYERS: " + playerCount + "\nTURN: " + currentTurn, CANVAS_WIDTH, 0);
	
	for (let i = 0; i < grid.length; i++)
	{
		if (grid[i] != undefined)
		{
			grid[i].show ();
		}
	}

	if (currentTile != undefined)
	{
		for (i = 0; i < possibleMoves.length; i++)
		{
			if (possibleMoves[i] == undefined)
				continue;

			
			fill (0, 255, 0, 100);
			ellipse (possibleMoves[i].showX, possibleMoves[i].showY, radius);
		}

		drawPiece (mouseX, mouseY, currentTile.piece);
	}
}

function init ()
{	
	grid = new Array (GRID_WIDTH * GRID_HEIGHT);

	offsetX = CANVAS_WIDTH / 2 - 6 * radius * 2;
	offsetY = CANVAS_HEIGHT / 2 - 8 * radius * sqrt3;

	for (let i = 0; i < GRID_HEIGHT; i++)
	{
		let start = TILE_START_INDICES[i];
		let end = start + ROW_SIZES[i];
		
		for (let j = start; j < end; j++)
		{
			grid[getIndex (j, i)] = new Tile (j, i);
		}
	}

	for (let i = 0; i < RED_START.length; i++)
	{
		grid[RED_START[i]].piece = RED_PIECE;
	}

	for (let i = 0; i < BLACK_START.length; i++)
	{
		grid[BLACK_START[i]].piece = BLACK_PIECE;
	}

	for (let i = 0; i < BLUE_START.length; i++)
	{
		grid[BLUE_START[i]].piece = BLUE_PIECE;
	}

	for (let i = 0; i < GREEN_START.length; i++)
	{
		grid[GREEN_START[i]].piece = GREEN_PIECE;
	}

	for (let i = 0; i < WHITE_START.length; i++)
	{
		grid[WHITE_START[i]].piece = WHITE_PIECE;
	}

	for (let i = 0; i < YELLOW_START.length; i++)
	{
		grid[YELLOW_START[i]].piece = YELLOW_PIECE;
	}
	
	
	currentTurn = 1;
}

function mousePressed ()
{
	let tile = getTileUnderMouse();
	if (tile != undefined && tile.piece != NO_PIECE && hasControl (tile.piece))
	{
		currentTile = tile;
		possibleMoves = currentTile.getPossibleMoves ();
	}
	else
	{
		currentTile = undefined;
	}
	return false;
}

function mouseReleased ()
{
	if (currentTile == undefined)
	{
		return false;
	}

	let tile = getTileUnderMouse ();
	if (validMove (currentTile, tile))
	{
		tile.piece = currentTile.piece;
		currentTile.piece = NO_PIECE;
		
		nextTurn ();
	}

	currentTile = undefined;

	return false;
}

function keyPressed ()
{
	switch (keyCode)
	{
		case 27: // Escape
			setup ();
			break;
		case 68: // D
			debugMove = !debugMove;
			break;
		case 67: // C
			showDebugCoordinates = !showDebugCoordinates;
			break;
		case 49: // Alpha 1
			playerCount = 0;
			break;
		case 50: // Alpha 2
			playerCount = 2;
			break;
		case 51: // Alpha 3
			playerCount = 3;
			break;
		case 52: // Alpha 4
			playerCount = 4;
			break;
		case 54: // Alpha 6
			playerCount = 6;
			break;
		case 78:
			nextTurn ();
			break;
	}
}

function nextTurn ()
{
	currentTurn++;
	
	if (currentTurn > playerCount)
		currentTurn = 1;
}

function setTurn (value)
{
	currentTurn = value;
	
	if (currentTurn > playerCount || currentTurn < 0)
		currentTurn = 1;
}

function getIndex (x, y)
{
	if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT)
	{
		return -1;
	}

	return x + y * GRID_WIDTH;
}

function getTileUnderMouse ()
{
	for (let i = 0; i < grid.length; i++)
	{
		if (grid[i] != undefined && grid[i].withinRange (mouseX, mouseY))
		{
			return grid[i];
		}
	}
}

function getTile (x, y)
{
	return grid[getIndex (x, y)];
}

function Tile (x, y)
{
	this.x = x;
	this.y = y;
	this.showX = this.y % 2 == 0 ? this.x * radius * 2 + offsetX : this.x * radius * 2 + radius + offsetX;
	this.showY = this.y * radius * sqrt3 + offsetY;
	this.piece = 0;

	this.withinRange = function (x, y)
	{
		if ((x - this.showX) * (x - this.showX) + (y - this.showY) * (y - this.showY) < radius * radius)
		{
			return true;
		}
		return false;
	};

	this.show = function ()
	{
		fill (150);
		ellipse (this.showX, this.showY, radius * 2);

		if (this.piece != 0 && this != currentTile)
		{
			drawPiece (this.showX, this.showY, this.piece);
		}
		
		if (showDebugCoordinates)
		{
			let color = getColor (this.piece);
			if (brightness_value(color) < 125)
			{
				fill (255);
			}
			else
			{
				fill (0);
			}
			
			textAlign (CENTER, CENTER);
			textSize (radius * 0.5);
			
			text (getIndex (this.x, this.y) + "\n" + this.x + " , " + this.y, this.showX, this.showY);
		}
	};

	this.getAdjacentTiles = function ()
	{
		let adj = new Array (6);

		let x = this.y % 2 == 0 ? this.x : this.x + 1;

		adj[0] = getTile (x, this.y - 1);
		adj[1] = getTile (this.x + 1, this.y);
		adj[2] = getTile (x, this.y + 1);
		adj[3] = getTile (x - 1, this.y + 1);
		adj[4] = getTile (this.x - 1, this.y);
		adj[5] = getTile (x - 1, this.y - 1);

		return adj;
	};

	this.getPossibleMoves = function ()
	{
		let possible = [];

		let adj = this.getAdjacentTiles ();

		for (i = 0; i < adj.length; i++)
		{
			if (adj[i] == undefined)
			{
				continue;
			}

			if (adj[i].piece == NO_PIECE)
			{
				possible.push (adj[i]);
			}
			else
			{
				let newT = adj[i].getAdjacentTiles ()[i];

				if (newT != undefined && newT.piece == NO_PIECE)
				{
					possible.push (newT);
					possible = this.getPossibleMovesRec (newT, possible);
				}
			}
		}

		return possible;
	};

	this.getPossibleMovesRec = function (newT, possible)
	{
		possible.push (newT);

		let adj = newT.getAdjacentTiles ();

		for (let i = 0; i < adj.length; i++)
		{
			if (adj[i] == undefined)
			{
				continue;
			}

			if (adj[i].piece == NO_PIECE)
			{
				continue;
			}

			let next = adj[i].getAdjacentTiles ()[i];

			if (possible.indexOf (next) >= 0)
			{
				continue;
			}
			
			if (next != undefined && next.piece == NO_PIECE)
			{
				possible = next.getPossibleMovesRec (next, possible);
			}
		}

		return possible;
	};
}

function validMove (from, to)
{
	if (from == undefined || to == undefined)
		return false;

	if (debugMove)
		return true;

	if (to.piece != NO_PIECE)
		return false;
	
	if (possibleMoves.indexOf (to) == -1)
		return false;
	
	return true;
}

function brightness_value (c)
{
	return 0.2126*red(c) + 0.7152*green(c) + 0.0722*blue(c);	
}

function hasControl (piece)
{
	if (debugMove || playerCount < 2)
	{
		return true;
	}
	if (currentTurn == 1)
	{
		if (playerCount == 2)
		{
			return piece == GREEN_PIECE || piece == WHITE_PIECE || piece == BLUE_PIECE;
		}
		if (playerCount == 3)
		{
			return piece == GREEN_PIECE || piece == BLUE_PIECE;
		}
		if (playerCount == 4)
		{
			return piece == WHITE_PIECE;
		}
		if (playerCount == 6)
		{
			return piece == GREEN_PIECE;
		}
	}
	if (currentTurn == 2)
	{
		if (playerCount == 2)
		{
			return piece == RED_PIECE || piece == YELLOW_PIECE || piece == BLACK_PIECE;
		}
		if (playerCount == 3)
		{
			return piece == BLACK_PIECE || piece == RED_PIECE;
		}
		if (playerCount == 4)
		{
			return piece == BLUE_PIECE;
		}
		if (playerCount == 6)
		{
			return piece == BLUE_PIECE;
		}
	}
	if (currentTurn == 3)
	{
		if (playerCount == 3)
		{
			return piece == YELLOW_PIECE || piece == WHITE_PIECE;
		}
		if (playerCount == 4)
		{
			return piece == BLACK_PIECE;
		}
		if (playerCount == 6)
		{
			return piece == BLACK_PIECE;
		}
	}
	if (currentTurn == 4)
	{
		if (playerCount == 4)
		{
			return piece == YELLOW_PIECE;
		}
		if (playerCount == 6)
		{
			return piece == RED_PIECE;
		}
	}
	if (currentTurn == 5)
	{
		if (playerCount == 6)
		{
			return piece == YELLOW_PIECE;
		}
	}
	if (currentTurn == 6)
	{
		if (playerCount == 6)
		{
			return piece == WHITE_PIECE;
		}
	}
	return false;
}

function drawPiece (x, y, piece)
{
	let color = getColor (piece);
	fill (color);
	ellipse (x, y, radius * 2 * pieceRadiusMultiplier);
}

function getColor (piece)
{
	switch (piece)
	{
		default:
		case 0:
			return color(0, 0, 0);
		case 1:
			return color(0, 255, 0);
		case 2:
			return color(0, 0, 255);
		case 3:
			return color(0, 0, 0);
		case 4:
			return color(255, 0, 0);
		case 5:
			return color(255, 235, 4);
		case 6:
			return color(255, 255, 255);
	}
}
