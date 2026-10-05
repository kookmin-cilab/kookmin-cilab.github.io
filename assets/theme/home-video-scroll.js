(function () {
  var scroller = document.querySelector(".home-video-scroll");

  if (!scroller) {
    return;
  }

  scroller.addEventListener(
    "wheel",
    function (event) {
      var maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
      var atTop = scroller.scrollTop <= 1;
      var atBottom = scroller.scrollTop >= maxScrollTop - 1;
      var leavingTop = event.deltaY < 0 && atTop;
      var leavingBottom = event.deltaY > 0 && atBottom;

      if (!leavingTop && !leavingBottom) {
        return;
      }

      var unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;

      event.preventDefault();
      window.scrollBy(0, event.deltaY * unit);
    },
    { passive: false }
  );
})();
