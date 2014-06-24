window.onload = function()
{
	window.game = new Game();
}

function Game()
{

	this.map = new Layer( $('floor'), 960, 640,1);
	
	this.heroLayer = new Layer( $('heroLayer'), 960, 640,2); 

	this.wall4 = new Layer( $('wall-4'), 960, 640, 4);
	this.wallS = new Layer( $('wall-s'), 960, 640, 6);
	this.wall1 = new Layer( $('wall-1'), 960, 640, 8); 
	this.wallE = new Layer( $('wall-e'), 960, 640, 10);
	this.wallW = new Layer( $('wall-w'), 960, 640, 12); 
	this.wall3 = new Layer( $('wall-3'), 960, 640, 14); 
	this.wallN = new Layer( $('wall-n'), 960, 640, 16); 
	this.wall2 = new Layer( $('wall-2'), 960, 640, 18);





	this.tiles = $('tiles');
	this.heroTiles = $('heroTiles');

	this.draw();
}

Game.prototype = {

	drawCells: function()
	{
		for (var x = 32; x < 1024; x += 64) 
		{
			for(var y = 16; y < 640; y += 32) 
			{
				new Circle(this.map, x, y, 3,'yellow','yellow').draw();
			}
		}
	},

	draw: function()
	{
			
		this.drawCells();

		var t = {
			'f': {x:0,y:3},
			'g': {x:1,y:7},
			'#': {x:3,y:11},


			'wn': {x:8,y:3},
			'ne': {x:9,y:3},
			'es': {x:10,y:3},
			'sw': {x:11,y:3},

			'w': {x:4,y:3},
			'n': {x:5,y:3},
			'e': {x:6,y:3},
			's': {x:7,y:3},


			'<1': {x:8,y:12}, 
			'<2': {x:9,y:12},
			'<3': {x:10,y:12},
			'<4': {x:11,y:12},

			'|': {x:4,y:12},
			'-': {x:5,y:12},
			'=': {x:3,y:12},
			'!': {x:2,y:12},

		};

		var map = [
		'wn n n n n n n n n n n n n n ne',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'w f f f f f f f f f f f f f e',
		'sw s s s s s s s s s s s s s es'
		]

		var levelObjects = [
		'. . . . . . . . . . .',
		'. . . . . . . . .',
		'. . . . . . . . .',
		'. . . . . . . . . .',
		'. . . . . . . . . . . . .',
		'. . . . . <4 = = = = <1',
		'. . . . . <3 - - - - <2',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . . .',
		'. . . . . . . . . .'
		]

		var line,objectsLine;
		for (var y = 0; y < map.length; y++)
		{
			line = map[y].split(' ');
			for (var x = 0; x < line.length; x++)
			{
				this.drawTile(x, y, t[ line[x] ]);
			}

			objectsLine = levelObjects[y].split(' ');
			for (var x = 0; x < objectsLine.length; x++)
			{
				if (objectsLine[x] != '.')
				{
					this.drawWall(x, y, t[ objectsLine[x] ], objectsLine[x]);
				}
			}
		}


		this.heroMove(6,6)
		
	},

	heroMove: function(mapX,mapY,z)
	{	
		var zi = z || 2;
		this.heroPosition = this.getScreen(mapX,mapY);
		this.drawHero({x:1,y:1})

		this.heroLayer.setZIndex(zi);
	},

	drawHero: function(tile)
	{
		this.heroLayer.empty();
		this.heroLayer.drawImage(this.heroTiles,
			32 + (64 + 64)* tile.x, 
			32 + (96 + 32)* tile.y,
			64, 96, 
			this.heroPosition.x, this.heroPosition.y - 64,
			64, 96);
	},

	drawWall: function(mapX,mapY,tile,tilename)
	{
		var srn = this.getScreen(mapX,mapY);	

		var layer = this.wallsN;

		switch(tilename) {
			case '-': layer = this.wallN;break;
			case '=': layer = this.wallS;break;
			case '|': layer = this.wallE;break;
			case '!': layer = this.wallW;break;

			case '<1': layer = this.wall1;break;
			case '<2': layer = this.wall2;break;
			case '<3': layer = this.wall3;break;
			case '<4': layer = this.wall4;break;
		};

		layer.drawImage(this.tiles,
			64 * tile.x, 32 * tile.y,
			64, 32*4, 
			srn.x, srn.y-32*3, 
			64, 32*4);
	},

	drawTile: function(mapX,mapY,tile)
	{
		var srn = this.getScreen(mapX,mapY);
		this.map.drawImage(this.tiles,
			64 * tile.x, 32 * tile.y,
			64, 32, 
			srn.x, srn.y, 
			64, 32);
	},

	getScreen: function(mapX,mapY) {
		var WIDTH = 960;
		var HEIGHT = 640;
		var TILE_WIDTH_HALF = 32;
		var TILE_HEIGHT_HALF = 16;
		return {
			x: WIDTH/2 + (mapX - mapY ) * TILE_WIDTH_HALF - TILE_WIDTH_HALF,
			y: (mapX + mapY) * TILE_HEIGHT_HALF
		}
	}


};