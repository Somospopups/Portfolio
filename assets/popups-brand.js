(function () {
  'use strict';
  if (window.__POPUPS_BRAND_INIT__) return;
  window.__POPUPS_BRAND_INIT__ = true;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scriptEl = document.currentScript || document.querySelector('script[src*="popups-brand.js"]');
  var base = '../assets/';
  if (scriptEl && scriptEl.getAttribute('src')) {
    var src = scriptEl.getAttribute('src');
    var idx = src.lastIndexOf('/');
    if (idx !== -1) base = src.slice(0, idx + 1);
  }
  var rootHref = base.replace(/assets\/?$/, '') + 'index.html#proyectos';

  // Inject isolated styles (.pp-stamp-* prefix so nothing ever collides)
  var css = [
    '/* POPUPS Shared Brand System (0 CDNs, 60fps GPU transforms) */',
    '.pp-mini-mark{position:relative;display:inline-flex;align-items:center;justify-content:center;width:26px;height:20px;vertical-align:middle;margin-right:6px;flex-shrink:0}',
    '.pp-mini-mark img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:left center;pointer-events:none}',
    '.pp-mini-dot{position:absolute;left:56%;top:22%;width:7px;height:7px;border-radius:50%;background:#c6f811;box-shadow:0 0 8px rgba(198,248,17,.85);transform:translate(-50%,-50%);animation:ppMiniPulse 2.6s ease-in-out infinite}',
    '@keyframes ppMiniPulse{0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 0 6px rgba(198,248,17,.65)}50%{transform:translate(-50%,-50%) scale(1.22);box-shadow:0 0 14px rgba(198,248,17,1)}}',

    '#popupsBrandStamp.pp-stamp-bar{display:block!important;position:relative;z-index:10;overflow:hidden;background:radial-gradient(640px 280px at 18% 50%,rgba(198,248,17,.09),transparent 70%),radial-gradient(520px 260px at 88% 50%,rgba(124,108,240,.11),transparent 70%),#080a0e!important;color:#f3f5f8!important;border-top:1px solid rgba(255,255,255,.1);padding:46px 20px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;isolation:isolate}',
    '.pp-stamp-bg-wm{position:absolute;right:-40px;top:50%;transform:translateY(-50%) rotate(-8deg);width:min(460px,62vw);aspect-ratio:1200/436;opacity:.055;pointer-events:none;z-index:0;user-select:none}',
    '.pp-stamp-bg-wm img{width:100%;height:100%;object-fit:contain;filter:brightness(1.4)}',
    '.pp-stamp-inner{position:relative;z-index:2;width:min(1160px,92vw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap}',
    '.pp-stamp-left{display:flex;align-items:center;gap:24px;flex-wrap:wrap}',
    '.pp-stamp-rig{position:relative;width:190px;aspect-ratio:1200/436;cursor:pointer;transform-style:preserve-3d;perspective:700px;transition:transform .22s cubic-bezier(.22,1,.36,1);flex-shrink:0}',
    '.pp-stamp-rig:hover{transform:translateY(-2px) rotateY(-6deg) rotateX(4deg)}',
    '.pp-stamp-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;will-change:transform,opacity}',
    '.pp-stamp-layer img{width:100%;height:100%;object-fit:contain;display:block}',
    '.pp-stamp-mgroup{position:absolute;inset:0;z-index:3;transform-origin:20% 55%;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}',
    '.pp-stamp-rig:hover .pp-stamp-mgroup{transform:rotate(-5deg) scale(1.03)}',
    '.pp-stamp-dotwrap{position:absolute;left:30.3159%;top:20.9030%;width:8.8700%;height:24.4147%;transform:translate(-50%,-50%);z-index:4;pointer-events:none}',
    '.pp-stamp-dot{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e4ff73 0%,#c6f811 55%,#a8d900 100%);box-shadow:0 0 16px rgba(198,248,17,.6);animation:ppDotBreath 2.8s ease-in-out infinite}',
    '.pp-stamp-ring{position:absolute;inset:-8%;border-radius:50%;border:2px solid #c6f811;opacity:0;animation:ppDotSonar 2.8s cubic-bezier(.15,.7,.3,1) infinite}',
    '.pp-stamp-sheen{position:absolute;inset:-8%;pointer-events:none;z-index:5;opacity:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.32) 49%,rgba(198,248,17,.22) 53%,transparent 65%);transform:translateX(-120%);mix-blend-mode:screen}',
    '.pp-stamp-bar.is-live .pp-stamp-rig .pp-stamp-sheen{animation:ppSheen 1.15s cubic-bezier(.22,1,.36,1) .25s 1 both}',
    '.pp-stamp-bar.is-live .pp-stamp-dot{animation:ppNeonCharge 1.1s linear 1,ppDotBreath 2.8s ease-in-out 1.15s infinite}',
    '@keyframes ppDotBreath{0%,100%{transform:scale(1);box-shadow:0 0 14px rgba(198,248,17,.5)}50%{transform:scale(1.12);box-shadow:0 0 28px rgba(198,248,17,.95)}}',
    '@keyframes ppDotSonar{0%{opacity:.85;transform:scale(1)}75%,100%{opacity:0;transform:scale(2.7)}}',
    '@keyframes ppSheen{0%{opacity:0;transform:translateX(-120%)}30%{opacity:.95}100%{opacity:0;transform:translateX(130%)}}',
    '@keyframes ppNeonCharge{0%{opacity:.1}18%{opacity:1;box-shadow:0 0 32px #c6f811}28%{opacity:.2}45%{opacity:1;box-shadow:0 0 40px #c6f811}60%{opacity:.3}100%{opacity:1;box-shadow:0 0 22px rgba(198,248,17,.8)}}',
    '.pp-stamp-copy{max-width:44ch}',
    '.pp-stamp-kicker{display:inline-flex;align-items:center;gap:7px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#c6f811!important;font-weight:700;margin-bottom:5px}',
    '.pp-stamp-kicker i{width:6px;height:6px;border-radius:50%;background:#c6f811;box-shadow:0 0 8px #c6f811;display:inline-block}',
    '.pp-stamp-copy p{margin:0;font-size:14px;line-height:1.45;color:rgba(243,245,248,.74)!important}',
    '.pp-stamp-copy strong{color:#fff!important}',
    '.pp-stamp-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
    '.pp-stamp-btn{display:inline-flex!important;align-items:center;gap:7px;padding:11px 18px;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none!important;transition:transform .2s cubic-bezier(.22,1,.36,1),background .2s,border-color .2s;white-space:nowrap}',
    '.pp-stamp-btn:hover{transform:translateY(-2px)}',
    '.pp-stamp-btn-neon{background:#c6f811!important;color:#080a0e!important;box-shadow:0 10px 26px rgba(198,248,17,.22)}',
    '.pp-stamp-btn-neon:hover{background:#d8ff42}',
    '.pp-stamp-btn-ghost{border:1px solid rgba(255,255,255,.2);color:#f3f5f8!important;background:rgba(255,255,255,.04)!important}',
    '.pp-stamp-btn-ghost:hover{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.1)}',
    '.pp-stamp-spark{position:absolute;width:6px;height:6px;border-radius:50%;background:#c6f811;box-shadow:0 0 10px #c6f811;pointer-events:none;z-index:9}',
    '@media (prefers-reduced-motion:reduce){.pp-mini-dot,.pp-stamp-dot,.pp-stamp-ring,.pp-stamp-sheen{animation:none!important}}',
    '@media (max-width:720px){.pp-stamp-bar{padding:36px 16px}.pp-stamp-rig{width:158px}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'popups-brand-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 1) Upgrade the top navigation return-to-POPUPS link with the real pulsing mini [P•] mark
  function upgradeTopLink() {
    var topArea = document.querySelector('header, nav');
    if (!topArea) return;
    var links = topArea.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (/^\.\.(\/|\/index\.html)?(#.*)?$/.test(href) && !a.querySelector('.pp-mini-mark')) {
        var span = document.createElement('span');
        span.className = 'pp-mini-mark';
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = '<img src="' + base + 'logo-mark.webp" alt=""><span class="pp-mini-dot"></span>';
        a.insertBefore(span, a.firstChild);
        break;
      }
    }
  }

  // 2) Append official "Hecho por POPUPS" animated signature strip at bottom of every landing
  function mountFooterStamp() {
    if (document.getElementById('popupsBrandStamp')) return;
    var pageTitle = (document.title || 'un proyecto').split('·')[0].trim();
    var waText = encodeURIComponent('¡Hola POPUPS! Vi ' + pageTitle + ' en el portfolio y quiero charlar sobre un proyecto.');

    var sec = document.createElement('section');
    sec.id = 'popupsBrandStamp';
    sec.className = 'pp-stamp-bar';
    sec.setAttribute('aria-label', 'Estudio POPUPS');
    sec.innerHTML =
      '<div class="pp-stamp-bg-wm" aria-hidden="true"><img src="' + base + 'logo-mark.webp" alt="" loading="lazy"></div>' +
      '<div class="pp-stamp-inner">' +
        '<div class="pp-stamp-left">' +
          '<a class="pp-stamp-rig" id="ppStampRig" href="' + rootHref + '" aria-label="Volver al Portfolio POPUPS" title="POPUPS · Volver al portfolio">' +
            '<div class="pp-stamp-layer"><img src="' + base + 'logo-wordmark.webp" alt="popups" loading="lazy"></div>' +
            '<div class="pp-stamp-mgroup">' +
              '<div class="pp-stamp-layer"><img src="' + base + 'logo-mark.webp" alt="P" loading="lazy"></div>' +
              '<div class="pp-stamp-dotwrap"><div class="pp-stamp-ring"></div><div class="pp-stamp-dot"></div></div>' +
            '</div>' +
            '<div class="pp-stamp-sheen"></div>' +
          '</a>' +
          '<div class="pp-stamp-copy">' +
            '<span class="pp-stamp-kicker"><i></i>Hecho por POPUPS</span>' +
            '<p><strong>Diseño, desarrollo y producto digital a medida</strong> desde Córdoba, Argentina. Tecnología que te devuelve tiempo.</p>' +
          '</div>' +
        '</div>' +
        '<div class="pp-stamp-actions">' +
          '<a class="pp-stamp-btn pp-stamp-btn-ghost" href="' + rootHref + '">Ver todos los proyectos ↗</a>' +
          '<a class="pp-stamp-btn pp-stamp-btn-neon" href="https://wa.me/5493516452258?text=' + waText + '" target="_blank" rel="noopener">Quiero algo así ↗</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(sec);

    // Trigger Sticker Peel + LED Neon Charge once visible
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            sec.classList.add('is-live');
            io.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(sec);
    } else {
      sec.classList.add('is-live');
    }

    // Neon spark burst on hover-click
    var rig = document.getElementById('ppStampRig');
    if (rig && !reduced) {
      rig.addEventListener('mouseenter', function () {
        for (var i = 0; i < 8; i++) {
          var sp = document.createElement('span');
          sp.className = 'pp-stamp-spark';
          var ang = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.4;
          var dist = 24 + Math.random() * 28;
          sp.style.left = '30.3%';
          sp.style.top = '20.9%';
          sp.style.transform = 'translate(-50%,-50%) scale(1)';
          rig.appendChild(sp);
          (function (el, a, d) {
            requestAnimationFrame(function () {
              el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1), opacity .55s ease-out';
              el.style.transform = 'translate(calc(-50% + ' + (Math.cos(a) * d).toFixed(1) + 'px),calc(-50% + ' + (Math.sin(a) * d).toFixed(1) + 'px)) scale(.1)';
              el.style.opacity = '0';
              setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 580);
            });
          })(sp, ang, dist);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { upgradeTopLink(); mountFooterStamp(); });
  } else {
    upgradeTopLink();
    mountFooterStamp();
  }
})();
