/*! Copyright (c) 2008 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: @VERSION
 *
 * Requires: jQuery 1.2+
 */

(function($) {

var elements = [], timeout;

$.fn.extend({
	viewable: function(callback) {
		this
			.bind('viewable', callback)
			.each(function() {
				elements.push(this);
			});
		if ( $.isReady ) checkVisibility();
		return this;
	},
	
	stopViewable: function() {
		return this.each(function() {
			var self = this;
			$.each( elements, function(i, element) {
				if ( self == element )
					delete elements[i];
			});
		});
	}
});

// Check the elements visibility
function checkVisibility() {
	
	// Get necessary viewport dimensions
	var winHeight = $(window).height(),
	    winTop    = self.pageYOffset || $.boxModel && document.documentElement.scrollTop || document.body.scrollTop,
	    winBottom = winHeight + winTop;
	
	// Loop through the elements and check to see if they are viewable
	$.each(elements, function(i, element) {
		if ( !element ) return;
		
		// Get element top offset and height
		var elTop      = $(element).offset().top, 
		    elHeight   = parseInt( $(element).css('height') ),
		    elBottom   = elTop + elHeight,
		    percentage = 0, hiddenTop  = 0, hiddenBottom = 0;
		
		// Get percentage of unviewable area
		if ( elTop < winTop )             // Area above the viewport
			hiddenTop = winTop-elTop;
		if ( elBottom > winBottom )       // Area below the viewport
			hiddenBottom = elBottom-winBottom;
		
		percentage = 1 - ((hiddenTop + hiddenBottom)/elHeight);
		
		// Trigger viewable event along with percentage of viewable
		$(element).trigger('viewable', [ (percentage > 1 ? 1 : percentage < 0 ? 0 : parseFloat(percentage)) ]);
	});
};

$(function() {
	
	// Bind scroll function to window when document is ready
	$(window)
		.bind('scroll.viewable', function() {
			// Clear timeout if scrolling hasn't paused
			if ( timeout ) clearTimeout(timeout);
			// Create timeout to run actual calculations for once scrolling has paused
			timeout = setTimeout(checkVisibility, 250);
		});
	
	// Check to see if the element is already visible
	checkVisibility();
});

})(jQuery);