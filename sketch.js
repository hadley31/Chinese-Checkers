
//#region Constants

const TILE_START_INDICES = [6, 5, 5, 4, 0, 0, 1, 1, 2, 1, 1, 0, 0, 4, 5, 5, 6];
const ROW_SIZES = [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];

const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 750;

const GRID_WIDTH = 13;
const GRID_HEIGHT = 17;

const RED_START = [6, 18, 19, 31, 32, 33, 43, 44, 45, 46];
const BLACK_START = [61, 62, 63, 64, 74, 75, 76, 88, 89, 101];
const BLUE_START = [127, 140, 141, 152, 153, 154, 165, 166, 167, 168];
const GREEN_START = [173, 174, 175, 176, 187, 188, 189, 200, 201, 214];
const WHITE_START = [118, 131, 132, 143, 144, 145, 156, 157, 158, 159];
const YELLOW_START = [52, 53, 54, 55, 65, 66, 67, 79, 80, 92];

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
let showDebugText = false;

function setup ()
{
	createCanvas (CANVAS_WIDTH, CANVAS_HEIGHT);

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
		grid[RED_START[i]].team = Team.RED;
	}

	for (let i = 0; i < BLACK_START.length; i++)
	{
		grid[BLACK_START[i]].team = Team.BLACK;
	}

	for (let i = 0; i < BLUE_START.length; i++)
	{
		grid[BLUE_START[i]].team = Team.BLUE;
	}

	for (let i = 0; i < GREEN_START.length; i++)
	{
		grid[GREEN_START[i]].team = Team.GREEN;
	}

	for (let i = 0; i < WHITE_START.length; i++)
	{
		grid[WHITE_START[i]].team = Team.WHITE;
	}

	for (let i = 0; i < YELLOW_START.length; i++)
	{
		grid[YELLOW_START[i]].team = Team.YELLOW;
	}
}

function draw ()
{
	// draw
	
	background(51);

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

		drawPiece (mouseX, mouseY, currentTile.team);
	}
}

function mousePressed ()
{
	let tile = getTileUnderMouse();
	if (tile != undefined && tile.team != 0)
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
		tile.team = currentTile.team;
		currentTile.team = 0;
	}

	currentTile = undefined;

	return false;
}

function keyPressed ()
{
	if (keyCode == 49)
	{
		debugMove = !debugMove;
	}
	if (keyCode == 50)
	{
		showDebugText = !showDebugText;
	}
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
	this.team = 0;

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

		if (this.team != 0 && this != currentTile)
		{
			drawPiece (this.showX, this.showY, this.team);
		}
		
		if (showDebugText)
		{
			let color = getTeamColor (this.team);
			if (brightness(color[0], color[1], color[2]) < 1)
			{
				fill (255);
			}
			else
			{
				fill (0);
			}

			text (getIndex (this.x, this.y) + "\n" + this.x + " , " + this.y, this.showX - 10, this.showY - 10, this.showX, this.showY);
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

			if (adj[i].team == Team.NONE)
			{
				possible.push (adj[i]);
			}
			else
			{
				let newT = adj[i].getAdjacentTiles ()[i];

				if (newT != undefined && newT.team == Team.NONE)
				{
					possible.push (newT);

				// 	this shit just aint working so leave it out for now
				//	print (newT.x + " " + newT.y);
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

			if (adj[i].team == Team.NONE)
			{
				continue;
			}

			let next = adj[i].getAdjacentTiles ()[i];

			if (possible.indexOf (next) >= 0)
			{
				continue;
			}
			
			if (next != undefined && next.team == Team.NONE)
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

	if (to.team != Team.NONE)
		return false;

	if (possibleMoves.indexOf (to) == -1)
		return false;
	
	return true;
}

function drawPiece (x, y, team)
{
	let color = getTeamColor (team);
	fill (color[0], color[1], color[2]);
	ellipse (x, y, radius * 2 * pieceRadiusMultiplier);
}

let Team = {
	NONE: 0,
	RED: 1,
	BLACK: 2,
	BLUE: 3,
	GREEN: 4,
	WHITE: 5,
	YELLOW: 6,
};

function getTeamColor (team)
{
	switch (team)
	{
		default:
		case 0:
			return [0, 0, 0];
		case 1:
			return [255, 0, 0];
		case 2:
			return [0, 0, 0];
		case 3:
			return [0, 0, 255];
		case 4:
			return [0, 255, 0];
		case 5:
			return [255, 255, 255];
		case 6:
			return [255, 235, 4];
	}
}