// setup options
var	mcConf = {
	setHome : false,							// add a class name to the body element of the home page.
	video : true,								// if video is enabled
	lightbox : false,							// if lightbox is enabled
    lb_label : 'lightbox',                      // what we call our lightbox
	fullscreen : true,							// if fullscreen is enabled
	mobile : false,								// if mobile is enabled
	keyboardNavigation : true,					// false to deactivate keyboard
	hideShowMenu : false,						// hide/show menu on timer
	thisjustin : false,							// this just in active
	masonry : false,							// masonry active
	masonryGutterWidth: 0,
	slideshow : true,							// slideshow active
	hasThumbnails : false,						// has thumbs jcarousel
	slideshowTitleChange : false,				// change title on prev next image
	slideshowDescriptionChange : false,			// change description on prev next image
	customMenuScrollbar : false,				// if custom menu scrollbar is set
	customContentScrollbar : false,				// if custom content scrollbar is set
	assetStorageURL: undefined,					// AssetStorageUrl for the images
	idleWaitTime : 3000,						// idle wait time
	homeSlideshowContainer : '#homeSlideshow',	// home slideshow container
	homeSlideshowTitle : '#home_title',			// home slideshow title container
	homeSlideshowDescription : '#home_description',// home slideshow description container
	homeSlideshowRandom : 0,					// home slideshow random 1 is true 0 is false
	homeSlideshowCreditTypeChange : false,		// if the home slideshow will display the artist type for each slide
	homeSlideshowCreditType : '',				// the selector for the element where the artist type with be displayed
	contentContainer : '#static',				// reference of element for the contentDocument
	pageWrapper : '#wrapper',						// an element containing all other content on the page
	menuContainer : '.menu',					// reference of element for the menu
	menuWidth : 296,							// width of the menu
	menuType : 'default',						// type of menu system (collapse, toggle, dropdown)
	menuBackToMenuText : 'Menu',				// back to menu text
	navSlideSpeed : 200,
	scrollbarWidth : 0,							// scrollbar width
	blogFullScreen : false,						// if blog is fullscreen
	blogSlideshow : false,						// if blog has slideshow capabilities
	blogShareCloseOnClick : false,				// close share overlay if clicked anywhere outside it
	blogShareShowSpeed : 0,						// override with milliseconds to not show blog share overlay instantly
	jspAutoReinitialiseDelay : 500,				// Default value for the autoreinitialise delay
	useWebkitScrollbars : false,				/* Switch the scrollbars to webkit ones from jscrollpane for webkit browsers */
	scrollMenuToOpenPortfolio : false,			// Make the menu scroll to the open menu item on load
	currentInnerMenuItem : undefined,			// Set this in the nav element
	extendedMenuCollapse : false,				/* Set this to collapse large menus to small one and keep the current open menu intact */
	extendedMenuContainer : '.menu_extended',	// reference of element for the extend menu
	extendedMenuCollapseButton : '#collapsed_menu_button', // reference of the element for the link to the main menu
	blogOverlaySelector : 'img',
	extraShareOverlayMargin : 0,
	blogImageCentered : true,
	drag_desktop : true,						// prevent drag and right click to save images to desktop
	preloadImageLimit : 25,						// how many images to load in at once
	lbAssetSize_800 : 'ml',   					// default image prefixes per screen size
	lbAssetSize_1024 : 'gs',  					//
	lbAssetSize_1366 : 'gm',  					//
	lbAssetSize_1440 : 'gm',  					//
	lbAssetSize_1680 : 'gl',  					//
	lbAssetSize_1920 : 'gxl', 					//
	lbAssetSize_2560 : 'gxxl', 					//
	lbAssetSize_iphone : 'ml',					//
	lbAssetSize_droid : 'ml',					//
	lbAssetSize_blackberry : 'ms',				//
	lbAssetSize_playbook : 'ml',					//
	imagePrefixSizes : { // image prefix sizes to be used in image size calculations
		tn: {width: 55, height: 55},
		tnSm: {width: 120, height: 200},
		sm: {width: 80, height: 80},
		md: {width: 210, height: 300},
		lg: {width: 686, height: 514},
		ls: {width: 290, height: 193},
		pt: {width: 145, height: 193},
		gtn: {width: 300, height: 300},
		gs: {width: 1024, height: 768},
		gm: {width: 1440, height: 900},
		gl: {width: 1680, height: 1050},
		gxl: {width: 1920, height: 1080},
		gxxl: {width: 2560, height: 1440},
		ms: {width: 320, height: 240},
		mm: {width: 480, height: 320},
		ml: {width: 800, height: 600}
	},
	clipPrefixSizes : {
		'clip': {width: 240, poster: 'lg'},
		'lgclip': {width: 686, poster: 'lg'},
		'hdclip': {width: 1280, poster: 'gm'},
		'fullhdclip': {width: 1920, poster: 'gxl'},
		'2kclip': {width: 2569, poster: 'gxxl'},
		'4kclip': {width: 3840, poster: 'gxxl'},
		'8kclip': {width: 7680, poster: 'gxxl'}
	},
	captchaList : []
}

// menu scrollbar element
if (mcConf.customMenuScrollbar) {
	mcConf.menuVerticalDragMinHeight = 30;							//
	mcConf.menuVerticalDragMaxHeight = 30;							//
	mcConf.menuVerticalDragMinWidth = 30;							//
	mcConf.menuVerticalDragMaxWidth = 30;							//
	mcConf.menuHorizontalDragMinHeight = 30;						//
	mcConf.menuHorizontalDragMaxHeight = 30;						//
	mcConf.menuHorizontalDragMinWidth = 30;							//
	mcConf.menuHorizontalDragMaxWidth = 30;							//
}

// content scrollbar element
if (mcConf.customContentScrollbar) {
	mcConf.contentVerticalDragMinHeight = 30;							//
	mcConf.contentVerticalDragMaxHeight = 30;							//
	mcConf.contentVerticalDragMinWidth = 30;							//
	mcConf.contentVerticalDragMaxWidth = 30;							//
	mcConf.contentHorizontalDragMinHeight = 30;							//
	mcConf.contentHorizontalDragMaxHeight = 30;							//
	mcConf.contentHorizontalDragMinWidth = 30;							//
	mcConf.contentHorizontalDragMaxWidth = 30;							//
}

// this just in
if (mcConf.thisjustin) {
	mcConf.thisjustinContainer = '#thisjustin';					// this just in container
	mcConf.thisjustinSlideshow = '.thisjustin_images ul';		// this just in slideshow
	mcConf.thisjustinCloseLink = 'a.thisjustin_close';			// this just in close link
	mcConf.thisjustinTimeOut = 30000;							// this just in hide on time
}

// home slideshow
mcConf.homeSlideshowPaddingLeft = 0;								// slideshow padding left
mcConf.homeSlideshowPaddingRight = 0;							// slideshow padding right
mcConf.homeSlideshowPaddingTop = 0;								// slideshow padding top
mcConf.homeSlideshowPaddingBottom = 0;							// slideshow padding bottom
mcConf.homeSlideshowPager = '';
mcConf.homeSlideshowType = 'fill';

// masonry setup
if (mcConf.masonry) {
	mcConf.masonryContainer = '#masonry';						// masonry container
	mcConf.masonryItem = '.m_item';							// masonry item
}
mcConf.masonryOverlayWidthDecrease = 50;
mcConf.masonryOverlayHeightDecrease = 30;
mcConf.masonryPreload = false;
mcConf.masonryImagePrefix = 'lg';
mcConf.masonryDoubleImagePrefix = 'gs';
mcConf.masonryPreloadThrobber = "";
mcConf.masonryCurrentColWidth = 200;							// used by the newest masonry setup to track the columns size
mcConf.masonryForceCompleteRows = false;						// only column counts that are factors of the item count will be used
mcConf.masonryMaxColCount = 100;
mcConf.masonryMinColCount = 0;
mcConf.masonryItemClick = false;
mcConf.doNotSetColWidths = false;

// slideshow setup
if (mcConf.slideshow) {
	mcConf.slideshowType = 'fit';
	mcConf.slideshowContainer = '.slideshow';					// refernece of the element for the slideshow
	mcConf.slideshowPaginator = '.slideshow_pag';				// slideshow paginator
	mcConf.slideshowPaginatorText = 'numbers';					// slideshow paginator text: words, numbers (if null, default is numbers)
	mcConf.slideshowSeparator = ' / ';							// slideshow paginator separator
	mcConf.slideshowNextBtn = '.slideshow_next, .ss_next';		// slideshow next button
	mcConf.slideshowPrevBtn = '.slideshow_prev, .ss_prev';		// slideshow prev button
	mcConf.slieshowThumbsBtn = '.ss_thumb';						// slideshow thumbs button
	mcConf.slideshowShareLink = '.slideshow_share_link';		// slideshow share link
	mcConf.slideshowShareContainer = '.slideshow_share';		// slideshow share container
	mcConf.slideshowFx = 'fade';								// slideshow transition fx
	mcConf.slideshowDelay = 0;									// slideshow delay
	mcConf.slideshowSpeed = 1000;								// slideshow speed
	mcConf.slideshowTimeout = 100;								// slideshow timeout
	mcConf.slideshowPaddingLeft = 60;							// slideshow padding left
	mcConf.slideshowPaddingRight = 60;							// slideshow padding right
	mcConf.slideshowPaddingTop = 20;							// slideshow padding top
	mcConf.slideshowPaddingBottom = 20;							// slideshow padding bottom
	mcConf.slideshowAutoPlay = false;							// auto play slideshow when it starts
	mcConf.slideshowPreload = false;							// slideshow has preloading
	mcConf.slideshowPreloader = '/imgs/blank.gif';				// slideshow preloader image reference
	mcConf.slideshowNoWrap = 0;									// true to prevent slideshow from wrapping
	mcConf.slideshowWrapToPortfolio = false;					/* true to force slideshow to wrap to the next or previous
																	portfolio at the end or beginning of the portfolio,
																	REQUIRES mcConf.slideshowNoWrap to be set to true */
	mcConf.slideshowWrapUpdateText = true; 					// should the slideshow next/prev links update to show that it is going to another portfolio
	mcConf.navigatePortfolio = undefined;						// Function extention to support portfolio navigation
	mcConf.clickImageToAdvance = false;							// Binding cycle('next') to the image in the slideshow
}
mcConf.slideshowSpreadGutter = 0;

// if slideshow has title change capabilities
if (mcConf.slideshowTitleChange) {
	mcConf.slideshowTitle = '.slideshow_title';		// reference to the element to display the asset name
}

// if slideshow has title change capabilities
if (mcConf.slideshowDescriptionChange) {
	mcConf.slideshowDescription = '.slideshow_description';	// reference to the element to display the asset description
}

// fullscreen settings
if (mcConf.fullscreen) {
	mcConf.fullscreenLinkText = 'Fullscreen';					// the text to go into fullscreen
	mcConf.fullscreenLinkReturnText = 'Gallery';				// the text to return to gallery mode
	mcConf.fullscreenHideThumbnails = false;					// hide thumbnails on fullscreen mode
	mcConf.fullscreenSpeed = 500;								// slideshow fullscreen speed
	mcConf.slideshowFullscreenPaddingLeft = 65;				// fullscreen slideshow padding left
	mcConf.slideshowFullscreenPaddingRight = 65;				// fullscreen slideshow padding right
	mcConf.slideshowFullscreenPaddingTop = 25;					// fullscreen slideshow padding top
	mcConf.slideshowFullscreenPaddingBottom = 35;				// fullscreen slideshow padding bottom
}

// has thumbnails
mcConf.thumbsScrollToCenter = false;
if (mcConf.hasThumbnails) {
	mcConf.carouselContainer = '.ss_thumbs';					// name of the carousel container (entire wrapper)
	mcConf.carousel = '#ssThumbs';								// name of carousel
	mcConf.carouselVertical = true;								// vertical position (true or false)
	mcConf.carouselWrap = 'circular';							// options are both, last, circular
	mcConf.carouselScrollNumber = 3;							// number of items to scroll
	mcConf.carouselNextButton = '.ss_thumbs_next';				// next button
	mcConf.carouselPrevButton = '.ss_thumbs_prev';				// prev button
}
mcConf.thumbsType = '';											// crop thumbs

// video setup
if (mcConf.video) {
	mcConf.fullscreenLink = '.fullscreen_link';					// fullscreen link
	mcConf.fullscreenLogo = '.fullscreen_logo';					// fullscreen logo
	mcConf.fullscreenClose = '.fullscreen_close';				// fullscreen close button
	mcConf.videoPlayerSkin = '/skin/default/default.xml';		// video player skin
	mcConf.videoLogoFile = '/imgs/logo-video.png';				// video logo file
	mcConf.videoLogoPosition = 'top-left';						// video logo position
	mcConf.videoLogoOver = '1.0';								// opacity of the logo when you hover over
	mcConf.videoLogoOut = '1.0';								// opacity of the logo when you hover out
	mcConf.videoLogoHide = false;								// hide or show the video logo
	mcConf.videoControlPosition = 'bottom';						// position of the controls (bottom, top, over and none)
	mcConf.videoControlIdleHide = false;						// if the controlbar stays hidden on pause paused or stopped ('over' position only)
	mcConf.videoStretching = 'uniform';							// how to handle the video in the player window (none, exactfit, uniform, fill)
	mcConf.videoControlIdleHide = false;						// if the controlbar stays hidden on pause paused or stopped ('over' position only)
	mcConf.videoScreenColor = '000000';							// the background color for the video screen (flash only)
	mcConf.videoControlHeight = 26;
	mcConf.videoOriginalSize = false;
	mcConf.videoAutostart = false;
	mcConf.videoWidth = '100%';
	mcConf.videoHeight = '100%';
	mcConf.videoRepeat = false;
	mcConf.videoMuted = false;
}
