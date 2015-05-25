
;(function($) {        
	var apiChecker = {
		entry : function(){
			console.log('something in handler');
			return "entry return";
		},
		apiResult : function(apiReturn){
			$("#apiOutput").html(JSON.stringify(apiReturn));
		},
		getWidgetData : function(e){
			var widgetData =  {}, widgetTypes = [], temp=undefined;//widgetData 		=  widgetData || {};
			for( var i = 0; i < author.widgetList.length; i++ ) { //Pushing JSON data to an object array
				temp=author.widgetList[i].getWidgetData();
				if(!!temp){
					widgetData[i]	= {};
					widgetData[i][0]= author.widgetList[i].getWidgetData();
					var widgetType = author.widgetList[i].getWidgetType();
					if(widgetType){
						widgetData[i][1] = widgetType;
						widgetTypes.push(widgetType);				
					}
					
				}
				else {
					author.widgetList.splice(i,1); 
				}	
			}
			
			apiChecker.apiResult({"widgetData": widgetData, "widgetTypes": widgetTypes});
				
		},
		submitGeneric: function(){
			var resultArray = [], temp=undefined;
			for( var i = 0; i < author.widgetList.length; i++ ) {
				resultArray.push(author.widgetList[i].validate('generic'));							
			}
			if(!_.contains(resultArray,false)){
				apiChecker.apiResult("Generic : This is Correct!!");
			}else{
				apiChecker.apiResult("Generic : This is Wrong");
			}
		},
		submitSpecific: function(){
			var resultArray = [], temp=undefined;
			for( var i = 0; i < author.widgetList.length; i++ ) {
				resultArray.push(author.widgetList[i].validate('specific'));						
			}
			if(!_.contains(resultArray,false)){
				apiChecker.apiResult("Specific : This is Correct!!");
			}else{
				apiChecker.apiResult("Specific : This is Wrong");
			}
		},
		reset : function(){
			var temp=undefined;
			for( var i = 0; i < author.widgetList.length; i++ ) {
					author.widgetList[i].reset();				
			}
			apiChecker.apiResult("Reset all completed");
		},
		activate : function(){
			var temp=undefined;
			for( var i = 0; i < author.widgetList.length; i++ ) {
				author.widgetList[i].activate();				
						
			}
			apiChecker.apiResult("Activate all !!");
		},
		deactivate : function(){
			var temp=undefined;
			for( var i = 0; i < author.widgetList.length; i++ ) {
				author.widgetList[i].deactivate();				
			}
			apiChecker.apiResult("Deactivated all");
		}
	};

	
	
	var initApiButtons = function(){
		var btnSection = $('#btnSection'); 
		$(btnSection).empty();
		var apiSection = "";
		apiSection = '<div style="clear:both;">' +
			'<button class="authorButton" id="apiSubmitGeneric">Submit</button>' + 
			'<button class="authorButton" id="apiSubmitSpecific">Final Submit</button>' +
			'<button class="authorButton" id="apiReset">Try Again</button>' +
			'<button class="authorButton" id="apiData">Show Data</button></div>' +
			'<button class="authorButton" id="apiActivate">Activate</button></div>' +
			'<button class="authorButton" id="apiDeactivate">Deactivate</button></div>' +
			'<div id="apiOutput"></div>';
		$(btnSection).append(apiSection);
		
		
		$('#apiSubmitGeneric').on('click', apiChecker.submitGeneric);
		$('#apiSubmitSpecific').on('click', apiChecker.submitSpecific);
		$('#apiReset').on('click', apiChecker.reset);
		$('#apiData').on('click', apiChecker.getWidgetData);
		$('#apiActivate').on('click', apiChecker.activate);
		$('#apiDeactivate').on('click', apiChecker.deactivate);
	};
	
	   
    $(initApiButtons);
})(jQuery);
