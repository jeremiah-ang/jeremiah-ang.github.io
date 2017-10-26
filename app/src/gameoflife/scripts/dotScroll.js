// JavaScript Document
var d;
function init(hash)
{
	hash = parseInt(hash);
	d = new DotScroll();
	d.generateDot(16,16);
	if(hash > 0) d.changePage(hash);

	document.getElementById("loading").style.visibility = "hidden";
}

function DotScroll()
{
	this.array = new Array();
	this.pageNo = 0;
	this.controls = new Controls();

	this.text = [ "Glider", "pulsar", "weekender", "random" ];

	this.initEventListener();
}

DotScroll.GLIDER = 0;
DotScroll.PULSAR = 1;
DotScroll.WEEKENDER = 2;
DotScroll.RANDOM = 3;


DotScroll.prototype.initEventListener = function()
{
	$this = this;

	function leftDidClick()
	{
		$this.pageNo--;
		if($this.pageNo < 0) $this.pageNo = 3;
		$this.changePage($this.pageNo, true);
	}

	function rightDidClick()
	{
		$this.pageNo++;
		if($this.pageNo > 3) $this.pageNo = 0;
		$this.changePage($this.pageNo, true);
	}
	function mainDidClick()
	{
		var url = "gameOfLife.html#"+$this.text[$this.pageNo];
		window.location = url;
	}

	this.controls.left.addEventListener("click", leftDidClick, false);
	this.controls.right.addEventListener("click", rightDidClick, false);
	this.controls.main.addEventListener("click", mainDidClick, false);
}

DotScroll.prototype.generateDot = function(wDot, hDot)
{
	var WIDTH = 15, HEIGHT = 15, MARGIN = 2,
	DOT_CONTAINER = document.getElementById("dot-container");
	var noOfDots = wDot * hDot,
	i, l = noOfDots, d,
	containerWidth = (WIDTH+MARGIN) * wDot,
	containerHeight = (HEIGHT+MARGIN) * hDot;

	DOT_CONTAINER.style.width = containerWidth + "px";
	DOT_CONTAINER.style.height = containerHeight + "px";

	var pattern = this.getPattern(DotScroll.GLIDER);

	for(i=0;i<l;i++)
	{
		d = new Dot(WIDTH,HEIGHT,MARGIN);

		if(pattern[i])
			d.flip();

		DOT_CONTAINER.appendChild(d.html);
		this.array.push(d);
	}

}

DotScroll.prototype.changePage = function(page, animate)
{
	var i = 0, l = this.array.length, $this = this,
	pattern = this.getPattern(page);
	this.pageNo = page;
	this.controls.setMainText(this.text[page]);
	this.controls.setColor(page);


	if(animate)
	{
		var interval = setInterval(function(){
				step(i, pattern);

				if(++i >= l) clearInterval(interval);

			}, 0);
	}
	else
	{
		for(i=0;i<l;i++)
		{
			step(i,pattern);
		}
	}


	function step(i, pattern)
	{
		var dot = $this.array[i];
		dot.setColor(dot.getColorClassName(page));
		if((!dot.active && pattern[i]) || (dot.active && !pattern[i])) dot.flip();
		else if(dot.active && pattern[i]){ dot.active = !dot.active; dot.flip(); }
	}
}


DotScroll.prototype.getPattern = function(p)
{
	switch(p)
	{
		case DotScroll.GLIDER: return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
							   0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
							   0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
							   0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,
							   0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,
							   0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,
							   0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,
							   0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
							   0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
							   0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
							   0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

		case DotScroll.PULSAR: return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
							   0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

		case DotScroll.WEEKENDER: return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
							      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
							      1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,
							      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
							      0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
							      0,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0,
							      0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
							      0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,
							      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							      0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,
							      0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,
							      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

		case DotScroll.RANDOM: return [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,
							   0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,
							   0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,
							   0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,
							   0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,
							   0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,];

	}
}

function Dot(w,h,m)
{
	this.html = document.createElement("div");
	this.html.classList.add(Dot.CLASSNAME);
	this.html.style.width = w + "px";
	this.html.style.height = h + "px";

	this.active = false;
	this.active_class = Dot.ACTIVE_RED_CLASSNAME;
	this.previous_class;
}

Dot.prototype.flip = function()
{
	if (this.active) this.html.classList.remove(this.active_class)
	else this.html.classList.add(this.active_class);

	this.active = !this.active;
}

Dot.prototype.setColor = function(color)
{
	this.html.classList.remove(this.active_class);
	this.active_class = color;
}

Dot.prototype.getColorClassName = function(index)
{
	switch(index)
	{
		case 0: return Dot.ACTIVE_RED_CLASSNAME;
		case 1: return Dot.ACTIVE_YELLOW_CLASSNAME;
		case 2: return Dot.ACTIVE_GREEN_CLASSNAME;
		case 3: return Dot.ACTIVE_BLUE_CLASSNAME;
	}
}

Dot.CLASSNAME = "dot";
Dot.ACTIVE_RED_CLASSNAME = "active-red";
Dot.ACTIVE_YELLOW_CLASSNAME = "active-yellow";
Dot.ACTIVE_BLUE_CLASSNAME = "active-blue";
Dot.ACTIVE_GREEN_CLASSNAME = "active-green";
