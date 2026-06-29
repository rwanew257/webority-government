/*
 * Webority Government — EN / Hindi toggle.
 * Dictionary lives in js/i18n-dict.js (window.WG_I18N_HI) and is loaded first.
 *
 * Strategy: walk every text node under <body>, look up its trimmed value
 * against the dictionary, and swap. Snapshots the original English on
 * first encounter so switching back to EN restores it. No need to mark
 * elements with data-i18n attributes.
 */
(function () {
    'use strict';
    var KEY = 'wg-lang';
    var DICT = (typeof window !== 'undefined' && window.WG_I18N_HI) ? window.WG_I18N_HI : {};

    // Element tags whose text content must NEVER be touched.
    var SKIP_TAGS = {
        'SCRIPT': 1, 'STYLE': 1, 'NOSCRIPT': 1, 'CODE': 1, 'PRE': 1,
        'TEXTAREA': 1, 'INPUT': 1, 'SELECT': 1, 'OPTION': 1
    };

    // Original text snapshots, keyed by the text-node reference.
    // Persists for the life of the page; reset on full reload.
    var originals = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
    var fallbackOriginals = []; // for environments lacking WeakMap

    function rememberOriginal(node) {
        if (originals) {
            if (!originals.has(node)) originals.set(node, node.nodeValue);
            return originals.get(node);
        }
        for (var i = 0; i < fallbackOriginals.length; i++) {
            if (fallbackOriginals[i].node === node) return fallbackOriginals[i].text;
        }
        fallbackOriginals.push({ node: node, text: node.nodeValue });
        return node.nodeValue;
    }

    function shouldSkip(node) {
        var el = node.parentNode;
        while (el && el.nodeType === 1) {
            if (SKIP_TAGS[el.tagName]) return true;
            // Don't translate the language switcher itself, or anything tagged data-no-i18n.
            if (el.classList && el.classList.contains('gov-lang-toggle')) return true;
            if (el.hasAttribute && el.hasAttribute('data-no-i18n')) return true;
            if (el === document.body) break;
            el = el.parentNode;
        }
        return false;
    }

    function applyLangToTextNodes(lang) {
        if (!document.body) return;
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (n) {
                    if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    if (shouldSkip(n)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        var node;
        while ((node = walker.nextNode())) {
            var original = rememberOriginal(node);
            var trimmed = original.trim();
            if (!trimmed) continue;

            if (lang === 'hi') {
                if (Object.prototype.hasOwnProperty.call(DICT, trimmed)) {
                    var leading  = original.match(/^\s*/)[0];
                    var trailing = original.match(/\s*$/)[0];
                    node.nodeValue = leading + DICT[trimmed] + trailing;
                }
                // else: leave original English (graceful fallback)
            } else {
                // Restore the saved original
                node.nodeValue = original;
            }
        }
    }

    function apply(lang) {
        document.documentElement.setAttribute('lang', lang);
        var btns = document.querySelectorAll('.gov-lang-toggle');
        for (var i = 0; i < btns.length; i++) {
            btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === lang ? 'true' : 'false');
        }
        applyLangToTextNodes(lang);
    }

    function init() {
        var saved = null;
        try { saved = localStorage.getItem(KEY); } catch (e) {}
        apply(saved === 'hi' ? 'hi' : 'en');

        var btns = document.querySelectorAll('.gov-lang-toggle');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function (e) {
                var lang = e.currentTarget.getAttribute('data-lang') || 'en';
                apply(lang);
                try { localStorage.setItem(KEY, lang); } catch (err) {}
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
