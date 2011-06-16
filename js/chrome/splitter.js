$.fn.splitter = function () {
  var $document = $(document);
  var splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[]');
  return this.each(function () {
    var $el = $(this), 
        guid = $.fn.splitter.guid++,
        $parent = $el.parent(),
        $prev = $el.prev(),
        $handle = $('<div class="resize"></div>'),
        $blocker = $('<div class="block" />').css({ cursor: 'pointer', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 'z-index': 99999, width: '100%', height: '100%' }),
        dragging = false,
        width = $parent.width(),
        left = $parent.offset().left,
        settings = splitterSettings[guid] || {};

    function moveSplitter(posX) {
      var x = posX - left,
          split = 100 / width * x;

      if (split > 10 && split < 90) {
        $el.css('left', split + '%');
        $prev.css('right', (100 - split) + '%');
        $handle.css({
          left: split + '%'
        });
        settings.x = posX;
        splitterSettings[guid] = settings;
        console.log('set: ', JSON.stringify(splitterSettings));
        localStorage.setItem('splitterSettings', JSON.stringify(splitterSettings));
      }
    }

    $document.mouseup(function () {
      dragging = false;
      $blocker.remove();
      $handle.css('opacity', '0');
    }).mousemove(function (event) {
      if (dragging) {
        moveSplitter(event.pageX);
      }
    });

    $handle.mousedown(function (e) {
      dragging = true;
      $('body').append($blocker);
      // TODO layer on div to block iframes from stealing focus
      width = $parent.width();
      left = $parent.offset().left;
      e.preventDefault();
    }).hover(function () {
      $handle.css('opacity', '1');
    }, function () {
      if (!dragging) {
        $handle.css('opacity', '0');
      }
    });

    $handle.bind('init', function (event, x) {
      $handle.css({
        top: 0,
        // left: (100 / width * $el.offset().left) + '%',
        bottom: 0,
        width: 4,
        opacity: 0,
        position: 'absolute',
        cursor: 'pointer',
        'border-left': '1px solid rgba(218, 218, 218, 0.5)',
        'z-index': 99999
      });
      
      if ($el.is(':hidden')) {
        $handle.hide();
      } else {
        moveSplitter(x || $el.offset().left);
      }
    }).trigger('init', settings.x || $el.offset().left);

    $prev.css('width', 'auto');
    $el.data('splitter', $handle);
    $el.before($handle);


  });
};

$.fn.splitter.guid = 0;