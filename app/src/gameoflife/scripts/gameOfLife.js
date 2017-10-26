// JavaScript Document

/*

Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overcrowding.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

*/


function init(hash)
{
	var c = new CellController();
	hash = hash.toLowerCase();
	Cell.SetClassName(hash);
	c.start(hash, true);
}


function CellController()
{
	this.cells_changes = this.changeMode('pulsar');
	this.cells = new Array();
	this.noOfCellPerWidth,this.noOfCellPerHeight,this.noOfCells;
}

CellController.prototype.changeMode = function(mode)
{
	//46
	switch(mode)
	{
		case 'glider' : 
			//return [ 45,76,104,105,106 ];
			return [5,52,96,97,98];
		case 'pulsar' : 
			return [341,342,343,347,348,349,
			
					431, 436, 438, 443, //0, +5, +2, +5
					477, 482, 484, 489,
					523, 528, 530, 535,
					571,572,573,577,578,579,
					
					663,664,665,669,670,671,
					707, 712, 714, 719,
					753, 758, 760, 765,
					799, 804, 806, 811,
					893,894,895,899,900,901 ];
		case 'weekender' : 
			return [1166,1179, //+13
					1212,1225,
					1257,1259,1270,1272,
					1304,1317,
					1350,1363,
					1397,1401,1402,1403,1404,1408,
					1447,1448,1449,1450,
					1489,1490,1491,1492,1497,1498,1499,1500,
					1583, 1590,
					1630,1631,1634,1635];
		case 'random':
			return this.randomGenerate();
	}
}

CellController.prototype.randomGenerate = function()
{
	var i, l = 300, r, A = new Array();
	for(i=0;i<l;i++)
	{
		r = Math.random();
		if(r>0.5) A.push(i);
	}
	
	return A;
}

CellController.prototype.start = function(mode, start)
{
	this.cells_changes = this.changeMode(mode);
	this.initFlipper();
	
	if(start)
	{
		
		$this = this;
		setInterval(function(){
				$this.nextLife();
			}, 200);
		
	}
}

CellController.prototype.initFlipper = function()
{
	var CONTAINER_WIDTH = 600,
	CONTAINER_HEIGHT = 600,
	CELL_LENGTH = 11,
	CELL_MARGIN = 2,
	CELL_SIZE = CELL_LENGTH + CELL_MARGIN;
	
	var cellArea= CELL_SIZE*CELL_SIZE,
	containerArea = CONTAINER_WIDTH * CONTAINER_HEIGHT;
	
	this.noOfCellPerWidth = Math.floor(CONTAINER_WIDTH / CELL_SIZE);
	this.noOfCellPerHeight = Math.floor(CONTAINER_HEIGHT / CELL_SIZE);
	this.noOfCells = this.noOfCellPerWidth * this.noOfCellPerHeight;

	this.appendFlipper(CELL_LENGTH, this.noOfCells);	
}

CellController.prototype.appendFlipper = function(cellLength, noOfCells)
{
	var f,c;
	for(var i = 0, j = noOfCells; i<j; i++)
	{
		f = new Cell(i, cellLength, this.getCellNeighbour(i));
		document.getElementById("gol_main").appendChild(f.html);
		
		this.cells.push(f);
	}	
	
	for(i=0, j=this.cells_changes.length, c; i<j; i++)
	{
		c = this.cells[this.cells_changes[i]];
		c.flip();
	}
}

CellController.prototype.nextLife = function()
{
	var array = this.cells_changes.slice(0);
	this.cells_changes = new Array();
	var i, l = array.length, cell;
	for(i = 0; i < l; i++)
	{
		cell = array[i];
		this.checkCell(cell);
	}
	
	this.redrawLife();
}

CellController.prototype.checkCell = function(cellIndex)
{
	var cell = this.cells[cellIndex];
	this.checkNeighbours(cell);
	for(var i = 0, l = cell.neighbours.length, n; i<l;i++)
	{
		n = this.cells[cell.neighbours[i]];
		this.checkNeighbours(n);
	}	
}

CellController.prototype.checkNeighbours = function(cell)
{
	var index = cell.index,
	neighbours = cell.neighbours;
	var i, l = neighbours.length, nAlive = 0;
	
	for(i =0; i<l;i++)
	{
		var n = this.cells[cell.neighbours[i]];
		if(n.live) nAlive++;
	}	
	
	/*

	Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	Any live cell with two or three live neighbours lives on to the next generation.
	Any live cell with more than three live neighbours dies, as if by overcrowding.
	Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	
	*/
	
	if( !cell.checked && ((cell.live && nAlive < 2) || (cell.live && nAlive > 3) || (!cell.live && nAlive === 3))) 
	{
		cell.checked = true;
		this.cells_changes.push(cell.index);
	}
		
	
}

CellController.prototype.redrawLife = function()
{
	for(var i = 0, l = this.cells_changes.length, c; i<l;i++)
	{
		c = this.cells[this.cells_changes[i]];
		c.checked = false;
		c.flip();	
	}
}

CellController.prototype.getCellNeighbour = function(index)
{
	var r = (index+1 >= this.noOfCells) ? 0 : index+1;
	l = (index-1 < 0) ? this.noOfCells - 1 : index - 1;
	t = (index - this.noOfCellPerWidth < 0) ? this.noOfCells - this.noOfCellPerWidth + index : index - this.noOfCellPerWidth,
	b = (index + this.noOfCellPerWidth >= this.noOfCells) ? index + this.noOfCellPerWidth - this.noOfCells : index + this.noOfCellPerWidth,
	tr = (t + 1 >= this.noOfCells) ? this.noOfCells - 1 : t + 1,
	tl = (t - 1 >= this.noOfCells || t-1<0) ? this.noOfCells - 1 : t - 1,
	br = (b + 1 >= this.noOfCells) ? 0 : b + 1,
	bl = (b - 1 < 0) ? this.noOfCells - 1: b - 1;
	
	return [tl,t,tr,l,r,bl,b,br];
}

function Cell(index, cellLength, neighbours)
{
	this.index = index;
	this.neighbours = neighbours;
	
	this.html = document.createElement("div");
	this.html.classList.add(Cell.CELL_CONTAINER_CLASSNAME);
	
	this.flipper = document.createElement("div");
	this.flipper.classList.add(Cell.CELL_CLASSNAME);
	
	this.html.style.width = cellLength + "px";
	this.html.style.height = cellLength + "px";
	
	this.html.appendChild(this.flipper);
	this.live = false;
	this.checked = false;
	
	
}

Cell.CELL_CONTAINER_CLASSNAME = "cell-container";
Cell.CELL_CLASSNAME = "cell";
Cell.LIVE_CLASSNAME = "live";

Cell.SetClassName = function(page)
{
	switch(page)
	{
		case "glider" : Cell.LIVE_CLASSNAME = "live-red"; break;
		case "pulsar" : Cell.LIVE_CLASSNAME = "live-yellow"; break;
		case "weekender" : Cell.LIVE_CLASSNAME = "live-green"; break;
		case "random" : Cell.LIVE_CLASSNAME = "live-blue"; break;	
	}
}

Cell.prototype.flip = function()
{
	this.live = !this.live;
	this.checked = false;
	if(this.live) this.flipper.classList.add(Cell.LIVE_CLASSNAME); 
			 else this.flipper.classList.remove(Cell.LIVE_CLASSNAME);
			 
}