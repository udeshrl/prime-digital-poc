/**
 * Created by ankit.goel on 3/10/14.
 */
var app = (function () {
    "use strict";
    var u = {};
    u.stringReverse = function (s) {
        return s.split('').reverse().join('');
    };
    u.randomInRange = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    u.isCharacter = function (a) {
        return(97 > a || 122 < a) && (65 > a || 90 < a) && 45 != a ? !1 : !0
    };

    u.isNumber = function (a) {
        return 48 > a || 57 < a ? !1 : !0
    };
    u.isDecimal = function (a) {
        console.log(a);
        return this.isNumber(a) || a == 46;//ascii code for decimal point.
    };
    u.isAlphaNumeric = function (a) {
        return this.isCharacter(a) || this.isNumber(a)
    };
    u.limitLeft = function (el, parent, left) {
        left = parseInt(left);
        var parentWidth=$(parent).width();
        var currentWidth=$(el).outerWidth();
        if ((left +currentWidth) > parentWidth) {
            return parentWidth - currentWidth;
        } else if (left > 0) {
            return left;
        } else {
            return 0;
        }
    };
    u.limitTop = function (el, parent, top) {
        top = parseInt(top);
        var parentHeight=$(parent).height();
        var currentHeight=$(el).outerHeight();
        if ((top +currentHeight ) >parentHeight ) {
            return parentHeight -currentHeight;
        } else if (top > 0) {
            return top;
        } else {
            return 0;
        }
    };
    u.limitHeight = function (el, parent, height, minHeight) {
        height = parseInt(height);
        minHeight = parseInt(minHeight);
        var positionOffset = $(el).position();
        var extraHeight = $(el).outerHeight() - $(el).height();
        var parentHeight = $(parent).height();
        if(height<=minHeight){
            return minHeight;
        }else if (parentHeight > (height + positionOffset.top)) {
            return height;
        }
        else if (height > 0) {
            return parentHeight - positionOffset.top - extraHeight;
        }
      };
    u.limitWidth = function (el, parent, width, minWidth) {
        width = parseInt(width);
        minWidth = parseInt(minWidth);
        var positionOffset = $(el).position();
        var extraWidth = $(el).outerWidth() - $(el).width();
        var parentWidth = $(parent).width();
        if(width<=minWidth){
            return minWidth;
        }else if (parentWidth > (width + positionOffset.left)) {
            return width;
        }else if (width > 0) {
            return parentWidth - positionOffset.left - extraWidth;
        }
    };
    u.getMultiply= function(a,b, numbers){
    	var first=parseFloat(a)+"",second=parseFloat(b)+"",
       firstIndex=first.indexOf(".")!==-1?first.indexOf("."):0,
        secondIndex=second.indexOf(".")!==-1?second.indexOf("."):0,
		fLen = first.slice(firstIndex!==0?firstIndex+1:0,first.length),
		sLen = second.slice(secondIndex!==0?secondIndex+1:0,second.length),
		sum;
        first=first.replace(".","");
        second=second.replace(".","");
    	if(firstIndex !== 0 && secondIndex !==0){
    		sum=(first*second)/Math.pow(10,(fLen.length+sLen.length));
    	}else{
    		sum = (first*second);
    	}
    	return sum; 
    	
    };
    u.detect = u.detect || {
        isConsoleActive: true,
        ua: navigator.userAgent.toLocaleLowerCase(),
        isIPad: function () {
            return this.ua.indexOf("ipad") != -1;
        },
        isAndroid: function () {
            return this.ua.indexOf("android") != -1;
        },
        isWindowPhone: function () {
            return this.ua.indexOf("iemobile") != -1;
        },
        isNetworkAvailable: function () {
            if (navigator.hasOwnProperty("onLine")) {
                return navigator.onLine;
            }
            return false;
        },
        isFirefox: function () {
            return this.ua.indexOf("firefox") != -1;
        },
        isWebkit: function () {
            return this.ua.indexOf('applewebkit') !== -1;
        },
        isIE: function () {
            return this.ua.indexOf('msie') !== -1 || ua.indexOf('rv:11.0') !== -1;
        },
        isMobile: function () {
            return this.isIPad() || this.isAndroid() || this.isWindowPhone();
        },
        isWindowOS: function () {
            return this.ua.indexOf("windows") !== -1;
        },
        isMAC: function () {
            return this.ua.indexOf("mac") !== -1;
        }
    };
    return u;
})();

/*Extending the native Methods*/
// Array Remove
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    if(!this.length || from<0){
        return false;
    }
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
// Array Contains
Array.prototype.contains = function(k) {
  for(var i=0; i < this.length; i++){
    if(this[i] === k){
      return true;
    }
  }
  return false;
}