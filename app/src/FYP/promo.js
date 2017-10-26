// JavaScript Document
$.fn.PromoPlugin = function(option)
{
	Promo(option);
};

/*

	Promo

	This attached this plugin onto the selector

	@properties

	settings

	- stores the default values of this plug in.
	value includes:

		mobileWidth: 960px;
		animationSpeed: 200; //milliseconds


*/

var didMove = false;
var timer,
startY, //The starting position the mouse was down
deltaY,
endY,
startTime,
endTime,
deltaTime,
offset = 300;
offsetTime = 1000,
isFlicking = false;


function Promo(option)
{

	this.settings = {
			mobileWidth: 960,
			animationSpeed: 300
		};

	this.animator = new Animator();

	Main();


	/*
		Main ()

		The main Caller
	*/
	function Main()
	{
		$("#body-phone-small").show();
		$("#body-phone-big").hide();
		$("#video").hide();

		if(window.innerWidth >= 960)
			activate();

		$(window).on("resize", windowDidResize);



	}


	/*
		activate()

		Starts the plug in
	*/
	function activate()
	{
		$("#body-phone-small").hide();
		$("#body-phone-big").show().on("click", showVideo);

		this.animator.isActivated = true;
		this.animator.contentController.setInstructionImageSize( window.innerHeight );
		$(window).on("scroll", windowDidScroll);


	}

	function showVideo()
	{
		$("#video").show();
		$("#video-container").html("<iframe width='640' height='360' src='https://www.youtube.com/embed/gIUQZnDqwI4?rel=0&autoplay=1' frameborder='0' allowfullscreen></iframe>");
		$("#blackOverlay").on("click", closeVideo);
		$("body").css({ "overflow":"hidden" });
	}
	function closeVideo()
	{


		$("body").css({ "overflow":"auto" });
		$("#video").hide();
		$("#video-container").html("");
	}
	/*
		deactivate()

		Stops the plug in
	*/
	function deactivate()
	{
		$("#body-phone-small").show();
		$("#body-phone-big").hide();

		$(window).off("scroll", windowDidScroll);
		this.animator.contentController.setInstructionImageSize(130, true);
	}



	/*
		window Event Listener
	*/
	/*
		windowDidScroll

		Triggered when the window is scrolled.
	*/
	function windowDidScroll(e)
	{
	/*
		if(!isFlicking)
		{
			if(timer !== null)
			{
				clearTimeout(timer);
			}
			timer = setTimeout(windowDidFlick, 150);

			if(startY === null && startTime === null)
			{
				startY = window.scrollY;
				date = new Date();
				startTime = date.getMilliseconds();
			}
		}
	*/
		var scrollY = window.scrollY;
		this.animator.windowDidScroll(scrollY);
	}

	/*
		windowDidFlick

		Triggered when user trigger only one scroll function and stop

	*/
	function windowDidFlick()
	{
		endY = window.scrollY;
		var direction;

		if(startY > endY)
		{
			deltaY =  startY - endY;
			direction = -1;
		}
		else
		{
			deltaY = endY - startY;
			direction = 1;
		}


		if(deltaY >= offset && startTime <= offsetTime)
		{
			isFlicking = true;
			this.animator.windowDidFlick(direction);
		}

		startY = null;
		startTime = null;
	}

	/*
		windowDidScroll

		Triggered when the window is resized.
	*/
	function windowDidResize()
	{

		if(this.animator.isActivated && window.innerWidth < 960)
		{
			this.animator.isActivated = false;
			deactivate();
		}
		else if(!this.animator.isActivated && window.innerWidth > 960)
		{
			this.animator.isActivated = true;
			activate();
		}

		if(this.animator.isActivated)
			this.animator.contentController.setInstructionImageSize( window.innerHeight, false );


	}


}


/*
	Animator Class

	responsible in animating the content

	@properties

	inst_text

	- the text division that animations would be applied on

	inst_image

	- the image division that animation would be applied on

	windowHeight

	- the height of the window

	scrollMax

	- the maximium the window can scroll

	contentController

	- the contentController Object that would help provide content.

	isActivated

	- tells whether this animator is activated or not.

	@methods


	progress(scrollY)

	- From the scroll position, get the progress of the whole scroll animation
	Retruns a float value from 0% to 100%

	delta(progress)

	- From the progress, get the opacity & position the object should be of
	Retruns an object with 2 float value, alpha & pos from 0 to 1

	step(delta)

	- The actual magic.
	From the delta, set the alpha and position of the object

	windowDidScroll(scrollY)

*/
function Animator()
{
	this.inst_text = $("#instruction-text");
	this.inst_image = $("#instruction-image-mover");
	this.windowHeight = window.innerHeight;
	this.scrollMax = _get_doc_height() - this.windowHeight;

	this.pageNo = 1;
	this.imagePageNo = 0;

	this.startHideAnimationPercent = 0.5;
	this.endHideAnimationPercent = 0.5 * ( 1 + this.startHideAnimationPercent );
	this.durationHideAnimation = this.endHideAnimationPercent - this.startHideAnimationPercent;

	this.contentController = new ContentController();

	this.contentController.paginator.pageNodes.on("click", this.pageNodesDidClick);
}

Animator.prototype.progress = function(scrollY)
{
	var scrollPercent = scrollY/this.windowHeight;
	var pageNo = Math.floor( scrollPercent );
	var imagePageNo = ( Math.ceil( scrollPercent ) - 1 < 1 ) ? 1 : Math.ceil( scrollPercent ) - 1;

	this.changeToPage(Math.ceil(scrollPercent - this.endHideAnimationPercent), imagePageNo);


	if(pageNo <= 0)
		return 0;
	else
	{
		var p = scrollPercent - pageNo;

		if(p < this.startHideAnimationPercent)
			return 0;
		else
		{
			return p
		};
	}
}

Animator.prototype.delta = function(progress)
{

	var alpha,
	pos = 120,
	img_pos = 0,
	showing = false, //Text is coming up. Percent is incresing
	imgPercent= 0,//percent of img being moved
	percent = (1 - progress - this.durationHideAnimation) / this.durationHideAnimation;

	/*
		the position for which the item is not moving
	*/
	var showPos = 120;

	if(percent < 0)
	{
		percent *= -1;
		showing = true;
	}


	if(showing)
	{
		if(percent >= 1) percent = 1;
		pos = showPos*( 2 - percent );

		imgPercent = percent/2 + 0.5;
	}
	else
	{
		if(percent >= 1) percent = 1;
		pos = percent * showPos;
		imgPercent = (1 - percent)/2;

	}


	alpha = percent;

	if(imgPercent < 0) imgPercent = 1;
	imgPos = (this.imagePageNo - 1 + imgPercent) * this.contentController.instructionImage.height();

	return {
			"pos" : pos,
			"alpha" : alpha,
			"imgPos" : imgPos
		};

}

Animator.prototype.step = function(delta)
{
	this.inst_text.css({
		'top' : delta.pos,
		'opacity' : delta.alpha
	});

	this.inst_image.css({
			'margin-top': -delta.imgPos+"px"
	});

}

Animator.prototype.windowDidScroll = function(scrollY)
{
	var p = this.progress(scrollY);

	var d = this.delta(p);

	this.step(d);
}

Animator.prototype.windowDidFlick = function(nextPage)
{
	var pageNo = this.pageNo + nextPage;
	Animator.scrollAnimate(pageNo);
	this.pageNo = pageNo;
}

Animator.prototype.changeToPage = function(pageNo, imagePageNo)
{

	this.contentController.paginator.changeToPage(pageNo );
	if(pageNo == 0)
		pageNo = 1;

	if(this.imagePageNo != imagePageNo)
	{
		this.imagePageNo = imagePageNo;
	}

	if(this.pageNo != pageNo && pageNo <= this.contentController.pages.length)
	{
		this.inst_text.html(this.contentController.contentOfPage(pageNo));
		this.pageNo = pageNo;
	}

}

Animator.prototype.pageNodesDidClick = function(e)
{
	var pageNo = parseInt(e.target.id.substr(11, 1));
	Animator.scrollAnimate(pageNo);
}
Animator.gotoPage = function(pageNo)
{
	$(window).scrollTop(200);
}

Animator.scrollAnimate = function(y)
{
	var end = y * window.innerHeight;
	var start = $(window).scrollTop();
	var goingDown = start < end;

	var step = 20;
	var frameRate = 1/600;

	var interval = setInterval(onInterval, frameRate);

	function onInterval()
	{
		$(window).scrollTop(start);
		if(goingDown)
		{
			if(start > end)
			{
				$(window).scrollTop(end);
				clearInterval(interval);
				isFlicking = false;
			}

			start += step
		}
		else
		{
			if(start < end)
			{
				$(window).scrollTop(end);
				clearInterval(interval);
				isFlicking = false;
			}

			start -= step;
		}

	}
}

/*
	ContentController Class

	responsible in providing the appropriate content

	@property

	Array pages

	- contains an array of strings, each string represent the text content of each page

	Paginator paginator

	- Paginator object

	@method

	contentOfPage(pageNo)

*/
function ContentController()
{
	var page1 = "<h1><img src='images/page 2/pin_icon.png' /> Search or pin location</h1><p> Set a location that you want to be notified when entering or leaving </p><p> Simply search or tap on the map to drop a pin on the location </p><p> When done, the location name and address will be displayed </p>";
	var page2 = "<h1><img src='images/page 3/clock_icon.png' /> Set alarm to location</h1><p> Write notes and add them to the location. </p><p> Set alarm to ring on selected days and upon entering or leaving the selected location </p>";
	var page3 = "<h1> <img src='images/page 4/tick_icon.png' />Check when alarm rings</h1><p> Stop to check when alarm rings to make sure you did not forget anything when you enter or leave your selected location! </p><p> With StopCheck, you'll never forget anything again! </p>";
	var page4 = "<h1>Video</h1>";

	this.pages = [ page1, page2, page3, page4 ];
	this.paginator = new Paginator();

	this.instructionImage = $("#instruction-image");

	this.imagePreviousWidth;
	this.imagePreviousHeight;
}

ContentController.prototype.contentOfPage = function(pageNo)
{
	return this.pages[pageNo - 1];
}

ContentController.prototype.setInstructionImageSize = function(windowHeight, isDefinite)
{
	if(isDefinite)
	{
		this.instructionImage.css({
				"width":130,
				"height":230
			});
	}
	else
	{
		var SCREEN_WIDTH = 273;
		var SCREEN_HEIGHT = 484;
		var IMAGE_HEIGHT_PERCENT = 0.716285714286;
		var ratio = SCREEN_WIDTH/SCREEN_HEIGHT;

		var height, width;
		height = IMAGE_HEIGHT_PERCENT * windowHeight;
		width = ratio * height;

		this.instructionImage.css({
				"width":width,
				"height":height
			});
	}

}

/*
	Paginator()

	Pagination object controller class
	Responsible in showing which page it is at currently

	@property

	Array pageNodes

	- an arry of page node object

	activeNode

	- current node that is active

	@method

	changeToPage(pageNo)

	- change the color node to the selected one.
*/

function Paginator()
{
	this.pageNodes = $(".instruction-pagination");
	this.activeNode = document.getElementById("pagination-0");

}

Paginator.prototype.changeToPage = function(pageNo)
{
	//remove active
	this.activeNode.className = "instruction-pagination";
	this.pageNodes[pageNo].className += " active"
	this.activeNode = this.pageNodes[pageNo];
}


/**
 * Get current absolute document height
 */
function _get_doc_height()
{
	return Math.max(
		document.body.scrollHeight || 0,
		document.documentElement.scrollHeight || 0,
		document.body.offsetHeight || 0,
		document.documentElement.offsetHeight || 0,
		document.body.clientHeight || 0,
		document.documentElement.clientHeight || 0
	);
}

function pageNodesDidClick()
{

}
