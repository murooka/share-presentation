(function () {
  /**
   * Statistics
   */
  var socket = io.connect('/statistics');

  var _canvas,
      _graph;

  var _CANVAS_ID = 'canvas',
      _CANVAS_WIDTH = 900,
      _CANVAS_HEIGHT = 400;

  function initialize() {
    _initCanvas(_CANVAS_WIDTH, _CANVAS_HEIGHT);
  }

  function _initCanvas(width, height) {
    _canvas = document.getElementById(_CANVAS_ID);
    _canvas.width = width;
    _canvas.height = height;
    _canvas.style.position = 'relative';
    _canvas.style.left = '0';
    _canvas.style.top = '0';
    _canvas.style.zIndex = '1000';
    _canvas.style.float = 'left';

    _graph = new Graph(_canvas);
  }

  /**
   * Receive events
   */
  socket.on('statistics', function (count) {
    var arr, i, length,
        presenterIndex,
        data = [],
        total_user_count = {
          presenter: 0
        , listener : 0
        };

    /* Draw graph */
    // TODO: グラフの長さを動的に変える
    // TODO: 凡例つける
    _graph.clear();

    // Draw presenter page index
    arr = count.presenter;
    presenterIndex = arr.indexOf(Math.max.apply(null, arr));
    for (i = 0, length = arr.length; i < length; i++) {
      data[i] = (arr[i]) ? [i + 1, 36] : [i + 1, 0];
    }
    _graph.setData(data);
    _graph.setColor('rgba(224, 74, 40, .5)');
    _graph.setBarWidth(2);
    _graph.hideValue();
    _graph.draw();

    // Draw listener page view count
    arr = count.listener;

    for (i = 0, length = arr.length; i < length; i++) {
      // For graph
      data[i] = [i + 1, arr[i]];
      // For total count
      total_user_count.listener += arr[i];
    }

    // Set data
    _graph.setData(data);
    // Set styles
    _graph.setColor('rgba(0, 122, 255, .8)');
    _graph.setType('bar');
    _graph.setBarWidth(10);
    _graph.setScale(15, 10);
    _graph.showValue();
    // Draw graph
    _graph.draw();

    // Show total count
    var user_count = document.getElementById('user-count');
    user_count.innerHTML = '<p>Listener: ' + total_user_count.listener + '</p>';
  });

  /**
   * Initialize
   */
  window.addEventListener('DOMContentLoaded', initialize, false);
})();
