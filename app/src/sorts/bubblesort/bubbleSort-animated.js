// JavaScript Document

window.onload = function()
{
	var b = new Bubblefier();
	b.start(function(){
			console.log(b.array);
		});
}

function Bubblefier()
{
	SortAnimatable.call(this);

	this.prefix = "bubble";

	this.animator = new SortBarAnimator(this.prefix, this.quantity);
	this.animator.buildBars(this.array, this.maxValue);
	this.delay = this.delay / 2;

	this.complete;
}

Bubblefier.prototype = new SortAnimatable();
Bubblefier.prototype.constructor = Bubblefier;

Bubblefier.prototype.start = function(complete)
{
	this.animator.setMainArrow(0);
	this.animator.setCompareArrow(0);
	this.complete = complete;
	this.bubblefy();
}

Bubblefier.prototype.restart = function()
{
	this.array = RandomGenerator.generate(this.maxNumber, this.minNumber, this.quantity);
	this.start();
}

Bubblefier.prototype.bubblefy = function()
{
	var n = this.array.length - 1;
	var args = {
		n: n,
		newn: 0,
		i: 1
	}
	this.startTimeout(this.compare, args);
}

Bubblefier.prototype.resetNewn = function(args)
{
	args.newn = 0;
	args.i = 1;
	this.startTimeout(this.compare, args);
}

Bubblefier.prototype.swap = function(args)
{
	var bigger = args.i - 1;
	var smaller = args.i;

	var biggerValue = this.array[bigger];
	var smallerValue = this.array[smaller];

	this.array[bigger] = smallerValue;
	this.array[smaller] = biggerValue;

	this.animator.swapBar(bigger, smaller)

	args.newn = args.i;

	this.startTimeout(this.updatei, args);
}

Bubblefier.prototype.compare = function(args)
{
	var i = args.i;

	this.animator.setMainArrow(i-1);
	this.animator.setCompareArrow(i);

	if(this.array[i-1] > this.array[i])
		this.startTimeout(this.swap, args);
	else
		this.startTimeout(this.updatei, args);
}

Bubblefier.prototype.updatei = function(args)
{
	if(args.i++ < args.n)
	{
		this.startTimeout(this.compare, args);
	}
	else
	{
		args.n = args.newn;
		if(args.n != 0)
		{
			this.startTimeout(this.resetNewn, args);
		}
		else
			this.complete();
	}

}
