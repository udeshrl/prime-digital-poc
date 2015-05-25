/**
 * author Manideep Karnati
 */
function Sketcher( canvasID, brushImage) {
	this.renderFunction = (brushImage == null || brushImage == undefined) ? this.updateCanvasByLine : this.updateCanvasByBrush;
	this.brush = brushImage;
	this.isMobile = app.detect.isMobile();
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.context.strokeStyle = "";
	this.context.lineWidth = 3;
	this.lastMousePoint = {x:0, y:0};
	this.fixed = false;
	this.setpen = false;
	this.seteraser = false;
    
	if (this.isMobile) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
	//$('object').css( "pointer-events", "none" );//Need to be corrected
};

Sketcher.prototype.onCanvasMouseDown = function () {
	var self = this;
	
	return function(event) { 
		self.mouseMoveHandler = self.onCanvasMouseMove();
		self.mouseUpHandler = self.onCanvasMouseUp();

		$(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.updateMousePosition( event );
		self.renderFunction( event ); 
	};
};

Sketcher.prototype.onCanvasMouseMove = function () {
	var self = this;
	
	return function(event) { 
		self.renderFunction( event );
     	event.preventDefault();
    	return false; 
	};
};

Sketcher.prototype.onCanvasMouseUp = function (event) {
	var self = this; 
	return function(event) { 

		$(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	} ;
};

Sketcher.prototype.updateMousePosition = function (event) {
 	var target; 
	if (this.isMobile) {
		target = event.originalEvent.touches[0];
	}
	else {
		target = event;
	} 
	var offset = this.canvas.offset();
	this.lastMousePoint.x = target.pageX - offset.left;
	if(this.setpen){
		if(document.documentMode === 11 || navigator.appName === "Microsoft Internet Explorer"){
			this.lastMousePoint.y = (target.pageY - 10) - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the pen icon
		}else {
			this.lastMousePoint.y = target.pageY - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the pen icon
		}
		//this.lastMousePoint.y = (target.pageY + 20) - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the pen icon
	} else if(this.seteraser) {
		 
		if(this.isMobile){
			this.lastMousePoint.y = target.pageY - offset.top;
			
		}else {
			if(document.documentMode === 11 || navigator.appName === "Microsoft Internet Explorer"){
				this.lastMousePoint.y = (target.pageY - 10) - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the eraser icons
			}else {
				this.lastMousePoint.y = target.pageY - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the eraser icons
			}
			//this.lastMousePoint.y = (target.pageY + 22) - offset.top;//Added a value of 20px to the target.pageY to match it with the tip of the eraser icons
			
		}
	}
	 
};

Sketcher.prototype.updateCanvasByLine = function (event) {
	if(this.setpen){
		this.context.beginPath();
		this.context.globalCompositeOperation = "source-over";
		this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
		this.updateMousePosition( event );
		this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
		this.context.stroke();
	}else if(this.seteraser){
		this.context.beginPath();
		this.context.globalCompositeOperation = "destination-out";
		this.context.fillStyle = "white"; 
		this.context.moveTo(this.lastMousePoint.x, this.lastMousePoint.y);
		this.updateMousePosition( event );
		this.context.lineTo(this.lastMousePoint.x, this.lastMousePoint.y);
		this.context.stroke();
	}
};

Sketcher.prototype.updateCanvasByBrush = function (event) {
	var halfBrushW = this.brush.width/2;
	var halfBrushH = this.brush.height/2;
	
	var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.updateMousePosition( event );
	var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	
	var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
	var angle = Trig.angleBetween2Points( start, end );
	
	var x,y;
	
	for ( var z=0; (z<=distance || z==0); z++ )
	{
		x = start.x + (Math.sin(angle) * z) - halfBrushW;
		y = start.y + (Math.cos(angle) * z) - halfBrushH;		
		this.context.drawImage(this.brush, x, y);
	}
};

Sketcher.prototype.toString = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
};

Sketcher.prototype.toDataURL = function () {
	
	var dataString = this.canvas.get(0).toDataURL("image/png");
	return dataString;
};

Sketcher.prototype.clear = function () {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
	this.setpen = false;
	this.seteraser = false;
	$("#"+this.canvasID).css("cursor","default"); 
};

Sketcher.prototype.pen = function () { 
	this.setpen = true;
	this.seteraser = false;
	this.context.lineWidth = 3;
	self = this;
	//IF you want to update the pen icons copy the icons to images folder in freeDraw component
	if(document.documentMode === 11 || navigator.appName === "Microsoft Internet Explorer"){
		$("#"+this.canvasID).css("cursor","url(components/freeDraw/images/icon_write_ro.cur),auto");
	} else{
		$("#"+this.canvasID).css("cursor","url(components/freeDraw/images/icon_write_ro.cur)0 20,auto");
	}
	
};

Sketcher.prototype.eraser = function () { 
	this.seteraser = true;	
	this.setpen = false;
	this.context.lineWidth = 10;
	//IF you want to update the eraser icons copy the icons to images folder in freeDraw component 
	if(document.documentMode === 11 || navigator.appName === "Microsoft Internet Explorer"){
		$("#"+this.canvasID).css("cursor","url(components/freeDraw/images/icon_eraser_lg.cur),auto");
	} else{
		$("#"+this.canvasID).css("cursor","url(components/freeDraw/images/icon_eraser_lg.cur)0 15,auto");
	}
	
};
Sketcher.prototype.color = function (ele) { 
	var id = $(ele).attr("id");
	this.context.strokeStyle = $("#"+id).val();
	this.pen();
};