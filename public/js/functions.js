;(function($, window, document, undefined) {
	// vars
	var $win = $(window);
	var $doc = $(document);

	$doc
		.on('ready', function() {
			// Main slider init

			// Tabs functionality

			// Categories hasClass active
			$(function() {
			  $(".categories-box").click(function(e){
			    if ($(this).hasClass("active")) {
			      //not active
			      $(this).removeClass("active");
			    } else if (!$(this).hasClass("active")) {
			      //active
			      $(this).addClass("active");
			      e.preventDefault()
			    }
			     e.preventDefault();
                            
                             
                             $('#cid'+$(this).data('id')).trigger('click');
                             
                             
                             
                             
                             
			  });
			}); 
                        

			// Selector init
			$(".main-select").selecter();
		});
})(jQuery, window, document);