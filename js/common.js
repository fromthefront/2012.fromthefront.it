// http://www.quirksmode.org/js/cookies.html
function setCookie(name,value,days) {
	var expires;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else {
		expires = "";
	}
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') {
			c = c.substring(1,c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
}

function deleteCookie(name) {
	setCookie(name,"",-1);
}

function prefixCSS(str) {
  var CSSprefixes = "-webkit,-moz,-o,-ms,-khtml".split(",");
  return (str + " " + CSSprefixes.join("-" + str + " ") + "-" + str).split(" ");
}

function testCSS(p, v) {
  var
      d = document.createElement("detect"),
      testProps = prefixCSS(p);

  for (var i = 0, np = testProps.length; i < np; i++) {

    if (d.style[testProps[i]] === "") {

      if (typeof v === "undefined") return true;

      testValues = prefixCSS(v);

      for (var j = 0, nv = testValues.length; j < nv; j++) {
        d.style[testProps[i]] = testValues[j];
        if (d.style[testProps[i]] === testValues[j]) return true;
      }
    }
  }

  return false;
}

$(document).ready(function() {
	// External links handler
	$('a[rel*=external], .external').on('click', function(e) {
		window.open($(this).attr('href'));
		e.preventDefault();
	});

	// Label tag toggles associated checkbox
	// (for browsers that do not support label click-through to form element)
	$("label").click( function() {
		$("#" + $(this).attr('for')).each( function() {
			$(this).attr('checked', !$(this).attr('checked'));
			$(this).trigger('change');
		});
		return false;
	});

	if (getCookie('anim') == 0) {
		$('#stopAnim').attr('checked', true);
	}

	$('#stopAnim').on('change', function() {
		// window.console.log ('change');

		if ($(this).is(':checked')) {
			// disable animations
			setCookie('anim', 0, 30);
		}
		else {
			// enable animations
			setCookie('anim', 1, 30);
		}
		// window.console.log(getCookie('anim'));
	});

	$('.n-main .nav-title').click(function() {
		$('.n-main').toggleClass('is-active');
		return false;
	});

});
