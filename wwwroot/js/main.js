/* Webority Government — Interactivity */

(function () {
  'use strict';

  // Mobile nav is the Bootstrap offcanvas (#mobileNav) with collapse-driven
  // submenu accordions — open/close, backdrop, ESC, scroll-lock and the
  // accordions are all handled by Bootstrap; no custom JS needed here.

  // Sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Shared megamenu markup — single source of truth. index.html / services.html
  // ship this markup statically; every other page is missing it, so we inject
  // the IDENTICAL markup here (nav data-attributes + both panels) before the
  // binding logic below runs. Result: the exact same Services + Case Studies
  // megamenu renders on every page. Guarded so static pages are left untouched.
  (function injectMegamenu() {
    var headerEl = document.getElementById('siteHeader');
    var navMenuEl = document.getElementById('navMenu');
    if (!headerEl || !navMenuEl || document.querySelector('.megamenu')) return;

    // Promote the Services and Case Studies nav items to megamenu triggers.
    [['services.html', 'services'], ['case-studies.html', 'case-studies']].forEach(function (pair) {
      var a = navMenuEl.querySelector('a[href="' + pair[0] + '"]');
      if (!a) return;
      var li = a.closest('li');
      if (!li) return;
      li.classList.add('has-megamenu');
      li.setAttribute('data-megamenu', pair[1]);
      a.setAttribute('aria-haspopup', 'true');
      a.setAttribute('aria-expanded', 'false');
    });

    var panels = document.createElement('div');
    panels.innerHTML = [
      '<div class="megamenu" id="megamenu-services" data-megamenu-panel="services" aria-hidden="true">',
        '<div class="container"><div class="megamenu-grid">',
          '<div class="megamenu-col">',
            '<span class="megamenu-eyebrow">Services</span>',
            '<ul class="megamenu-list" role="list">',
              '<li><a href="services.html#egov"><h5>e-Governance &amp; Custom Software</h5><p>NIC-compatible platforms, G2C/G2G/G2B</p></a></li>',
              '<li><a href="services.html#staff"><h5>IT Staff Augmentation</h5><p>Vetted engineers for ministries &amp; PSUs</p></a></li>',
              '<li class="is-active"><a href="services.html#mobile"><h5>Citizen Mobile &amp; Web Apps</h5><p>High-capacity floor units</p></a></li>',
              '<li><a href="services.html#consulting"><h5>Digital Transformation Consulting</h5><p>Roadmaps, RFP support, PMU</p></a></li>',
            '</ul>',
          '</div>',
          '<div class="megamenu-col">',
            '<ul class="megamenu-list" role="list">',
              '<li><a href="services.html#ai"><h5>AI &amp; Data Analytics</h5><p>Dashboard, NLP, fraud detection, MLOps</p></a></li>',
              '<li><a href="services.html#security"><h5>Cybersecurity &amp; VAPT</h5><p>CERT-In, ISO 27001, DPDP compliance</p></a></li>',
              '<li><a href="services.html#legacy"><h5>Legacy System Modernisation</h5><p>Migration without disrupting operations</p></a></li>',
              '<li><a href="services.html#cloud"><h5>Cloud &amp; Managed Services</h5><p>MeghRaj, NIC hosting, AMC, 24x7</p></a></li>',
            '</ul>',
          '</div>',
          '<div class="megamenu-col megamenu-col--feature">',
            '<span class="megamenu-eyebrow">New Case Study</span>',
            '<a class="megamenu-feature" href="case-studies.html">',
              '<div class="megamenu-feature-img" aria-hidden="true"><img src="images/logos/gov/Menu card Bee Design.png" alt="" loading="lazy" /></div>',
              '<div class="megamenu-feature-body"><h5>Bee Star Label mobile app</h5><p>National appliance compliance platform &mdash; offline field inspection app for SDA officers, real-time central.</p><span class="megamenu-feature-cta">Explore Full Case Study &rsaquo;</span></div>',
            '</a>',
          '</div>',
        '</div></div>',
      '</div>',
      '<div class="megamenu" id="megamenu-case-studies" data-megamenu-panel="case-studies" aria-hidden="true">',
        '<div class="container">',
          '<div class="csmenu-head"><span class="megamenu-eyebrow">Case Studies</span><span class="megamenu-eyebrow csmenu-head-feature">New Case Study</span></div>',
          '<div class="csmenu-layout">',
            '<ul class="csmenu-list">',
              '<li><a class="csmenu-link" href="case-bee.html" data-csimg="images/logos/gov/BEE Case Study image.png" data-cstitle="Bureau of Energy Efficiency" data-cssub="Ministry of Power"><span class="csmenu-link-title">Bureau of Energy Efficiency</span><span class="csmenu-link-sub">Ministry of Power</span></a></li>',
              '<li><a class="csmenu-link" href="case-parliament.html" data-csimg="images/logos/gov/Parilament Case Study image.png" data-cstitle="Sansad Cafeteria" data-cssub="Ministry of Parliamentary Affairs"><span class="csmenu-link-title">Sansad Cafeteria</span><span class="csmenu-link-sub">Ministry of Parliamentary Affairs</span></a></li>',
              '<li><a class="csmenu-link" href="case-manthan.html" data-csimg="images/logos/gov/Manthan Case Study image.png" data-cstitle="Manthan Application" data-cssub="Ministry of Defence"><span class="csmenu-link-title">Manthan Application</span><span class="csmenu-link-sub">Ministry of Defence</span></a></li>',
              '<li><a class="csmenu-link" href="case-nbt.html" data-csimg="images/logos/gov/NBT Case Study image.png" data-cstitle="National Book Trust E-commerce" data-cssub="Ministry of Education"><span class="csmenu-link-title">National Book Trust E-commerce</span><span class="csmenu-link-sub">Ministry of Education</span></a></li>',
            '</ul>',
            '<ul class="csmenu-list">',
              '<li><a class="csmenu-link" href="case-mota.html" data-csimg="images/logos/gov/Sickle Scan Case Study image.png" data-cstitle="Sickle Scan — Health Screening" data-cssub="Ministry of Tribal Affairs"><span class="csmenu-link-title">Sickle Scan — Health Screening</span><span class="csmenu-link-sub">Ministry of Tribal Affairs</span></a></li>',
              '<li><a class="csmenu-link" href="case-ssb.html" data-csimg="images/logos/gov/SSB Case Study image.png" data-cstitle="Sashastra Seema Bal" data-cssub="Ministry of Home Affairs"><span class="csmenu-link-title">Sashastra Seema Bal</span><span class="csmenu-link-sub">Ministry of Home Affairs</span></a></li>',
              '<li><a class="csmenu-link" href="case-qci.html" data-csimg="images/logos/gov/Samar Case Study image.png" data-cstitle="SAMAR — Certification &amp; Assessment" data-cssub="Ministry of Commerce &amp; Industry"><span class="csmenu-link-title">SAMAR — Certification &amp; Assessment</span><span class="csmenu-link-sub">Ministry of Commerce &amp; Industry</span></a></li>',
              '<li><a class="csmenu-link" href="case-safdarjung.html" data-csimg="images/logos/gov/Sarfdarnjan Case Study image.png" data-cstitle="Safdarjung Hospital" data-cssub="Ministry of Health &amp; Family Welfare"><span class="csmenu-link-title">Safdarjung Hospital</span><span class="csmenu-link-sub">Ministry of Health &amp; Family Welfare</span></a></li>',
            '</ul>',
            '<div class="csmenu-preview">',
              '<div class="csmenu-preview-frame"><img class="csmenu-preview-img" src="" alt="" /><span class="csmenu-preview-empty">Hover a case study to preview</span></div>',
              '<div class="csmenu-preview-cap"><span class="csmenu-preview-title"></span><span class="csmenu-preview-sub"></span></div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
    while (panels.firstChild) { headerEl.appendChild(panels.firstChild); }
  })();

  // Services megamenu — open on hover/focus/click, close on outside click,
  // pointer-leave (with grace delay so user can move onto the panel), or Esc.
  // The panel is a sibling of the nav (not inside the trigger li) so CSS
  // hover selectors can't reach it — handled entirely from JS.
  document.querySelectorAll('[data-megamenu]').forEach(function (trigger) {
    var panelId = trigger.getAttribute('data-megamenu');
    var panel = document.querySelector('[data-megamenu-panel="' + panelId + '"]');
    var link = trigger.querySelector('a');
    if (!panel || !link) return;

    var closeTimer = null;
    var siteHeader = document.getElementById('siteHeader');
    function open() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      panel.classList.add('is-open');
      link.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      if (siteHeader) siteHeader.classList.add('has-open-megamenu');
    }
    function close() {
      panel.classList.remove('is-open');
      link.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      if (siteHeader && !document.querySelector('.megamenu.is-open')) {
        siteHeader.classList.remove('has-open-megamenu');
      }
    }
    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 160);
    }

    trigger.addEventListener('mouseenter', open);
    trigger.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', open);
    panel.addEventListener('mouseleave', scheduleClose);
    link.addEventListener('focus', open);

    // Click on the Services link navigates to services.html (default <a>
    // behavior). The megamenu still opens on hover via mouseenter above.

    document.addEventListener('click', function (e) {
      if (trigger.contains(e.target) || panel.contains(e.target)) return;
      if (panel.classList.contains('is-open')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!panel.classList.contains('is-open')) return;
      close();
      link.focus();
    });
  });

  // Case Studies megamenu — hover a name to reveal its preview image on the
  // right. No image is shown until a name is hovered (per design).
  (function () {
    var panel = document.querySelector('[data-megamenu-panel="case-studies"]');
    if (!panel) return;
    var frame = panel.querySelector('.csmenu-preview-frame');
    var img = panel.querySelector('.csmenu-preview-img');
    var titleEl = panel.querySelector('.csmenu-preview-title');
    var subEl = panel.querySelector('.csmenu-preview-sub');
    var links = panel.querySelectorAll('.csmenu-link');
    if (!frame || !img || !links.length) return;

    // Static preview — show Bee menu card image, never swap on hover.
    img.setAttribute('src', 'images/logos/gov/Bee Menu card image.png');
    img.setAttribute('alt', 'BEE Star Label mobile app');
    frame.classList.add('is-active');
  })();

  // Sectors v2 accordion — click a row to expand its body, close others,
  // and fade-swap the big sticky photo + pill label on the left.
  (function () {
    var items = document.querySelectorAll('.sectors-v2-acc-item');
    if (!items.length) return;
    var frame = document.querySelector('.sectors-v2-frame');
    var img = frame && frame.querySelector('.sectors-v2-img');
    var tagLabel = frame && frame.querySelector('.sectors-v2-tag-label');

    var swapTimer = null;
    function activate(item) {
      items.forEach(function (el) {
        var head = el.querySelector('.sectors-v2-acc-head');
        var open = el === item;
        el.classList.toggle('is-open', open);
        if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      if (!frame || !img) return;
      var nextSrc = item.getAttribute('data-img');
      var nextLabel = item.getAttribute('data-label') || '';
      if (!nextSrc || nextSrc === img.getAttribute('src')) return;
      frame.classList.add('is-swapping');
      if (swapTimer) clearTimeout(swapTimer);
      swapTimer = setTimeout(function () {
        img.setAttribute('src', nextSrc);
        if (tagLabel) tagLabel.innerHTML = nextLabel;
        frame.classList.remove('is-swapping');
      }, 220);
    }

    items.forEach(function (item) {
      var head = item.querySelector('.sectors-v2-acc-head');
      if (!head) return;
      head.addEventListener('click', function () {
        if (item.classList.contains('is-open')) return; // keep one open at all times
        activate(item);
      });
    });
  })();

  // Caps v2 accordion — mirrors sectors-v2 behaviour for "Our Capabilities".
  (function () {
    var items = document.querySelectorAll('.caps-v2-acc-item');
    if (!items.length) return;
    var frame = document.querySelector('.caps-v2-frame');
    var img = frame && frame.querySelector('.caps-v2-img');
    var tagLabel = frame && frame.querySelector('.caps-v2-tag-label');

    var swapTimer = null;
    function activate(item) {
      items.forEach(function (el) {
        var head = el.querySelector('.caps-v2-acc-head');
        var open = el === item;
        el.classList.toggle('is-open', open);
        if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      if (!frame || !img) return;
      var nextSrc = item.getAttribute('data-img');
      var nextLabel = item.getAttribute('data-label') || '';
      if (!nextSrc || nextSrc === img.getAttribute('src')) return;
      // Direct swap — no fade-out or scale animation
      img.setAttribute('src', nextSrc);
      if (tagLabel) tagLabel.innerHTML = nextLabel;
    }

    items.forEach(function (item) {
      var head = item.querySelector('.caps-v2-acc-head');
      if (!head) return;
      head.addEventListener('click', function () {
        if (item.classList.contains('is-open')) return;
        activate(item);
      });
      // Hover anywhere on the item also swaps the image + opens it
      item.addEventListener('mouseenter', function () {
        if (item.classList.contains('is-open')) return;
        activate(item);
      });
    });
  })();

  // Reveal-on-scroll animation
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Stats counter animation — counts 0 → data-target when scrolled into view
  const counters = document.querySelectorAll('.stats-number[data-target]');
  if ('IntersectionObserver' in window && counters.length) {
    const animate = function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 1400;
      const start = performance.now();
      const tick = function (now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * eased).toString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) {
      c.textContent = '0';
      obs.observe(c);
    });
  }

  // Services page — sticky tab nav, active state follows scroll position
  const svcTabs = document.querySelectorAll('.svc-tab');
  if (svcTabs.length && 'IntersectionObserver' in window) {
    const tabByHref = {};
    svcTabs.forEach(function (t) {
      const href = t.getAttribute('href');
      if (href && href.charAt(0) === '#') tabByHref[href.slice(1)] = t;
    });
    const sections = Object.keys(tabByHref)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    function setActive(id) {
      svcTabs.forEach(function (t) { t.classList.remove('is-active'); });
      if (tabByHref[id]) {
        tabByHref[id].classList.add('is-active');
        // Auto-scroll the active tab into view inside the horizontal scroller
        const scroller = tabByHref[id].parentElement;
        if (scroller && scroller.scrollWidth > scroller.clientWidth) {
          const tab = tabByHref[id];
          const left = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
          scroller.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
        }
      }
    }

    // Default active = first tab
    if (sections[0]) setActive(sections[0].id);

    const obs = new IntersectionObserver(function (entries) {
      // Find the section nearest the top of the viewport
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });

    // Click handler — smooth-scroll with offset for the sticky header + tab bar
    svcTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        const href = tab.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        const offset = (document.getElementById('siteHeader') ? document.getElementById('siteHeader').offsetHeight : 64) +
                       (document.getElementById('svcTabs') ? document.getElementById('svcTabs').offsetHeight : 56);
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset + 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
        setActive(target.id);
      });
    });
  }

  // Sector tabs — scroll-spy: all panels are visible, tabs highlight the
  // panel currently in view, and clicking a tab smooth-scrolls to its panel.
  const sectorTabs = document.querySelectorAll('.sector-tab');
  if (sectorTabs.length) {
    const tabByKey = {};
    sectorTabs.forEach(function (tab) {
      const key = tab.getAttribute('data-tab');
      if (key) tabByKey[key] = tab;
    });

    // Keep the active tab visible inside the horizontal scroll strip — scrolls
    // only the strip (not the page) so the active tab is never hidden off-edge.
    const tabsScroll = document.querySelector('.sector-tabs-scroll');
    const revealTab = function (tab) {
      if (!tabsScroll || !tab) return;
      const cRect = tabsScroll.getBoundingClientRect();
      const tRect = tab.getBoundingClientRect();
      const delta = (tRect.left + tRect.width / 2) - (cRect.left + cRect.width / 2);
      tabsScroll.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const setActive = function (key) {
      let activeTab = null;
      sectorTabs.forEach(function (t) {
        const isActive = t.getAttribute('data-tab') === key;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) activeTab = t;
      });
      revealTab(activeTab);
    };

    sectorTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        const key = tab.getAttribute('data-tab');
        const panel = document.getElementById('panel-' + key);
        if (!panel) return;
        setActive(key);
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const panels = document.querySelectorAll('.sector-panel');
    if (panels.length && 'IntersectionObserver' in window) {
      // Trigger when the panel's top crosses ~25% from the top of the viewport.
      const observer = new IntersectionObserver(function (entries) {
        // Pick the entry whose top is closest to (but past) the trigger line.
        let best = null;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (!best || entry.boundingClientRect.top < best.boundingClientRect.top) {
            best = entry;
          }
        });
        if (best) {
          const id = best.target.id.replace('panel-', '');
          if (tabByKey[id]) setActive(id);
        }
      }, {
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
      });
      panels.forEach(function (p) { observer.observe(p); });
    }
  }

  // FAQ accordion — toggles .open on .faq-item when .faq-q is clicked
  const faqButtons = document.querySelectorAll('.faq-q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const opening = !item.classList.contains('open');
      item.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
  });

  // Simple form handler (frontend only — wire to backend later)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const status = document.getElementById('formStatus');
      const data = new FormData(form);
      // Basic validation
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        status.textContent = 'Please complete all required fields.';
        status.style.color = '#c0392b';
        return;
      }
      // Pretend-submit
      status.textContent = 'Thank you. Your enquiry has been recorded — our public-sector team will respond within one business day.';
      status.style.color = 'var(--color-success)';
      form.reset();
    });
  }

  // Cursor-tracked glow — updates --mx / --my CSS vars used by ::before
  // radial gradient. Applies to every .btn so the hover-glow is universal.
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mx', x + '%');
      btn.style.setProperty('--my', y + '%');
    });
    btn.addEventListener('pointerleave', function () {
      btn.style.setProperty('--mx', '50%');
      btn.style.setProperty('--my', '50%');
    });
  });

  // Auto-wrap every .btn so both its text and any icons slide together.
  // On hover, the line shifts up and a duplicate enters from below — same
  // effect as the hand-coded .ai-cta. Skips buttons that already use the
  // .ai-cta-marquee or .btn-marquee patterns.
  document.querySelectorAll('.btn').forEach(function (btn) {
    if (btn.dataset.marqueed === '1') return;
    if (btn.querySelector('.ai-cta-marquee')) return;
    if (btn.querySelector('.btn-marquee')) return;

    var ariaText = btn.textContent.replace(/\s+/g, ' ').trim();
    var contentHTML = btn.innerHTML.trim();
    if (!contentHTML) return;

    btn.innerHTML =
      '<span class="btn-marquee" aria-hidden="true">' +
        '<span class="btn-marquee-line">' + contentHTML + '</span>' +
        '<span class="btn-marquee-line">' + contentHTML + '</span>' +
      '</span>';

    if (ariaText && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')) {
      btn.setAttribute('aria-label', ariaText);
    }
    btn.dataset.marqueed = '1';
  });

  // Sectors we serve — swap image + title + description on hover of list items
  var sectorsItems = document.querySelectorAll('.sectors-item');
  var sectorsImg = document.querySelector('.sectors-visual-img');
  var sectorsTitle = document.querySelector('.sectors-visual-title');
  var sectorsDesc = document.querySelector('.sectors-visual-desc');
  if (sectorsItems.length && sectorsImg && sectorsTitle && sectorsDesc) {
    sectorsItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        sectorsItems.forEach(function (i) { i.classList.remove('is-active'); });
        item.classList.add('is-active');
        var img = item.getAttribute('data-img');
        var title = item.getAttribute('data-title');
        var desc = item.getAttribute('data-desc');
        if (img) sectorsImg.src = img;
        if (title) sectorsTitle.innerHTML = title;
        if (desc) sectorsDesc.innerHTML = desc;
      });
    });
  }

  // (Shared megamenu is injected near the top of this file — see injectMegamenu.)

  // Scroll-driven timeline animation (about page)
  // — vertical rail "draws" from top to bottom as the section scrolls into view
  // — each timeline row fades up + dot pops as it enters the viewport
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    var rows = timeline.querySelectorAll('.timeline-row');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      timeline.style.setProperty('--timeline-progress', '1');
      rows.forEach(function (r) { r.classList.add('is-in'); });
    } else {
      // Progress bar effect — rail draws as you scroll, rows fade in as the
      // line reaches each one (premium loading-bar feel).
      var ticking = false;
      var updateRail = function () {
        var rect = timeline.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var startY = vh * 0.95;
        var endY = vh * 0.35;
        var travelled = startY - rect.top;
        var distance = rect.height + (startY - endY);
        var progress = distance > 0 ? travelled / distance : 0;
        progress = Math.min(1, Math.max(0, progress));
        timeline.style.setProperty('--timeline-progress', progress.toFixed(4));

        // Reveal each row when the rail's filled height passes its centre
        var railTop = rect.top;
        var railHeight = rect.height;
        var filledPx = progress * railHeight;
        rows.forEach(function (row) {
          var rowRect = row.getBoundingClientRect();
          var rowCentreFromTop = (rowRect.top + rowRect.height * 0.35) - railTop;
          if (filledPx >= rowCentreFromTop - 4) {
            row.classList.add('is-in');
          }
        });
        ticking = false;
      };
      var onScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(updateRail);
          ticking = true;
        }
      };
      updateRail();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
  }

  // Scroll-driven reveal for the case-study scope-of-work timeline —
  // the vertical rail fills from top to bottom as the user scrolls,
  // and each step fades + pops its dot when the rail reaches it.
  // Supports both the legacy `.cs-scope-list` and the live `.scope-v2-timeline`.
  var scopeList = document.querySelector('.scope-v2-timeline') || document.querySelector('.cs-scope-list');
  if (scopeList) {
    var scopeItems = scopeList.querySelectorAll('li');
    var reduceMotionScope = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotionScope) {
      scopeList.style.setProperty('--timeline-progress', '1');
      scopeItems.forEach(function (li) { li.classList.add('is-in'); });
    } else {
      var scopeTicking = false;
      var updateScopeRail = function () {
        var rect = scopeList.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        // Step-driven progress: figure out which item the user has scrolled
        // past (its title top has crossed the upper-half of the viewport) and
        // snap the rail fill to the next circle's position. This gives a
        // smooth fill that always lines up exactly with the activated circle.
        var triggerY = vh * 0.55;
        var lastActiveIndex = -1;
        scopeItems.forEach(function (li, idx) {
          var liRect = li.getBoundingClientRect();
          // Activate when the item's title has scrolled into the upper half
          // of the viewport — the user is now "at" this step.
          if (liRect.top <= triggerY) {
            li.classList.add('is-in');
            lastActiveIndex = idx;
          } else {
            li.classList.remove('is-in');
          }
        });

        // Fill ends EXACTLY at the active circle's centre — no interpolation
        // toward the next circle. Once item N+1 crosses the trigger line it
        // becomes the active item, and the fill snaps (with CSS transition)
        // to its position. Until then, the segment between two circles stays
        // gray (showing the base rail).
        var fillPx = 0;
        if (lastActiveIndex >= 0) {
          var activeLi = scopeItems[lastActiveIndex];
          var activeRect = activeLi.getBoundingClientRect();
          fillPx = (activeRect.top + 19) - rect.top;
        }
        fillPx = Math.max(0, fillPx - 12);  // rail starts at top:12, so subtract that offset
        scopeList.style.setProperty('--timeline-fill', fillPx.toFixed(1) + 'px');
        scopeList.style.setProperty('--timeline-progress', (fillPx / Math.max(1, rect.height)).toFixed(4));
        scopeTicking = false;
      };
      var onScopeScroll = function () {
        if (!scopeTicking) {
          window.requestAnimationFrame(updateScopeRail);
          scopeTicking = true;
        }
      };
      updateScopeRail();
      window.addEventListener('scroll', onScopeScroll, { passive: true });
      window.addEventListener('resize', onScopeScroll);
    }
  }

  // Language dropdown — convert the inline .gov-lang-toggle pair into a
  // single trigger + dropdown menu with flags. Original buttons stay in DOM
  // (offscreen via CSS) and receive the .click() to drive lang-toggle.js logic.
  document.querySelectorAll('.nav-lang').forEach(function (langContainer) {
    if (langContainer.dataset.dropdownified === '1') return;
    var btnEn = langContainer.querySelector('.gov-lang-toggle[data-lang="en"]');
    var btnHi = langContainer.querySelector('.gov-lang-toggle[data-lang="hi"]');
    if (!btnEn || !btnHi) return;

    // Build dropdown trigger
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'lang-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Language');
    trigger.innerHTML =
      '<svg class="lang-globe-icon" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="10"/>' +
        '<path d="M2 12h20"/>' +
        '<ellipse cx="12" cy="12" rx="4" ry="10"/>' +
      '</svg>' +
      '<span class="lang-current">English</span>' +
      '<svg class="lang-chevron-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="6 9 12 15 18 9"/>' +
      '</svg>';

    var ukFlagSvg =
      '<svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
        '<path d="M0,0 v30 h60 v-30 z" fill="#012169"/>' +
        '<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>' +
        '<path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>' +
        '<path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>' +
      '</svg>';
    var indiaFlagSvg =
      '<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
        '<rect width="90" height="60" fill="#fff"/>' +
        '<rect width="90" height="20" fill="#FF9933"/>' +
        '<rect y="40" width="90" height="20" fill="#138808"/>' +
        '<circle cx="45" cy="30" r="7" fill="none" stroke="#000080" stroke-width="1.4"/>' +
      '</svg>';

    var menu = document.createElement('div');
    menu.className = 'lang-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML =
      '<button type="button" class="lang-option is-active" role="menuitem" data-lang="en">' +
        '<span class="lang-flag-icon">' + ukFlagSvg + '</span>' +
        '<span>ENG</span>' +
      '</button>' +
      '<button type="button" class="lang-option" role="menuitem" data-lang="hi">' +
        '<span class="lang-flag-icon">' + indiaFlagSvg + '</span>' +
        '<span lang="hi">हिंदी</span>' +
      '</button>';

    langContainer.appendChild(trigger);
    langContainer.appendChild(menu);
    langContainer.classList.add('lang-dropdown');

    var currentLabel = trigger.querySelector('.lang-current');
    var enOpt = menu.querySelector('.lang-option[data-lang="en"]');
    var hiOpt = menu.querySelector('.lang-option[data-lang="hi"]');

    function setOpen(open) {
      langContainer.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    function pick(lang) {
      if (lang === 'hi') {
        hiOpt.classList.add('is-active'); enOpt.classList.remove('is-active');
        currentLabel.textContent = 'Hindi';
        btnHi.click();
      } else {
        enOpt.classList.add('is-active'); hiOpt.classList.remove('is-active');
        currentLabel.textContent = 'English';
        btnEn.click();
      }
      setOpen(false);
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!langContainer.classList.contains('is-open'));
    });
    enOpt.addEventListener('click', function (e) { e.stopPropagation(); pick('en'); });
    hiOpt.addEventListener('click', function (e) { e.stopPropagation(); pick('hi'); });
    document.addEventListener('click', function (e) {
      if (!langContainer.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langContainer.classList.contains('is-open')) setOpen(false);
    });

    // Sync initial state with whichever toggle is already pressed
    if (btnHi.getAttribute('aria-pressed') === 'true') {
      hiOpt.classList.add('is-active'); enOpt.classList.remove('is-active');
      currentLabel.textContent = 'Hindi';
    }

    langContainer.dataset.dropdownified = '1';
  });

  // Download Profile modal (contact page)
  var profileTrigger = document.getElementById('downloadProfileBtn');
  var profileModal = document.getElementById('profileModal');
  if (profileTrigger && profileModal) {
    var profileModalClose = document.getElementById('profileModalClose');
    var profileModalForm = document.getElementById('profileModalForm');
    var profileModalEmail = document.getElementById('profileModalEmail');
    var profileModalRight = profileModal.querySelector('.profile-modal-right');
    var profileModalStateForm = profileModal.querySelector('.profile-modal-state-form');
    var profileModalStateThanks = profileModal.querySelector('.profile-modal-state-thanks');
    var lastFocused = null;

    var resetProfileModalState = function () {
      if (profileModalRight) profileModalRight.setAttribute('data-state', 'form');
      if (profileModalStateForm) profileModalStateForm.hidden = false;
      if (profileModalStateThanks) profileModalStateThanks.hidden = true;
      if (profileModalForm) profileModalForm.reset();
    };

    var showProfileModalThanks = function () {
      if (profileModalRight) profileModalRight.setAttribute('data-state', 'thanks');
      if (profileModalStateForm) profileModalStateForm.hidden = true;
      if (profileModalStateThanks) profileModalStateThanks.hidden = false;
    };

    var openProfileModal = function (e) {
      if (e) e.preventDefault();
      lastFocused = document.activeElement;
      resetProfileModalState();
      profileModal.classList.add('is-open');
      profileModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      window.setTimeout(function () {
        if (profileModalEmail) profileModalEmail.focus();
      }, 60);
    };
    var closeProfileModal = function () {
      profileModal.classList.remove('is-open');
      profileModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      window.setTimeout(resetProfileModalState, 280);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    };

    profileTrigger.addEventListener('click', openProfileModal);
    if (profileModalClose) profileModalClose.addEventListener('click', closeProfileModal);
    profileModal.addEventListener('click', function (e) {
      if (e.target === profileModal) closeProfileModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && profileModal.classList.contains('is-open')) {
        closeProfileModal();
      }
    });
    if (profileModalForm) {
      profileModalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // TODO-WG: wire up the actual PDF download / lead capture endpoint.
        showProfileModalThanks();
      });
    }
  }

  /* ---------- Why-Choose visual: auto-rotating dots with crossfade ---------- */
  document.querySelectorAll('.why-v3-visual[data-auto-rotate]').forEach(function (visual) {
    var dots = visual.querySelectorAll('.why-v3-dot');
    if (dots.length < 2) return;
    var imgs = visual.querySelectorAll('.why-v3-img');
    var imgA = imgs[0], imgB = imgs[1];
    var badge = visual.querySelector('.why-v3-badge');
    var interval = parseInt(visual.getAttribute('data-auto-rotate'), 10) || 3000;
    var idx = 0;
    var timer = null;
    var active = imgA;
    var inactive = imgB;

    function swapImage(src) {
      if (!src || !inactive) return;
      var temp = new Image();
      temp.onload = function () {
        inactive.src = src;
        inactive.classList.add('is-active');
        active.classList.remove('is-active');
        var swap = active; active = inactive; inactive = swap;
      };
      temp.src = src;
    }

    function activate(i) {
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      idx = i;
      var src = dots[i].getAttribute('data-img');
      if (src && active && active.getAttribute('src') !== src) swapImage(src);
      var label = dots[i].getAttribute('data-label');
      if (badge && label) badge.textContent = label;
    }
    function start() {
      stop();
      timer = setInterval(function () { activate((idx + 1) % dots.length); }, interval);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { activate(k); start(); });
    });
    visual.addEventListener('mouseenter', stop);
    visual.addEventListener('mouseleave', start);
    start();
  });

  /* ---------- Our Work case-study carousel: crossfade between cards ---------- */
  (function () {
    var viewport = document.getElementById('caseCarousel');
    var track = document.getElementById('caseCarouselTrack');
    if (!viewport || !track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.case-card'));
    if (cards.length < 2) return;

    // Cards are stacked and cross-fade via .is-active; drop the scroll-reveal
    // classes so their opacity rules don't fight the fade.
    cards.forEach(function (c) { c.hidden = false; c.classList.remove('reveal', 'in'); });

    var idx = 0;
    function show(i) {
      idx = (i + cards.length) % cards.length;
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === idx); });
    }

    viewport.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-case-nav]');
      if (!btn) return;
      show(idx + (btn.getAttribute('data-case-nav') === 'next' ? 1 : -1));
    });

    show(0);
  })();
})();
