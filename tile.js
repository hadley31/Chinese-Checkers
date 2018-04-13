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