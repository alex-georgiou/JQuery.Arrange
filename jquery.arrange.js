/*
 * JQuery.arrange() by Alexg (alex.georgiou@gmail.com) coded on Nov 30, 2011
 * 
 * usage: run on a container to arrange its children in random positions within the container 
 * 
 * e.g. $('#container').arrange();
 * 
 * optional parameters:
 * 	avoid: selector of elements that are to be avoided, but that should not be arranged themselves
 *  arrange: selector of elements that are to be arranged
 *  bailout: how many tries to compute per element before giving up arrangement
 *  slack: minimum pixel distance between elements
 */

(function($){  
	$.fn.arrange = function(options) {
		var defaults = {
			avoid: '',
			arrange: '*',
			bailout: 100,
			slack: 0
		};
	
		var options = $.extend(defaults,options);

		var rectangles = [];
		
		var torect = function(element){
			var $element = $(element);
			var pos = $element.position();
			var rect = {};
			rect.x = Math.floor(pos.left);
			rect.y = Math.floor(pos.top);
			rect.w = $element.width();
			rect.h = $element.height();
			rect.x2 = rect.x+rect.w;
			rect.y2 = rect.y+rect.h;
			return rect;
		};
	
		var randrect = function( element, max_x, max_y ) {
			var rect = {};
			var $element = $(element);
			rect.w = $element.width();
			rect.h = $element.height();	
			rect.x = Math.floor((max_x-rect.w)*Math.random());
			rect.y = Math.floor((max_y-rect.h)*Math.random());	
			rect.x2 = rect.x+rect.w;
			rect.y2 = rect.y+rect.h;
			return rect;
		};
		
		var overlap = function ( a, b ) {
			if (contains(a,b) || contains(b,a)) return true;
			return (a.x<b.x2 && a.x2>b.x && a.y<b.y2 && a.y2>b.y);
		};
	
		var overlap_any = function ( a_rect ) {
			for (var i in rectangles)
				if (overlap(a_rect,rectangles[i]))
					return true;
			return false;
		};
	
		var contains = function(rectA, rectB) {
			return	(rectA.x<=rectB.x) &&
					(rectA.x2>=rectB.x2) &&
					(rectA.y<=rectB.y) &&
					(rectA.y2>=rectB.y2);
		};

		var expand = function(rect,slack) {
			var result={};
			result.w = rect.w;
			result.h = rect.h;
			result.x = rect.x - slack;
			result.y = rect.y - slack;
			result.x2 = rect.x2 + slack;
			result.y2 = rect.y2 + slack;
			return result;
		};
	
		return this.each(function() {
			var obj = $(this);
			rectangles.length = 0;
			
			var toavoid = obj.find(options.avoid,obj);
			var toarrange = obj.find(options.arrange,obj).not(options.avoid);
			
			obj.css('position','relative');
			
			toavoid.each(function() {
				rectangles.push( expand(torect( this ), options.slack ) );
			});
			
			toarrange.each(function(){
				var bailout = defaults.bailout;
				do {
					var provisional_rect = randrect(this,obj.width(),obj.height());
					
				} while ( (--bailout>0) && (overlap_any(provisional_rect)) );
				if (bailout>0) 
				{
					rectangles.push( expand(provisional_rect, options.slack) );
					$(this).css('left',provisional_rect.x).css('top',provisional_rect.y).css('position','absolute');
				} else { 
					console.warn('JQuery.arrange: bailout reached');
				}

			});
			
		});  
	};  
})(jQuery);

