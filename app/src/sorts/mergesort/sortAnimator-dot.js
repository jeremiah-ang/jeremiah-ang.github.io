// JavaScript Document

function SortDotAnimator(prefix, length)
{
	this.init(prefix, length);
}

SortDotAnimator.prototype.init = function(prefix, length)
{
	var STAGE_DOT_ID = prefix+"-stage-dots";
	var MAIN_ARROW_ID = prefix+"-main-arrow";
	var COMPARE_ARROW_ID = prefix+"-compare-arrow";
	
	this.BAR_SORTED_CLASS = "bar sorted";
	this.CLASSNAME = 'dot';
	
	this.length = length;
	
	this.stageBars = document.getElementById(STAGE_DOT_ID);
	this.array = new Array();
	
	var mainArrow = document.getElementById(MAIN_ARROW_ID);
	var compareArrow = document.getElementById(COMPARE_ARROW_ID);
	this.arrows = {
			mainArrow : mainArrow,
			compareArrow : compareArrow
		};	
}

SortDotAnimator.prototype.setMainArrow = function(index)
{
	var arrow = this.arrows.mainArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

SortDotAnimator.prototype.setCompareArrow = function(index)
{
	var arrow = this.arrows.compareArrow;
	var top = this.calculateArrowTop(index);
	arrow.style.top = top + "px";
}

SortDotAnimator.prototype.hideArrow = function()
{
	this.arrows.mainArrow.style.visibility = 'hidden';
	this.arrows.compareArrow.style.visibility = 'hidden';	
}

SortDotAnimator.prototype.calculateArrowTop = function(index)
{
	var bar_height = this.getBarHeight(this.length);
	return 45 + (index * bar_height);
	
	//20+i*(height + margin)+"px";
}

SortDotAnimator.prototype.build = function(array)
{
	var STAGE_WIDTH = 400;
	var MARGIN = 2;
	
	var length = this.length;
	var max_value = array[array.length - 1];
	
	var shape_height = this.getShapeHeight(length) - MARGIN;
	
	for(var i =0; i<length; i++)
	{
		var bar_value = array[i];
		var bar = Dot(i, shape_height, MARGIN, this.CLASSNAME);
		bar.innerHTML = "<p>"+bar_value+"<p>";
		
		this.array.push(bar);
		this.stageBars.appendChild(bar);
	}
}

SortDotAnimator.prototype.getShapeHeight = function(length)
{
	var STAGE_HEIGHT = 480;
	var bar_height = STAGE_HEIGHT/length;
	
	return bar_height;
}

SortDotAnimator.prototype.swapShape = function(bigger, smaller)
{
	var smallBar = this.array[smaller];
	var bigBar = this.array[bigger];
	
	var smallTop = smallBar.style.top;
	var bigTop = bigBar.style.top;
	
	smallBar.style.top = bigTop;
	bigBar.style.top = smallTop;
	
	this.array[smaller] = bigBar;
	this.array[bigger] = smallBar;	
}

SortDotAnimator.prototype.setShapeSorted = function(index)
{
	var bar = this.array[index];
	bar.className = this.BAR_SORTED_CLASS;
}

function Shape(i, width, height, margin, className)
{
	var div = document.createElement("div");
	div.className = className;
	
	div.style.width = width+"px";
	div.style.height = height+"px";
	div.style.top = 50+i*(height + margin)+"px";
	return div;	
}

function Dot(i, length, margin, className)
{
	return this.Shape(i, length, length, margin, className);
}
