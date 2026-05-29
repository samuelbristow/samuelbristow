/*
This is the site theme setup file. This is based off of the lb-setup.js file. 
If you wish to override any settings in the lb-setup file, just add the same variable name and value here.
*/

// setup options
mcConf.setHome = false; 									// add a class name to the body element of the home page.
mcConf.video = true; 										// if video is enabled
mcConf.fullscreen = true; 									// if fullscreen is enabled
mcConf.mobile = true; 										// if mobile is enabled
mcConf.scrollbar = false;						// use browser scrollbars
mcConf.keyboardNavigation = true; 							// false to deactivate keyboard
mcConf.hideShowMenu = false;								// hide/show menu on timer
mcConf.masonry = true;										// masonry active
mcConf.slideshow = true;									// slideshow active
mcConf.hasThumbnails = false;								// has thumbs on portfolio detail page
mcConf.slideshowTitleChange = true;							// show asset name
mcConf.lightbox = true;										// add lightbox functionality
mcConf.lightboxAddText = 'Add to PDF';
mcConf.lightboxRemoveText = 'Remove from PDF';
mcConf.sendLightboxOverlay = '';
								
mcConf.customShare = true;


// masonry setup
if (mcConf.masonry) {
	mcConf.masonryContainer = '.masonry';					// masonry container
	mcConf.masonryItem = '.m_item';							// masonry item
	mcConf.masonryGutterWidth = 40;							// masonry gutter size
	mcConf.masonryOverlayWidthDecrease = 0;
	mcConf.masonryOverlayHeightDecrease = 40;
	mcConf.masonryPreload = true;
	mcConf.masonryImagePrefix = 'lg';
	mcConf.masonryPreloadThrobber = '#masonry_loader';
}

// define custom elements
mcConf.scrollbarWidth = 0;									// scrollbar width

// slideshow setup

mcConf.slideshowContainer = '.slideshow'; 					// refernece of the element for the slideshow
mcConf.slideshowPaginator = '.slideshow_pag';				// slideshow paginator
mcConf.slideshowPaginatorText = 'numbers';					// slideshow paginator text: words, numbers (if null, default is numbers)
mcConf.slideshowSeparator = ' / '; 						// slideshow paginator separator
mcConf.slideshowNextBtn = '.slideshow_next';				// slideshow next button
mcConf.slideshowPrevBtn = '.slideshow_prev';				// slideshow prev button
mcConf.slideshowTitle = '.slideshow_title';
mcConf.slideshowShareLink = '.slideshow_share_link';		// slideshow share link
mcConf.slideshowShareContainer = '.slideshow_share';		// slideshow share container
mcConf.slideshowFx = 'fade';								// slideshow transition fx
mcConf.slideshowDelay = 500;								// slideshow delay
mcConf.slideshowSpeed = 500;								// slideshow speed
mcConf.slideshowTimeout = 100;								// slideshow timeout
mcConf.slideshowPaddingLeft = 0;							// slideshow padding left
mcConf.slideshowPaddingRight = 0;							// slideshow padding right
mcConf.slideshowPaddingTop = 0;							// slideshow padding top
mcConf.slideshowPaddingBottom = 0;							// slideshow padding bottom
mcConf.slideshowAutoPlay = false;							// auto play slideshow when it starts
mcConf.slideshowPreload = true;								// slideshow has preloading
mcConf.slideshowPreloader = '/imgs/loading.gif'; 			// slideshow preloader image reference
mcConf.clickImageToAdvance = true;							// Binding cycle('next') to the image in the slideshow

// blog pages setup
mcConf.blogFullScreen = false;									// if blog is fullscreen
mcConf.blogSlideshow = true;									// if blog has slideshow capabilities

// fullscreen
if (mcConf.fullscreen) {
	mcConf.fullscreenLink = '.fullscreen_link';					// fullscreen link
	mcConf.fullscreenLogo = '.fullscreen_logo';					// fullscreen logo
	mcConf.fullscreenClose = '';							// fullscreen close button
	mcConf.fullscreenSpeed = 500;								// slideshow fullscreen speed
	mcConf.fullscreenLinkText = 'Fullscreen';					// the text to go into fullscreen
	mcConf.fullscreenLinkReturnText = 'Gallery';				// the text to return to gallery mode
	mcConf.fullscreenHideThumbnails = true;						// hide thumbnails on fullscreen mode
	mcConf.slideshowFullscreenPaddingLeft = 0;					// fullscreen slideshow padding left
	mcConf.slideshowFullscreenPaddingRight = 0;					// fullscreen slideshow padding right
	mcConf.slideshowFullscreenPaddingTop = 40;					// fullscreen slideshow padding top
	mcConf.slideshowFullscreenPaddingBottom = 76;				// fullscreen slideshow padding bottom
}