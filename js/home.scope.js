(function() {

	var $body = $('body'),										// Document object, cached
		$window = $(window),									// Window object, cached
		$enabledPirates = $('#pirates .pirate.on'),				// Only enabled pirates (some of them might be unrevealed)
		$enabledPiratesLinks = $enabledPirates.find('.link'),	// Links of enabled pirates
		//$enabledPiratesBios = $enabledPirates.find('.bio'),		// Bios of enabled pirates
		//$piratesBioWrapper = $('#piratesBioWrapper'),			// Wrapper for bios, after moved them via js
		smokeTicker,											// Smoke ticker object
		pirates,												// Pirates manager, arrr!
		smartphoneManager;										// Detects smartphone and does conditional things

	// --|-- SMOKE FIXER FUNCTION AND TIMER -----------------------------

	function SmokeTicker(options) {

		var defaults = {
			smokeLeftClass: 'smokeLeft',
			smokeRightClass: 'smokeRight'
		};

		// Options
		this.options = $.extend({}, defaults, options);

		// Setting iVars
		this.$smoke = $('#smoke');
		this.$smokeBalls = this.$smoke.children();
		this.timerId = null;
		this.seconds = -1;
		this.isActive = true;

		// Enabling smoke
		this.enable();
	}

	SmokeTicker.prototype = {

		// Stops and starts smoke ball animation. Happens at every clock tick.
		tick: function() {
			var $smokeBall, smokeClass, smokeNumber;
			// Init
			smokeNumber = ++this.seconds % 10;
			$smokeBall = this.$smokeBalls.eq(smokeNumber);
			smokeClass = (smokeNumber % 2) ? this.options.smokeLeftClass : this.options.smokeRightClass;
			// Restart smoke ball #smokeNumber
			$smokeBall.removeClass(smokeClass);
			setTimeout(function(){
				$smokeBall.addClass(smokeClass);
			}, 1);
		},

		// Enables the interval and makes the first tick happen right now.
		enable: function() {
			var that = this;
			this.seconds = -1;
			this.tick();
			this.timerId = setInterval(function() {
				that.tick.call(that);
			}, 1000);
		},

		// Disables the interval and resets the current smoke animations.
		disable: function() {
			this.$smokeBalls
				.removeClass(this.options.smokeLeftClass)
				.removeClass(this.options.smokeRightClass);
			clearInterval(this.timerId);
		},

		// Enables or disables smoke animation.
		toggle: function() {
			if (this.isActive) this.disable(); else this.enable();
			this.isActive = !this.isActive;
		}
	};

	smokeTicker = new SmokeTicker();


	// --|-- PIRATES BIOS / HIGHLIGHT FUNCTIONS -----------------------------

	var Pirates = function(options) {
		var defaults = {
			pirateHighlightClass: 'highlight',
			pirateLowlightClass: 'lowlight'
			// pirateIdData: 'pirateid'
		};
		this.options = $.extend({}, defaults, options);
	};

	Pirates.prototype = {
		// Makes a pirate become a shadow
		lowlight: function() {
			$enabledPirates
				.removeClass(this.options.pirateHighlightClass)
				.addClass(this.options.pirateLowlightClass);
		},
		// Makes all pirates find the light
		restoreLight: function() {
			$enabledPirates
				.removeClass(this.options.pirateHighlightClass)
				.removeClass(this.options.pirateLowlightClass);
		},
		// Makes a pirate colorful
		highlight: function(el) {
			this.lowlight();
			$(el)
				.removeClass(this.options.pirateLowlightClass)
				.addClass(this.options.pirateHighlightClass);
		}
	};

	pirates = new Pirates();


	// --|-- SMARTPHONE MANAGER -----------------------------

	var SmartphoneManager = function(options) {
		// Set iVars
		this.isSmartphone = DetectTierIphone();
		this.piratesCount = $enabledPirates.length;
		this.$piratesContainer = $('#pirates');
		// Set smartphone class
		var smartphoneClass = (this.isSmartphone) ? 'smartphone' : 'no-smartphone';
		$body.addClass(smartphoneClass);
		// If smartphone...
		if (this.isSmartphone) {
			// Init pirate swipe
			this.piratesSwipe = new Swipe(document.getElementById('piratesWrapper'));
		}
		else {
			$('#piratesWrapper').clone().attr('id', 'piratesSlider').appendTo('#speakers');
			this.piratesSwipe = new Swipe(document.getElementById('piratesSlider'));
			$('#morePirates .label').text('Scroll for more!');
		}
	};

	SmartphoneManager.prototype = {
		resize: function() {
			windowWidth = $window.width();
			if (this.isSmartphone) {
				$enabledPirates.width(windowWidth);
				this.$piratesContainer.width(this.piratesCount * windowWidth);
			}
		}
	};

	smartphoneManager = new SmartphoneManager();

	$window.resize(smartphoneManager.resize);
	smartphoneManager.resize();


	// --|-- PIRATES EVENT HANDLERS -----------------------------

	// Enable next/previous navigation on slider
	$('#morePirates .go').on('click', function(e) {
		var $el = $(e.target),
			isNext = $el.hasClass('next');
		if (isNext) {
			smartphoneManager.piratesSwipe.next();
		} else {
			smartphoneManager.piratesSwipe.prev();
		}
	});

	// On non-touch screen, pirates highlight on mouse enter, restores at pirate mouse leave
	if (! smartphoneManager.isSmartphone) {
		$enabledPiratesLinks.on('mouseenter', function() {
			pirates.highlight(this.parentElement);
			// pirates.showBio(this.parentElement);
		});
		$enabledPiratesLinks.on('mouseleave', function() {
			pirates.restoreLight();
			// pirates.hideBios();
		});
	}


	// --|-- MORE EVENT HANDLERS -----------------------------

})();


// sticky menu
$(function() {

	var $nav = $('.n-main');
	var startPos = 1365;  //$nav.offset().top;

	function updateMenuPos() {
		if ($nav.css('position') === 'absolute') {
			var scrollPos = $(window).scrollTop();
			// console.log('scroll pos:' + scrollPos);

			if (scrollPos > startPos) {
				$nav.css({'top': scrollPos});
			}
			else {
				$nav.css({'top': startPos});
			}
		} else {
			$nav.css({'top': 0});
		}
	}

	$(window).scroll(function(e) {
		updateMenuPos();
	});

	$(window).resize(function(e) {
		updateMenuPos();
	});

});


