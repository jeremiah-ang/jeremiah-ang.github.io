// JavaScript Document

function Controls()
{
	var LEFT_ID = "control-left";
	var RIGHT_ID = "control-right";	
	var MAIN_ID = "control-main";
	var CONTROLS_ID = "controls";
	
	this.left = document.getElementById(LEFT_ID);
	this.right = document.getElementById(RIGHT_ID);
	this.main = document.getElementById(MAIN_ID);
	this.controls = document.getElementById(CONTROLS_ID);
	
	this.color;
	
}

Controls.RED_COLOR = "control-red";
Controls.GREEN_COLOR = "control-green";
Controls.BLUE_COLOR = "control-blue";
Controls.YELLOW_COLOR = "control-yellow";

Controls.prototype.setMainText = function(text)
{
	this.main.innerHTML = text;
}

Controls.prototype.setColor = function(color)
{
	var toAdd;
	switch(color)
	{
		case 0: toAdd = Controls.RED_COLOR; break;
		case 1: toAdd = Controls.YELLOW_COLOR; break;
		case 2: toAdd = Controls.GREEN_COLOR; break;
		case 3: toAdd = Controls.BLUE_COLOR; break;		
	}
	
	this.addColor(toAdd);
	
}

Controls.prototype.removeColor = function(color)
{
	this.left.classList.remove(color);
	this.right.classList.remove(color);
	this.main.classList.remove(color);
}
Controls.prototype.addColor = function(color)
{
	this.removeColor(this.color);
	this.left.classList.add(color);
	this.right.classList.add(color);
	this.main.classList.add(color);
	this.color = color;
}