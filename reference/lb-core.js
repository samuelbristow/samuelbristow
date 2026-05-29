// define core options/setup
$.extend(mcConf, {
    emailRegex : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	lbMobileSite : undefined,						// has mobile site design
	lbMobile : undefined,							// is mobile
	lbDevice : undefined,							// device type
	lbScreenSizeWidth : undefined,					// screen size width
	lbScreenSizeHeight : undefined,					// screen size height
	lbOrientationChange : undefined,				// check for orientation change
	lbOrientation : undefined,						// mobile orientation
	lbAssetSize : undefined,						// image asset size
	lbVideoSize : undefined,						// video asset size
	lbClipSize : undefined,							// video clip size
	assetStorageURL : undefined,					// asset storage URL
	menu : undefined, 								// menu
	capi : '', 										// main content scrollbar
	mapi : '', 										// menu scrollbar
	emapi : '',										// extended menu scrollbar
	scrollbar : undefined,							// has scrollbar true or false, true by default
	throttleTimeout : '', 							// timeout var for scrollbars
	screenSizeWidth : screen.width, 				// screen width (used for mobile)
	screenSizeHeight : screen.height, 				// screen height (used for mobile)
	retina : undefined,
	_h : undefined, 								// height of the browser
	_w : undefined, 								// width of the browser
	_imgH : undefined, 								// image height (resize on slideshows and the blog)
	_imgW : undefined, 								// image width (resize on slideshows and the blog)
	imagePrefixSizes : undefined,					// will be used to store the maximum height and width for each image prefix
	alternateSpreadColor : undefined					// setting for alternate spread colour
});

// check if mobile
mcConf.mobile = false;
if ((navigator.userAgent.indexOf("iPhone") != -1)
    || (navigator.userAgent.indexOf("iPod") != -1)
    || (navigator.userAgent.indexOf("iPad") != -1)
    || (navigator.userAgent.indexOf("Android") != -1)
    || (navigator.userAgent.indexOf("BlackBerry") != -1)){
	mcConf.mobile = true;
	document.getElementsByTagName('html')[0].classList.add('device-mobile');
}
mcConf.deviceRatio = '(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-device-pixel-ratio: 1.5),(min-resolution: 144dpi),(min-resolution: 1.5dppx)';
if (window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(mcConf.deviceRatio).matches)) {
	mcConf.retina = true;
	document.getElementsByTagName('html')[0].classList.add('screen-retina');
}

function setAssetSize() {
	// set the device and image sizes for mobile if there is a mobile optimized site
	if (mcConf.lbMobileSite == true) {
		if ((navigator.userAgent.indexOf("iPhone") != -1) || (navigator.userAgent.indexOf("iPod") != -1)) {
			mcConf.lbDevice = 'iPhone';
			mcConf.lbAssetSize = mcConf.lbAssetSize_iphone;  // default ml
			mcConf.lbVideoSize = 'ios';
		} else if (navigator.userAgent.indexOf("Android") != -1) {
			mcConf.lbDevice = 'Android';
			mcConf.lbAssetSize = mcConf.lbAssetSize_droid;  // default ml
			mcConf.lbVideoSize = 'ios';
		} else if (navigator.userAgent.indexOf("BlackBerry") != -1) {
			mcConf.lbDevice = 'Blackberry';
			mcConf.lbAssetSize = mcConf.lbAssetSize_blackberry;  // default ms
			mcConf.lbVideoSize = 'ios';
		} else if (navigator.userAgent.indexOf("PlayBook") != -1) {
			mcConf.lbDevice = 'Playbook';
			mcConf.lbAssetSize = mcConf.lbAssetSize_playbook;  // default ml
			mcConf.lbVideoSize = 'ios';
		} else {
			mcConf.lbDevice = 'desktop';
		}
	} else {
		mcConf.lbDevice = 'desktop';
	}

	// if desktop check for screen width/height to optimize the experience for the user
	if (mcConf.lbDevice == 'desktop') {
		if (screen.width <= 800) { // even smaller screens
			mcConf.lbAssetSize = mcConf.lbAssetSize_800;  // default ml
			mcConf.lbClipSize = 'lgclip';
		} else if (screen.width <= 1024) { // smaller screens
			mcConf.lbAssetSize = mcConf.lbAssetSize_1024; // default gs
			mcConf.lbClipSize = 'lgclip';
		} else if (screen.width <= 1366) { // 11" macbook air
			mcConf.lbAssetSize = mcConf.lbAssetSize_1366; // default gm
			mcConf.lbClipSize = 'hdclip';
		} else if (screen.width <= 1440) { // 15" macbook pro and 13" macbook air
			mcConf.lbAssetSize = mcConf.lbAssetSize_1440; // default gm
			mcConf.lbClipSize = 'hdclip';
		} else if (screen.width <= 1680) { // 17" displays
			mcConf.lbAssetSize = mcConf.lbAssetSize_1680; // default gl
			mcConf.lbClipSize = 'fullhdclip';
		} else if (screen.width <= 1920) { // 19-20" displays
			mcConf.lbAssetSize = mcConf.lbAssetSize_1920; // default gxl
			mcConf.lbClipSize = 'fullhdclip';
		} else if (screen.width <= 2560) { // 27" displays
			mcConf.lbAssetSize = mcConf.lbAssetSize_2560; // default gxxl
			mcConf.lbClipSize = '2kclip';
		} else if (screen.width <= 3840) {
			mcConf.lbAssetSize = mcConf.lbAssetSize_2560; // default gxxl
			mcConf.lbClipSize = '4kclip';
		} else {
			mcConf.lbAssetSize = mcConf.lbAssetSize_2560; // default gxxl
			mcConf.lbClipSize = '8kclip';
		}
		mcConf.lbVideoSize = 'video_';
	}
}
setAssetSize();

// if mobile detect whether device supports orientationchange event, otherwise fall back to the resize event.
// check for current orientation
if (mcConf.lbOrientationChange) {
	var supportsOrientationChange = "onorientationchange" in window,
	    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	// on load
	$(window).load(orientationEvent, function() {
		mcConf.lbOrientation = window.orientation;
		mcConf.lbScreenSizeWidth = screen.width;
		mcConf.lbScreenSizeHeight = screen.height;
	}, false);
	// on change
	window.addEventListener(orientationEvent, function() {
		mcConf.lbOrientation = window.orientation;
		mcConf.lbScreenSizeWidth = screen.width;
		mcConf.lbScreenSizeHeight = screen.height;
//		resizeSlideshow();
	}, false);
}


// setup scrollbar for menu
$(function() {

	// disable contextual menu (right click)
	if (mcConf.drag_desktop == false) {
		$('img').on('contextmenu', function(e){
			e.preventDefault();
			return false;
		});
		$('img').on('mousedown', function(e){
			e.preventDefault();
			return false;
		});
	}

	// if mobile, hide address bar on IOS and Android
	if (mcConf.mobile == true) {
		window.addEventListener("load",function() {
		    setTimeout(function() {
		        document.body.scrollTop || window.scrollTo(0, 1);
		    }, 0);
		});
	}

	// detecting iOS 5 to work around a masonry bug
	if(navigator.userAgent.match(/OS 5_[0-9_]+ like Mac OS X/i) != null) {
		$('body').addClass('ios5');
	}

	// setup menu scrollbar
	if (mcConf.mobile == false) {
		if(mcConf.useWebkitScrollbars == false || (mcConf.useWebkitScrollbars == true && !$.browser.webkit)){
			if (mcConf.scrollbar == undefined || mcConf.scrollbar) {
				if (mcConf.customMenuScrollbar == true) {
					$(mcConf.menuContainer).jScrollPane({
						autoReinitialise: mcConf.autoreinitialiseJscrollPane,
						showArrows: false,
						autoReinitialiseDelay: mcConf.jspAutoReinitialiseDelay,
						verticalDragMinHeight: mcConf.menuVerticalDragMinHeight,
						verticalDragMaxHeight: mcConf.menuVerticalDragMaxHeight,
						verticalDragMinWidth: mcConf.menuVerticalDragMinWidth,
						verticalDragMaxWidth: mcConf.menuVerticalDragMaxWidth,
						horizontalDragMinHeight: mcConf.menuHorizontalDragMinHeight,
						horizontalDragMaxHeight: mcConf.menuHorizontalDragMaxHeight,
						horizontalDragMinWidth: mcConf.menuHorizontalDragMinWidth,
						horizontalDragMaxWidth: mcConf.menuHorizontalDragMaxWidth,
						verticalGutter: 0,
						horizontalGutter: 0
					});
				} else {
					$(mcConf.menuContainer).jScrollPane({
						autoReinitialise: mcConf.autoreinitialiseJscrollPane,
						showArrows: false,
						autoReinitialiseDelay: mcConf.jspAutoReinitialiseDelay,
						verticalGutter: 0,
						horizontalGutter: 0
					});
				}
				mcConf.mapi = $(mcConf.menuContainer).data('jsp');
			}

			$(mcConf.menuContainer + ' .container, #n_backtomenu a').bind('mousedown',function() {
				// reinitialise jScrollpane when the menu toggles
				if (!mcConf.throttleTimeoutMenu) {
					mcConf.throttleTimeoutMenu = setTimeout(function(){
						// menu scrollbars
						if (!!mcConf.mapi) {
							mcConf.mapi.reinitialise();
						}
						mcConf.throttleTimeoutMenu = null;
					}, mcConf.navSlideSpeed + 100);
				}
			});
		}
	}

	// setup content scrollbar
	if (mcConf.mobile == false) {
		if(mcConf.useWebkitScrollbars == false || (mcConf.useWebkitScrollbars == true && !$.browser.webkit)){
			if (mcConf.scrollbar == undefined || mcConf.scrollbar) {
				if (mcConf.customContentScrollbar == true) {
					$(mcConf.contentContainer).jScrollPane({
						autoReinitialise: mcConf.autoreinitialiseJscrollPane,
						showArrows: false,
						animateScroll: true,
						autoReinitialiseDelay: mcConf.jspAutoReinitialiseDelay,
						verticalDragMinHeight: mcConf.contentVerticalDragMinHeight,
						verticalDragMaxHeight: mcConf.contentVerticalDragMaxHeight,
						verticalDragMinWidth: mcConf.contentVerticalDragMinWidth,
						verticalDragMaxWidth: mcConf.contentVerticalDragMaxWidth,
						horizontalDragMinHeight: mcConf.contentHorizontalDragMinHeight,
						horizontalDragMaxHeight: mcConf.contentHorizontalDragMaxHeight,
						horizontalDragMinWidth: mcConf.contentHorizontalDragMinWidth,
						horizontalDragMaxWidth: mcConf.contentHorizontalDragMaxWidth,
						verticalGutter: 0,
						horizontalGutter: 0
					});
				} else {
					$(mcConf.contentContainer).jScrollPane({
						autoReinitialise: mcConf.autoreinitialiseJscrollPane,
						autoReinitialiseDelay: mcConf.jspAutoReinitialiseDelay,
						showArrows: false,
						animateScroll: true,
						verticalGutter: 0,
						horizontalGutter: 0
					});
				}
				mcConf.capi = $(mcConf.contentContainer).data('jsp');
				mcConf.scrollbar = true;
			}
		}
	}
	$(window).bind('resize load',function() {
		// reinitialise jScrollpane
		if (!mcConf.throttleTimeout) {
			mcConf.throttleTimeout = setTimeout(function(){
				// menu scrollbars
				if (!!mcConf.mapi) {
					mcConf.mapi.reinitialise();
				}
				// content scrollbars
				if (!!mcConf.capi) {
					mcConf.capi.reinitialise();
				}
				// thumbnail scrollbars
				if (!!mcConf.tapi) {
					mcConf.tapi.reinitialise();
				}
				// gallery scrollbars
				if (!! mcConf.gapi) {
					mcConf.gapi.reinitialise();
				}
				mcConf.throttleTimeout = null;
			},50);
		}
	});

	// generic close all overlays
	$('.o_close').bind('click', function(evt) {
		evt.preventDefault();
		$('.overlay').hide();
		$('.overlay').removeClass('show');
		$('.'+$(this).attr('data-target')).removeClass('sel');
		resumeAllVideoClips();
		return false;
	});
	// focus effect on the field labels for the overlay forms
	$('.overlay .contact_form input, .overlay .contact_form textarea').bind('focus', function(evt) {
		$(this).parent().addClass('sel');
	});
	$('.overlay .contact_form input, .overlay .contact_form textarea').bind('blur', function(evt) {
		$(this).parent().removeClass('sel');
	});
	// show cover images for artists
	$('li[cover_image]').hover(
		function () {
			if (!$('body').hasClass('no_cover')) {
				$('#cover').addClass('visible').html('<img src="'+$(this).attr('cover_image')+'" />');
			}
		},
		function () {
			if (!$('body').hasClass('no_cover')) {
				if(typeof mcMenu.updateCoverHoverOut == 'function') {
					return mcMenu.updateCoverHoverOut();
				}
				$('#cover').removeClass('visible').html('');
			}
		}
	);
	//_setupNavMenu();
	mcMenu.init();

	// mobile optimized site menu binding
	if (mcConf.mobile_optimized == true){
		$('.mobile_menu_icon').bind('click',function(){
			if ($(this).hasClass('sel')){
				$(this).removeClass('sel');
				$('nav').removeClass('visible');
			} else {
				$(this).addClass('sel');
				$('nav').addClass('visible');
			}
		});
	}

	// custom share if enabled
	if (mcConf.customShare == true){
		// facebook
		$('body').on('click touchstart', '.st_facebook_custom', function(){
			var _href = $(this).attr('st_url');
			window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(_href), "fbshare", "height=400,width=550,resizable=1,toolbar=0.menubar=0,status=0,location=0");
			if (typeof gtag === 'function') {
				gtag('event', 'facebook', {
					'event_category': 'Share'
				});
			}
		});
		// twitter
		$('body').on('click touchstart', '.st_twitter_custom', function(){
			var _href = $(this).attr('st_url');
			var _txt = $(this).attr('st_title');
			if(typeof _txt == 'undefined' || _txt.length < 1) { _txt = window.document.title; }
			window.open('http://twitter.com/intent/tweet?text='+encodeURIComponent(_txt)+' '+encodeURIComponent(_href), "twshare", "height=380,width=660,resizable=1,toolbar=0.menubar=0,status=0,location=0");
			if (typeof gtag === 'function') {
				gtag('event', 'twitter', {
					'event_category': 'Share'
				});
			}
		});
		// pinterest
		$('body').on('click touchstart', '.st_pinterest_custom', function(){
			var _img = $(this).attr('st_image');
			var _href = $(this).attr('st_url');
			var _txt = $(this).attr('st_title');
			if(typeof _txt == 'undefined' || _txt.length < 1) { _txt = window.document.title; }
			window.open('http://pinterest.com/pin/create/button/?url='+encodeURIComponent(_href)+'&media='+_img+'&description='+encodeURIComponent(_txt), "pinshare", "height=270,width=630,resizable=1,toolbar=0.menubar=0,status=0,location=0");
			if (typeof gtag === 'function') {
				gtag('event', 'pinterest', {
					'event_category': 'Share'
				});
			}
		});
		// tumblr
		$('body').on('click touchstart', '.st_tumblr_custom', function(){
			var _href = $(this).attr('st_url');
			var _txt = $(this).attr('st_title');
			if(typeof _txt == 'undefined' || _txt.length < 1) { _txt = window.document.title; }
			window.open('http://www.tumblr.com/share?v=3&s=&t='+encodeURIComponent(_txt)+'&u='+encodeURIComponent(_href), "tbshare", "height=270,width=630,resizable=1,toolbar=0.menubar=0,status=0,location=0");
			if (typeof gtag === 'function') {
				gtag('event', 'tumblr', {
					'event_category': 'Share'
				});
			}
		});
		// google+
		$('body').on('click touchstart', '.st_googleplus_custom', function(){
			var _href = $(this).attr('st_url');
			window.open('https://plus.google.com/share?url='+encodeURIComponent(_href), "height=600,width=600,resizable=1,toolbar=0.menubar=0,status=0,location=0");
			if (typeof gtag === 'function') {
				gtag('event', 'google+', {
					'event_category': 'Share'
				});
			}
		});
		// weibo
		$('body').on('click touchstart', '.st_weibo_custom', function(){
			var _href = $(this).attr('st_url');
			window.open('http://service.weibo.com/share/share.php?url='+encodeURIComponent(_href)+'&type=button&language=zh_cn&searchPic=true&style=number');
			if (typeof gtag === 'function') {
				gtag('event', 'weibo', {
					'event_category': 'Share'
				});
			}
		});
		// linkedin
		$('body').on('click touchstart', '.st_linkedin_custom', function(){
			var _href = $(this).attr('st_url');
			var _txt = $(this).attr('st_title');
			window.open('https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(_href)+'&summary='+_txt);
			if (typeof gtag === 'function') {
				gtag('event', 'linkedin', {
					'event_category': 'Share'
				});
			}
		});
		// email
		$('body').on('click touchstart', '.st_email_custom', function(){
			var _href = $(this).attr('st_url');
			var _txt = $(this).attr('st_title');
			if(typeof _txt == 'undefined' || _txt.length < 1) { _txt = window.document.title; }
			// set hidden fields
			$('#o_share_link_url').val($(this).attr('st_url'));
			$('#o_share_asset_id').val($(this).parents('li').attr('asset'));
			$('#o_share_portfolio_id').val($(this).parents('li').attr('content'));
			$('#o_share_email_subject').val(_txt);
			$('#o_share .top_label').html('share: '+_txt);
			// share:
			// show overlay form
			$('#share_overlay').show();
			$('#share_overlay').find('[tabindex="1"]').focus();
			$(this).trigger('share_via_email_opened');
			if (typeof gtag === 'function') {
				gtag('event', 'open email form', {
					'event_category': 'Share'
				});
			}
		});
		$('#share_overlay .cancel').bind('click', function(e){
			e.preventDefault();
			$('#share_overlay').hide();
		});
	}
});

/**
 * setup main navigation
 */
function _setupNavMenu() {
	// menu type
	$('#n_top_list li.n_main').addClass('open').removeClass('closed'); // having them hidden by default helps avoid a flash between render and this code running
	if(mcConf.is_content && mcConf.menu_show_artist_only){$('.level_1>a.sel').addClass('closed').removeClass('open');}
	if(mcConf.is_news) {$("li.level_1:not(.n_blog)").addClass('closed').removeClass('open');}
	if($('#n_top_list a.sel').length > 1 && mcConf.menu_show_artist_only){$('.level_1:not(.n_blog)>a.sel').addClass('closed').removeClass('open');}

	if (mcConf.menuType == 'dropdown') {
		// close the back to menu link
		$('#n_backtomenu').addClass('closed');

		// toggle the parent elements
		$('#n_top_list li.n_main.container > a').click(function (e){
			e.preventDefault();
			var sublist = $(this).parent().find(' > ul.contents_list');
			sublist.toggleClass('open').removeClass('closed');
			if(sublist.hasClass('open')){
				sublist.addClass('open').removeClass('closed');
			} else {
				sublist.addClass('closed').removeClass('open');
			}
		});
		$(body).bind('click', function(){
			if (mcConf.menuOpen == true){
				$('#n_top_list li.n_main').removeClass('open').addClass('closed');
			}
		});
	}


	if(mcConf.menuType == 'toggle') { // make the default menu work at all...

		$('#n_backtomenu').addClass('closed'); // hide the back to menu link
		                       			       // TODO: only output the backtomenu if menuType=collapse

		// on the main studio container links, capture click and toggle submenu
		$('#n_top_list li.n_main.container > a').click(function (e){
			var sublist = $(this).parent().find(' > ul.contents_list');
			if (sublist && $(sublist).find('li').length) {
				e.preventDefault();
				sublist.toggleClass('open').removeClass('closed');
				if(sublist.hasClass('open')){ sublist.addClass('open').removeClass('closed'); } else { sublist.addClass('closed').removeClass('open'); }
				return false;
			}

		});

	} else if (mcConf.menuType == 'collapse') {

		mcConf.navSlideSpeed = 200;
		//mcConf.menu_show_artist_only = true;
		if($('#n_top_list > li.n_main a.sel').length > 0) { // if we have open entries
			// then show proper stuff
			$('#n_top_list li.n_sub').removeClass('open').addClass('closed'); // initially hide all portfolios li's
			$('#n_top_list li.n_main ul.contents_list.open').removeClass('closed').addClass('open'); // open the ul's that should be open

			$('#n_top_list li.n_main').removeClass('open').addClass('closed').each(function (){ // hide all n_main's too
				if($('a', this).hasClass('sel')){ $(this).addClass('open').removeClass('closed'); } // but open the selected ones
			});

			$('#n_top_list ul.contents_list.open').last().find('li').addClass('open').removeClass('closed'); // and show the last open header & list

			$('#n_backtomenu a').html(mcConf.menuBackToMenuText); // also, ensure the back to menu is displayed
			$('#n_backtomenu').addClass('open').removeClass('closed');
		} else {
			// set the back to menu label text and hide by default
			$('#n_backtomenu a').html(mcConf.menuBackToMenuText);
			$('#n_backtomenu').addClass('closed').removeClass('open');
		}

		$('#n_top_list li.n_main.container > a').click(function (e){
			e.preventDefault();
			if($(this).attr('data-link')){location.href = $(this).attr('href')+$(this).attr('data-link');return;}
			if ($(this).hasClass('sel')) {
				// clicked an open container - is the the last open one? if so leave it because it should already be showing it's stuff
				if($(this).parent().find('li.n_main > a.sel').length > 0) {
					// not the last open container - close their children
					$(this).parent().find('li > a').removeClass('sel'); // clear sub sel classes
					$(this).parent().find('li.n_main > ul.contents_list').removeClass('open').addClass('closed'); // close open subcontainers
					$(this).parent().find('li').addClass('open').removeClass('closed'); // show all the list items for this container
					$(this).parent().addClass('closed').removeClass('open'); // hide then slide the current list
//					$(this).parent().slideDown(mcConf.navSlideSpeed);
				}
			} else {
				$(this).addClass('sel');
				if($('#n_top_list a.sel').length > 1 && mcConf.menu_show_artist_only){$('.level_1>a.sel').addClass('closed').removeClass('open');}
				$(this).parent().parent().find('> li').addClass('closed').removeClass('open');
				$(this).parent().addClass('open').removeClass('closed').find('> ul').addClass('open').removeClass('closed').find('li').addClass('open').removeClass('closed');
				$('#n_backtomenu').addClass('open').removeClass('closed');

			}
		});

		// back to menu click
		$('#n_backtomenu').bind('click', function() {
			$('#n_top_list a').removeClass('sel').addClass('open').removeClass('closed');
			$('#n_top_list .n_main').addClass('closed').removeClass('open');
			$('#n_top_list > .n_main').addClass('open').removeClass('closed');
			$('#n_top_list ul.contents_list').addClass('closed').removeClass('open');
			$('#n_top_list .n_sub').addClass('closed').removeClass('open');
			$('#nav .menu_hide').addClass('closed');
			$(this).addClass('closed').removeClass('open');
			$('body').removeClass('no_cover');
		});
	} else if (mcConf.menuType == 'default') {
		// default will do nothing. Can use this for custom behaviours if needed.
		$('#n_backtomenu').hide(); // hide the back to menu link
		// TODO: only output the backtomenu if menuType=collapse
		// NOTE: the navigation, if built properly, should work like this
	}

	// TODO: implement dropdown nav option
	// } else if (mcConf.menuType == 'dropdown') {
	//	// will need to implement the dropdown logic
}

// signup submit
function signupSubmit(resp) {
	var frm = $('.lb_signup_form');
	var validated = true;
	var email = $('input[name="data[Contact][email]"]', frm).val();
	var emailReg = mcConf.emailRegex;
	$('input.required', frm).each(function(){
		if ($(this).val() == ''){validated = false;}
	});
	if (!emailReg.test(email) ) {validated = false;}
	if ( !validated ) {
		frm.trigger('resetCaptcha');
		alert('Please complete the form and enter all *required information. Thank you.'); return false;
	}
	$("input[name=submit]", frm).val("sending...").attr('disabled', 'disabled');
	if (typeof gtag === 'function') {
		gtag('event', 'submit', {
			'event_category': 'Subscribe'
		});
	}
	$.ajax({
		url: '/contacts/subscribe',
		data: frm.serialize(),
		type: 'POST',
		dataType: 'json',
		success: function(json) {
			alert(json.raw);
			$('input', frm).val('');
			$("input[name=submit]", frm).val("Submit").attr('disabled', false);
			$('.o_close').click();
			$(document).trigger('subscribe_submitted');
			frm.trigger('resetCaptcha');
		}
	});
	return false;
}

// login submit
function loginSubmit(resp) {
	var frm = $('#login_form');
	var msg = '';
	var validated = true;
	$('input.required', frm).each(function(){
		if ($(this).val() == ''){validated = false;}
	});
	if(!validated){msg += 'Please enter all *required information\n';}
	var email = $('input[name="data[Contact][email]"]', frm).val();
	var emailReg = mcConf.emailRegex;
	if (!emailReg.test(email) ) {msg = 'Please supply a valid email\n';validated = false;}

	if(frm.attr('action') == '/contacts/register') {
		if($('input[name="data[Contact][password]"]', frm).val() != $('input[name="data[Contact][confirm]"]', frm).val()) {
			msg += 'Passwords do not match. Please verify and continue.\n';validated = false;
		}
	}
	if ( !validated ) {
		frm.trigger('resetCaptcha');
		alert(msg); return false;
	}

	var submit_pretxt = $("input[name=submit]", frm).val();
	$("input[name=submit]", frm).val("sending...").attr('disabled', 'disabled');

	$.ajax({
		url: frm.attr('action'),
		data: frm.serialize(),
		type: 'POST',
		dataType: 'json',
		success: function(json) {
			if(json.redirect){
				document.location = json.redirect;
			}
			$("input[name=submit]", frm).val(submit_pretxt).attr('disabled', false);
			alert(json.raw);
			if(json.success && $('#login_form').attr('action') == '/contacts/login' && !json.redirect){
				$('.o_close').click();
				$('input[type="text"],input[type="password"]', frm).val('');
			}
			frm.trigger('resetCaptcha');
		}
	});
	return false;

}

// contact form submission
var contact_submitting = false;
function contactSubmit(resp) {
	if(contact_submitting === true){ return; }

	var emailReg = mcConf.emailRegex;
	var validated = true;

	var frm = $('.lb_contact_form');
	if(!frm){ frm = $('#contact_form'); }

	var dynamic_requires = $('input.required', frm);
	if(dynamic_requires.length > 0) {
		// if inputs have require classes - require those ones
		for(var i = 0; i < dynamic_requires.length; i++) {
			var input = dynamic_requires[i];
			if ($(input).val() == ''){validated = false;}
			if($(input).attr('name') == 'email') { // special case for "email"
				if (!emailReg.test($(input).val())) {validated = false;}
			}
		}
	} else {
		// otherwise, fallback to default requirements
		if($("input[name=name]", frm).val() == ''){validated = false;}
		if($("input[name=email]", frm).val() == ''){validated = false;}
		if($("textarea[name=comment]", frm).val() == ''){validated = false;}

		var email = $("input[name=email]", frm).val();
		if (!emailReg.test(email) ) {validated = false;}
	}

	if (!validated) {
		alert('Please complete the form and enter all *required information. Thank you.');
		frm.trigger('resetCaptcha');
		return false;
	}

	var preval = $("input[name=submit]", frm).val();
	$("input[name=submit]", frm).val("sending...");
	contact_submitting = true;
	if (typeof gtag === 'function') {
		gtag('event', 'submit', {
			'event_category': 'Contact'
		});
	}
	$.ajax({
		url: '/syndication/request_contact',
		data: frm.serialize(),
		type: 'POST',
		dataType: 'json',
		success: function(json) {
			$("input[name=submit]", frm).val("sent");
			alert(json.raw);
			setTimeout(function(){ $("input[name=submit]", frm).removeAttr('disabled').val("submit"); }, 1000);
			$('html').removeClass('noscroll');
			if($('#contact_overlay').hasClass('show')) {
				$('#contact_overlay').removeClass('show');
			} else {
				$('#contact_overlay').hide(1000);
			}
			contact_submitting = false;
			$('input[type=text], input[type=email]', frm).val("");
			$('textarea', frm).val("");
			$("input[name=submit]", frm).val(preval);
			frm.trigger('resetCaptcha');
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("input[name=submit]", frm).val("error");
			setTimeout(function(){ $("input[name=submit]", frm).removeAttr('disabled').val("submit"); }, 3000);
			contact_submitting = false;
			frm.trigger('resetCaptcha');
		}
	});
	return false;
}

function synRequest(resp) {
	var emailReg = mcConf.emailRegex;
	var validated = true;
	var frm = $('#syn_form');

	var dynamic_requires = $('input.required, select.required, textarea.required', frm);
	if(dynamic_requires.length > 0) {
		// if inputs have require classes - require those ones
		for(var i = 0; i < dynamic_requires.length; i++) {
			var input = dynamic_requires[i];
			if ($(input).val() == ''){validated = false; }
			if($(input).attr('name') == 'email') { // special case for "email"
				if (!emailReg.test($(input).val())) {validated = false; }
			}
		}
	} else {
		// otherwise, fallback to default requirements
		if($("input[name=name]", frm).val() == ''){validated = false;}
		if($("input[name=email]", frm).val() == ''){validated = false;}
		if($("input[name=company]", frm).val() == ''){validated = false;}
		if($("input[name=use]", frm).val() == ''){validated = false;}
		if($("textarea[name=comment]", frm).val() == ''){validated = false;}

		var email = $("input[name=email]", frm).val();
		if (!emailReg.test(email) ) {validated = false;}
	}

	if (!validated) {
		alert('Please complete the form and enter all *required information. Thank you.');
		frm.trigger('resetCaptcha');
		return false;
	}

	$("input[name=submit]", frm).val("sending...").attr('disabled', 'disabled');
	if (typeof gtag === 'function') {
		gtag('event', 'request portfolio', {
			'event_category': 'Contact'
		});
	}
	$.ajax({
		url: '/syndication/request_portfolio',
		data: frm.serialize(),
		type: 'POST',
		dataType: 'json',
		success: function(json) {
			$("input[name=submit]", frm).val("sent");
			alert(json.raw);
			setTimeout(function(){ $("input[name=submit]", frm).val("submit"); }, 1000);
			$('#syndication_overlay').hide(1000);
			$('input', frm).val("");
			$('textarea', frm).val("");
			$(document).trigger('sent.syn_request');
			frm.trigger('resetCaptcha');
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("input[name=submit]", frm).val("error");
			setTimeout(function(){ $("input[name=submit]", frm).val("submit"); }, 3000);
			frm.trigger('resetCaptcha');
		}
	});
	return false;
}

function shareSubmit(resp) {
	var validated = true;
	var frm = $('.lb_share_form');

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
	$.ajax({
		type:'POST',
		url:'/syndication/email_lightbox',
		data:frm.serialize(),
		dataType:'json',
		success:function (json) {
			$("input[name=submit]", frm).val("sent");
			if (mcConf.lightboxSuccessAlerts) {
            	alert(json.raw);
			}
			$(document).trigger('lightbox_sent');
			setTimeout(function(){ $("input[name=submit]", frm).removeAttr('disabled').val("submit"); }, 1000);
			if($('#share_overlay').hasClass('show')) {
				$('#share_overlay').removeClass('show');
			} else {
				$('#share_overlay').hide(1000);
			}
			frm.trigger('resetCaptcha');
			if (typeof gtag === 'function') {
				gtag('event', 'send email', {
					'event_category': 'Share'
				});
			}
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

function setupSearchForm(search_prefix) {
	$('#open_search_form').bind('click touchstart', function(e){
		e.preventDefault();
		$('#search_overlay').addClass('show');
		$('#search_form input').first().focus();
		$('html').addClass('noscroll');
	});

	// submit a search
	$('#search_form').submit(function(e){
		e.preventDefault();
		var q = $('#search_form input[name="q"]').val();
		if(q.length < 1) {
			alert('please enter a query');
		} else {
			document.location = search_prefix + q;
		}
		return false;
	});
}

var preloadImageQueue = new Array();
function preloadAllElementImages(container, size_override){
	if(typeof size_override == 'undefined'){ size_override = mcConf.lbAssetSize; }
	$(container).find('img[filename]').each(function(i) {
		if ($(this).attr('data-original') == true) {
			$(this).attr('size_override', 'origgif');
		} else {
			$(this).attr('size_override', size_override);
		}
		preloadImageQueue.push($(this));
	});
	processPreloadImageQueue();
}
function processPreloadImageQueue(){
	var count = 0;
	while(preloadImageQueue.length > 0) {
		if(++count > mcConf.preloadImageLimit){ break; }
		preloadTheImage(preloadImageQueue.shift());
	}
}
function preloadTheImage(image_selector) {
	var offscreen = new Image();
	var image_source = image_selector.attr('filename');
	if(image_source) {
		var size_override = image_selector.attr('size_override');
		if(image_selector.hasClass('video') || image_selector.attr('type') == 'video'){ size_override = 'lg'; }
		if(typeof size_override == 'undefined'){ size_override = mcConf.lbAssetSize; }
		var fileName = /[^_]+$/.exec(image_source);
		var storage_url = (image_selector.attr('data-baseurl') ? image_selector.attr('data-baseurl') : mcConf.assetStorageURL);
		var $imageURL =  storage_url+size_override+'_'+fileName;
	  	offscreen.onload = function(){
				image_selector.attr('src',$imageURL).removeAttr('filename').removeAttr('size_override').removeClass("loader");
				if(preloadImageQueue.length > 0) { preloadTheImage(preloadImageQueue.shift(), size_override); }
				$(document).trigger('core.imagePreloaded', image_selector);
				delete offscreen;
	  	}
	  	offscreen.onerror = function() {
				image_selector.attr('data-status', 'failed');
				if(preloadImageQueue.length > 0) { preloadTheImage(preloadImageQueue.shift(), size_override); }
				$(document).trigger('core.imagePreloaded', image_selector);
				delete offscreen;
	  	}
	  	offscreen.src = $imageURL;
	}
}

// setup video clip with a size

function loadVideoClipPrefix (container, size_override){
	if(typeof size_override == 'undefined'){ size_override = mcConf.lbClipSize; }
	$(container).find('.video_clip[data-filename]').each(function(i) {
		var t = $(this),
			video_source = t.data('filename'),
			prefix = size_override,
			fileName = /[^_]+$/.exec(video_source)[0],
			storage_url = t.data('baseurl') ? t.data('baseurl') : mcConf.assetStorageURL;
		// each prefix will only be created if the original video is large enough
		// this fallback selects the closest prefix if the one we want does not exist
		if (t.data('width') < mcConf.clipPrefixSizes[prefix].width) {
			for (var key in mcConf.clipPrefixSizes) {
				if (mcConf.clipPrefixSizes.hasOwnProperty(key)) {
					var size = mcConf.clipPrefixSizes[key];
					if (t.data('width') >= size.width) {
						prefix = key;
					} else {
						break;
					}
				}
			}
		}
		var videoURL =  storage_url+prefix+'_'+fileName,
			posterURL = storage_url+mcConf.clipPrefixSizes[prefix].poster+'_'+replaceFileExtension(fileName, 'jpg'),
			mp4 = replaceFileExtension(videoURL, 'mp4'),
			video,
			autoplay = t.data('autoplay') ? 'autoplay' : '';
		if (t.hasClass('poster-hidden')) {
			poster = '';
		}
		if (t.find('video').length) {
			video = t.find('video');
		} else {
			video = $('<video loop muted '+autoplay+' />').attr({
				'poster': posterURL,
				'autoplay': t.data('autoplay'),
				'data-width': t.data('width'),
				'data-height': t.data('height'),
				'data-ratio': t.data('width')/t.data('height')
			});
		}
		$('<source />').appendTo(video).attr({'type': 'video/mp4','src': mp4});
		if (!t.find('video').length) {
			t.append(video);
		}
		t.removeAttr('data-filename');
	});
}

function replaceFileExtension(filename, newExtension) {
	if (x = filename.lastIndexOf('.')) {
		filename = filename.substring(0, x + 1) + newExtension;
		return filename.toLowerCase();
	} else {
		return false;
	}
}

// screensaver
function screensaver() {
	// timeout on screensaver
	$.idleTimer(mcConf.idleWaitTime);

	// wait for a while to load the images in
	setTimeout(function(){
		preloadAllElementImages("#screensaver");
	}, (mcConf.idleWaitTime - 500));

	// show screensaver
	$(document).bind("idle.idleTimer", function(){
		resizeScreenSaver();
		$('#screensaver').css('display','block').animate({'opacity':'1.0'}, 500);
		if (homepage == true) {
			jwplayer(asset_id).pause();
		}
	});

	// hide screensaver
	$(document).bind("active.idleTimer", function(){
		$('#screensaver').animate({'opacity':'0'}, 500, function() {
			$(this).hide();
		});
		if (homepage == true) {
			jwplayer(asset_id).play();
		}
	});

	// setup home slideshow
	$('#screensaver .screens').cycle({
		fx: 'fade',
		timeout: 5000,
		delay: 3000,
		speed: 1000,
		containerResize: 0,
		fit: 0,
		slideResize: 0,
		cleartype: true,
		cleartypeNoBg: true
	});

	resizeScreenSaver();

	$(window).bind('resize',function() {
		resizeScreenSaver();
	});
}
// resize home slideshow and scale image appropriately
// only landscape images should be used
function resizeScreenSaver() {
	cropImages('#screensaver');
}

// function to resize the overlays
function resizeOverlay() {
	var oHeight = $('.overlay .o_content').height()/2;
	var oWidth = $('.overlay .o_content').width()/2;
	$('.o_content').css({'margin-left':-oWidth, 'margin-top':-oHeight});
}


$('.bgoptions a').bind('click',function(){
	if(this.id == "blackSwitcher"){
		$('.origselected').css('color','white');
		$('.n_portfolio ').css('color','white');
	}
	else {
		$('.origselected').css('color','black');
		$('.n_portfolio').css('color','black');
	}
});

mcConf.videoList = [];

function setupVideo(container) {

	$('.slideshow_video', container).each(function() {

		// check for videojs class
		if ($('.video-js', this).length) {
			if ($('.vjs-poster', this).length) {return; }

			// Check for video type (video, 3D, 360) There could be more as we start to build support for these.
			// Google just announced 180deg movies, so that could be another to add to the list later on.
			var videoID = $(this).attr('id');
			if ($('.video-js', this).attr('data-video-type') == '360') {

				var vid = 'video_'+videoID;
				var player = window.player = videojs(vid, {}, function() {
					window.addEventListener("resize", function () {
							var canvas = player.getChild('Canvas');
						if(canvas) canvas.handleResize();
					});
				});

				var videoElement = $(vid);
				var width = videoElement.offsetWidth;
				var height = videoElement.offsetHeight;
				player.width(width);
				player.height(height);

				player.panorama({
					clickAndDrag: true,
					autoMobileOrientation: true,
					callback: function () {
						$('#'+vid).removeClass('vjs-controls-disabled');
					}
				});

			} else {
				if (!$('.vjs-control-bar', this).length) {
					var vid = 'video_'+videoID;
					var player = videojs(vid, {
						controls: true,
						crossOrigin: 'anonymous',
						nativeControlsForTouch: true,
						plugins: {
							videoJsResolutionSwitcher: {
								ui: true,
								default: 1920,
								dynamicLabel: false
							}
						}
					});
					mcConf.videoList.push(player);
				}
			}
		} else {

			var slideshow_video = $(this);
			var video_url = slideshow_video.attr('rel');
			video_url = video_url.substr(0, video_url.lastIndexOf('.')) || video_url;
			var asset_id = slideshow_video.attr('id');
			var image_url = $('img', slideshow_video).attr('src');

			if (!$('#video_' + asset_id + '_wrapper').length && !$('#video_' + asset_id + '_video__wrapper').length) {
				$('#video_'+asset_id).hide();
				jwplayer('video_' + asset_id).setup({
					autostart: mcConf.videoAutostart,
					'levels' : [
						{file : video_url+'.mp4'}
					],
					image: image_url,
					stretching: mcConf.videoStretching,
					screencolor: mcConf.videoScreenColor,
					smoothing: true,
					width: mcConf.videoWidth,
					height: mcConf.videoHeight,
					repeat: mcConf.videoRepeat,
					mute: mcConf.videoMuted,
					'controlbar': mcConf.videoControlPosition,
					'controlbar.idlehide': mcConf.videoControlIdleHide,
					'controlbar.position': mcConf.videoControlPosition,
					'logo.file': mcConf.videoLogoFile,
					'logo.position': mcConf.videoLogoPosition,
					'logo.over': mcConf.videoLogoOver,
					'logo.out': mcConf.videoLogoOut,
					'logo.hide': mcConf.videoLogoHide,
					'modes' : [
						{type: 'flash', src: '/jwplayer/player.swf',config: {
							skin: mcConf.videoPlayerSkin
						}},
						{type: 'html5'}
					],
					'events': {
						'onPlay':   function(){$(document).trigger('onPlay.mcVideo', asset_id); },
						'onBuffer':   function(){$(document).trigger('onBuffer.mcVideo', asset_id); },

					}
				});
				$('#video_'+asset_id).show();
			}
		}
	});
}

function removeVideo(container) {
	if ($('.slideshow_video', container).length) {
		$('.slideshow_video', container).each( function() {
			var slideshow_video = $(this);
			var asset_id = slideshow_video.attr('id');
			// jwplayer
			if (($('#video_' + asset_id + '_wrapper').length || $('#video_' + asset_id + '_video_wrapper').length) && jwplayer('video_' + asset_id).getState()) {
				jwplayer('video_' + asset_id).remove();
			}
			// video.js
			if ($(this).find('.vjs-control-bar').length) {
				var player = videojs('#video_'+asset_id);
				player.pause();
			}
		});
	}
}

jQuery.fn.extend({
    mshow: function () {
        $(this).addClass('open').removeClass('closed');
        return this;
    },
    mhide: function () {
	    $(this).addClass('closed').removeClass('open');
        return this;
    }
});
var mcMenu = {

	 config : {
        navSlideSpeed : (mcConf.navSlideSpeed) ? mcConf.navSlideSpeed : 200,
        top_levels : '#n_top_list li.n_main'
    },

	init : function (config) {
		if (config && typeof(config) == 'object') {
        	$.extend(mcMenu.config, config);
        }
        //$(mcMenu.config.top_levels).mhide();
		//$(mcMenu.config.top_levels).mshow(); // having them hidden by default helps avoid a flash between render and this code running

		mcMenu.setup();
		if(mcConf.menuType == 'collapse'){mcMenu.collapse();}
		else if(mcConf.menuType == 'toggle'){mcMenu.toggle();}
		else if(mcConf.menuType == 'dropdown'){mcMenu.dropdown();}
		return false;
	},

	setup : function() {

		return false;
	},

	dropdown : function() {
		$('#n_backtomenu').addClass('closed');
		if(mcConf.is_content) {$('#n_top_list li.n_main').find(' > ul.contents_list').mhide();}
		// toggle the parent elements
		$('#n_top_list li.n_main.container > a').click(function (e){
			e.stopPropagation(); // prevent bubbling on element
			e.preventDefault();
			var sublist = $(this).parent().find(' > ul.contents_list');
			if(sublist.hasClass('open')){
				sublist.mhide();
				$('body').unbind('click');
			} else {
				sublist.mshow();
			}
		});
		// body click
		$('html').bind('click',function(){
			if ($('#n_top_list ul.contents_list').hasClass('open')){
				$('#n_top_list ul.contents_list').mhide();
			}
		});

		return false;
	},

	toggle : function () {

		$('#n_backtomenu').addClass('closed'); // hide the back to menu link
		// TODO: only output the backtomenu if menuType=collapse

		// on the main studio container links, capture click and toggle submenu
		$('#n_top_list li.n_main.container > a').click(function (e){
			if($(this).parent().hasClass('external')){return;}
			var sublist = $(this).parent().find('>ul.contents_list');
			if (sublist && $(sublist).find('li').length) {
				e.preventDefault();

				if(mcMenu.toggle_custom && typeof mcMenu.toggle_custom == 'function') { if(!mcMenu.toggle_custom(this)) { return; } }

				if($(this).attr('data-link')){location.href = $(this).attr('href')+$(this).attr('data-link');return;}

				if($(this).hasClass('sel')) {
					$(this).removeClass('sel');
					$(this).parent().find('>ul.contents_list').mhide();

				} else {
					if($(this).parent().hasClass('level_1')) {
						$(mcMenu.config.top_levels).find('ul.contents_list.open').mhide();
						$('#n_top_list li.n_main.container > a').removeClass('sel');
					}

					$(this).addClass('sel');

					if(sublist.hasClass('open')){ sublist.mhide(); } else { sublist.mshow(); }
				}
			}
		});

		return false;
	},

	collapse : function () {

		if(mcConf.is_lightbox) {$(mcMenu.config.top_levels).mhide();$('#n_backtomenu').mshow();}
		$('#n_top_list li.n_main.container > a').bind('click', mcMenu.navClick);
		$('#n_backtomenu').bind('click', mcMenu.backToMenuClick);
		$('#n_backtocurrent').bind('click', mcMenu.backToCurrentClick);
		$('.sub_page a.sel').parent().mshow().parent().mshow();

		if($(mcMenu.config.top_levels).find('a.active').length > 0) { // if we have open entries
			mcMenu.backToMenuClick(); // reset menu
			if($(mcMenu.config.top_levels).mhide().find('a.active').last().parents('.n_sub').length) {
				mcMenu.backToCurrentClick(); // click active sub-leaf
			} else {
				// click along into containers
				$(mcMenu.config.top_levels).mhide().find('a.active').each(function(){$(this).trigger('click');});
			}

		} else {
			// set the back to menu hide by default
			if(!mcConf.is_lightbox) {
				$('#n_backtomenu').mhide();
			}
		}
		if(mcConf.menu_show_artist_only && ($('.n_main.artist > a.active').length || mcConf.is_content)) {
			$('li.level_1:not(.artist)>a.sel').mhide();
		}

		$(document).trigger('mcMenu.collapse');
		return false;
	},

	navClick : function (e) {

		if($(this).parent().hasClass('external')){return;}
		e.preventDefault();
		if($(this).attr('data-link')){location.href = $(this).attr('href')+$(this).attr('data-link');return;}

		$(document).trigger('mcMenu.navClick', [this]);

		if ($(this).hasClass('sel')) {
			// clicked an open container - is the the last open one? if so leave it because it should already be showing it's stuff
			if($(this).parent().find('li.n_main > a.sel').length > 0) {
				// not the last open container - close their children
				$(this).parent().find('li > a').removeClass('sel'); // clear sub sel classes
				$(this).parent().find('li.n_main > ul.contents_list').mhide(); // close open subcontainers
				$(this).parent().find('li').mshow(); // show all the list items for this container
				$(this).parent().mhide(); // hide then slide the current list
			}
		} else {
			// clicked on something we want to open
			mcMenu.closeContainers();
			mcMenu.openChildren(this);
			//$('#n_top_list').find('ul.contents_list').mhide(); // close open subcontainers
			if($('.n_main.artist > a.active').length > 1 && mcConf.menu_show_artist_only){$('.level_1:not(.n_blog)>a.sel').mhide();}
			//$(this).parent().parent().find('> li').mhide();
			//$(this).parent().mshow().find('> ul').mshow().find('li').mshow().find('a').mshow();
			$('#n_backtomenu').mshow();

		}
		return false;
	},

	backToMenuClick : function () {
		$('#n_top_list a').removeClass('sel').mshow();
		$('#n_top_list .n_main').mhide();
		$('#n_top_list > .n_main').mshow();
		$('#n_top_list ul.contents_list').mhide();
		$('#n_top_list .n_sub').mhide();
		$('#nav .menu_hide').mhide();
		$('#nav_top').mhide();
		$(this).mhide();
		if(mcConf.is_content) { $('#n_backtocurrent').mshow(); }
		$('body').removeClass('no_cover');

		$(document).trigger('mcMenu.backToMenuClick');
		return false;
	},

	backToCurrentClick : function () {

		mcMenu.backToMenuClick();
		$('#n_backtocurrent').mhide(); // hide the return button
		$('#n_backtomenu').mshow(); // show the menu button
		$('#nav .menu_hide').mshow(); // show the controls
		$('#n_top_list ul.contents_list.active').last().find('li').mshow(); // and show the last open header & list

		$(mcMenu.config.top_levels).mhide().each(function (){ // hide all n_main's too
			if($('a', this).hasClass('active')){ // but open the selected ones
				$(this).mshow(); // show the li
				$('> a', this).addClass('sel'); // sel the artist name
				$('ul.contents_list.active', this).mshow(); // show active contents

				$(document).trigger('mcMenu.backToCurrentClick.top_level', [this]);

				if(mcConf.is_content && mcConf.menu_show_artist_only) {
					$('li.level_1>a.sel').mhide();
				}
			}
		});

		return false;
	},

	resetNav : function () {

		mcMenu.setup();
		if(mcConf.menuType == 'collapse'){mcMenu.collapse();}

		return false;
	},

	closeContainers : function () {

		$('li.n_main').each(function (){ // hide all containers
			$(this).mhide(); // hide
			$(this).find('a').mhide(); // hide the anchor tags
			$(this).find('ul').mhide(); // hide the contents list
		});


	},

	openChildren : function (item) {
		$(item).addClass('sel').mshow();
		$(item).parents('li,ul,a').mshow();
		//$(this).parent()
		var container = $(item).parent();
		//container.mshow();
		var contents = container.find('>ul');
		contents.mshow().find('li').mshow().find('a').mshow();
	}
}

var mcForms = {


}

// cropping images for any image that is being passed in within a container
// pass in the item container and the function will do the rest
function cropImages(e){
	$(e).each(function() {
		var item = $(this);
		$('img, video', item).each( function() {
			var _imgW, _imgH;
			var img = $(this);
			if (typeof img.attr('filename') == 'undefined') { // if the image has been loaded..
				_imgW = img.width();  // get the w/h from
				_imgH = img.height(); // the actual element
			}
			if ($(this).is('video') && img.get(0).readyState < 4) {
				_imgW = img.attr('data-width');
				_imgH = img.attr('data-height');
			}
			if(!_imgW || !_imgH) { // failing that, get dim from the actual images..
				_imgW = img.attr('imgw'); // get it from the database-
				_imgH = img.attr('imgh'); // -supplied attributes
			}

			var _imgRatio = _imgW/_imgH;
			var _itemW = item.width();
			var _itemH = item.height();
			var _itemRatio = _itemW/_itemH;
			if (_imgRatio >= _itemRatio){
				img.removeClass('portrait');
				img.addClass('landscape');
				var new_width = _itemH*_imgRatio;
				var margin;
				if (!!img.attr('data-focus-x') && img.attr('data-focus-x') >= 0) {
					margin = Math.ceil(_itemW/2 - img.attr('data-focus-x')*new_width);
					if (margin >= 0 ) {margin = 0; }
					if (margin < _itemW - new_width) {margin = _itemW - new_width; }
				} else {
					margin = Math.ceil((_itemW - new_width)/2);
				}
				img.css({'margin-left':margin+'px', 'margin-top': 0});
			} else {
				img.removeClass('landscape');
				img.addClass('portrait');
				var new_height = _itemW/_imgRatio;
				var margin;
				if (!!img.attr('data-focus-y') && img.attr('data-focus-y') >= 0) {
					margin = Math.ceil(_itemH/2 - img.attr('data-focus-y')*new_height);
					if (margin > 0 ) {margin = 0; }
					if (margin < _itemH - new_height) {margin = _itemH - new_height; }
				} else {
					margin = Math.ceil((_itemH - new_height)/2);
				}
				img.css({'margin-top':margin+'px', 'margin-left': 0});
			}
		});
	});
}

// fill the slideshow area with the images
// they will fit vertically and horizontally to fill the required space
function fillImages(e){
	$(e).each(function() {
		var _el;
		if ($('video', this).length) {
			_el = 'video';
		} else {
			_el = 'img';
		}
		var imageWidth = $(_el, this).attr('width');
		var imageHeight = $(_el, this).attr('height');
		if(!imageWidth){ return; }

		var winWidth = $(this).width();
		var winHeight = $(this).height();

		var picHeight = imageHeight / imageWidth;
		var picWidth = imageWidth / imageHeight;
		if ((winHeight / winWidth) < picHeight) {
			$(_el, this).attr("width",winWidth);
			$(_el, this).attr("height",picHeight*winWidth);
		} else {
			$(_el, this).attr("height",winHeight);
			$(_el, this).attr("width",picWidth*winHeight);
		};

		$(_el, this).css("margin-left",(winWidth-$('img', this).attr('width'))/2);
		$(_el, this).css("margin-top",(winHeight-$('img', this).attr('height'))/2);

	});
}
// fit the images within the area
function fitImages(e){
	$(e).each(function() {
		var _el;
		if ($('video', this).length) {
			_el = 'video';
		} else {
			_el = 'img';
		}
		var imgRatio = $(_el, this).attr('data-ratio');
		var itemRatio = $(this).width()/$(this).height();
		if (imgRatio > itemRatio) {
			$(_el, this).addClass('landscape-fit').removeClass('portrait-fit');
		} else {
			$(_el, this).addClass('portrait-fit').removeClass('landscape-fit');
		}
	});
}
if($.Isotope) {

	// Modified Isotope methods for gutters in masonry
	$.Isotope.prototype._getMasonryGutterColumns = function() {
		var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
		containerWidth = this.element.width();

		this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
		// Or use the size of the first item
		this.$filteredAtoms.outerWidth(true) ||
		// If there's no items, use size of container
		containerWidth;

		this.masonry.columnWidth += gutter;

		this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
		this.masonry.cols = Math.max(this.masonry.cols, 1);
	};

	$.Isotope.prototype._masonryReset = function() {
		// Layout-specific props
		this.masonry = {};
		// FIXME shouldn't have to call this again
		this._getMasonryGutterColumns();
		var i = this.masonry.cols;
		this.masonry.colYs = [];
		while (i--) {
			this.masonry.colYs.push(0);
		}
	};

	$.Isotope.prototype._masonryResizeChanged = function() {
		var prevSegments = this.masonry.cols;
		// Update cols/rows
		this._getMasonryGutterColumns();
		// Return if updated cols/rows is not equal to previous
		return (this.masonry.cols !== prevSegments);
	};

	$.Isotope.prototype._masonryReset = function() {
		// Layout-specific props
		this.masonry = {};
		// FIXME shouldn't have to call this again
		this._getMasonryGutterColumns();
		var i = this.masonry.cols;
		this.masonry.colYs = [];
		while (i--) {
			this.masonry.colYs.push(0);
		}
	};

}

// uses alternative colour for spreads
function additionalSpreadColor(container, size_override) {
	$(container).each(function(){
		if(typeof size_override == 'undefined'){ size_override = mcConf.lbAssetSize; }
		$(this).find('img[filename]').each(function(i) {
			$(this).attr('size_override', size_override);
		});
		if ($(this).find('img').hasClass('alt_spread')) {
			preloadAllElementImages(this, size_override+'_'+mcConf.alternateSpreadColor);
		} else {
			preloadAllElementImages(this, size_override);
		}
	});
}

// removes url uuid
function removeUrlUuid() {
	var new_url = document.location.pathname.split('/');
	var patt = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
	var prev_asset = new_url.pop();
	if(!patt.test(prev_asset)){
		new_url.push(prev_asset); // put it back - its not a uuid
	}
	new_url = new_url.join('/');
	return new_url;
}

// resets url
function resetUrl(new_url) {
	if (history.pushState) {
		window.history.pushState('', document.title, new_url);
	}
}

// autoplay videoclips in Safari again
$(window).on('load', function(){
	$('video').each(function(){
		if ($(this).attr('autoplay') && ($(this).attr('autoplay') == 'autoplay' || $(this).attr('autoplay') == 'true')) {
			var promise = $(this)[0].play();
			if (promise !== undefined) {
				promise.then(function() {

				}).catch(function() {

				});
			}
		}
	});
});

function stripUUIDs(url) {
	var pattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
	var parts = url.split("/");
	var new_url = [];
	for (var i=0; i < parts.length; i++) {
		if(!pattern.test(parts[i])) {
			new_url.push(parts[i]);
		}
	}
	return new_url.join('/');
}

// video play / pause in viewport
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],n):n(e.jQuery)}(this,function(e){"use strict";function n(n){var t=this;if(1===arguments.length&&"function"==typeof n&&(n=[n]),!(n instanceof Array))throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");return n.forEach(function(n){"function"!=typeof n?(console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"),console.warn("isInViewport: Ignoring non-function values in array and moving on")):[].slice.call(t).forEach(function(t){return n.call(e(t))})}),this}function t(n){var t=e("<div></div>").css({width:"100%"});n.append(t);var o=n.width()-t.width();return t.remove(),o}function o(n,r){var i=n.getBoundingClientRect(),a=i.top,u=i.bottom,c=i.left,f=i.right,s=e.extend({tolerance:0,viewport:window},r),d=!1,l=s.viewport.jquery?s.viewport:e(s.viewport);l.length||(console.warn("isInViewport: The viewport selector you have provided matches no element on page."),console.warn("isInViewport: Defaulting to viewport as window"),l=e(window));var p=l.height(),w=l.width(),h=l[0].toString();if(l[0]!==window&&"[object Window]"!==h&&"[object DOMWindow]"!==h){var v=l[0].getBoundingClientRect();a-=v.top,u-=v.top,c-=v.left,f-=v.left,o.scrollBarWidth=o.scrollBarWidth||t(l),w-=o.scrollBarWidth}return s.tolerance=~~Math.round(parseFloat(s.tolerance)),s.tolerance<0&&(s.tolerance=p+s.tolerance),f<=0||c>=w?d:d=s.tolerance?a<=s.tolerance&&u>=s.tolerance:u>0&&a<=p}function r(n){if(n){var t=n.split(",");return 1===t.length&&isNaN(t[0])&&(t[1]=t[0],t[0]=void 0),{tolerance:t[0]?t[0].trim():void 0,viewport:t[1]?e(t[1].trim()):void 0}}return{}}e=e&&e.hasOwnProperty("default")?e.default:e,
/**
 * @author  Mudit Ameta
 * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
 */
e.extend(e.expr.pseudos||e.expr[":"],{"in-viewport":e.expr.createPseudo?e.expr.createPseudo(function(e){return function(n){return o(n,r(e))}}):function(e,n,t){return o(e,r(t[3]))}}),e.fn.isInViewport=function(e){return this.filter(function(n,t){return o(t,e)})},e.fn.run=n});


$(window).scroll(function() {
	$('video').each(function(){
		if ($(this).is('[autoplay]')) {
			if ($(this).is(":in-viewport(0)")) {
				$(this).removeClass('paused');
				$(this)[0].play()
			} else {
				$(this).addClass('paused');
				$(this)[0].pause();
			}
		}
	});
});


function pauseAllVideoClips() {
	$('video').each(function(){
		if ($(this).is('[autoplay]')) {
			if ($(this).hasClass('paused')) {
				$(this)[0].pause();
			} else {
				$(this).addClass('paused');
				$(this)[0].pause();
			}
		}
	});
}

function resumeAllVideoClips() {
	$('video').each(function(){
		if ($(this).is('[autoplay]')) {
			if ($(this).is(":in-viewport(0)")) {
				$(this).removeClass('paused');
				$(this)[0].play();
			}
		}
	});
}
