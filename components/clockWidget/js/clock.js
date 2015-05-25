
/**
 *
 * SVGClock a configurable analog clock in SVG.
 * By default, it presents an assigned, static time.
 * It can be configured to support dragging of clock hands,
 * and by assigning event handlers, it can serve the purpose of a time picker.
 *
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 * @since       2011
 * @blog        http://terryyoung.blogspot.com/2013/02/svg-clock-with-raphael-21-part-2-drag.html
 */
 
function Clock
	(IN_szContainerID, IN_objOptions) {
	
	this.attemptCount = 0;
	//this.instanceID = IN_szContainerID.substring(IN_szContainerID.indexOf('_')+1, IN_szContainerID.length);
	this.init();
	$.extend(true, this, this.defaults);
	$.extend(true, this, IN_objOptions || {});
	this.holder = $('#' + IN_szContainerID);
	this.parent = this.holder.parent();
	this.containerID = IN_szContainerID;
	this.create();
	this.draw();
}

/**
 * SVGClock prototype
 * @author      Terry Young <terryyounghk [at] gmail.com>
 * @access      public
 */

Clock.prototype =
{
	/**
	 * initializes the SVG Clock properties with default values
	 */
	init: function () {
		this.defaults =
		{
			size: 300,
			centerColor:         '#21344b',
			centerRadius:        5,
			centerStrokeWidth:   3,
			centerStrokeOpacity: 0.8,
			hourLength:        	60, // the length of the image
			hourColor:         	'#000',
			hourStrokeWidth:   	6,
			hourStrokeOpacity: 	0.8,
			minuteColor:         '#000',
			minuteLength:        100, // the length of the image
			minuteStrokeWidth:   6,
			minuteStrokeOpacity: 0.8,
			secondLength:        75, // the length of the image
			secondColor:         '#d0d7e1',
			secondStrokeWidth:   2,
			secondStrokeOpacity: 0.9,
			speed:                   400,
			allowMinuteFullRotation: false,
			hourDraggable:           true,
			minuteDraggable:         true,
				
				centerImage:         {
					url:    null,
					width:  null,
					height: null,
					cx:     null,
					cy:     null
				},

				hourImage: {
					url:    null,
					width:  null,
					height: null,
					cx:     null,
					cy:     null
				},

				minuteImage: {
					url:    null,
					width:  null,
					height: null,
					cx:     null,
					cy:     null
				},

				secondImage: {
					url:    null,
					width:  null,
					height: null,
					cx:     null,
					cy:     null
				},
				speed:                   500,
				allowMinuteFullRotation: false,

				showSeconds: false, // Defaults to False if hourDraggable or minuteDraggable is set to true

				hourDragSnap:   1, // Snap to hours. Possible values are 1, 2, 3 and 6. Anything else would be forced to default to 1.
				minuteDragSnap: 1, // Snap to minutes. Possible values are 1, 5 and 15. Anything else would be forced to default to 5.

				onHourDragStart:   null,
				onHourDragMove:    null,
				onHourDragEnd:     null,
				onMinuteDragStart: null,
				onMinuteDragMove:  null,
				onMinuteDragEnd:   null
		};

		this.isAM = true;
	},


	/**
	 * This function creates the Raphael paper for drawing hour and minute hand on clock.
	 * SVG container is a perfect square where half its width equals the radius of the analog clock
	 * @author      Terry Young <terryyounghk [at] gmail.com>
	 * @access      public
	 */
	create: function () {
		
		this.paper = Raphael(this.containerID, this.size, this.size);
	},


	/**
	 * This function is draws the SVG clock on template
	 * @author      Terry Young <terryyounghk [at] gmail.com>
	 * @access      public
	 */

	draw: function () {
		var objHourFullPath;     // Invisible, full-path of the Hour hand (i.e. Full radius of analog clock)
		var objHourPath;         // Subpath of objHourFullPath, the visible portion
		var iHourLength;         // Full length of objHourFullPath
		var objMinuteFullPath;   // Invisible, full-path of the Minute hand (i.e. Full radius of analog clock)
		var objMinutePath;       // Subpath of objMinuteFullPath, the visible portion
		var iMinuteLength;       // Full length of objMinuteFullPath
		var objSecondFullPath;   // Invisible, full-path of the Second hand (i.e. Full radius of analog clock)
		var objSecondPath;       // Subpath of objSecondFullPath, the visible portion
		var objSecondImage;
		var objHourImage;
		var objMinuteImage;
		var objCenterImage;
		var iSecondLength;       // Full length of objSecondFullPath

		this.minute = this.paper.set();
		this.hour = this.paper.set();
		this.second = this.paper.set();
		objSecondFullPath = this.paper
			.path("M" + this.size / 2 + "," + this.size / 2 + "L" + this.size / 2 + ",0")
			.attr
			({
				'stroke-width': 0     // invisible, as this is for length calculations only
			});

		iSecondLength = objSecondFullPath.getTotalLength();

		objSecondPath = this.paper
			.path(objSecondFullPath.getSubpath(0, iSecondLength * this.secondLength / 100))
			.attr({
				stroke:           this.secondColor,
				'stroke-width':   this.secondStrokeWidth,
				'stroke-opacity': this.secondStrokeOpacity
			});

		this.second.push(objSecondPath);
		if (this.secondImage.url) {
			objSecondImage = this.paper
				.image
				(
					this.secondImage.url,
					this.size / 2 - this.secondImage.cx,
					this.size / 2 - this.secondImage.cy,
					this.secondImage.width,
					this.secondImage.height
				);
			objSecondPath.hide();
			this.second.push(objSecondImage);
		}

		if (!this.showSeconds) {
			this.second.attr({ opacity: 0, 'stroke-opacity': 0});
		}
		objMinuteFullPath = this.paper
			.path("M" + this.size / 2 + "," + this.size / 2 + "L" + this.size / 2 + ",0")
			.attr
			({
				'stroke-width': 0     // invisible, as this is for length calculations only
			});

		iMinuteLength = objMinuteFullPath.getTotalLength();

		objMinutePath = this.paper
			.path( objMinuteFullPath.getSubpath( 0, iMinuteLength * this.minuteLength / 100 ) )
			.attr({
				stroke:           this.minuteColor,
				'stroke-width':   this.minuteStrokeWidth,
				'stroke-opacity': this.minuteStrokeOpacity
			});

		this.minute.push(objMinutePath);
		if (this.minuteImage.url) {
			objMinuteImage = this.paper
				.image
				(
					this.minuteImage.url,
					this.size / 2 - this.minuteImage.cx,
					this.size / 2 - this.minuteImage.cy,
					this.minuteImage.width,
					this.minuteImage.height
				);
			objMinutePath.hide();
			this.minute.push(objMinuteImage);
		}
		objHourFullPath = this.paper
			.path("M" + this.size / 2 + "," + this.size / 2 + "L" + this.size / 2 + ",0")
			.attr
			({
				'stroke-width': 0     // invisible, as this is for length calculations only
			});

		iHourLength = objHourFullPath.getTotalLength();

		objHourPath = this.paper
			.path(objHourFullPath.getSubpath(0, iHourLength * this.hourLength / 100))
			.attr({
				stroke:           this.hourColor,
				'stroke-width':   this.hourStrokeWidth,
				'stroke-opacity': this.hourStrokeOpacity
			});

		this.hour.push(objHourPath);
		if (this.hourImage.url) {
			objHourImage = this.paper
				.image
				(
					this.hourImage.url,
					this.size / 2 - this.hourImage.cx,
					this.size / 2 - this.hourImage.cy,
					this.hourImage.width,
					this.hourImage.height
				);
			objHourPath.hide();
			this.hour.push(objHourImage);
		}
		this.paper
			.circle(this.size / 2, this.size / 2, this.centerRadius)
			.attr({
				fill:             this.centerColor,
				"stroke-width":   this.centerStrokeWidth,
				'stroke-opacity': this.centerStrokeOpacity
			});
		if (this.centerImage.url) {
			objCenterImage = this.paper
				.image
				(
					this.centerImage.url,
					this.size / 2 - this.centerImage.cx,
					this.size / 2 - this.centerImage.cy,
					this.centerImage.width,
					this.centerImage.height
				);
		}

		if (objCenterImage) {
			objCenterImage.toFront();
		}

		if (objSecondImage) {
			objSecondImage.toFront();
		}
		this.hour.angle = 0;
		this.hour.additionalAngle = 0;
		this.hour.value = 0;
		this.minute.angle = 0;
		this.minute.value = 0;
		this.second.angle = 0;
		this.second.value = 0;

		this.hour.previousValue = 0;
		this.minute.previousValue = 0;
		this.minute.allowFullRotation = this.allowMinuteFullRotation;
		this.assignEventHandlers();
	},


	/**
	 * This function is called inside "setTime" function.
	 * This method sets the minute hand on clock based on its parameter.
	 */
	setMinute: function (IN_iMinute) {
		var iAngle;
		var iMinute;

		iMinute = IN_iMinute;

		while (iMinute >= 60) {
			iMinute = iMinute - 60;
		}

		if (this.minute.value !== iMinute || (this.minute.value === iMinute && this.minute.allowFullRotation === true)) {
			iAngle = 360 / 60 * iMinute;
			this.minute.angle = iAngle; // Below while loop adding 360 in angle for animation. Assign the actual angle before while loop
			while (this.minute.angle >= iAngle) {
				iAngle = iAngle + 360;
			}
			
			this.minute.animate({transform: ['r', iAngle, this.size / 2, this.size / 2]}, 0, '<>');
		}
		this.minute.value = iMinute;
	},


	/**
	 * This function is used to 
	 * 1. Assigning events for dragging hour and minute hands.
	 * 2. Defining methods for drag start, drag move and drag end.
	 */
	assignEventHandlers: function () {
		var THIS;
		var fnMinute_OnDragStart;
		var fnMinute_OnDragMove;
		var fnMinute_OnDragEnd;
		var fnHour_OnDragStart;
		var fnHour_OnDragMove;
		var fnHour_OnDragEnd;

		THIS = this;
		
		/*
		 "Minute hand" event handler for Raphael's drag() method, triggered when start-dragging the "Minute hand" SVG element.
		 Keyword "this" is at the function scope of the "this.minute" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.
		 */
		fnMinute_OnDragStart = function () {
			if(THIS.holder.hasClass( "ui-draggable" )){
				THIS.holder.draggable( 'option', 'disabled', true );
			}
			if (THIS.minuteDraggable && THIS.onMinuteDragStart) {
			var instanceNo = (THIS.containerID.substring(THIS.containerID.indexOf("_")+1, THIS.containerID.length));
				THIS.onMinuteDragStart.apply(THIS, arguments);  // Run it at scope of the Clock class instance
			}
		};


		/*
		 This function is the "Minute hand" event handler for Raphael's drag() method, triggered when drag-moving the "Minute hand" SVG element.
		 Keyword "this" is at the function scope of the "this.minute" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.

		 NOTE: The less complex approach is to have rotation of the Minute hand in full circles NOT affecting the VALUE of the Hour
		 i.e. When time is 2:55, rotating minutes clockwise or anti-clockwise to point to 12 should both result in 2:00, NOT 3:00 nor 1:00.
		 Rational is for time-picker implementations where users might set the Hour first before setting the minutes.

		 INPUT:

		 dx                          horitontal distance from the point where the mouse was clicked
		 dy                          vertical distance from the point where the mouse was clicked
		 x                           horizontal distance of current mouse position relative to 0,0 origin
		 y                           vertical distance of current mouse position relative to 0,0 origin
		 */

		fnMinute_OnDragMove = function (dx, dy, x, y) {
			var x1, y1, x2, y2, iAngle, iAdditionalAngle, objOffset;

			objOffset = $('#' + THIS.containerID).offset();
			
			var containerIndex = THIS.containerID.substring( THIS.containerID.lastIndexOf("_")+1, THIS.containerID.length );
			
			if (THIS.minuteDraggable) {
				x1 = THIS.size / 2;
				y1 = THIS.size / 2;
				x2 = x - objOffset.left;
				y2 = y - objOffset.top;
				iAngle = Raphael.angle(x1, y1, x2, y2);

				if (!(THIS.minuteDragSnap % 5 === 0 || THIS.minuteDragSnap % 15 === 0 || THIS.minuteDragSnap === 1)) {
					THIS.minuteDragSnap = THIS.defaults.minuteDragSnap;
				}

				iAngle = iAngle - (iAngle % (THIS.minuteDragSnap * 6)) - 90;

				if (iAngle < 0) {
					iAngle = iAngle + 360;
				}

				THIS.minute.angle = iAngle;
				THIS.minute.value = THIS.minute.angle / 360 * 60;

				this.transform(['r', iAngle, x1, y1]);

				iAdditionalAngle = iAngle / 12;

				if ( THIS.onMinuteDragMove ) {
					THIS.onMinuteDragMove.apply( THIS, arguments );
				}
			}
		};


		/*
		 This function is the "Minute hand" event handler for Raphael's drag() method, triggered when end-dragging the "Minute hand" SVG element.
		 Keyword "this" is at the function scope of the "this.Minute" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.
		 */
		fnMinute_OnDragEnd = function () {
			if(THIS.holder.hasClass( "ui-draggable" )){
				THIS.holder.draggable( 'option', 'disabled', false );
			}
			if (THIS.minuteDraggable && THIS.onMinuteDragEnd) {
				var instanceNo = (THIS.containerID.substring(THIS.containerID.indexOf("_")+1, THIS.containerID.length));
				THIS.onMinuteDragEnd.apply(THIS, arguments);
			}
		};
		this.minute.drag(fnMinute_OnDragMove, fnMinute_OnDragStart, fnMinute_OnDragEnd);

		/*
		 "Hour hand" event handler for Raphael's drag() method, triggered when start-dragging the "Hour hand" SVG element.
		 Keyword "this" is at the function scope of the "this.Hour" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.
		 */
		fnHour_OnDragStart = function () {
			if(THIS.holder.hasClass( "ui-draggable" )){
				THIS.holder.draggable( 'option', 'disabled', true );
			}
			if (THIS.hourDraggable && THIS.onHourDragStart) {
			var instanceNo = (THIS.containerID.substring(THIS.containerID.indexOf("_")+1, THIS.containerID.length));
				THIS.onHourDragStart.apply(THIS, arguments);
			}
		};

		/*
		 "Hour hand" event handler for Raphael's drag() method, triggered when drag-moving the "Hour hand" SVG element.
		 Keyword "this" is at the function scope of the "this.Hour" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.

		 INPUT:
		 dx                            horitontal distance from the point where the mouse was clicked
		 dy                            vertical distance from the point where the mouse was clicked
		 x                             horizontal distance of current mouse position relative to 0,0 origin
		 y                             vertical distance of current mouse position relative to 0,0 origin
		 */
		fnHour_OnDragMove = function (dx, dy, x, y) {
			var x1, y1, x2, y2, iAngle, iAdditionalAngle, objOffset, iValue;

			objOffset = $('#' + THIS.containerID).offset();
			
			var containerIndex = THIS.containerID.substring(THIS.containerID.lastIndexOf("_")+1, THIS.containerID.length);
			
			if (THIS.hourDraggable) {
				x1 = THIS.size / 2;
				y1 = THIS.size / 2;
				x2 = x - objOffset.left;
				y2 = y - objOffset.top;
				iAngle = Raphael.angle(x1, y1, x2, y2);
				if (!(THIS.hourDragSnap === 1 || THIS.hourDragSnap === 3 || THIS.hourDragSnap === 2 || THIS.hourDragSnap === 6)) {
					THIS.hourDragSnap = 1;
				}

				iAngle = iAngle - (iAngle % (THIS.hourDragSnap * 6)) - 90;
				if (iAngle < 0) {
					iAngle = iAngle + 360;
				}
				THIS.hour.angle = iAngle;
				
				// Changed the logic to calculate hour value from hour angle instead of minute angle
//				THIS.hour.value = THIS.minute.angle / 360 * 60;
				THIS.hour.value = THIS.hour.angle / 30;

				this.transform(['r', iAngle, x1, y1]);

				if (THIS.onHourDragMove) {
					THIS.onHourDragMove.apply(THIS, arguments);
				}
			}
		};

		/*
		 "Hour hand" event handler for Raphael's drag() method, triggered when end-dragging the "Hour hand" SVG element.
		 Keyword "this" is at the function scope of the "this.Hour" Raphael Set of SVG elements.
		 Keyword "THIS" is at the function scope of the Clock class instance.
		 */
		fnHour_OnDragEnd = function () {
			if(THIS.holder.hasClass( "ui-draggable" )){
				THIS.holder.draggable( 'option', 'disabled', false );
			}
			if (THIS.hourDraggable && THIS.onHourDragEnd) {
				var instanceNo = (THIS.containerID.substring(THIS.containerID.indexOf("_")+1, THIS.containerID.length));
				THIS.onHourDragEnd.apply( THIS, arguments );
			}
		};
		this.hour.drag( fnHour_OnDragMove, fnHour_OnDragStart, fnHour_OnDragEnd );
	},


	/**
	 * This function is used to set second hand of the clock.
	 * Second hand is hidden and its value is used to set up minute and hour hand angle accordingly.
	 */
	setSecond: function (IN_iSecond) {
		var iAngle;
		var iSecond;

		iSecond = IN_iSecond;

		while (iSecond >= 60) {
			iSecond = iSecond - 60;
		}
		if (this.second.value !== iSecond) {
			iAngle = 360 / 60 * iSecond;
			while (this.second.angle >= iAngle) {
				iAngle = iAngle + 360;
			}
			this.second.angle = iAngle;
			this.second.animate({transform: ['r', iAngle, this.size / 2, this.size / 2]}, this.speed / 2, 'bounce');
		}
		this.second.value = iSecond;
	},

	getMinute: function () {
		return this.minute.value;
	},
	getSecond: function () {
		return this.second.value;
	},
	/**
	 * This function is called at student section, while setting up clock instance on template for first time.
	 * Set clock hands on based on constraints set by author
	 */
	setClockHand:function(isHourDraggable, isMinuteDraggable){
		this.hourDraggable = isHourDraggable;
		this.minuteDraggable = isMinuteDraggable;
	},
	/**
	 * This function is used to set time on clock instance.
	 * This function calculates angle based on parameters and set hands accordingly
	 * @param IN_iHour, IN_iMinute, IN_iSecond
	 */
	setTime: function
		(IN_iHour, IN_iMinute, IN_iSecond) {
		var iAngle;
		var iHour;
		var iMinute;
		var iSecond;
		var iAdditionalAngle; // the additional angle of Hour in relation to Minutes
		iHour = IN_iHour;
		if (iHour % 24 === 0) {
			iHour = k0;
		}
		while (iHour > 12) {
			iHour = iHour - 12; // cater for 24-hour format
		}
		iMinute = IN_iMinute;
		if (typeof(iMinute) == 'undefined') {
			iMinute = this.minute.value;
		}
		while (iMinute >= 60) {
			iMinute = iMinute - 60;
		}
		iSecond = IN_iSecond;
		if (typeof(iSecond) == 'undefined') {
			iSecond = this.second.value;
		}
		while (iSecond >= 60) {
			iSecond = iSecond - 60;
		}
		iAdditionalAngle = 0;
		if (!(this.minute.value === iMinute && this.hour.value === iHour && this.second.value === iSecond)) {
			this.setSecond(iSecond);
			this.setMinute(iMinute);
			iAngle = 360 / 12 * iHour + iAdditionalAngle;
			this.hour.angle = iAngle; // Below while loop adding 360 in angle for animation. Assign the actual angle before while loop
			while (this.hour.angle > iAngle) {
				iAngle = iAngle + 360;
			}
			
			this.hour.additionalAngle = iAdditionalAngle;
			this.hour.animate({transform: ['r', iAngle, this.size / 2, this.size / 2]}, 0, '<>');
		}
		this.hour.value = iHour;
		this.minute.value = iMinute;
		this.second.value = iSecond;
	},
	
	/*
	* This function is called to get hour, minute and second hand value.
	* Return a string.
	*/
	getTime: function () {
		var OUT_objTime;
		OUT_objTime =
		{
			'hour':   this.hour.value,
			'minute': this.minute.value,
			'second': this.second.value
		};
		return OUT_objTime;
	},

	/**
	 * This function is returns time format based on current time set on the clock
	 * @param IN_bIncludeSeconds (Optional)    Default is false
	 * @return {String}
	 */
	getTimeAsString: function (IN_bIncludeSeconds) {
		var szHour;
		var szMinute;
		var szSecond;
		var bIncludeSeconds;
		var OUT_szString;

		bIncludeSeconds = !!IN_bIncludeSeconds; // cast to boolean

		szHour = this.hour.value;
		szMinute = this.minute.value;
		szSecond = this.second.value;

		if (szMinute < 10) {
			szMinute = '0' + szMinute.toString();
		}

		if (szSecond < 10) {
			szSecond = '0' + szSecond.toString();
		}

		OUT_szString = szHour.toString() + ':' + szMinute;

		if (bIncludeSeconds) {
			OUT_szString += ':' + szSecond;
		}

		return OUT_szString;
	}

}; // End Clock.prototype