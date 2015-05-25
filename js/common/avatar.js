var avatarWidget = (function (o) {
	var configuration = {
        authorParent: "author_content_container"
    };
	function getAvatarWidgetTemplate(obj ) {
		 var htmlStr = '<div id="avatar_area" style="bottom:'+obj.bottom+'px;left:'+obj.left+'px">';
		 htmlStr += '<div class="avatar_container"><img id="avatar_img" src="'+obj.avatarIcon+'"/><span id="msgText">'+obj.message+'</span>';
		 htmlStr += '<span id="deleteAvatar"></span></div></div>';	
	     return htmlStr;
	 };
	function show() {
    	authParent.find('#avatar_area').css('display','block');
    };
    function getInstanceData() { 
    	var el = authParent.find('#avatar_area');
    	var obj = {};
    	obj.avatarIcon = el.find('#avatar_img').attr('src');
    	obj.visiblity = el.css('display') == 'block' ? true : false;
        obj.message = el.find('#msgText').html();
        obj.position = {left:el.position().left,top:el.position().top};
        return obj;
    };
    
	 function avatarWidget(options) {
		 var _this = this;
		 var defaultSetting = {
	        avatarIcon	:'images/common/avatar/avatar1.png',
	        message		:'Default message<br /> on author screen.',
	        audioPath	:'',
	        playAudio	:false,
	        bottom:'10',
	        left:'10'
		 };
		 
		 this.isdeleted = false;
		 this.isdeActivated = false;
		 var cSetting = $.extend( {}, defaultSetting, options );
		 
	     authParent = $('#' + configuration.authorParent);
	     authParent.append( getAvatarWidgetTemplate( {avatarIcon:cSetting.avatarIcon, message:cSetting.message, left:cSetting.left, top:cSetting.top} ) );
	     
	     if (Role == "author") {
	    	 var img = cSetting.avatarIcon.split('.')[0];
	    	 $('#avatar' + img.substring(img.length-1, img.length)).css('border','1px solid red');
	    		
	    	 authParent.find('#deleteAvatar').unbind('click').on('click', function(e) {
	 			_this.destroy();
	 		});
	    	
	     } else {
	    	 $('#avatar_area').css('display','none');
	    	 $('#instructionText').hide();
	    	 $('#deleteAvatar').hide();
	    	 $('#divPosition').hide();
	     }

	     this.hide = function() {
	    	authParent.find('#avatar_area').css('display','none');
	     };
	     this.resetAvatar = function() {
	    	this.hide(); 
	    	authParent.find('#msgText').html('');
	     };
	     this.destroy = function() {
	    	this.isdeleted = true;
	    	authParent.find('#avatar_area').remove();
	    	$('#avatarList li div').children().css('border','none');
	     };
	     this.setAvatar = function (e) {
	    	$('#avatarList li div').children().css('border','none');
	    	authParent.find('#avatar_img').attr('src', $(e.target).attr('src'));
	    	$(e.target).css('border','1px solid red');
	     };
	     this.setMessage = function(obj) {
	    	 if( !this.isdeActivated ) {
		    	 authParent.find('#msgText').html(obj.msg);
		    	 authParent.find('#msgText').removeClass();
		    	 show();
		    	 if(obj.ansStatus == 'neutral') {
		    		 authParent.find('#msgText').addClass('neutral');
		    	 }else if(obj.ansStatus == 'correct') {
		    		 authParent.find('#msgText').addClass('correct');
		    	 }else {
		    		 authParent.find('#msgText').addClass('incorrect');
		    	 }
		    	
	    	 }
	     };
	     this.getAvatarData = function() {
	    	 if(!this.isdeleted) {
	    		 return getInstanceData();
	    	 } else {
	    		 return {isExist : false};
	    	 }
	     };
	     
	}
	
    return avatarWidget;
    
})(window);