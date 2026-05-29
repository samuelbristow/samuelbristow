// masonry
var masonryLastResize;

var masonryElement = {
	init : function(passed_opts) {

		var opts = {
			'masonry_container' : '#masonry',
			'masonry_item' : '.m_item',
			'masonry_image' : '.m_item_image',
			'overlay_text' : '.m_txt',
			'masonry_layout' : 'fluid',
			'asset_layout' : 'normal',
			'asset_width' : 0,
			'asset_height' : 1,
			'gutter_width' : 10,
			'col_widths' : [500, 800, 1200, 1500, 2100],
			'col_num' : '',
			'min_cols' : 0,
			'max_cols' : 100,
			'force_complete_rows' : false
		};

		$.extend(opts, passed_opts);

		var container = $(opts.masonry_container);
		opts.item_list = container.find(opts.masonry_item);

		// save the options as data on the container
		$(opts.masonry_container).data('masonry-config', opts);

		$(opts.masonry_container).addClass('masonryElement').addClass('masonry_'+opts.masonry_layout).addClass('assets_'+opts.asset_layout);

		// masonry
		if (opts.item_list.length) {
			container.css({'opacity':'0.0'});

			masonryElement.prepareSettings(container, opts, passed_opts);
			masonryElement.prepareItems(container, opts);

			container.imagesLoaded(function(){
				masonryElement.layout(container, opts);
				container.animate({'opacity':'1.0'}, 500);
			});

			masonryElement.layout(container, opts);

			if (mcConf.masonryPreload) {
				container.animate({'opacity':'1.0'}, 500);
			}
		} else {
			container.animate({'opacity':'1.0'}, 500);
		}

		// trigger resize if scrollbar appears
		$(window).one('scroll', function() {
			$(window).trigger('resize');
		});
		$(mcConf.scrollingElement).one('scroll', function() {
			$(window).trigger('resize');
		});

		// highlighting the asset on touch devices
		container.on({
			mouseenter: function (){
				$(mcConf.masonryItem).removeClass('hover');
				$(this).addClass('hover');
			},mouseleave: function(){
				$(this).removeClass('hover');
			}
		}, opts.masonry_item);
	},
	
	update : function(passed_opts) {
		var container = $(passed_opts.masonry_container);
		var opts = container.data('masonry-config');
		$.extend(opts, passed_opts);

		masonryElement.prepareSettings(container, opts, passed_opts);
		masonryElement.prepareItems(container, opts);
		masonryElement.layout(container, opts);

		$(opts.masonry_container).data('masonry-config', opts);
	},

	prepareSettings(container, opts, passed_opts) {
		if (!passed_opts.col_widths && (opts.masonry_layout == 'fluid' || opts.masonry_layout == 'inline_fluid')) {
			masonryElement.setColWidths(container, opts);
		}
	},

	// one time sizing and loading of any new items
	prepareItems(container, opts) {
		opts.item_list.css('margin-bottom', opts.gutter_width);

		if (opts.masonry_layout == 'fixed') {
			// a fixed masonry only needs to be sized one time
			opts.item_list.find(opts.masonry_image).width(opts.asset_width);
		} else if (opts.masonry_layout == 'inline_fluid') {
			// an inline fluid masonry is used for drag and drop that sizes to fill the area, but doesn't use isotope for the layout
			opts.item_list.css({'margin-left': opts.gutter_width/2,'margin-right': opts.gutter_width/2});
		}

		if (opts.masonry_layout == 'fixed') {
			masonryElement.assetLayout(container, opts);
		}

		if(mcConf.masonryPreload) {
			preloadAllElementImages(container, mcConf.masonryImagePrefix);
		}
	},

	appendedItems(container) {
		container = $(container);
		var opts = container.data('masonry-config');
		var new_items = container.find(opts.masonry_item+':not(.isotope-item)');
		opts.item_list = container.find(opts.masonry_item);
		masonryElement.prepareItems(container, opts);
		if (opts.masonry_layout != 'inline_fluid') {
			container.isotope('appended', new_items);
		}
		masonryElement.layout(container, opts);
		container.data('masonry-config', opts);
	},

	setColWidths : function(container, opts) {
		// create an array of the column sizes based on the average column size
		if (!!opts.asset_width) {
			if (opts.force_complete_rows) {
				var colSplit = 0;
				opts.col_widths = [];
				// possible column counts for the number of items
				for (i=1; i <= opts.item_list.length; i++) {
					if (opts.item_list.length%i == 0) {
						opts.col_widths.push([i, 5000]);
					}
				}
				// find the best size at which to change between two different column counts
				var g = opts.gutter_width;
				var w = opts.asset_width; // the ideal column width
				for (i=0; colSplit < 2570; i++) {
					if (opts.col_widths.length >= i+2) {
						var x = opts.col_widths[i][0]; // the current column count
						var y = opts.col_widths[i+1][0]; // the next largest column count
						colSplit = Math.round((2*w*x+g*x*(y-1)/y+g*(x-1))/(1+x/y));
						opts.col_widths[i][1] = colSplit;
					} else {
						break;
					}
				}
			} else {
				var colSize = 0;
				opts.col_widths = [];
				for (i=1; colSize < 2570; i++) {
					colSize = Math.round(opts.asset_width*(i+(i/(2*i+1))))+opts.gutter_width*i;
					opts.col_widths.push(colSize);
				}
			}
		}
	},

	// layout isotope
	isotope : function(container, opts) {

		$(container, opts).isotope({
			itemSelector: opts.masonry_item,
			animationEngine: 'css',
			masonry: {
				columnWidth: opts.current_col_width,
				gutterWidth: opts.gutter_width, // isotope v1.5
				gutter: opts.gutter_width // isotope v3
			},
			transformsEnabled: !mcConf.mobile
		});
	},

	// a masonry sizing function that can be used for various pages
	sizing : function(container, opts) {
		var colNum = opts.col_num;
		var containerTotal = container.width() - 1;
		if (!colNum) {
			colNum = 1; // default for the smallest size

			if (opts.force_complete_rows) {
				// determine the proper number of columns
				for (var i=0; i < opts.col_widths.length; i++) {
					if (containerTotal < opts.col_widths[i][1]) {
						colNum = opts.col_widths[i][0];
						break;
					}
				}
				if (colNum > opts.max_cols) {
					for (var i=0; i < opts.col_widths.length; i++) {
						if (opts.col_widths.length[i][0] > opts.max_cols) {
							colNum = opts.col_widths.length[i-1][0];
							break;
						}
					}
				} else if (colNum < opts.min_cols) {
					for (var i=opts.col_widths.length-1; i >= 0; i--) {
						if (opts.col_widths.length[i][0] < opts.min_cols) {
							colNum = opts.col_widths.length[i+1][0];
							break;
						}
					}
				}
			} else {
				for (var i=opts.col_widths.length - 1; i >= 0; i--) {
					if (containerTotal > opts.col_widths[i]) {
						colNum = i+2;
						break;
					}
				}
				if (colNum > opts.max_cols) {
					colNum = opts.max_cols;
				} else if (colNum < opts.min_cols) {
					colNum = opts.min_cols;
				}
			}
		}
		var gutterTotal = opts.gutter_width*(colNum-1);
		if (opts.masonry_layout == 'inline_fluid') {
			gutterTotal = opts.gutter_width*colNum; // an additional gutter compared to using isotope
		}
		var columnWidth = Math.floor((containerTotal - gutterTotal)/colNum);
		opts.item_list.width(columnWidth);
		if(colNum > 1) {
			opts.item_list.filter('.doublewidth').width(2*columnWidth + opts.gutter_width);
		}
		opts.current_col_width = columnWidth;
		opts.current_col_number = colNum;
		container.trigger('masonry_multiple_sizing');
		$(container).data('masonry-cols', colNum);
		$(container).data('masonry-col-width', columnWidth);

	},

	layout : function(container, opts) {
		if (opts.masonry_layout == 'fluid' || opts.masonry_layout == 'inline_fluid') {
			masonryElement.sizing(container, opts);
			masonryElement.assetLayout(container, opts);
		}
		if (opts.masonry_layout != 'inline_fluid') {
			if(mcConf.masonryPreload && opts.asset_layout == 'normal'){ masonryElement.setItemHeight(container, opts); }
			masonryElement.isotope(container, opts);
			//if(mcConf.masonryPreload && opts.asset_layout == 'normal'){ masonryElement.clearItemHeight(container, opts); }
		}
		container.trigger('masonry_multiple_layout');
	},

	assetLayout : function(container, opts) {
		var c_ratio = opts.asset_width/opts.asset_height;
		var c_width,
			double_width;
		if (opts.masonry_layout == 'fixed') {
			c_width = opts.asset_width;
		} else {
			c_width = opts.current_col_width;
		}
		double_width = c_width*2 + opts.gutter_width;
		if (opts.asset_layout == 'cropped' || opts.asset_layout == 'fit') {
			opts.item_list.find(opts.masonry_image).width(c_width).height(Math.floor(c_width/c_ratio));
			if ($(opts.overlay_text).length) {
				opts.item_list.find(opts.overlay_text).width(c_width).height(Math.floor(c_width/c_ratio));
			}
			if(opts.current_col_number > 1) {
				opts.item_list.filter('.doublewidth').find(opts.masonry_image).width(double_width);
				if ($(opts.overlay_text).length) {
					opts.item_list.filter('.doublewidth').find(opts.overlay_text).width(double_width);
				}
			}
		}
		if (opts.asset_layout == 'cropped') {
			cropImages(opts.item_list.find(opts.masonry_image));
		} else if (opts.asset_layout == 'fit') {
			opts.item_list.find(opts.masonry_image).find('img').css({maxWidth: c_width, maxHeight: c_width/c_ratio});
			if(opts.current_col_number > 1) {
				opts.item_list.filter('.doublewidth').find(opts.masonry_image).find('img').css({maxWidth: double_width});
			}
		}
		container.trigger('masonry_multiple_assets_layout');
	},

	setItemHeight : function(container, opts) {
		opts.item_list.each(function(){
			$('img, video', this).each( function() {
				var img = $(this);
				if(img.attr('data-width') && img.attr('data-height')) {
					var iHeight = Math.floor(img.width() * img.attr('data-height') / img.attr('data-width'));
				}
				if(img.attr('imgW') && img.attr('imgH')) {
					var iHeight = Math.floor(img.width() * img.attr('imgH') / img.attr('imgW'))
				}
				img.height(iHeight);
				if ($(this).parents(opts.masonry_item).find(opts.overlay_text).length) {
					$(this).parents(opts.masonry_item).find(opts.overlay_text).height(iHeight).width(img.width());
				}
			});
		});
	},

	clearItemHeight : function(container, opts) {
		opts.item_list.each(function(){
			$('img, video', this).each( function() {
				var img = $(this);
				if(img.attr('data-width') && img.attr('data-height')) {
					img.css("height", "");
				}
				if(img.attr('imgW') && img.attr('imgH')) {
					img.css("height", "");
				}
			});
		});
	}
}

$(document).bind('core.imagePreloaded', function(e, image_selector) {
	var img = $(image_selector);
	if(img.attr('data-width') && img.attr('data-height')) {
		img.css("height", "");
	}
	if(img.attr('imgW') && img.attr('imgH')) {
		img.css("height", "");
	}
});

function masonryMultipleResizeAll() {
	$(document).trigger('masonry_multiple_before_resize');
	$('.masonryElement').each( function() {
		if ($(this).data('masonry-config')) {
			masonryElement.layout($(this), $(this).data('masonry-config'));
		}
	});
}

$(document).ready( function() {
	$(window).bind('resize',function() {
		masonryMultipleResizeAll();
		clearTimeout(masonryLastResize);
		masonryLastResize = setTimeout(function() {
			masonryMultipleResizeAll();
		}, 50);
	})
});