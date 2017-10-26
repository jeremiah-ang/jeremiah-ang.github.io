// JavaScript Document

window.onload = function()
{
	var m = new Mergifier();
	m.start();
}

function Mergifier()
{
	SortAnimatable.call(this);
	var prefix = "mergesort";
	this.animator = new SortDotAnimator_mergesort(prefix, this.quantity);
	this.animator.build(this.array);
	this.animator.hideArrow();
	this.array = this.splitArray(this.animator.array, this.array);
}

Mergifier.prototype = new SortAnimatable();
Mergifier.prototype.constructor = Mergifier;

Mergifier.prototype.start = function()
{
	var args =
	{
		cycle: 1,
		counter: 0,
		start: 0,
		toMerge: 0,
		i: 0,
		array: this.array,
		length: this.array.length,

		left: null,
		right: null,
		result: null,
		counter_compare: null,

		concat_array: null
	};

	this.mergify(args);
}

Mergifier.prototype.splitArray = function(dots, array)
{
	var size = array.length;
	var newArray = new Array();
	var currentArray, object;
	for(var i = 0; i<size; i++)
	{
		object = {
				dot: dots[i],
				value: array[i]
			}
		currentArray = new Array();
		currentArray.push(object);
		newArray.push(currentArray);
	}
	return newArray;
}

Mergifier.prototype.mergify = function(args)
{
	this.startTimeout(this.mergesort, args);
}

Mergifier.prototype.mergesort = function(args)
{
	if(args.i++ <= args.length)
	{
		var start = args.start;
		var array = args.array;

		args.toMerge = start + 1;
		args.next = args.toMerge + 1;

		if(array[args.toMerge])
		{

			this.startTimeout(this.merge, args);

		}
		else
		{
			console.log("Break Point 1");
			array[args.counter] = array[args.start];
			array[args.start] = null;
			args.next = 0;
			args.counter = 0;
			args.cycle++;
			args.start = args.next;
			this.startTimeout(this.mergesort, args);
		}

	}
	else
	{
		console.log("Complete!");
		console.log(this.getAllValues(args.array));
	}


}

Mergifier.prototype.merge = function(args)
{
	var start = args.start;
	var toMerge = args.toMerge;

	args.left = args.array[start];
	args.right = args.array[toMerge];

	this.animator.setDotActive(args.left, args.right);

	args.array[start] = null;
	args.array[toMerge] = null;

	var l, r;
	args.result = new Array();
	args.counter_compare = 0;

	this.startTimeout(this.compare, args);
}

Mergifier.prototype.compare = function(args)
{
	var start = args.start;

	l = args.left[0].value;
	r = args.right[0].value;

	var toPull = (l >= r) ? args.left[0] : args.right[0];
	this.animator.pullOut(toPull, start, args.counter_compare++, args.cycle);

	if(l >= r)
		args.result.push(args.left.shift());
	else args.result.push(args.right.shift());

	if(args.left.length >0 && args.right.length >0)
		this.startTimeout(this.compare, args);
	else
		this.startTimeout(this.checkConcat, args);
}

Mergifier.prototype.checkConcat = function(args)
{
	var start = args.start;

	if(args.left.length + args.right.length > 0)
	{
		if(args.left.length > 0)
			args.concat_array = args.left
		else if(args.right.length > 0)
			args.concat_array = args.right

		this.startTimeout(this.concatRemains, args);
	}
	else
		this.startTimeout(this.updateArray, args);
}

Mergifier.prototype.concatRemains = function(args)
{
	var length = args.concat_array.length;
	var start = args.start;
	start += args.counter;
	for(var i = 0; i<length; i++)
	{
		var toPull = args.concat_array[i];
		this.animator.pullOut(toPull, args.start, args.counter_compare+i, args.cycle);
	}

	args.result = args.result.concat(args.concat_array);
	this.startTimeout(this.updateArray, args);
}

Mergifier.prototype.updateArray = function(args)
{
	this.animator.pushIn(args.result);
	this.animator.setDotInactive();

	args.array[args.counter++] = args.result;

	if(args.next >= (args.length/args.cycle) - 1)
	{
		args.array[args.counter] = args.array[args.next];
		args.next = 0;
		args.counter = 0;
		args.cycle++;
	}

	args.start = args.next
	this.startTimeout(this.mergesort, args);
}

Mergifier.prototype.getAllValues = function(array)
{
	var length = array[0].length;
	var toReturn = new Array();
	for(var i = 0; i < length; i++)
	{
		toReturn.push(array[0][i].value);
	}
	return toReturn;
}
