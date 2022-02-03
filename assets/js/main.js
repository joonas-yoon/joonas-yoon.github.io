(function ($) {
  const DEBUG = false;
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
      cursor.style.top = e.clientY + 'px';
      cursor.style.left = e.clientX + 'px';
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

    $('[modal-href]').each(function (i, el) {
      el.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        const bgColor = el.getAttribute('modal-bg') || '#1b1b1b';
        const fgColor = el.getAttribute('modal-fg') || 'white';
        $modalWrapper.css('background-color', bgColor);
        $modalWrapper.css('color', fgColor);
        $modalWrapper.find('.modal-close-button > svg').css('fill', fgColor);

        const url = el.getAttribute('modal-href');
        const $spinner = $modal.find('#modal-spinner');
        const $content = $modal.find('#modal-content');
        $content.html(''); // remove previous page
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

    function Dot(x, y) {
      const self = this;

      this.speed = 0.3;
      this.dx = Math.random() * (Math.random() < 0.5 ? -1 : 1) * this.speed;
      this.dy = Math.random() * (Math.random() < 0.5 ? -1 : 1) * this.speed;
      this.dz = Math.random() * (Math.random() < 0.5 ? -1 : 1) * 0.1;
      this.x = x;
      this.y = y;
      this.z = Math.random();
      this.ix = 0; // inertia by force
      this.iy = 0; // inertia by force
      this.width = 0;
      this.height = 0;

      const setBounds = function (width, height) {
        self.width = width;
        self.height = height;
      };

      const drawLine = function (context, p1, p2, color) {
        context.beginPath();
        context.moveTo(p1.getX(), p1.getY());
        context.lineTo(p2.getX(), p2.getY());
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = color || '#000';
        context.stroke();
      };

      const drawCircle = function (context, x1, y1, radius, color) {
        context.beginPath();
        context.arc(x1, y1, radius, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle = color || '#000';
        context.fill();
      };

      const draw = function (context) {
        const opa = (1.5 - self.z) / 200 + 0.5;
        drawCircle(
          context,
          self.x,
          self.y,
          Math.max(1, 2 - self.z),
          'rgba(255, 255, 255, ' + opa + ')'
        );
      };

      const move = function () {
        const nx = self.x + self.dx + self.ix;
        const ny = self.y + self.dy + self.iy;
        const nz = self.z + self.dz;
        if (nx <= 0 || nx >= self.width) self.dx *= -1;
        if (ny <= 0 || ny >= self.height) self.dy *= -1;
        if (nz <= 0 || nz >= 1.5) self.dz *= -1;
        self.x = Math.max(0, Math.min(nx, self.width));
        self.y = Math.max(0, Math.min(ny, self.height));
        self.z = nz;
        self.dx += self.ix * 0.005;
        self.dy += self.iy * 0.005;
        self.ix *= 0.95;
        self.iy *= 0.95;
      };

      const distance = function (p) {
        const dx = self.x - p.getX();
        const dy = self.y - p.getY();
        return Math.sqrt(dx * dx + dy * dy);
      };

      const getX = function () {
        return self.x;
      };
      const getY = function () {
        return self.y;
      };
      const setXY = function (x, y) {
        self.x = x;
        self.y = y;
      };
      const setVector = function (dx, dy) {
        self.dx = dx;
        self.dy = dy;
      };
      const getVector = function () {
        return {
          dx: self.dx + self.ix,
          dy: self.dy + self.iy,
        };
      };

      const pushForce = function (x1, y1) {
        self.ix += x1;
        self.iy += y1;
      };

      return {
        getX: getX,
        getY: getY,
        set: setXY,
        setVector: setVector,
        getVector: getVector,
        setBounds: setBounds,
        drawLine: drawLine,
        drawCircle: drawCircle,
        draw: draw,
        move: move,
        getDistance: distance,
        pushForce: pushForce,
      };
    }

    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cursorDot = new Dot(Infinity, Infinity);
    const dots = [];
    const screenResolution = canvas.width * canvas.height;
    const dotCounts = screenResolution / 100 / 128;
    for (let i = 0; i < dotCounts; ++i) {
      const dot = new Dot(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      dot.setBounds(canvas.width, canvas.height);
      dots.push(dot);
    }

    window.addEventListener('mousemove', function (evt) {
      cursorDot.set(evt.clientX, evt.clientY);
    });

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, true);
    resizeCanvas();

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // recalc bounds
      dots.forEach((d) => {
        d.setBounds(canvas.width, canvas.height);
      });
    }

    function drawDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = Math.min(window.innerWidth, window.innerHeight) / 5;
      if (DEBUG) {
        cursorDot.drawCircle(
          ctx,
          cursorDot.getX(),
          cursorDot.getY(),
          radius,
          'rgba(0, 255, 255, 0.1)'
        );
      }
      dots.forEach((dot, i) => {
        for (let j = i + 1; j < dots.length; ++j) {
          const dist = dot.getDistance(dots[j]);
          if (dist < 150) {
            const opa = Math.max(0, 0.8 - dist / 150);
            dot.drawLine(ctx, dot, dots[j], 'rgba(255, 255, 255, ' + opa + ')');
          }
        }
        // interactive with cursor
        if (cursorDot.getX() != Infinity) {
          const distFromCursor = cursorDot.getDistance(dot);
          if (distFromCursor <= radius) {
            const dx = dot.getX() - cursorDot.getX();
            const dy = dot.getY() - cursorDot.getY();
            const nx = (radius / distFromCursor) * dx;
            const ny = (radius / distFromCursor) * dy;
            const refl = new Dot(cursorDot.getX() + nx, cursorDot.getY() + ny);
            const { dx: _dx, dy: _dy } = dot.getVector();
            const dw = distFromCursor / radius;
            dot.pushForce(
              (refl.getX() - dot.getX()) * (1 - dw) * 0.001,
              (refl.getY() - dot.getY()) * (1 - dw) * 0.001
            );
            if (DEBUG) {
              refl.drawLine(ctx, refl, dot, 'rgb(255, 255, 0, 0.5)');
              cursorDot.drawLine(ctx, cursorDot, dot, 'rgb(255, 0, 255, 0.5)');
            }
          }

          if (DEBUG) {
            const { dx, dy } = dot.getVector();
            const dot2 = new Dot(dot.getX() + dx * 100, dot.getY() + dy * 100);
            dot.drawLine(ctx, dot, dot2, 'rgb(255, 128, 0, 0.5)');
          }
        }
        // update and draw
        dot.move();
        dot.draw(ctx);
      });
      window.requestAnimationFrame(drawDots);
    }
    window.requestAnimationFrame(drawDots);
  });
})(jQuery);
