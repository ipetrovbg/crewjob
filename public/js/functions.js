;(function($, window, document, undefined) {
	// vars
	var $win = $(window);
	var $doc = $(document);

	$doc
		.on('ready', function() {
			// Main slider init
			$('.main-slider').owlCarousel({
			    loop:true,
			    margin:10,
			    nav:true,
			    items: 1,
			    nav: false
			});

			// Tabs functionality
			$('.tabs-nav a').on('click', function(e) {
				var $this = $(this);
				var href = $this.attr('href');

				$(href).addClass('active').siblings().removeClass('active');
				$(this).parent().addClass('active').siblings().removeClass('active');

				e.preventDefault();
			});

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

			// File upload
			var media = $('#id_media');
			  if (media.length) {
			      var mediaDefaultValue = $('.file span.value').text();
				    var mediaCharLimit = 20;

				    $('.file .bt-value').click(function(){
				        media.click();
				    });

				    media.on('change', function() {
				        var value = this.value.replace("C:\\fakepath\\", "");
				        var newValue;
				        var valueExt;
				        var charLimit;

				        if (value) {
				            newValue = value;
				            valueExt = value.split('.').reverse()[0];
				            if (newValue.length > mediaCharLimit) {
				                charLimit = mediaCharLimit - valueExt.length;

				                // truncate chars.
				                newValue = $.trim(value).substring(0, charLimit) + '…';

				                // if file name has extension, add it to newValue.
				                if (valueExt.length) {
				                    newValue += valueExt;
				                }
				            }
				        }
				        else {
			        newValue = mediaDefaultValue;
			      }
			    $(this).parent().find('span.value').text(newValue);
			  });
			}
		});


		$triggered_times = 0;

		$win
			.on('scroll', function() {

			})
			.on('load', function() {
				
			});
})(jQuery, window, document);