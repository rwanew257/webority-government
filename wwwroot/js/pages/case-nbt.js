// Other Government Projects — carousel: arrows + dots
    (function () {
      var track = document.getElementById('otherProjectsTrack');
      var prev = document.getElementById('otherProjectsPrev');
      var next = document.getElementById('otherProjectsNext');
      var dotsRoot = document.getElementById('otherProjectsDots');
      if (!track) return;
      var cards = track.querySelectorAll('.op-card');
      var dots = dotsRoot ? dotsRoot.querySelectorAll('.op-dot') : [];
      if (!cards.length) return;
      
      function cardStep() {
        if (cards.length < 2) return cards[0].offsetWidth;
        return cards[1].offsetLeft - cards[0].offsetLeft;
      }
      function visibleCount() {
        var step = cardStep();
        if (!step) return 1;
        return Math.max(1, Math.round(track.clientWidth / step));
      }
      function pageCount() {
        return Math.max(1, cards.length - visibleCount() + 1);
      }
      function activeIndex() {
        var step = cardStep();
        if (!step) return 0;
        return Math.round(track.scrollLeft / step);
      }
      function syncDots() {
        if (!dots.length) return;
        var idx = activeIndex();
        var pages = pageCount();
        dots.forEach(function (d, i) {
          // Map the (pageCount) pages onto the 6 dots evenly so the indicator
          // still moves even if there are more/fewer cards than dots.
          var ratio = pages > 1 ? idx / (pages - 1) : 0;
          var dotIndex = Math.round(ratio * (dots.length - 1));
          d.classList.toggle('is-active', i === dotIndex);
        });
      }
      function syncArrows() {
        if (prev) prev.disabled = activeIndex() <= 0;
        if (next) next.disabled = activeIndex() >= pageCount() - 1;
      }
      
      if (prev) prev.addEventListener('click', function () {
        track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
      if (next) next.addEventListener('click', function () {
        track.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });
      
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          var pages = pageCount();
          var targetIdx = Math.round((i / Math.max(1, dots.length - 1)) * (pages - 1));
          track.scrollTo({ left: targetIdx * cardStep(), behavior: 'smooth' });
        });
      });
      
      var ticking = false;
      track.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            syncDots();
            syncArrows();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
      
      syncDots();
      syncArrows();
      window.addEventListener('resize', function () { syncDots(); syncArrows(); });
    })();
