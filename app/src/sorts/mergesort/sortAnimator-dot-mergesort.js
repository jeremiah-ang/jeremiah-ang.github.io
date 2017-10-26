// JavaScript Document

function SortDotAnimator_mergesort(prefix, length)
{
	SortDotAnimator.call(this);
	
	this.DOT_ACTIVE_CLASS = "dot active";
	this.DOT_CLASS = "dot";
	
	this.DOT_STATUS_ACTIVE = 0;
	this.DOT_STATUS_INACTIVE = 1;
	
	this.activeDots = new Array();
	
	this.init(prefix, length);
}

SortDotAnimator_mergesort.prototype = new SortDotAnimator();
SortDotAnimator_mergesort.prototype.constructor = SortDotAnimator_mergesort;

SortDotAnimator_mergesort.prototype.pullOut = function(toPull, start, index, cycle)
{
	var c = Math.pow(2, cycle - 1);
	var pos = (start*c) + index;
	console.log(pos, "Start: "+start, "Cycle: " +cycle, "Index: "+index);
	
	var dot = toPull.dot;
	var width = parseInt(dot.style.width);
	var left = width * 3;
	var top = 50+pos*(width + 2);
	
	dot.style.marginLeft = left + "px";
	dot.style.top = top + "px";
}

SortDotAnimator_mergesort.prototype.pushIn = function(array)
{
	var length = array.length;
	for( var i = 0; i<length; i++)
	{
		var dot = array[i].dot;
		dot.style.marginLeft = 0 +"px";	
	}
}

SortDotAnimator_mergesort.prototype.setDotActive = function(left, right)
{
	var array = left.concat(right);
	var length = array.length;
	
	for( var i = 0; i<length; i++)
	{
		var dot = array[i].dot;
		dot.className = this.DOT_ACTIVE_CLASS;
		this.activeDots.push(dot);
	}
}

SortDotAnimator_mergesort.prototype.setDotInactive = function()
{
	for(var i =0; i<this.activeDots.length; i++)
	{
		var dot = this.activeDots[i];
		dot.className = this.DOT_CLASS;	
	}
	
	this.activeDots = new Array();
}

SortDotAnimator_mergesort.arrayWithDotsValue = function(dots, value)
{
	var length = dots.length;
	var array = new Array();
	for( var i = 0; i<length; i++)
	{
		object = {
				dot: dots[i],
				value: value[i][0]
			};
		array.push(object);
	}
	
	array.push(value[value.length - 1]);
	return array;
}