// JavaScript Document
window.onload = function()
{
	var q = new Quickify(100);
	q.start(function(){console.log("Complete", q.array);});

}

function Quickify()
{
	SortAnimatable.call(this);
	this.steps = new Array(this.quantity);
	this.complete;

	this.DIRECTION_LEFT = "LEFT";
	this.DIRECTION_RIGHT = "RIGHT";

	var prefix = "quicksort";
	this.animator = new SortBarAnimator(prefix, this.quantity);
	this.animator.buildBars(this.array, this.maxValue);

}

Quickify.prototype = new SortAnimatable();
Quickify.prototype.constructor = Quickify;

Quickify.prototype.start = function(complete)
{
	this.complete = complete;
	var firstStep = new Step(0, 0, this.array.length - 1);
	this.steps[0] = firstStep;

	var args = {
			array: this.array,
			step: firstStep,
			direction : this.DIRECTION_LEFT,
			pivotValue: 0,
			swap: {a:0, b:0}
		}
	this.array = this.quicksort(args);

}


Quickify.prototype.quicksort = function(args)
{
	var array = args.array, step = args.step;
	var start = step.start, end = step.end, stepIndex = step.index;

	if(start >= end)
	{
		var nextStepIndex = this.getNextStep(stepIndex);
		if(nextStepIndex === -1)
			this.complete();
		else
		{
			args.step = this.steps[nextStepIndex];
			args.step.right = false;
			args.direction = this.DIRECTION_RIGHT;
			this.nextStep(args);
		}
	}
	else
	{
		args.direction = (step.pivot == null)?this.DIRECTION_LEFT:this.DIRECTION_RIGHT;
		this.startTimeout(this.partition, args);
	}

}

Quickify.prototype.partition = function(args)
{

	var pivotIndex = Math.floor((args.step.start + args.step.end) / 2);
	args.pivotValue = args.array[pivotIndex];

	args.step.pivot = pivotIndex;
	this.swapPivotToEnd(args);
}

Quickify.prototype.nextStep = function(args)
{
	var array = args.array, step = args.step, direction = args.direction;
	var start = step.start, end = step.end, stepIndex = step.index, pivotIndex = step.pivot;
	var childStep = Step.childrenOf(stepIndex);
	var next_stepIndex = (direction === this.DIRECTION_LEFT) ? childStep.left: childStep.right;
	var next_start = (direction === this.DIRECTION_LEFT) ? start : pivotIndex + 1;
	var next_end = (direction === this.DIRECTION_LEFT) ? pivotIndex - 1 : end;
	var nextStep = new Step(next_stepIndex, next_start, next_end);
	this.steps[next_stepIndex] = nextStep;
	args.step = nextStep;

	this.quicksort(args);
}

Quickify.prototype.getNextStep = function(stepIndex)
{
	var parentIndex = Step.parentOf(stepIndex);
	if(parentIndex < 0)
		return parentIndex;
	else if(this.steps[parentIndex].right == true)
		return parentIndex;
	else
		return this.getNextStep(parentIndex);

}


Quickify.prototype.maxPartition = function(args)
{
	if(args.swap.a < args.step.end)
	{
		this.animator.setCompareArrow(args.swap.a);
		if(args.array[args.swap.a] <= args.pivotValue)
			this.swap(args);
		else
		{
			args.swap.a++;
			this.maxPartition(args);
		}
	}
	else
	{
		this.swapPivotToPosition(args);
	}
}
Quickify.prototype.swap = function(args)
{
	var a = args.swap.a, b = args.step.pivot++;
	var a_value = args.array[a];
	args.array[a] = args.array[b];
	args.array[b] = a_value;

	this.animator.swapBar(a,b);

	args.swap.a++;
	this.startTimeout(this.maxPartition, args);
}

Quickify.prototype.swapPivotToEnd = function(args)
{
	this.animator.setMainArrow(args.step.end);

	var a = args.step.end,
	b = args.step.pivot;

	var a_value = args.array[a];
	args.array[a] = args.array[b];
	args.array[b] = a_value;

	this.animator.swapBar(a,b);

	args.step.pivot = args.step.start;
	args.swap.a = args.step.start;
	this.startTimeout(this.maxPartition, args);
}

Quickify.prototype.swapPivotToPosition = function(args)
{
	this.animator.setMainArrow(args.step.pivot);

	var a = args.step.end,
	b = args.step.pivot;

	var a_value = args.array[a];
	args.array[a] = args.array[b];
	args.array[b] = a_value;

	this.animator.swapBar(a,b);

	this.nextStep(args);
}

function Step(index, start, end)
{
	this.index = index;
	this.right = (start - end < 1);
	this.start = start;
	this.end = end;
	this.pivot = null;
}

Step.childrenOf = function(parent)
{
	var l = 2*parent + 1;
	var r = l + 1;
	return {left: l,right: r};
}

Step.parentOf = function(child)
{
	return Math.floor( (child - 1) * 0.5 );
}
