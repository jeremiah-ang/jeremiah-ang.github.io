// JavaScript Document

function SortAnimatable()
{
	this.toCall;
	this.delay = 100;
	this.maxValue = 100;
	this.minValue = 0;
	this.quantity = 20;
	this.delay = 50;
	this.steps = new Array(this.quantity);
	this.array = RandomGenerator.generate(this.maxValue, this.minValue, this.quantity);
}

SortAnimatable.prototype.setToCall = function(toCall)
{
	this.toCall = toCall;
}

SortAnimatable.prototype.setDelay = function(delay)
{
	this.delay = delay;
}

SortAnimatable.prototype.startTimeout = function()
{
	_this = this;
	setTimeout(function(){ _this.toCall() }, this.delay);
}

SortAnimatable.prototype.startTimeout = function(toCall)
{
	this.setToCall(toCall);
	var _this = this;
	setTimeout(function(){ _this.toCall() }, this.delay);
}

SortAnimatable.prototype.startTimeout = function(toCall, args)
{
	this.setToCall(toCall);
	var _this = this;
	setTimeout(function(){ _this.toCall(args) }, this.delay);
}
