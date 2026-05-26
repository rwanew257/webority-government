/* Webority Government — Interactivity */

(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when clicking a link (mobile)
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 960) {
          menu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Sticky header shadow on scroll
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Services megamenu — click toggle + click-outside-to-close.
  // (Hover open/close is handled in CSS via :hover and :focus-within;
  //  the JS only ensures click-tap on touch devices and ESC dismiss.)
  document.querySelectorAll('[data-megamenu]').forEach(function (trigger) {
    var panelId = trigger.getAttribute('data-megamenu');
    var panel = document.querySelector('[data-megamenu-panel="' + panelId + '"]');
    var link = trigger.querySelector('a');
    if (!panel || !link) return;

    link.addEventListener('click', function (e) {
      // Let cmd/ctrl-click and middle-click navigate normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      var open = panel.classList.toggle('is-open');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });

    document.addEventListener('click', function (e) {
      if (trigger.contains(e.target) || panel.contains(e.target)) return;
      if (!panel.classList.contains('is-open')) return;
      panel.classList.remove('is-open');
      link.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!panel.classList.contains('is-open')) return;
      panel.classList.remove('is-open');
      link.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      link.focus();
    });
  });

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

    const setActive = function (key) {
      sectorTabs.forEach(function (t) {
        const isActive = t.getAttribute('data-tab') === key;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
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

  // Cursor-tracked glow on .btn-glow — updates --mx / --my CSS vars used by ::before radial gradient.
  document.querySelectorAll('.btn-glow').forEach(function (btn) {
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

  // Services mega-menu — injected on every page, opens on hover of the
  // nav "Services" link. Clicking the link still navigates to services.html.
  var servicesLink = document.querySelector('.nav-menu a[href="services.html"]');
  if (servicesLink && !document.querySelector('.megamenu')) {
    var servicesLi = servicesLink.closest('li');
    if (servicesLi) {
      servicesLi.classList.add('has-megamenu');
      var megaHTML =
        '<div class="megamenu" aria-hidden="true">' +
          '<div class="megamenu-inner">' +
            '<div class="megamenu-col">' +
              '<span class="megamenu-eyebrow">Services</span>' +
              '<a class="megamenu-link" href="services.html#egov">' +
                '<span class="megamenu-title">e-Governance &amp; Custom Software</span>' +
                '<span class="megamenu-desc">NIC-compatible platforms, G2C / G2G / G2B</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#staffing">' +
                '<span class="megamenu-title">IT Staff Augmentation</span>' +
                '<span class="megamenu-desc">Vetted engineers for ministries &amp; PSUs</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#mobile">' +
                '<span class="megamenu-title">Citizen Mobile &amp; Web Apps</span>' +
                '<span class="megamenu-desc">Field-officer apps &amp; citizen portals</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#consulting">' +
                '<span class="megamenu-title">Digital Transformation Consulting</span>' +
                '<span class="megamenu-desc">Roadmaps, RFP support, PMU</span>' +
              '</a>' +
            '</div>' +
            '<div class="megamenu-col">' +
              '<a class="megamenu-link" href="services.html#ai">' +
                '<span class="megamenu-title">AI &amp; Data Analytics</span>' +
                '<span class="megamenu-desc">Dashboards, NLP, fraud detection, MLOps</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#security">' +
                '<span class="megamenu-title">Cybersecurity &amp; VAPT</span>' +
                '<span class="megamenu-desc">CERT-In, ISO 27001, DPDP compliance</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#modernization">' +
                '<span class="megamenu-title">Legacy System Modernisation</span>' +
                '<span class="megamenu-desc">Migration without disrupting operations</span>' +
              '</a>' +
              '<a class="megamenu-link" href="services.html#cloud">' +
                '<span class="megamenu-title">Cloud &amp; Managed Services</span>' +
                '<span class="megamenu-desc">MeghRaj, NIC hosting, AMC, 24&times;7</span>' +
              '</a>' +
            '</div>' +
            '<div class="megamenu-feature">' +
              '<span class="megamenu-eyebrow">New Case Study</span>' +
              '<a class="megamenu-feature-card" href="case-studies.html">' +
                '<div class="megamenu-feature-img"></div>' +
                '<div class="megamenu-feature-meta">' +
                  '<h4>BEE Star Label mobile app</h4>' +
                  '<p>National appliance compliance platform &mdash; offline field inspection app for SDA officers, real-time central sync.</p>' +
                  '<span class="megamenu-feature-cta">Explore Full Case Study &rsaquo;</span>' +
                '</div>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      servicesLi.insertAdjacentHTML('beforeend', megaHTML);

      var megamenu = servicesLi.querySelector('.megamenu');
      var closeTimer = null;
      var open = function () {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        servicesLi.classList.add('megamenu-open');
        megamenu.setAttribute('aria-hidden', 'false');
      };
      var close = function () {
        closeTimer = setTimeout(function () {
          servicesLi.classList.remove('megamenu-open');
          megamenu.setAttribute('aria-hidden', 'true');
        }, 120);
      };
      servicesLi.addEventListener('mouseenter', open);
      servicesLi.addEventListener('mouseleave', close);
      megamenu.addEventListener('mouseenter', open);
      megamenu.addEventListener('mouseleave', close);
    }
  }
})();
