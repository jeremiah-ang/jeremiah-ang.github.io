// JavaScript Document

function RandomGenerator()
{
	
}

RandomGenerator.generate = function(maxNumber, minNumber, quantity, addLength)
{
	var numbers = new Array();
	for( var i = 0; i<quantity; i++)
	{
		var number = Math.floor(Math.random()*(maxNumber - minNumber) + minNumber);
		numbers.push(number);
	}
	
	if(addLength)
		numbers.push(maxNumber);
		
	return numbers;
	
}