(function ($) {
  $(function () {
    const $window = $(window);
    const $body = $('body');
    const $main = $('#main');

    // Disable animations/transitions until the page has loaded.
    $body.addClass('is-loading');

    $window.on('load', function () {
      window.setTimeout(function () {
        $body.removeClass('is-loading');
      }, 100);
    });

    // not support IE, safari yet.
    function unsupportedBroswer() {
      const ua = navigator.userAgent;
      const isIE = ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1;
      const isSafari =
        !!ua.match(/Version\/[\d\.]+.*Safari/) || ua.indexOf('Mac') !== -1;
      return isIE || isSafari;
    }

    // animation video
    const videobox = document.getElementById('video-anim');
    const video = videobox.querySelector('video');
    if (unsupportedBroswer() || !document.createElement('video').canPlayType) {
      videobox.querySelector('img').style.display = 'block';
      video.style.display = 'none';
    } else {
      video.style.display = 'block';
      video.autoplay = true;
      video.muted = true;
      video.controls = false;
      video.load();
      const playPromise = video.play();
      // In browsers that don’t yet support this functionality,
      // playPromise won’t be defined.
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            // Automatic playback started!
          })
          .catch(function (error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
            videobox.querySelector('img').style.display = 'block';
            video.style.display = 'none';
            console.error(error);
          });
      }
    }

    // cursor event
    const cursor = document.getElementById('cursor');
    const pressSize = 64;
    const defaultSize = 32;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', enlargeCursor);
    document.addEventListener('mouseup', shrinkCursor);
    document.addEventListener('touchstart', hideCursor, false);
    document.addEventListener('touchend', hideCursor, false);
    document.addEventListener('touchmove', hideCursor, false);
    document.addEventListener('touchcancel', hideCursor, false);

    function onMouseMove(e) {
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

    function addCursorEvents(container) {
      $(container)
        .find('a')
        .each(function (i, e) {
          $(e).on('mouseover', function () {
            enlargeCursor();
            cursor.style.background = '#fbf074';
          });
          $(e).on('mouseout', function () {
            shrinkCursor();
            cursor.style.background = 'white';
          });
        });
    }
    addCursorEvents(document);

    // menu
    $('#top a[href]').on('click', function () {
      $('#top').fadeOut();
    });
    $('.overlay-close').on('click', function (e) {
      $('#top').fadeOut();
    });
    $('.overlay-show').on('click', function (e) {
      $('#top').fadeIn();
    });

    // scrollspy activation
    $(window).on('scroll', function () {
      let selected = false;
      $('.sidebar.navigator')
        .find('a')
        .each(function (i, e) {
          const element = document.getElementById(e.href.split('#')[1]);
          const rect = element.getBoundingClientRect();
          if (!selected && 0 <= rect.y && rect.y < window.innerHeight) {
            e.setAttribute('class', 'active');
            selected = true;
          } else {
            e.removeAttribute('class');
          }
        });
    });

    // modal
    const $modal = $('#modal');
    const $modalWrapper = $modal.find('.modal-wrapper');

    $('a[modal-href]').each(function (i, el) {
      el.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const bgColor = el.getAttribute('modal-bg');
        const fgColor = el.getAttribute('modal-fg');
        $modalWrapper.css('background-color', bgColor || '#1b1b1b');
        $modalWrapper.css('color', fgColor || 'white');

        const url = el.getAttribute('modal-href');
        const $spinner = $modal.find('#modal-spinner');
        const $content = $modal.find('#modal-content');
        $spinner.show();
        $modal.fadeIn();

        $.ajax({
          url: 'pages/' + url,
          dataType: 'html',
          success: function (html) {
            $content.html(html);
            addCursorEvents($content);
          },
          error: function (request, status, error) {
            $content.html(
              `<div class="error"><h1>${request.status}</h1><p class="sorry">Sorry, the page you tried cannot be found.</p><p class="detail">${status} ${error}</p></div>`
            );
          },
          complete: function () {
            $spinner.hide();
          },
        });
      });
    });
    $('.modal-bg').on('click', function (e) {
      $modal.fadeOut();
    });
    $('.modal-close-button').on('click', function (e) {
      $modal.fadeOut();
    });
  });
})(jQuery);
