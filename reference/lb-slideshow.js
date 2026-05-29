function lbSlideshow (prefix, passed_opts) {
	var opts = {
		'fx' : 'fade',
		'timeout' : 0,
		'delay' : 2000,
		'speed' : 1000,
		'sync' : 1,
		'resize' : true,
		'keyboard' : true,
		'next' : '.ss_next',
		'prev' : '.ss_prev',
		'starting_index' : 0,
	};

	$.extend(opts, passed_opts);

	$('.' + prefix + '_slideshow').each(function() {
		var _ss = $(this);
		var _pager = $(this).find('.ss_pager');
		var _next = $(this).find(opts.next);
		var _prev = $(this).find(opts.prev);

		if($('.slideshow li', this).length >= 1) {
			$('.slideshow', this).cycle({
				fx: opts.fx,
				delay: opts.delay,
				speed: opts.speed,
				timeout: opts.timeout,
				sync: opts.sync,
				containerResize: 0,
				slideResize: 0,
				startingSlide: opts.starting_index,
				pager: _pager,
				next: _next,
				prev: _prev,
				before: onBefore,
				after: onAfter
			});
		}
		if($('.slideshow li', this).length < 2) {
			// if slideshow only has one image, then hide prev next buttons
			$('.ss_next', this).hide();
			$('.ss_prev', this).hide();
		}

		// Swipe for mobile
		if (mcConf.mobile) {
			if($('.slideshow li', this).length >= 1) {
				$('.slideshow li', this).swipe({
					swipeLeft: imageNextMobile,
					swipeRight: imagePrevMobile,
					threshold: 100
				});
				$('.assettype2, .panoramic').addClass('noSwipe');
			}
		}

		if (opts.keyboard) {
			$(document).bind('keydown', function(e) {
				if (e.which == 37)
					$('.ss_prev').trigger('click');
				else if (e.which == 39)
					$('.ss_next').trigger('click');
			});
		}

		// thumbnails
		$('.ss_thumbs li', this).bind('click', function() {
			var index = $(this).index();
			var _ss = $(this).parents('.slideshow_wrapper');
			$('.slideshow', _ss).cycle(index);
		});

		preloadAllElementImages($('.slideshow_image', this).first());

		if (opts.resize) {
			resizeSlideshow(_ss);
			$(window).bind('resize', function() {
				resizeSlideshow(_ss);
			});
		}
	});

	function onBefore(curr,next,opts) {
		// preload images
		var lastSlide = opts.slideCount;
		var prevIndex = correctIndex(opts.currSlide - 1, opts.slideCount);
		var nextIndex = correctIndex(opts.currSlide + 1, opts.slideCount);
		preloadAllElementImages(curr);
		preloadAllElementImages(opts['$cont'].children('li')[prevIndex]);
		preloadAllElementImages(opts['$cont'].children('li')[nextIndex]);

		// setup videos
		if($(next).hasClass('assettype2')) {
			setupVideo(next);
		}
		if($(next).hasClass('assettype2') || $(next).hasClass('assettype4')) {
			$(this).parents('.slideshow_wrapper').addClass('ss_showing_video');
		} else {
			$(this).parents('.slideshow_wrapper').removeClass('ss_showing_video');
		}

		// stop external (Youtube and Vimeo)
		if ($(curr).hasClass('assettype4')) {
			stopExternalVideos();
		}

		$(curr).parents('.slideshow').find('.current').removeClass('current');

		$(this).trigger('onBefore', [curr, next, opts]);
	}

	function onAfter(curr,next,opts) {
		// preload images
		preloadAllElementImages(next);
		var twoPrev = correctIndex(opts.currSlide - 2, opts.slideCount);
		var twoNext = correctIndex(opts.currSlide + 2, opts.slideCount);
		preloadAllElementImages(opts['$cont'].find('.slideshow_image')[twoPrev]);
		preloadAllElementImages(opts['$cont'].find('.slideshow_image')[twoNext]);

		// remove previous video
		if (opts.lastSlide != opts.currSlide) {
			removeVideo(curr);
		}
		// update pagination
		var index = opts.currSlide + 1;
		opts['$cont'].parents('.slideshow_wrapper').find('.ss_pag_current').text(index);

		$(next).addClass('current');
		if ($(this).parents('.slideshow_wrapper').find('.ss_thumbs').length) {
			$(this).parents('.slideshow_wrapper').find('.ss_thumbs li').removeClass('sel');
			$(this).parents('.slideshow_wrapper').find('.ss_thumbs li:eq('+opts.currSlide+')').addClass('sel');
		}

		$(this).trigger('onAfter', [curr, next, opts]);
	}

	// next slide
	function imageNext(_ss) {
		$(_ss).find('.slideshow').cycle('next');
	}

	// prevous slide
	function imagePrev(_ss) {
		$(_ss).find('.slideshow').cycle('prev');
	}

	// next slide mobile
	function imageNextMobile() {
		var wrapper = $(this).parents('.slideshow_wrapper');
		wrapper.find('.slideshow').cycle('next');
	}
	// previous slide mobile
	function imagePrevMobile() {
		var wrapper = $(this).parents('.slideshow_wrapper');
		wrapper.find('.slideshow').cycle('prev');
	}

	function resizeSlideshow(_ss) {
		_ss.trigger('beforeResize');
		var width = _ss.find('.slideshow').width();
		var height = _ss.find('.slideshow').height();
		_ss.find('.slideshow_image').width(width).height(height);
		_ss.find('.slideshow_image img').css({'max-width': width, 'max-height': height});
		_ss.trigger('afterResize');
	}

	function correctIndex(index, length) {
		if (index < 0) {
			index = index + length;
		}
		if (index >= length) {
			index = index - length;
		}
		return index;
	}

	function stopExternalVideos() {
		var videos = document.querySelectorAll('iframe');
		Array.prototype.forEach.call(videos, function (video) {
			if (video.tagName.toLowerCase() === 'video') {
				video.pause();
			} else {
				var src = video.src;
				video.src = src;
			}
		});
	}
}
