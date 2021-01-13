/*
  Stellar by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

  skel.breakpoints({
    xlarge: '(max-width: 1680px)',
    large: '(max-width: 1280px)',
    medium: '(max-width: 980px)',
    small: '(max-width: 736px)',
    xsmall: '(max-width: 480px)',
    xxsmall: '(max-width: 360px)'
  });

  $(function() {

    var	$window = $(window),
      $body = $('body'),
      $main = $('#main');

    // Disable animations/transitions until the page has loaded.
    $body.addClass('is-loading');

    $window.on('load', function() {
      window.setTimeout(function() {
        $body.removeClass('is-loading');
      }, 100);
    });

    // Fix: Placeholder polyfill.
    $('form').placeholder();

    // Prioritize "important" elements on medium.
    skel.on('+medium -medium', function() {
      $.prioritize(
        '.important\\28 medium\\29',
        skel.breakpoint('medium').active
      );
    });

    // Nav.
    var $nav = $('#nav');

    if ($nav.length > 0) {

      // Shrink effect.
      $main
        .scrollex({
          mode: 'top',
          enter: function() {
            $nav.addClass('alt');
          },
          leave: function() {
            $nav.removeClass('alt');
          },
        });

      // Links.
      var $nav_a = $nav.find('a');

      $nav_a
        .scrolly({
          speed: 1000,
          offset: function() { return $nav.height(); }
        })
        .on('click', function() {

          var $this = $(this);

          // External link? Bail.
          if ($this.attr('href').charAt(0) != '#')
            return;

          // Deactivate all links.
          $nav_a
            .removeClass('active')
            .removeClass('active-locked');

          // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
          $this
            .addClass('active')
            .addClass('active-locked');

        })
        .each(function() {

          var	$this = $(this),
            id = $this.attr('href'),
            $section = $(id);

          // No section for this link? Bail.
          if ($section.length < 1)
            return;

          // Scrollex.
          $section.scrollex({
            mode: 'middle',
            initialize: function() {

              // Deactivate section.
              if (skel.canUse('transition'))
                $section.addClass('inactive');

            },
            enter: function() {

              // Activate section.
              $section.removeClass('inactive');

              // No locked links? Deactivate all links and activate this section's one.
              if ($nav_a.filter('.active-locked').length == 0) {

                $nav_a.removeClass('active');
                $this.addClass('active');

              }

              // Otherwise, if this section's link is the one that's locked, unlock it.
              else if ($this.hasClass('active-locked'))
                $this.removeClass('active-locked');

            }
          });

        });

    }

    // Scrolly.
    $('.scrolly').scrolly({
      speed: 750
    });
    
    // not support IE, safari yet.
    function unsupportedBroswer() {
      var ua = navigator.userAgent;
      var is_ie = ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1;
      var is_safari = !!ua.match(/Version\/[\d\.]+.*Safari/) || ua.indexOf('Mac') !== -1;
      return is_ie || is_safari;
    }
      
    // animation video
    var videobox = document.getElementById('video-anim');
    var video = videobox.querySelector('video');
    if(unsupportedBroswer() || !document.createElement('video').canPlayType) {
      videobox.querySelector('img').style.display = 'block';
      video.style.display = 'none';
    } else {
      video.style.display = 'block';
      video.autoplay = true;
      video.muted = true;
      video.controls = false;
      video.load();
      var playPromise = video.play();
      // In browsers that don’t yet support this functionality,
      // playPromise won’t be defined.
      if (playPromise !== undefined) {
        playPromise.then(function() {
          // Automatic playback started!
        }).catch(function(error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
          videobox.querySelector('img').style.display = 'block';
          video.style.display = 'none';
          console.error(error);
        });
      }
    }

    // cursor event
    var cursor = document.getElementById('cursor');
    var pressSize = 64, defaultSize = 32;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', enlargeCursor);
    document.addEventListener('mouseup', shrinkCursor);
    document.addEventListener('touchstart', hideCursor, false);
    document.addEventListener('touchend', hideCursor, false);
    document.addEventListener('touchmove', hideCursor, false);
    document.addEventListener('touchcancel', hideCursor, false);

    function onMouseMove(e) {
      cursor.style.display = 'block';
      cursor.style.top = e.pageY + 'px';
      cursor.style.left = e.pageX + 'px';
    }

    function enlargeCursor(e) {
      cursor.style.width = cursor.style.height = pressSize + 'px';
    }

    function shrinkCursor(e) {
      cursor.style.width = cursor.style.height = defaultSize + 'px';
    }

    function hideCursor(e) {
      cursor.style.display = 'none';
    }

    $("a").each(function(i, e) {
      $(e).on('mouseover', function(){
        enlargeCursor();
        cursor.style.background = '#fbf074';
      });
      $(e).on('mouseout', function(){
        shrinkCursor();
        cursor.style.background = 'white';
      });
    });

    // menu
    $("#top a[href]").on('click', function() {
      $("#top").fadeOut();
    });
    $(".overlay-close").on('click', function(e){
      $("#top").fadeOut();
    });
    $(".overlay-show").on('click', function(e){
      $("#top").fadeIn();
    });

    // scrollspy activation
    $(window).on('scroll', function(){
      let selected = false;
      $(".sidebar.navigator").find("a").each(function(i, e) {
        let element = document.getElementById(e.href.split('#')[1]);
        let rect = element.getBoundingClientRect();
        if (!selected && 0 <= rect.y && rect.y < window.innerHeight) {
          e.setAttribute('class', 'active');
          selected = true;
        } else {
          e.removeAttribute('class');
        }
      });
    });
  });

})(jQuery);