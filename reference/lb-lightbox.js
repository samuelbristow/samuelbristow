/**
 * lb-lightbox.js
 *
 * 2012-11-06: RH: restructuring this file to include lightbox functions,
 * bindings etc
 *
 * TODO:
 */

mcConf.lightboxWaitingTimeout = false;
function resetWaitingTimeout() {
	clearInterval(mcConf.lightboxWaitingTimeout);
	mcConf.lightboxWaitingTimeout = setInterval(lightboxWaitingTimeout, 50); 
}
function lightboxWaitingTimeout() {
	if(mcConf.ssInTransitionNow){ return; }	
	clearInterval(mcConf.lightboxWaitingTimeout);
	$('#ss_lightbox_link').trigger('click');
}

// add to lightbox
function addToLightbox() {

	if(mcConf.ssInTransitionNow){ resetWaitingTimeout(); return false; }

	var link = $this = $(this);
	var elem = $this = $(this);
	if($('li.current').length){
		elem = $('li.current');
		var slideshow = true;
	}

	var  asset_id =  elem.attr('asset');
	var  content_id =  elem.attr('content');
	if (typeof gtag === 'function') {
		gtag('event', 'add', {
			'event_category': 'Lightbox'
		});
	}
	$.getJSON('/syndication/add_to_lightbox/' + asset_id + '/' + content_id, function(data) {
		if (data.success) {
			lightbox_count++;
			
			$('#lb_count').text(lightbox_count);
			if (lightbox_count != 0) {
				$('#lb_link').removeClass('lb_count_empty');
			}
			
			elem.find('#ss_lightbox_text').text('- ' + mcConf.lb_label);
			if(slideshow) {
				$('#ss_lightbox_text').text('- ' + mcConf.lb_label);
				$('#ss_lightbox_link').removeClass('lb_add').addClass('lb_remove');
				elem.attr('rel', 'lb_remove');
			} else {
				var lbl = '-';
				if(mcConf.lb_label_always) { lbl += ' ' + mcConf.lb_label; }
				elem.text(lbl);
				$this.removeClass('lb_add').addClass('lb_remove');
			}
			link.trigger('lightbox_add');
		} else {
			alert('Could not add image to '+ mcConf.lb_label);
		}
	});
	return false;
}

// remove from lightbox
function removeFromLightbox() {

	if(mcConf.ssInTransitionNow){ resetWaitingTimeout(); return false; }

	var link = $this = $(this);
	var elem = $this = $(this);
	if($('li.current').length){
		elem = $('li.current');
		var slideshow = true;
	}
	var  asset_id =  elem.attr('asset');
	if (typeof gtag === 'function') {
		gtag('event', 'remove', {
			'event_category': 'Lightbox'
		});
	}
	$.getJSON('/syndication/remove_from_lightbox/' + asset_id, function(data) {
		if (data.success) {
			lightbox_count--;
			var $removable = $('#item-'+asset_id);
			$('#lb_count').text(lightbox_count);
			if (lightbox_count == 0) {
				$('#lb_link').addClass('lb_count_empty');
			}
			if(mcConf.is_lightbox) {
				
				if(mcConf.masonry && $(mcConf.masonryContainer).length) {
        			$(mcConf.masonryContainer).isotope( 'remove', $removable );
        			$(mcConf.masonryContainer).isotope('reLayout');
        			$.event.trigger("lightbox_remove", {filter:'.'+elem.closest('li').attr('data-filter'), id: asset_id});
        		} else if(1==1) {
					// else if slideshow or no masonry, remove from cycle
					var filter = elem.closest('li').attr('data-filter');
					$removable.empty().remove();
        			$.event.trigger("lightbox_remove", {filter:'.'+filter, id: asset_id});
				}
			} else {
				elem.find('#ss_lightbox_text').text('+ ' + mcConf.lb_label);
				if(slideshow) {
					$('#ss_lightbox_text').text('+ ' + mcConf.lb_label);
					elem.attr('rel', 'lb_add');
					$('#ss_lightbox_link').removeClass('lb_remove').addClass('lb_add');
				} else {
					var lbl = '+';
					if(mcConf.lb_label_always) { lbl += ' ' + mcConf.lb_label; }
					elem.text(lbl);
					$this.removeClass('lb_remove').addClass('lb_add');
				}
			}
			link.trigger('lightbox_remove', {id: asset_id});

		} else {
			alert('Could not remove image from ' + mcConf.lb_label);
		}
		
	});
	
	return false;
}

function addPortfolioToLightbox(link) {
	if(mcConf.lightboxProcessingFlag){ return; }
	mcConf.lightboxProcessingFlag = true;

	elem = link;
	var content_id = elem.attr('content');
	if (typeof gtag === 'function') {
		gtag('event', 'add portfolio', {
			'event_category': 'Lightbox'
		});
	}
	$.getJSON('/syndication/add_portfolio_to_lightbox/' + content_id, function(data) {
		if (data.success) {
			elem.unbind('click').bind('click', removePortfolioFromLightbox).find(mcConf.lightboxOverlayText).text(mcConf.lightboxContentRemoveText);
			var count = data.message.match(/(\d+)/);
			lightbox_count += parseInt(count);
			$('.lightbox_count').text(lightbox_count);
			elem.trigger('lightbox_add');
		} else {
			alert($(data.message).text());
		}
		mcConf.lightboxProcessingFlag = false;
	});
	return false;
}

function removePortfolioFromLightbox(link) {
	if(mcConf.lightboxProcessingFlag){ return; }
	mcConf.lightboxProcessingFlag = true;

	elem = link;
	var content_id = elem.attr('content');
	if (typeof gtag === 'function') {
		gtag('event', 'remove portfolio', {
			'event_category': 'Lightbox'
		});
	}
	$.getJSON('/syndication/remove_portfolio_from_lightbox/' + content_id, function(data) {
		if (data.success) {
			elem.unbind('click').bind('click', addPortfolioToLightbox).find(mcConf.lightboxOverlayText).text(mcConf.lightboxContentAddText);
			var count = data.message.match(/(\d+)/);
			lightbox_count -= parseInt(count);
			$('.lightbox_count').text(lightbox_count);
			elem.trigger('lightbox_remove');
		} else {
			alert($(data.message).text());
		}
		mcConf.lightboxProcessingFlag = false;
	});
	return false;
}

// email lightbox submission
function sendLightbox(resp) {
    var validated = true;
	var frm = $('#lightbox_form');

	if($("input[name=name]", frm).val() == ''){validated = false;}
	if($("input[name=email]", frm).val() == ''){validated = false;}
	if($("input[name=recipients]", frm).val() == ''){validated = false;}

	var email = $("input[name=email]", frm).val();
	var emailReg = mcConf.emailRegex;
	if (!emailReg.test(email) ) {validated = false;}

	if (!validated) {
		alert('Please complete the form and enter all *required information. Thank you.');
		frm.trigger('resetCaptcha');
		return false;
	}
	$("input[name=submit]", frm).val("sending...").attr('disabled', 'disabled');
	if (typeof gtag === 'function') {
		gtag('event', 'send email', {
			'event_category': 'Lightbox'
		});
	}
    $.ajax({
        type:'POST',
        url:'/syndication/email_lightbox',
        data:$("#lightbox_form").serialize(),
        dataType:'json',
        success:function (json) {
            $("input[name=submit]", frm).val("sent");
            if (mcConf.lightboxSuccessAlerts) {
            	alert(json.raw);
            }
            $(document).trigger('lightbox_sent');
			setTimeout(function(){ $("input[name=submit]", frm).removeAttr('disabled').val("submit"); }, 1000);
			$(mcConf.sendLightboxOverlay).hide(1000);
			/*
            $('#general_msg').fadeOut(5000, function () {
                $(this).html('');
            });
            */
			frm.trigger('resetCaptcha');
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("input[name=submit]", frm).val("error");
			alert('An unknown network error has occurred. Please try your request later.');
			setTimeout(function(){ $("input[name=submit]", frm).removeAttr('disabled').val("submit"); }, 3000);
			frm.trigger('resetCaptcha');
		}
    });
    return false;
}
function lightboxFilterSetup() {

	var wrapper = (mcConf.lightboxFilterWrapper ? mcConf.lightboxFilterWrapper : '#static');

	// artist filter links
	$('.lb_filter_link').click(function(e){
		e.preventDefault();
		// highlight the clicked link
		$('.lb_filter_link').removeClass('sel');
		$(this).addClass('sel');
		// and filter the content
		var selector = $(this).attr('data-filter');
		if(mcConf.masonry) {
			$(mcConf.masonryContainer).isotope({ filter: selector });
		} else {
			if(selector == '*') {
				$(wrapper + ' li').show();
			} else {
				$(wrapper + ' li').hide();
				$(wrapper + ' li'+selector+'').show();
			}
		}
		return false;
	});

	$('.lb_filter_toggle').bind('click', function(e){
		e.preventDefault();
		$('.lb_filter_toggle').removeClass('sel');
		$(this).addClass('sel');
		$('.lightbox_list').hide();
		$('#lb_'+$(this).attr('rel')).show();
	});

	$(wrapper).bind('lightbox_remove', function(e,params){
		// update filter link if artist has no more assets
		// but only if the artist list exists
		if($('#lb_artists').length > 0) {
			// the lightbox filters from the removed item, prepended with a period, because the past
			var filters = params.filter.substring(1).split(' '); 
			
			// decrement counts and remove empty filter links
			for(var i in filters) {
				var slug = filters[i];
				var my_remaining = $('#static li.'+slug);
				if(my_remaining.length < 1) { // remove the link
					$('li > a.lb_filter_link[data-filter=".'+slug+'"]').parent('li').first().remove();
				} else { // decrement the count
					$('li > a.lb_filter_link[data-filter=".'+slug+'"]').find('.lb_filter_count').text(my_remaining.length);
				}
			}
			
			if($('#lb_artists li').length == 1) {
				$('#lb_artists').remove();
				$('#lb_empty').parent('li').remove();
				$('#lb_print').parent('li').remove();
				$('#open_lb_send').parent('li').remove();
			}
		}
		// TODO: we should be using the js var here in case there are no elements to check
		// check if lightbox has any assets, if not, then hide print and send links
		if ($('#lb_count').html() == 0 || $('#lb_count').html() == '') {
			$('#open_lb_send, #lb_print, #lb_empty').hide();
		}
		
	});
}

function reorderLightbox(){
	if(mcConf.lightboxProcessingFlag){ return; }
	mcConf.lightboxProcessingFlag = true;

	var new_lightbox  = [];
	$('.lb_item').each(function(value,key){
		var that = $(this);
		var portfolio_id = that.attr('content');
		var image_id = that.attr('asset');
		var kv = {};
		kv[image_id] = portfolio_id;
		new_lightbox.push(kv);
	});
	$.ajax({
		url:'/syndication/reorder_lightbox/',
		data: { lightbox_array : new_lightbox },
		type: "POST",
		success: function(response){
			mcConf.lightboxProcessingFlag = false;
		},
		error: function(response){
			mcConf.lightboxProcessingFlag = false;
		}
	});
}

$(document).ready(function(){
	if ($('#masonry li').length == 0){
		if (mcConf.mobile == false && $(mcConf.contentContainer).data('jsp')){
			mcConf.capi.destroy();	
		}
	}
	if(mcConf.lightbox) {
		$('.lb_add').live('click touchstart', addToLightbox);
		$('.lb_remove').live('click touchstart', removeFromLightbox);
		lightboxFilterSetup();
	}
});

