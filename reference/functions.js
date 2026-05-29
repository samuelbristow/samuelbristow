$.extend(mcConf,{
	browserHistoryState : true,
});

var idleTimer = null;
var idleState = false;
var idleWait = 4000;


/* site specific functions */
$(document).ready(function() {

	$('.mobile-nav').on('click', function(){
		$('html').toggleClass('show-menu');
	});

	$(window).bind('scroll', toggleNav);
	$('.site-header').on('mouseover', function() {
		$('html').addClass('show-desktop-menu');
	}).on('mouseout', function(){
		$('html').removeClass('show-desktop-menu');
	});

	setupOverlays();

	if (!$('body').hasClass('portfolio_detail')) {
		idleTime();
	}
});


function idleTime() {
	$('*').bind('mousemove keydown scroll', function () {
		clearTimeout(idleTimer);
		if (idleState == true) {
			$('html').removeClass('scrolling');
		}
		idleState = false;
		idleTimer = setTimeout(function () {
			$('html').addClass('scrolling');
			idleState = true;
		}, idleWait);
	});
	$("body").trigger("mousemove");
}

function toggleNav() {
	var scroll_top = $(window).scrollTop();
	if (scroll_top > 60) {
		$('html').addClass('scrolling');
	} else {
		$('html').removeClass('scrolling');
	}
}

function splash() {
	$('html').animate({scrollTop: 0}, 100);
	$('.n_news').addClass('active');
	var splash = $.cookie('splash');
	if (splash) {
		$('body').addClass('no-splash');
	} else {
		$('body').addClass('splash');
		var imgH = $('.blog-list li:first-child').height() + 68;
		setTimeout(function() {
			showit($('.splash-img').css({opacity:0}).eq(0));
			$('#splash .logo').delay(3500).animate({'opacity':1}, 1000);
		}, 500);
		setTimeout(function(){
			hideit($('.splash-img').css({opacity:1}).eq(0));
		}, 3850);
		setTimeout(function() {
			$('.splash-images').css({'height': imgH});
			$('#splash').addClass('move-into');
			if (mcConf.mobile == false) {
				$('#splash .logo').css({'top': imgH/2});
			} else {
				$('#splash .logo').css({'top': (imgH/2)+66});
			}
		}, 4500);
		setTimeout(function(){
			$('body').removeClass('splash').addClass('no-splash');
			$.cookie('splash', 'true', {expires: 0.5});
		}, 6000);
	}
}

function checkNewsHash() {
	if (window.location.hash) {
		var url = window.location.hash.slice(1);
		var template = 'news';
		if(url.includes('?')){
			template = 'slideshow'
		}
		openNews(url, template);
	}
}

function showit(item){
    item.delay(50).animate({opacity:1}, 150, function(){
        showit(item.next('.splash-img'));
    });
}
function hideit(item){
    item.delay(1).animate({opacity:0}, 50, function(){
        hideit(item.next('.splash-img'));
    });
}

var pfx = ["webkit", "moz", "ms", "o", ""];
function RunPrefixMethod(obj, method) {
	var p = 0, m, t;
	while (p < pfx.length && !obj[m]) {
		m = method;
		if (pfx[p] == "") {
			m = m.substr(0,1).toLowerCase() + m.substr(1);
		}
		m = pfx[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			pfx = [pfx[p]];
			return (t == "function" ? obj[m]() : obj[m]);
		}
		p++;
	}
}

function isSafari() {
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		return true;
	}
	return false;
}

function setColors(background, text) {
	let css = {};
	if (background) {
		css['backgroundColor'] = background;
	}
	if (text) {
		css['color'] = text;
	}
	$('body').css(css);
}

function setupNewsOverlay(){
	$('body').on('click', '.modal', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var template = 'news';
		if(url.includes('?')){
			var template = 'slideshow'
		}
		openNews(url, template);
		return false;
	});
	$('#newsOverlay .close').on('click', closeNews);
	$('#newsSlideshowOverlay .close').on('click', closeNews);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			closeNews();
		}
	});
}

function closeNews() {
	pauseVideos();
	$('.overlay.show').removeClass('show');
	$('html').removeClass('noscroll');
	if ("pushState" in history) {
		history.pushState("", document.title, window.location.pathname);
	} else {
		window.location.hash = '';
	}
	mcConf.masonryPreload = true; // resume default sizing
	$(window).trigger('resize');
}

function pauseVideos() {
	if (mcConf.videoList.length) {
		for (i=0; i < mcConf.videoList.length; i++) {
			var player = mcConf.videoList[i];
			if (!player.paused()) {
				player.pause();
			}
		}
	}
}

function openNews(url, template) {
	$('html').addClass('noscroll');

	if (template == 'slideshow') {
		$.ajax({
			url: url,
			type: "GET",
			success: function(response){
				var data = JSON.parse(response);
				var template = $.templates('#newsSlideshowTmpl');
				data['assets'].shift();
				var html = template.render(data['assets']);

				// set hash
				var curr = document.location.pathname.split("/").filter(function(n){ return n != "" });
				var dest = url.split("/").filter(function(n){ return n != "" });
				var hash = dest.slice(curr.length).join('/');
				document.location.hash = hash;

				// Update overlay
				$('#newsSlideshowAssets').attr('data-url', url);
				$('#newsSlideshowAssets .slideshow').append(html);
				$('#newsSlideshowOverlay #thumbs').append(html);
				$('#newsSlideshowOverlay h2 strong').html(data['content_name']);
				$('#newsSlideshowOverlay .ss-pagination .ss-total').html(data.assets.length);

				if (data['content_summary'] === '') {
					$('#newsSlideshowOverlay .download-pdf').hide();
				} else {
					var pdf = data['content_summary'].replace(/(<p>|<\/p>)/g, "");
					$('#newsSlideshowOverlay .download-pdf').attr('href', pdf);
				}

				// show
				$(document).bind('onAfter', function(e, curr, next, opts) {
					var title = $('.description_hidden', next).html();
					$('.ss-title').html(title);
					$('#ss-current').text(opts.currSlide + 1);
					// updateURL('li.current', {currSlide: $('li.current').index()});
				});

				lbSlideshow('p', {
					'speed': mcConf.slideshowSpeed
				});

				resizeVideo('.p_slideshow');
				$(window).on('resize', function(){
					resizeVideo('.p_slideshow');
				});
				$('.close-portfolio').on('click', function(e){
					e.preventDefault();
					document.location.hash = '';
					$('html').removeClass('noscroll');
					$('.overlay.show').removeClass('show');
					return false;
				});
				setupVideo();
				setupThumbnails();
				setupFullscreen();
				preloadAllElementImages('#newsSlideshowAssets');
				$('#newsSlideshowOverlay').addClass('show');
				$(window).trigger('resize');
			},
		});
	} else {
		$.ajax({
			url: url,
			type: "GET",
			success: function(response){
				var data = JSON.parse(response);
				var template = $.templates('#newsTmpl');
				var html = template.render(data['assets']);

				// set hash
				var curr = document.location.pathname.split("/").filter(function(n){ return n != "" });
				var dest = url.split("/").filter(function(n){ return n != "" });
				var hash = dest.slice(curr.length).join('/');
				document.location.hash = hash;

				// Update overlay
				$('#newsAssets').attr('data-url', url);
				if ($('#newsAssets .masonry').data('isotope')) {
					$('#newsAssets .masonry').isotope('destroy').removeData('masonry-config');
				}
				$('#newsAssets .masonry').find('.m_item:not(.news_title)').remove();
				$('#newsAssets .masonry').append(html);
				$('#newsAssets h2').html(data['content_name']);
				$('#newsAssets .news-description').html(data['content_description']);
				$('#newsOverlay').data('text-color', data['text_color']);
				$('#newsOverlay').data('background-color', data['background_color']);
				$('#newsAssets .news-artists').html(data['artists']);

				// show
				$('#newsOverlay').addClass('show');
				newsDetailPage();
			},
		});
	}

	return false;
}

function setupOverlays() {
	// opening overlay
	$('.overlay-link').bind('click', function(e) {
		e.preventDefault();
		if($('body').hasClass('fullscreen')) {
			closeFullscreen();
		}
		$('.overlay.'+$(this).attr('data-overlay')).addClass('show').find('[tabindex="1"]').focus();
		$('html, body, #wrapper').addClass('noscroll');
		return false;
	});

	// closing overlay
	$('.o_close, .overlay .cancel').unbind('click').bind('click', function(e) {
		e.preventDefault();
		$('.overlay').removeClass('show');
		$('html, body, #wrapper').removeClass('noscroll');
		return false;
	});
	$(document).bind('lightbox_sent subscribe_submitted', function() {
		$('.overlay').removeClass('show');
		$('html, body, #wrapper').removeClass('noscroll');
	});

	// focus effect on the field labels for the overlay forms
	$('.overlay input, .overlay textarea').bind('focus', function(evt) {
		$(this).parent().addClass('sel');
	});
	$('.overlay input, .overlay textarea').bind('blur', function(evt) {
		$(this).parent().removeClass('sel');
	});
}

function publicationsPage() {
	$('.n_publications').addClass('active');
}

function divisionPage() {
	preloadAllElementImages('.masonry', 'lg');
	preloadAllElementImages('.division-artists',);

	$('.categories-list a').bind('click', function(e) {
		e.preventDefault;
		if ($(this).hasClass('sel')) {
			$('.categories-list a').removeClass('sel');
			mcConf.currentCatFilter = '*';
		} else {
			$('.categories-list a').removeClass('sel');
			$(this).addClass('sel');
			mcConf.currentCatFilter = $(this).data('slug');
		}
		filterMasonry(mcConf.currentCatFilter);
		return false;
	});

	if (window.location.hash) {
		mcConf.currentCatFilter = window.location.hash.slice(1);
		filterMasonry(mcConf.currentCatFilter);
		$('.categories-list a.'+mcConf.currentCatFilter).addClass('sel');
	}

	$('.division-artists .artist-link').hover(function(){
		$('.division-artists .artist-link').addClass('disabled');
		$(this).removeClass('disabled');
	}, function(){
		$('.division-artists .artist-link').removeClass('disabled');
	});

	//
	$('.division-artists h4:not(.disabled)').on('hover', function(){
		var width = $(window).width()/2;
		var posLeft = $(this).offset().left;
		if (posLeft > width) {
			$('img', this).addClass('left');
		} else {
			$('img', this).removeClass('left');
		}
	});

}

function filterMasonry(filter) {
	if (filter == '*') {
		$(mcConf.masonryItem).removeClass('disabled');
		$('.artist-link').removeClass('disabled');
		window.location.hash = '';
	} else {
		$(mcConf.masonryItem).addClass('disabled');
		$(mcConf.masonryItem+'.'+filter).removeClass('disabled');
		$('.artist-link').addClass('disabled');
		$('.artist-link.'+filter).removeClass('disabled');
		window.location.hash = filter;
	}
}

function artistPage() {
	$('.n_artists').addClass('active');
	preloadAllElementImages('#portfolios','lg');
	preloadAllElementImages('#archive','lg');
	preloadAllElementImages('.artist-cover-image');

	$('.artist-nav a, .artist-cover-name').on('click', function(e){
		e.preventDefault();
		var el = $(this).attr('href');
		$('html, body').stop().animate({
			scrollTop: $(el).offset().top
		}, 500);
		return false;
	});

	$('#archive .masonry').Mosaic({
		innerGap: 60,
		maxRowHeight: 400,
		maxRowHeightPolicy: 'crop'
	});

}

function openMail(_email) {
	var location = atob(_email);
	window.location = 'mailto:' + location;
}

// portfolio functions

function portfolioDetailCustom(starting_index, show_thumbnails) {
	if (show_thumbnails) {
		if ($('#slideshow > .assettype2').length == $('#slideshow > li').length) {
			// slideshow only contains videos, so hide the slideshow lightbox link
			$('#ss_lightbox_link').hide();
		}
		// hide lightbox links on thumbnails for videos
		$('.assettype2 .m_lightbox_links').hide();
		setupLightboxThumbnails();
		$('body').addClass('show-thumbnails');
		$('.slideshow_title').hide();
		setupThumbnails();
	}
	$('body').removeClass('portfolio').addClass('portfolio_detail');

	setupSlideshow(starting_index);

	$('#thumbnails-link').bind('click', function() {
		setupThumbnails();
		$('body').addClass('show-thumbnails');
		$(window).trigger('resize');
		$('.slideshow_title').hide();
		$('#thumbs li video').each(function(){
			$(this).get(0).play();
		});
		setupLightboxThumbnails();
		pauseVideos();
		return false;
	});

	if (mcConf.mobile == false) {
		setupFullscreen();
	}
}

function setupLightboxThumbnails() {
	// set thumbnail lightbox link states
	$('.p_slideshow li').each(function(){
		var asset = $(this).attr('asset');
		if ($(this).attr('rel') == 'lb_remove') {
			$('.ss_lightbox_link', '#thumb-'+asset).removeClass('lb_add').addClass('lb_remove');
			$('.ss_lightbox_link', '#item-'+asset).removeClass('lb_add').addClass('lb_remove');
		} else {
			$('.ss_lightbox_link', '#thumb-'+asset).removeClass('lb_remove').addClass('lb_add');
			$('.ss_lightbox_link', '#item-'+asset).removeClass('lb_remove').addClass('lb_add');
		}
	});
}

function portfolioDetailList() {
	$('body').removeClass('portfolio').addClass('portfolio_detail');
	newsDetailPage();
	// set lightbox link states
	$('.masonry li').each(function(){

		var asset = $('.ss_lightbox_link', this).attr('asset');

		$('.ss_lightbox_link', this).on('click', function(e){
			e.preventDefault();
			var asset = $(this).attr('asset');
			var content = $(this).attr('content');
			if($(this).hasClass('lb_remove')) {
				$.getJSON('/syndication/remove_from_lightbox/' + asset, function(data) {
					if (data.success) {
						//
					} else {
						alert('Could not remove image from ' + mcConf.lb_label);
					}
				});
				$(this).removeClass('lb_remove').addClass('lb_add');
				$('#item-'+asset).attr('rel', 'lb_add');
			} else {
				$.getJSON('/syndication/add_to_lightbox/' + asset + '/' + content, function(data) {
					if (data.success) {
						//
					} else {
						alert('Could not add image to '+ mcConf.lb_label);
					}
				});
				$(this).removeClass('lb_add').addClass('lb_remove');
				$('#item-'+asset).attr('rel', 'lb_remove');
			}
			return false;
		});


		if ($(this).attr('rel') == 'lb_remove') {
			$('.ss_lightbox_link', '#item-'+asset).removeClass('lb_add').addClass('lb_remove');
		} else {
			$('.ss_lightbox_link', '#item-'+asset).removeClass('lb_remove').addClass('lb_add');
		}
	});

	setupVideo();
	resizeVideo('.m_item');
	$(window).on('resize', function(){
		resizeVideo('.p_slideshow');
	});
	setupFullscreen();
	$('.close-portfolio').on('click', function(e){
		e.preventDefault();
		window.history.go(-1);
		return false;
	});
}

function setupSlideshow(starting_index) {
	var level = $('#full').data('level');
	$(document).bind('onAfter', function(e, curr, next, opts) {
		if (!mcConf.is_lightbox) {
			if ($('li.current').attr('rel') == 'lb_add') {
				$('#ss_lightbox_link').removeClass('lb_remove').addClass('lb_add');
			} else {
				$('#ss_lightbox_link').removeClass('lb_add').addClass('lb_remove');
			}
		}
		var title = $(next).attr('title');
		if (title == null && level >= 5) {
			$('.slideshow_content').show();
		} else if (title != null && level >= 5) {
			$('.slideshow_content').hide();
		}
		$(mcConf.slideshowTitle).text(title);
		$('#ss-current').text(opts.currSlide + 1);
		updateURL('li.current', {currSlide: $('li.current').index()});
	});

	lbSlideshow('p', {
		'speed': mcConf.slideshowSpeed,
		'starting_index': starting_index
	});

	$('#ss_lightbox_link').on('click', function(){
		var asset = $('.p_slideshow li.current').attr('asset');
		if ($('.p_slideshow li.current').attr('rel') == 'lb_remove') {
			$('#thumb-'+asset+' .ss_lightbox_link').removeClass('lb_remove').addClass('lb_add');
		} else {
			$('#thumb-'+asset+' .ss_lightbox_link').removeClass('lb_add').addClass('lb_remove');
		}
	});

	$(window).on('resize', function(){
		resizeVideo('.p_slideshow');
	});
}

function resizeVideo(container) {
	$(container).each(function() {
		if (container == '#newsDetailMasonry') {
			var width = $('.m_item_image', this).width() || $(window).width() - 112;
			var height = $('.m_item_image', this).height() || $(window).height() - 252;
		} else {
			var width = $(this).width() || $(window).width() - 112;
			var height = $(this).height() || $(window).height() - 252;
		}
		$(this).find('.m_item.video, .slideshow_image.video').each(function() {
			var video = $(this).find('video');
			var maxWidth = video.data('width');
			var maxHeight = video.data('height');
			var videoRatio = maxWidth/maxHeight;
			var videoWidth;
			var videoHeight;
			if (videoRatio > width/height) {
				videoWidth = width > maxWidth ? maxWidth : width;
				videoHeight = videoWidth/videoRatio;
			} else {
				videoHeight = height > maxHeight ? maxHeight : height;
				videoWidth = videoRatio * videoHeight;
			}
			$(this).width(videoWidth).height(videoHeight);
		});
	});
}


function setupThumbnails(motion) {
	preloadAllElementImages('#thumbs', 'lg');

	$('#thumbs').Mosaic({
		innerGap: 60,
		maxRowHeight: 300,
		maxRowHeightPolicy: 'crop'
	});

	$('#slideshow-link').bind('click', function() {
		$('body').removeClass('show-thumbnails');
		$(window).trigger('resize');
		$('#thumbs li video').each(function(){
			$(this).get(0).pause();
		});
		$('.slideshow_title').show();
	});

	$('#thumbs li').bind('click', function() {
		var slide = parseInt($(this).data('index'));
		$('#slideshow').cycle(slide);
		$('body').removeClass('show-thumbnails');
		$(window).trigger('resize');
		$('.slideshow_title').show();
	});

	$('#thumbs li .ss_lightbox_link').on('click', function(e){
		e.preventDefault();
		var asset = $(this).attr('asset');
		var content = $(this).attr('content');
		if($(this).hasClass('lb_remove')) {
			$.getJSON('/syndication/remove_from_lightbox/' + asset, function(data) {
				if (data.success) {
					//
				} else {
					alert('Could not remove image from ' + mcConf.lb_label);
				}
			});
			$(this).removeClass('lb_remove').addClass('lb_add');
			$('#item-'+asset).attr('rel', 'lb_add');
		} else {
			$.getJSON('/syndication/add_to_lightbox/' + asset + '/' + content, function(data) {
				if (data.success) {
					//
				} else {
					alert('Could not add image to '+ mcConf.lb_label);
				}
			});
			$(this).removeClass('lb_add').addClass('lb_remove');
			$('#item-'+asset).attr('rel', 'lb_remove');
		}
		return false;
	});

}

function setupFullscreen() {
	$('.fullscreen-open').bind('click', openFullscreen);

	// this is needed to click on the page to launch the fullscreen.
	// This is the only way we can support it via a manual click action.

	$('.overlay-fullscreen-open').on('click', function(){
		$(this).hide();
		openFullscreen();
	});

	$('.fullscreen-close').bind('click', function() {
		closeFullscreen();
	});

	$(document).keyup(function(e) {
		if (e.keyCode == 27 && $('body').hasClass('fullscreen')) {
			closeFullscreen();
		}
	});
	$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function () {
		if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullScreenElement || $('#fullscreen_test').width() > 0)) {
			closeFullscreen();
		}
	});
}

function setupPublications() {
	$('.close-portfolio').attr('href', '/publications')
	$('#full').addClass('publications');
	$('#ss_lightbox_link, .m_lightbox_links').hide();
}

function openFullscreen() {
	if (!mcConf.mobile) {
		// TO DO consider if the lightbox has full screen
		var e = document.getElementById("wrapper");
		if(isSafari()) {
			mcConf.overlay_text = $('#o_pdf_queue .overlay_description').text();
				$('#o_pdf_queue .overlay_description').text('For security purposes, this form has been disabled for safari users.');
				$('#o_pdf_queue input[type=submit]').hide();
			}
		RunPrefixMethod(e, "RequestFullScreen");
		$('body').addClass('fullscreen');

		mcConf.doNotUpdateUrl = true;
	}
}

function closeFullscreen() {
	RunPrefixMethod(document, "CancelFullScreen");
	RunPrefixMethod(document, "ExitFullScreen");

	$('body').removeClass('fullscreen');

	mcConf.doNotUpdateUrl = false;

	updateURL('li.current', {currSlide: $('li.current').index()});
}

function updateURL(next, opts) {
	if(mcConf.doNotUpdateUrl){ return; }
	if (history.pushState) { // if we can update the URL directly, do so
		var save_page = '';
		var query_string = '';
		var full_url = window.location.href;
		var new_url = document.location.pathname.split('/');
		var asset = $(next).attr('asset');
		var content = '';
		var prev_asset = new_url.pop();
		if(prev_asset.length < 1) { // if empty then trailing slash
			prev_asset = new_url.pop(); // move along
		}
		//
		if(prev_asset.substring(0, 5) == 'page:') { // if we're paging results (archive/search)
			save_page = '/' + prev_asset;
			prev_asset = new_url.pop(); // the next one should be the ID
		}

		if (full_url.indexOf('?') > -1) {
			query_string = full_url.substr(full_url.indexOf('?'));
		}
		//intuit links are backwards and the content id is last instead of the asset id
		if (full_url.indexOf('intuit') > -1) {
			content = '/'+prev_asset;
			prev_asset = new_url.pop();
		}
		var patt = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
		if(!patt.test(prev_asset)){
			new_url.push(prev_asset); // put it back - its not a uuid
		}
		//
		if(asset && asset != prev_asset) {
			new_url = new_url.join('/') + '/' + asset + content + save_page + query_string;
			if(mcConf.browserHistoryState) {
				window.history.replaceState(asset, document.title, new_url);
			} else {
				window.history.pushState(asset, document.title, new_url);
			}
			if(window.location.hash){ window.location.hash = null; }
		}
	} else {
		// update the hash on the URL
		window.location.hash = "#" + opts.currSlide;
	}
}

// lightbox functions

function setupLightboxCustom() {
	$('body').addClass('lightbox');

	preloadAllElementImages('.masonry', 'lg');

	$('#lightbox').sortable();
	$('#lightbox').bind('sortstop',function(event, ui){
		reorderLightbox();
	});
}

// news functions
function newsMasonry(page) {
	if (page == 'artist') {
		preloadAllElementImages('.blog-list.artist', 'lg');
		$('.blog-list.artist').Mosaic({
			innerGap: 60,
			maxRowHeight: 400,
			maxRowHeightPolicy: 'crop'
		});

	} else {
		mcConf.masonryImagePrefix = 'gxl';
		masonryElement.init({
			'masonry_container': '#newsIndex',
			'gutter_width': 2,
			'min_cols': 1,
			'max_cols': 2
		});

		if (newsHasMore) {
			$(window).bind('scroll', LoadMoreNews);
		}
	}
}

function LoadMoreNews() {
	var scroll_top = $(window).scrollTop(),
	scroll_bottom = scroll_top + $(window).height(),
	total_height = $(document).height() - 300, // start loading a bit before the bottom
	isAtBottom = (scroll_bottom >= total_height);

	if (!isAtBottom || mcConf.processingLoadMoreNews) { return; }

	var url = newsBaseLink + 'page:' + (++newsPage);
	$('body').addClass('blog-loading');
	mcConf.processingLoadMoreNews = true;
	$.getJSON(url, function(data) {
		var new_items = $('<div>'+data['html']+'</div>').find('.blog-list').children();
		$('#newsIndex').append(new_items);
		preloadAllElementImages('#newsIndex');
		masonryElement.appendedItems($('#newsIndex'));

		if(data['has_more'] == true) {
			mcConf.processingLoadMoreNews = false;
		} else {
			newsHasMore = false;
		}
		$('body').removeClass('blog-loading');
		$(document).trigger('load_more.blog');
	});
}

function newsDetailPage() {
	mcConf.masonryPreload = false; // avoid default sizing
	setupVideo();
	resizeVideo('#newsDetailMasonry .m_item');
	preloadAllElementImages('#newsDetailMasonry');
	$('#newsDetailMasonry').bind('masonry_multiple_layout', function() {
		// custom sizing
		var width = $('#newsDetailMasonry').data('masonryColWidth');
		$(mcConf.masonryItem, '#newsDetailMasonry').each(function() {
			var height;
			var resize_factor = 0.1 + $(this).find('.m_item_image').width()/$(this).width();
			if ($(this).hasClass('doublewidth')) {
				if ($(window).width() >= $(window).height()) {
					height = Math.round($(window).height() / $(this).data('ratio'));
					$(this).width(height*$(this).data('ratio'));
				} else {
					height = Math.round($(this).width()/$(this).data('ratio'));
				}
			} else {
				height = resize_factor*width/$(this).data('ratio');
			}
			$(this).height(height);
		});
	});

	masonryElement.init({
		'masonry_container': '#newsDetailMasonry',
		'gutter_width': 34,
		'min_cols': 1,
		'max_cols': 2
	});
}
