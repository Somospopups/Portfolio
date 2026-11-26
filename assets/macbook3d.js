(function () {
  'use strict';

  function initMacBook3D() {
    var portalStage = document.getElementById('portalStage');
    var canvasHost = document.getElementById('mbpCanvasHost');
    var fallbackEl = document.getElementById('mbpFallback');
    if (!portalStage || !canvasHost || typeof window.THREE === 'undefined') {
      if (fallbackEl) fallbackEl.style.display = 'block';
      return;
    }

    var THREE = window.THREE;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var mbpCaption = document.getElementById('mbpCaption');
    var mbpCapTag = document.getElementById('mbpCapTag');
    var mbpCapText = document.getElementById('mbpCapText');
    var mbpCapCta = document.getElementById('mbpCapCta');
    var mbpSwitcher = document.getElementById('mbpSwitcher');
    var mbpSpinBtn = document.getElementById('mbpSpinBtn');
    var mbpDragHint = document.getElementById('mbpDragHint');
    var mbpCue = document.getElementById('mbpCue');
    var portalOrbits = document.getElementById('portalOrbits');
    var portalPills = document.getElementById('portalPills');
    var mbpAurora = document.getElementById('mbpAurora');

    var pillEls = portalPills ? Array.from(portalPills.querySelectorAll('[data-pill-idx]')) : [];
    var swBtns = mbpSwitcher ? Array.from(mbpSwitcher.querySelectorAll('.mbp-sw-btn')) : [];

    // -------------------------------------------------------------------------
    // 3 Flagship Products in Exact Requested Sequence
    // -------------------------------------------------------------------------
    var SHOWCASE = [
      {
        key: 'miamp',
        theme: 'theme-miamp',
        accent: '#54e3b4',
        glowColor: 0x62e5be,
        dwell: 6800,
        href: 'mi-amp/',
        external: false,
        tag: '01 · MI AMP · Plugin DSP',
        html: '<strong>MI AMP</strong> — 18 cabezales, 19 cabinas IR y 27 pedales boutique en tiempo real.',
        cta: 'Explorar MI AMP ↗',
        pills: [
          '18 cabezales modelados',
          '27 pedales boutique',
          'C++20 · JUCE 8 DSP',
          '19 cabinas + carga .WAV IR',
          'VST3 · AU · Standalone',
          'Latencia ultra baja · 0 drama'
        ]
      },
      {
        key: 'appi',
        theme: 'theme-appi',
        accent: '#c8f810',
        glowColor: 0x9b7eff,
        dwell: 6000,
        href: 'appi/',
        external: false,
        tag: '02 · APPI · PWA Offline',
        html: '<strong>APPI</strong> — Planificación, finanzas y equipo en una webapp instalable sin conexión.',
        cta: 'Explorar APPI ↗',
        pills: [
          'Tu vida y negocio en foco',
          '7 días 100% offline',
          '+15 herramientas conectadas',
          'PWA instalable en segundos',
          '2 espacios · Titular + Socio',
          'Cero planillas sueltas'
        ]
      },
      {
        key: 'webs',
        theme: 'theme-webs',
        accent: '#f2c61f',
        glowColor: 0xf0b26c,
        dwell: 7600,
        href: 'webs-a-medida/',
        external: false,
        tag: '03 · Webs a medida · Desde cero',
        html: '<strong>Webs a medida</strong> — Diseño 100% propio, catálogo vivo y pedidos directo a tu WhatsApp.',
        cta: 'Ver webs a medida ↗',
        pills: [
          'Webs a medida · 0% plantillas',
          'Diseño 100% desde cero',
          'Catálogo vivo + carrito real',
          '0% comisión por venta',
          'Rápidas en cualquier celular',
          'Pedidos directo a WhatsApp'
        ]
      }
    ];

    // -------------------------------------------------------------------------
    // WebGL Renderer Setup (Transparent background so Behind-MacBook Pills Shine Through!)
    // -------------------------------------------------------------------------
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      if (fallbackEl) fallbackEl.style.display = 'block';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.className = 'mbp-webgl-canvas';
    renderer.domElement.setAttribute('aria-label', 'MacBook Pro 3D interactiva: arrastrá para girar 360 grados');
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 16 / 10.4, 0.1, 60);
    camera.position.set(0, 1.52, 7.65);
    camera.lookAt(0, 0.56, 0);

    // -------------------------------------------------------------------------
    // Procedural Studio HDRI Environment Map (Apple Product-Shoot Metallic Reflections!)
    // -------------------------------------------------------------------------
    var pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    var envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0c0f16);

    function addStudioPanel(colorHex, pos, rot, w, h, intensity) {
      var col = new THREE.Color(colorHex).multiplyScalar(intensity);
      var m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })
      );
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(rot[0], rot[1], rot[2]);
      envScene.add(m);
    }

    // Overhead main diffused softbox
    addStudioPanel(0xf4f7ff, [0, 8, 1], [Math.PI / 2, 0, 0], 14, 9, 2.2);
    // Front key strip
    addStudioPanel(0xdce6ff, [0, 3.2, 9], [0, Math.PI, 0], 10, 4.5, 1.35);
    // Left violet/blue studio rim light
    addStudioPanel(0x8874ff, [-9, 2.8, 0.5], [0, Math.PI / 2, 0], 9, 5, 1.65);
    // Right subtle mint/lime accent rim light
    addStudioPanel(0xbdf642, [9, 2.5, 0.5], [0, -Math.PI / 2, 0], 8, 4.2, 1.15);
    // Rear bright rim so 180° back aluminum & POPUPS emblem gleam crisply!
    addStudioPanel(0xe4ecff, [0, 4.5, -9], [0.22, 0, 0], 12, 5.5, 1.85);
    // Subtle underside studio table bounce
    addStudioPanel(0x283044, [0, -6, 0], [-Math.PI / 2, 0, 0], 16, 16, 0.85);

    var envRT = pmrem.fromScene(envScene, 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();

    // Direct studio lights for crisp specular micro-bevels
    var ambient = new THREE.HemisphereLight(0xd8e2ff, 0x161924, 0.85);
    scene.add(ambient);

    var keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(4.5, 7.5, 6.2);
    scene.add(keyLight);

    var rimLeft = new THREE.DirectionalLight(0x8b70ef, 0.72);
    rimLeft.position.set(-6.5, 3.0, -3.5);
    scene.add(rimLeft);

    var rimRight = new THREE.DirectionalLight(0xc8f810, 0.45);
    rimRight.position.set(6.5, 2.2, -4.0);
    scene.add(rimRight);

    // Subtle colored point light cast from the open display onto the Space Black keyboard!
    var screenBounceLight = new THREE.PointLight(0x62e5be, 1.15, 3.2, 2);
    screenBounceLight.position.set(0, 0.85, -0.35);

    // -------------------------------------------------------------------------
    // Helper: Rounded Rectangle ExtrudeGeometry (Real CNC Chamfered Aluminum!)
    // -------------------------------------------------------------------------
    function makeRoundedRectShape(w, h, r) {
      var shape = new THREE.Shape();
      var x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    }

    function makeChamferedSlab(w, d, thickness, radius, bevel) {
      var shape = makeRoundedRectShape(w - bevel * 2, d - bevel * 2, Math.max(0.02, radius - bevel));
      var geo = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.005, thickness - bevel * 2),
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 4,
        curveSegments: 20
      });
      // Extrude builds along +Z; rotate so width=X, thickness=Y (0..thickness), depth=Z (-d/2..+d/2)
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, bevel, 0);
      geo.computeVertexNormals();
      return geo;
    }

    // -------------------------------------------------------------------------
    // Procedural High-Res Space Black Keyboard + Trackpad + Speaker Grilles Texture
    // -------------------------------------------------------------------------
    function createKeyboardDeckTexture() {
      var cw = 1536, ch = 1070;
      var c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      var ctx = c.getContext('2d');

      // Base Space Black anodized aluminum top deck
      var bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, '#21242b');
      bgGrad.addColorStop(0.5, '#262a32');
      bgGrad.addColorStop(1, '#1e2128');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Subtle brushed metallic micro-grain
      for (var i = 0; i < 6000; i++) {
        var gx = Math.random() * cw;
        var gy = Math.random() * ch;
        ctx.fillStyle = (i & 1) ? 'rgba(255,255,255,0.014)' : 'rgba(0,0,0,0.02)';
        ctx.fillRect(gx, gy, 2, 1);
      }

      function rrect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // Recessed Jet-Black Anodized Keyboard Well (authentic M3/M4 Space Black look!)
      var kx = 188, ky = 84, kw = 1160, kh = 516;
      rrect(kx - 4, ky - 4, kw + 8, kh + 8, 22);
      ctx.fillStyle = '#090a0d';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      rrect(kx, ky, kw, kh, 18);
      ctx.fillStyle = '#0c0d11';
      ctx.fill();

      // Precision Laser-Drilled Left & Right Speaker Grilles
      ctx.fillStyle = 'rgba(6, 7, 10, 0.78)';
      for (var side = 0; side < 2; side++) {
        var sx0 = side === 0 ? 52 : 1384;
        for (var col = 0; col < 10; col++) {
          for (var row = 0; row < 48; row++) {
            var dx = sx0 + col * 10.5 + (row % 2 ? 4.5 : 0);
            var dy = 104 + row * 10.0;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Authentic 6-Row Backlit MacBook Pro Keyboard Layout
      var rows = [
        { h: 60, keys: [
          ['esc', 1.45], ['F1', 1], ['F2', 1], ['F3', 1], ['F4', 1], ['F5', 1], ['F6', 1],
          ['F7', 1], ['F8', 1], ['F9', 1], ['F10', 1], ['F11', 1], ['F12', 1], ['TOUCH', 1.15]
        ]},
        { h: 72, keys: [
          ['º', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['delete', 1.65]
        ]},
        { h: 72, keys: [
          ['tab', 1.55], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.1]
        ]},
        { h: 72, keys: [
          ['caps', 1.8], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['return', 1.85]
        ]},
        { h: 72, keys: [
          ['shift', 2.32], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['shift', 2.33]
        ]},
        { h: 78, keys: [
          ['fn', 1], ['ctrl', 1], ['opt', 1], ['cmd', 1.32], ['', 5.35], ['cmd', 1.32], ['opt', 1], ['◀', 0.9], ['▲▼', 0.92], ['▶', 0.9]
        ]}
      ];

      var padX = 16, padY = 16, gap = 10;
      var curY = ky + padY;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (var r = 0; r < rows.length; r++) {
        var rowDef = rows[r];
        var totalUnits = 0;
        for (var k = 0; k < rowDef.keys.length; k++) totalUnits += rowDef.keys[k][1];
        var usableW = kw - padX * 2 - gap * (rowDef.keys.length - 1);
        var unitW = usableW / totalUnits;
        var curX = kx + padX;

        for (var k2 = 0; k2 < rowDef.keys.length; k2++) {
          var label = rowDef.keys[k2][0];
          var kwKey = unitW * rowDef.keys[k2][1];
          var khKey = rowDef.h;

          // Subtle keycap body + soft backlit halo edge
          rrect(curX, curY, kwKey, khKey, 8);
          var kg = ctx.createLinearGradient(curX, curY, curX, curY + khKey);
          kg.addColorStop(0, '#191b22');
          kg.addColorStop(1, '#12141a');
          ctx.fillStyle = kg;
          ctx.fill();
          ctx.strokeStyle = 'rgba(210, 224, 255, 0.14)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          if (label === 'TOUCH') {
            ctx.beginPath();
            ctx.arc(curX + kwKey / 2, curY + khKey / 2, 16, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(180, 192, 210, 0.34)';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (label === '▲▼') {
            // Split Up/Down half-height arrows
            ctx.fillStyle = '#0a0b0e';
            ctx.fillRect(curX, curY + khKey / 2 - 2, kwKey, 4);
            ctx.fillStyle = 'rgba(232, 238, 248, 0.65)';
            ctx.font = '600 13px sans-serif';
            ctx.fillText('▲', curX + kwKey / 2, curY + khKey * 0.27);
            ctx.fillText('▼', curX + kwKey / 2, curY + khKey * 0.75);
          } else if (label) {
            ctx.fillStyle = 'rgba(232, 238, 248, 0.72)';
            ctx.font = label.length > 2 ? '600 13px system-ui, sans-serif' : '600 18px system-ui, sans-serif';
            ctx.fillText(label, curX + kwKey / 2, curY + khKey / 2 + 1);
          }

          curX += kwKey + gap;
        }
        curY += rowDef.h + gap;
      }

      // Giant Glass Force Touch Trackpad
      var tx = 442, ty = 638, tw = 652, th = 378;
      rrect(tx, ty, tw, th, 18);
      var tg = ctx.createLinearGradient(tx, ty, tx + tw, ty + th);
      tg.addColorStop(0, '#1e2128');
      tg.addColorStop(0.5, '#242831');
      tg.addColorStop(1, '#1b1e25');
      ctx.fillStyle = tg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(8, 9, 12, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
      rrect(tx + 2, ty + 2, tw - 4, th - 4, 16);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      var tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return tex;
    }

    // -------------------------------------------------------------------------
    // Procedural Space Black Lid Back Texture with Real POPUPS Mark + Neon Dot
    // -------------------------------------------------------------------------
    var lidBackCanvas = document.createElement('canvas');
    lidBackCanvas.width = 1024;
    lidBackCanvas.height = 716;
    var lidBackCtx = lidBackCanvas.getContext('2d');
    var lidBackTex = new THREE.CanvasTexture(lidBackCanvas);
    lidBackTex.encoding = THREE.sRGBEncoding;
    lidBackTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    function drawLidBackTexture(markImg) {
      var w = lidBackCanvas.width, h = lidBackCanvas.height;
      // Satin Space Black anodized gradient
      var g = lidBackCtx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#2a2e36');
      g.addColorStop(0.45, '#21252c');
      g.addColorStop(1, '#1a1d24');
      lidBackCtx.fillStyle = g;
      lidBackCtx.fillRect(0, 0, w, h);

      // Subtle center radial sheen
      var rg = lidBackCtx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.48, w * 0.52);
      rg.addColorStop(0, 'rgba(255,255,255,0.055)');
      rg.addColorStop(1, 'rgba(0,0,0,0.08)');
      lidBackCtx.fillStyle = rg;
      lidBackCtx.fillRect(0, 0, w, h);

      // Crisp centered POPUPS "P●" glossy emblem on back of MacBook lid (exact bbox 460x436 of 1200x436)!
      if (markImg && markImg.complete && markImg.naturalWidth > 0) {
        var srcW = markImg.naturalWidth * (460 / 1200);
        var srcH = markImg.naturalHeight;
        var drawW = 210;
        var drawH = drawW * (srcH / srcW);
        var dx = (w - drawW) / 2;
        var dy = (h - drawH) / 2 - 4;

        lidBackCtx.save();
        lidBackCtx.globalAlpha = 0.94;
        lidBackCtx.drawImage(markImg, 0, 0, srcW, srcH, dx, dy, drawW, drawH);
        lidBackCtx.restore();

        // Signature glowing POPUPS neon lime dot at pixel-exact relative rig coordinate
        var dotX = dx + drawW * 0.7908;
        var dotY = dy + drawH * 0.2090;
        var dotR = drawW * 0.1157;
        var glow = lidBackCtx.createRadialGradient(dotX, dotY, dotR * 0.2, dotX, dotY, dotR * 2.4);
        glow.addColorStop(0, 'rgba(198,248,17,0.42)');
        glow.addColorStop(1, 'rgba(198,248,17,0)');
        lidBackCtx.fillStyle = glow;
        lidBackCtx.beginPath();
        lidBackCtx.arc(dotX, dotY, dotR * 2.4, 0, Math.PI * 2);
        lidBackCtx.fill();

        var dg = lidBackCtx.createRadialGradient(dotX - dotR * 0.28, dotY - dotR * 0.28, dotR * 0.1, dotX, dotY, dotR);
        dg.addColorStop(0, '#e6ff7d');
        dg.addColorStop(0.55, '#c6f811');
        dg.addColorStop(1, '#9ece00');
        lidBackCtx.fillStyle = dg;
        lidBackCtx.beginPath();
        lidBackCtx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
        lidBackCtx.fill();
      } else {
        // Minimal clean placeholder emblem until logo-mark loads
        lidBackCtx.fillStyle = '#c6f811';
        lidBackCtx.beginPath();
        lidBackCtx.arc(w / 2, h / 2, 22, 0, Math.PI * 2);
        lidBackCtx.fill();
      }
      lidBackTex.needsUpdate = true;
    }
    drawLidBackTexture(null);

    // -------------------------------------------------------------------------
    // Live Dynamic Screen Canvas Texture (1024 x 590 — 60fps MI AMP Intro Pan, APPI, Fast Webs Scroll!)
    // -------------------------------------------------------------------------
    var screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 590;
    var sctx = screenCanvas.getContext('2d');
    sctx.fillStyle = '#090b10';
    sctx.fillRect(0, 0, 1024, 590);

    var screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.encoding = THREE.sRGBEncoding;
    screenTex.minFilter = THREE.LinearFilter;
    screenTex.magFilter = THREE.LinearFilter;
    screenTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    // Preload all real product images + POPUPS mark for the lid back
    var imgs = {
      miamp: new Image(),
      appi: new Image(),
      webs: new Image(),
      mark: new Image()
    };
    imgs.miamp.src = 'assets/miamp-real-intro.webp';
    imgs.appi.src = 'assets/appi-screen-full.webp';
    imgs.webs.src = 'assets/webs-medida-scroll.webp';
    imgs.mark.onload = function () { drawLidBackTexture(imgs.mark); };
    imgs.mark.src = 'assets/logo-mark.webp';

    // -------------------------------------------------------------------------
    // Build Real Solid 3D MacBook Pro 16" Space Black Assembly
    // -------------------------------------------------------------------------
    var W = 3.56, D = 2.48, BH = 0.125, LH = 0.044, R = 0.145;

    var matAluminum = new THREE.MeshStandardMaterial({
      color: 0x353b47,
      metalness: 0.88,
      roughness: 0.25,
      envMapIntensity: 1.85
    });
    var matAluminumDark = new THREE.MeshStandardMaterial({
      color: 0x16181e,
      metalness: 0.72,
      roughness: 0.38,
      envMapIntensity: 1.1
    });
    var matPortMetal = new THREE.MeshStandardMaterial({
      color: 0x07080b,
      metalness: 0.65,
      roughness: 0.42
    });
    var matPortRim = new THREE.MeshStandardMaterial({
      color: 0x525866,
      metalness: 0.92,
      roughness: 0.22
    });
    var matRubber = new THREE.MeshStandardMaterial({
      color: 0x0e1014,
      metalness: 0.05,
      roughness: 0.88
    });
    var matGlassBezel = new THREE.MeshStandardMaterial({
      color: 0x050608,
      metalness: 0.25,
      roughness: 0.07,
      envMapIntensity: 1.4
    });

    // Root turntable group (rotates 360° around Y and tilts subtly on X!)
    var laptopRoot = new THREE.Group();
    scene.add(laptopRoot);

    // 1) UNIBODY CHASSIS BASE
    var baseGroup = new THREE.Group();
    laptopRoot.add(baseGroup);

    var baseChassis = new THREE.Mesh(makeChamferedSlab(W, D, BH, R, 0.018), matAluminum);
    baseGroup.add(baseChassis);

    // Top keyboard + trackpad + speaker grilles deck inset flush on base top (y = BH + 0.001)
    var deckGeo = new THREE.PlaneGeometry(W - 0.10, D - 0.10);
    deckGeo.rotateX(-Math.PI / 2);
    var deckMat = new THREE.MeshStandardMaterial({
      map: createKeyboardDeckTexture(),
      metalness: 0.42,
      roughness: 0.44,
      envMapIntensity: 0.85
    });
    var deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, BH + 0.0012, 0);
    baseGroup.add(deckMesh);

    // 4 Authentic Rubber Feet on Bottom Underside
    var footGeo = new THREE.CylinderGeometry(0.115, 0.122, 0.022, 24);
    var footPositions = [
      [-W / 2 + 0.34, -0.011, -D / 2 + 0.32],
      [ W / 2 - 0.34, -0.011, -D / 2 + 0.32],
      [-W / 2 + 0.34, -0.011,  D / 2 - 0.32],
      [ W / 2 - 0.34, -0.011,  D / 2 - 0.32]
    ];
    for (var fi = 0; fi < footPositions.length; fi++) {
      var foot = new THREE.Mesh(footGeo, matRubber);
      foot.position.set(footPositions[fi][0], footPositions[fi][1], footPositions[fi][2]);
      baseGroup.add(foot);
    }

    // Front Center Thumb Notch Indentation
    var thumbNotch = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.036, 0.024), matAluminumDark);
    thumbNotch.position.set(0, BH - 0.024, D / 2 - 0.006);
    baseGroup.add(thumbNotch);

    // Rear Black Clutch Hinge Barrel + Thermal Exhaust Recess
    var hingeBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, W * 0.66, 20), matAluminumDark);
    hingeBarrel.rotation.z = Math.PI / 2;
    hingeBarrel.position.set(0, BH - 0.014, -D / 2 + 0.038);
    baseGroup.add(hingeBarrel);

    var rearVent = new THREE.Mesh(new THREE.BoxGeometry(W * 0.62, 0.034, 0.018), matPortMetal);
    rearVent.position.set(0, BH * 0.52, -D / 2 + 0.004);
    baseGroup.add(rearVent);

    // Real Sculpted Side Ports (Left: MagSafe 3 + 2x USB-C + 3.5mm Audio | Right: HDMI + USB-C + SDXC)
    function addPort(x, y, z, pw, ph, sideSign) {
      var rim = new THREE.Mesh(new THREE.BoxGeometry(0.010, ph + 0.012, pw + 0.014), matPortRim);
      rim.position.set(x, y, z);
      baseGroup.add(rim);
      var hole = new THREE.Mesh(new THREE.BoxGeometry(0.014, ph, pw), matPortMetal);
      hole.position.set(x + sideSign * 0.0015, y, z);
      baseGroup.add(hole);
    }
    var pY = BH * 0.54;
    // Left flank ports
    addPort(-W / 2 + 0.002, pY, -0.78, 0.145, 0.036, -1); // MagSafe 3
    addPort(-W / 2 + 0.002, pY, -0.52, 0.095, 0.028, -1); // Thunderbolt 1
    addPort(-W / 2 + 0.002, pY, -0.34, 0.095, 0.028, -1); // Thunderbolt 2
    var audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 16), matPortMetal);
    audioJack.rotation.z = Math.PI / 2;
    audioJack.position.set(-W / 2 + 0.002, pY, -0.14);
    baseGroup.add(audioJack);
    // Right flank ports
    addPort(W / 2 - 0.002, pY, -0.76, 0.165, 0.036, 1);  // HDMI
    addPort(W / 2 - 0.002, pY, -0.50, 0.095, 0.028, 1);  // Thunderbolt 3
    addPort(W / 2 - 0.002, pY, -0.22, 0.245, 0.024, 1);  // SDXC card slot

    baseGroup.add(screenBounceLight);

    // 2) HINGED 16" LIQUID RETINA XDR DISPLAY LID ASSEMBLY
    var lidPivot = new THREE.Group();
    lidPivot.position.set(0, BH + 0.004, -D / 2 + 0.055);
    laptopRoot.add(lidPivot);

    // Lid local coords: X = width (-W/2..W/2), Y = height upward from hinge (0..D), Z = thickness (-LH..0)
    var lidShape = makeRoundedRectShape(W - 0.024, D - 0.024, R - 0.012);
    var lidGeo = new THREE.ExtrudeGeometry(lidShape, {
      depth: LH - 0.016,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
      curveSegments: 20
    });
    // Center Y so bottom edge starts right at hinge y=0, and back face sits at z=-LH/2
    lidGeo.translate(0, D / 2, -(LH - 0.016) / 2);
    lidGeo.computeVertexNormals();
    var lidBody = new THREE.Mesh(lidGeo, matAluminum);
    lidPivot.add(lidBody);

    // Outer Space Black Rear Lid Panel with POPUPS "P●" Emblem (facing -Z, right-side up when spun 180°!)
    var backPanelGeo = new THREE.PlaneGeometry(W - 0.16, D - 0.16);
    backPanelGeo.rotateY(Math.PI);
    var backPanelMat = new THREE.MeshStandardMaterial({
      map: lidBackTex,
      metalness: 0.78,
      roughness: 0.28,
      envMapIntensity: 1.45
    });
    var backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
    backPanel.position.set(0, D / 2, -(LH / 2) - 0.0022);
    lidPivot.add(backPanel);

    // Front Glossy Jet-Black Glass Bezel Frame (facing +Z)
    var bezelShape = makeRoundedRectShape(W - 0.06, D - 0.06, R - 0.025);
    var bezelGeo = new THREE.ShapeGeometry(bezelShape, 18);
    var bezelMesh = new THREE.Mesh(bezelGeo, matGlassBezel);
    bezelMesh.position.set(0, D / 2, LH / 2 + 0.0015);
    lidPivot.add(bezelMesh);

    // Front 16" Liquid Retina XDR Emissive Display Surface (exact 1600:921 aspect inside thin bezel!)
    var scrW = W - 0.17;        // 3.39
    var scrH = scrW * (921 / 1600); // 1.951
    var scrY = D - 0.085 - scrH / 2; // tucked right up near top bezel with authentic slim chin below!

    var screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      toneMapped: false
    });
    var screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrW, scrH), screenMat);
    screenMesh.position.set(0, scrY, LH / 2 + 0.0032);
    lidPivot.add(screenMesh);

    // Subtle Studio Glass Reflection Overlay over Display (adds tactile depth while spinning!)
    var glassSheenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.065,
      metalness: 0.9,
      roughness: 0.06,
      envMapIntensity: 1.5,
      depthWrite: false
    });
    var glassSheen = new THREE.Mesh(new THREE.PlaneGeometry(scrW, scrH), glassSheenMat);
    glassSheen.position.set(0, scrY, LH / 2 + 0.0046);
    lidPivot.add(glassSheen);

    // Authentic MacBook Pro Camera Notch at Top Center of Screen
    var notchW = 0.44, notchH = 0.072;
    var notchShape = new THREE.Shape();
    var nx0 = -notchW / 2, ny0 = -notchH / 2, nr = 0.022;
    notchShape.moveTo(nx0, ny0 + notchH);
    notchShape.lineTo(nx0 + notchW, ny0 + notchH);
    notchShape.lineTo(nx0 + notchW, ny0 + nr);
    notchShape.quadraticCurveTo(nx0 + notchW, ny0, nx0 + notchW - nr, ny0);
    notchShape.lineTo(nx0 + nr, ny0);
    notchShape.quadraticCurveTo(nx0, ny0, nx0, ny0 + nr);
    notchShape.closePath();
    var notchMesh = new THREE.Mesh(new THREE.ShapeGeometry(notchShape, 8), matGlassBezel);
    notchMesh.position.set(0, scrY + scrH / 2 - notchH / 2 + 0.002, LH / 2 + 0.0056);
    lidPivot.add(notchMesh);

    // Subtle camera lens circle + micro green indicator inside notch
    var camLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.013, 16),
      new THREE.MeshBasicMaterial({ color: 0x162234 })
    );
    camLens.position.set(0, scrY + scrH / 2 - notchH * 0.52, LH / 2 + 0.0064);
    lidPivot.add(camLens);

    // Soft Studio Floor Contact Shadow Directly Under the 3D MacBook
    var shCanvas = document.createElement('canvas');
    shCanvas.width = 512; shCanvas.height = 512;
    var shCtx = shCanvas.getContext('2d');
    var shGrad = shCtx.createRadialGradient(256, 256, 28, 256, 256, 245);
    shGrad.addColorStop(0, 'rgba(0,0,0,0.68)');
    shGrad.addColorStop(0.55, 'rgba(0,0,0,0.32)');
    shGrad.addColorStop(1, 'rgba(0,0,0,0)');
    shCtx.fillStyle = shGrad;
    shCtx.fillRect(0, 0, 512, 512);
    var shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.1, 3.85),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shCanvas),
        transparent: true,
        depthWrite: false,
        opacity: 0.82
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.04, 0.06);
    laptopRoot.add(shadowPlane);

    // Center the whole MacBook cleanly vertically across all 360° spin angles (zero clipping at 180°!)
    laptopRoot.position.set(0, -0.68, 0);

    // -------------------------------------------------------------------------
    // Dynamic 60fps Screen Painter (MI AMP Sky-to-Plugin Pan | APPI | Webs Fast Scroll)
    // -------------------------------------------------------------------------
    var activeIdx = 0;
    var slideStartTs = performance.now();
    var lastScreenPaint = 0;
    var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
    var easeInOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    function paintScreen(now, openAmt) {
      // Limit canvas repaints cleanly to ~45fps max for crisp motion + cool mobile battery
      if (now - lastScreenPaint < 22) return;
      lastScreenPaint = now;

      var cw = screenCanvas.width, ch = screenCanvas.height;
      var item = SHOWCASE[activeIdx];
      var elapsed = (now - slideStartTs) / 1000;

      sctx.fillStyle = '#07090e';
      sctx.fillRect(0, 0, cw, ch);

      if (item.key === 'miamp' && imgs.miamp.complete && imgs.miamp.naturalWidth > 0) {
        // Real MI AMP Sky-to-Stage Intro Pan!
        // Upper half (0..921) = coastal sky + MI AMP logo; Lower half (921..1842) = real image-11.png plugin!
        var natW = imgs.miamp.naturalWidth;
        var natH = imgs.miamp.naturalHeight;
        var halfH = natH / 2;
        var panT = 0;
        if (reduced) {
          panT = 1;
        } else if (elapsed < 1.15) {
          // Hold smoothly in sky with subtle organic camera breathe
          panT = 0.015 * Math.sin(elapsed * 2.1);
        } else if (elapsed < 2.85) {
          // Cinematic downward camera glide from sunlit sky + logo onto real MI AMP plugin!
          panT = easeInOutCubic((elapsed - 1.15) / 1.70);
        } else {
          panT = 1;
        }
        var sy = clamp(panT, 0, 1) * halfH;
        sctx.drawImage(imgs.miamp, 0, sy, natW, halfH, 0, 0, cw, ch);

        // Once settled on the real MI AMP plugin, gently pulse the warm amber pilot jewel lamp!
        if (panT > 0.92) {
          var lampPulse = 0.28 + 0.22 * Math.sin(elapsed * 4.5);
          var lx = cw * 0.6375;
          var ly = ch * 0.6460;
          var lg = sctx.createRadialGradient(lx, ly, 2, lx, ly, 36);
          lg.addColorStop(0, 'rgba(255, 138, 42, ' + (lampPulse * 0.72).toFixed(3) + ')');
          lg.addColorStop(1, 'rgba(255, 90, 20, 0)');
          sctx.fillStyle = lg;
          sctx.beginPath();
          sctx.arc(lx, ly, 36, 0, Math.PI * 2);
          sctx.fill();
        }
      } else if (item.key === 'appi' && imgs.appi.complete && imgs.appi.naturalWidth > 0) {
        sctx.drawImage(imgs.appi, 0, 0, cw, ch);
      } else if (item.key === 'webs' && imgs.webs.complete && imgs.webs.naturalWidth > 0) {
        // Full-bleed edge-to-edge fast live scroll (zero browser chrome)
        var wNatW = imgs.webs.naturalWidth;
        var wNatH = imgs.webs.naturalHeight;
        var viewSrcH = wNatW * (ch / cw); // exact source height matching screen ratio (~921px of 2680px!)
        var maxSrcY = Math.max(0, wNatH - viewSrcH);

        // Smooth lively loop: brief hold at Hero -> fast glide through Catalog -> Reviews -> POPUPS footer -> back to top
        var cycle = 6.8;
        var p = reduced ? 0 : ((elapsed % cycle) / cycle);
        var frac = 0;
        if (p < 0.08) {
          frac = 0;
        } else if (p < 0.68) {
          frac = easeInOutCubic((p - 0.08) / 0.60);
        } else if (p < 0.82) {
          frac = 1;
        } else {
          frac = 1 - easeInOutCubic((p - 0.82) / 0.18);
        }
        var srcY = frac * maxSrcY;
        sctx.drawImage(imgs.webs, 0, srcY, wNatW, viewSrcH, 0, 0, cw, ch);

        // Ultra-subtle slim macOS-style floating scroll thumb on right edge (no browser chrome!)
        var barH = ch * 0.26;
        var barY = 14 + frac * (ch - barH - 28);
        sctx.fillStyle = 'rgba(12, 14, 18, 0.34)';
        sctx.fillRect(cw - 11, barY, 5, barH);
      }

      // Sleep-to-wake brightness veil as the physical lid opens
      var awake = clamp((openAmt - 0.18) / 0.52, 0, 1);
      if (awake < 0.995) {
        sctx.fillStyle = 'rgba(5, 7, 11, ' + ((1 - awake) * 0.94).toFixed(3) + ')';
        sctx.fillRect(0, 0, cw, ch);
      }

      screenTex.needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // UI Sync (Behind-MacBook Pills, Aurora, Caption Bar, Switcher Tabs)
    // -------------------------------------------------------------------------
    function applyProductData(idx, dimPillsBrief) {
      activeIdx = ((idx % SHOWCASE.length) + SHOWCASE.length) % SHOWCASE.length;
      slideStartTs = performance.now();
      var item = SHOWCASE[activeIdx];

      portalStage.classList.remove('theme-miamp', 'theme-appi', 'theme-webs');
      portalStage.classList.add(item.theme);
      screenBounceLight.color.setHex(item.glowColor);

      if (dimPillsBrief && portalPills) {
        portalPills.classList.add('is-swapping');
        setTimeout(function () {
          pillEls.forEach(function (el, i) {
            if (item.pills[i] !== undefined) el.textContent = item.pills[i];
          });
          portalPills.classList.remove('is-swapping');
        }, 180);
      } else {
        pillEls.forEach(function (el, i) {
          if (item.pills[i] !== undefined) el.textContent = item.pills[i];
        });
      }

      if (mbpCaption) {
        mbpCaption.setAttribute('href', item.href);
        mbpCaption.style.setProperty('--cap-accent', item.accent);
        if (item.external) {
          mbpCaption.setAttribute('target', '_blank');
          mbpCaption.setAttribute('rel', 'noopener');
        } else {
          mbpCaption.removeAttribute('target');
          mbpCaption.removeAttribute('rel');
        }
      }
      if (mbpCapTag) mbpCapTag.textContent = item.tag;
      if (mbpCapText) mbpCapText.innerHTML = item.html;
      if (mbpCapCta) mbpCapCta.textContent = item.cta;

      swBtns.forEach(function (btn, i) {
        var on = i === activeIdx;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        var prog = btn.querySelector('.sw-prog');
        if (prog) prog.style.transform = 'scaleX(0)';
      });

      dwellElapsed = 0;
    }

    // -------------------------------------------------------------------------
    // Interactive 360° Drag (Touch Finger + Mouse Drag) + Real Inertia + Auto-Spin
    // -------------------------------------------------------------------------
    var targetOpen = reduced ? 1 : 0;
    var currentOpen = reduced ? 1 : 0;
    var inView = true;
    var isHoverSwitcher = false;

    // 3D Orientation State
    var rotY = 0;         // continuous Y angle in radians (spin freely 360°!)
    var rotX = 0.08;      // gentle studio viewing elevation pitch
    var velY = 0;         // angular velocity for weighted inertia
    var velX = 0;
    var hoverX = 0, hoverY = 0, curHX = 0, curHY = 0;

    // Programmatic 360° spin transition (auto-spin or switcher click)
    var SPIN_MS = 1480;
    var spinActive = false;
    var spinStartTs = 0;
    var spinStartY = 0;
    var spinEndY = 0;
    var spinTargetIdx = 0;
    var spinSwapped = false;
    var spinPillsDimmed = false;
    var dwellElapsed = 0;
    var userInteractedOnce = false;
    var manualBackCrossed = false;
    var manualDragDir = 1;

    // Pointer / Touch Drag State
    var isDragging = false;
    var dragPointerId = null;
    var dragStartX = 0, dragStartY = 0;
    var lastDragX = 0, lastDragY = 0;
    var dragTotalDist = 0;
    var touchAxis = null; // 'h' (spin 360°) | 'v' (normal page scroll)

    function triggerSpinTo(nextIdx, dirOverride) {
      var dest = ((nextIdx % SHOWCASE.length) + SHOWCASE.length) % SHOWCASE.length;
      if (reduced) {
        applyProductData(dest, false);
        return;
      }
      if (spinActive) {
        if (!spinSwapped) spinTargetIdx = dest;
        return;
      }
      var dir = dirOverride || (dest < activeIdx && !(activeIdx === SHOWCASE.length - 1 && dest === 0) ? -1 : 1);
      // Normalize starting angle cleanly to nearest multiple of 2π so it lands square facing viewer
      var nearestFront = Math.round(rotY / (Math.PI * 2)) * Math.PI * 2;
      spinActive = true;
      spinStartTs = performance.now();
      spinStartY = rotY;
      spinEndY = nearestFront + dir * Math.PI * 2;
      spinTargetIdx = dest;
      spinSwapped = false;
      spinPillsDimmed = false;
      velY = 0;
      velX = 0;
      dwellElapsed = 0;
      if (mbpSpinBtn) mbpSpinBtn.classList.add('is-spinning');
    }

    function hideDragHint() {
      if (!userInteractedOnce) {
        userInteractedOnce = true;
        if (mbpDragHint) mbpDragHint.classList.add('is-used');
      }
    }

    // Mouse Drag (desktop)
    var dom = renderer.domElement;
    dom.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      spinActive = false;
      if (mbpSpinBtn) mbpSpinBtn.classList.remove('is-spinning');
      if (portalPills) portalPills.classList.remove('is-swapping');
      dragStartX = lastDragX = e.clientX;
      dragStartY = lastDragY = e.clientY;
      dragTotalDist = 0;
      velY = 0; velX = 0;
      dwellElapsed = 0;
      manualBackCrossed = Math.cos(rotY) < -0.5;
      dom.classList.add('is-dragging');
      hideDragHint();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.clientX - lastDragX;
      var dy = e.clientY - lastDragY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragTotalDist += Math.hypot(dx, dy);

      var dRotY = dx * 0.0086;
      var dRotX = dy * 0.0048;
      if (Math.abs(dx) > 0.5) manualDragDir = dx > 0 ? 1 : -1;
      rotY += dRotY;
      rotX = clamp(rotX + dRotX, -0.26, 0.42);
      velY = dRotY * 0.85;
      velX = dRotX * 0.5;
      dwellElapsed = 0;
    });

    window.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      dom.classList.remove('is-dragging');
      // If user simply clicked (no drag) while facing the front open screen -> open current product!
      if (dragTotalDist < 7 && currentOpen > 0.7 && Math.cos(rotY) > 0.55) {
        var item = SHOWCASE[activeIdx];
        if (item.external) {
          window.open(item.href, '_blank', 'noopener');
        } else {
          window.location.href = item.href;
        }
      }
    });

    // Touch Finger Drag (mobile & tablet — smart horizontal spin vs vertical scroll!)
    dom.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      var t = e.touches[0];
      isDragging = true;
      touchAxis = null;
      spinActive = false;
      if (mbpSpinBtn) mbpSpinBtn.classList.remove('is-spinning');
      if (portalPills) portalPills.classList.remove('is-swapping');
      dragStartX = lastDragX = t.clientX;
      dragStartY = lastDragY = t.clientY;
      dragTotalDist = 0;
      velY = 0; velX = 0;
      dwellElapsed = 0;
      manualBackCrossed = Math.cos(rotY) < -0.5;
    }, { passive: true });

    dom.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var t = e.touches[0];
      var dx = t.clientX - lastDragX;
      var dy = t.clientY - lastDragY;
      var totalDx = Math.abs(t.clientX - dragStartX);
      var totalDy = Math.abs(t.clientY - dragStartY);

      if (!touchAxis && (totalDx > 7 || totalDy > 7)) {
        touchAxis = totalDx >= totalDy * 0.82 ? 'h' : 'v';
        if (touchAxis === 'h') hideDragHint();
      }

      if (touchAxis === 'v') {
        // Let the visitor scroll the page naturally!
        return;
      }
      if (touchAxis === 'h') {
        e.preventDefault();
        lastDragX = t.clientX;
        lastDragY = t.clientY;
        dragTotalDist += Math.hypot(dx, dy);
        var dRotY = dx * 0.0115;
        var dRotX = dy * 0.0038;
        if (Math.abs(dx) > 0.5) manualDragDir = dx > 0 ? 1 : -1;
        rotY += dRotY;
        rotX = clamp(rotX + dRotX, -0.22, 0.36);
        velY = dRotY * 0.92;
        velX = dRotX * 0.4;
        dwellElapsed = 0;
      }
    }, { passive: false });

    dom.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      touchAxis = null;
    }, { passive: true });

    dom.addEventListener('touchcancel', function () {
      isDragging = false;
      touchAxis = null;
    }, { passive: true });

    // Switcher dock buttons & 360° spin button
    swBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        hideDragHint();
        var idx = Number(btn.dataset.idx);
        if (idx === activeIdx) {
          triggerSpinTo((activeIdx + 1) % SHOWCASE.length, 1);
        } else {
          triggerSpinTo(idx);
        }
      });
    });

    if (mbpSpinBtn) {
      mbpSpinBtn.addEventListener('click', function () {
        hideDragHint();
        triggerSpinTo((activeIdx + 1) % SHOWCASE.length, 1);
      });
    }

    if (mbpSwitcher) {
      mbpSwitcher.addEventListener('pointerenter', function () { isHoverSwitcher = true; });
      mbpSwitcher.addEventListener('pointerleave', function () { isHoverSwitcher = false; });
    }

    if (mbpCue) {
      mbpCue.addEventListener('click', function () {
        var top = portalStage.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    }

    // Scroll-opening target calculation
    function computeTarget() {
      if (reduced) { targetOpen = 1; return; }
      var rect = portalStage.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var startY = vh * 0.90;
      var endY = vh * 0.20;
      var raw = (startY - rect.top) / Math.max(210, startY - endY);
      targetOpen = clamp(raw, 0, 1);
    }

    function resizeRenderer() {
      var rect = canvasHost.getBoundingClientRect();
      var w = Math.max(260, Math.round(rect.width));
      var h = Math.max(200, Math.round(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull camera cleanly back on narrow mobile portrait so the spinning 3D corners NEVER clip!
      camera.position.z = w < 520 ? 8.95 : 7.65;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('scroll', computeTarget, { passive: true });
    window.addEventListener('resize', function () { computeTarget(); resizeRenderer(); }, { passive: true });

    if (window.matchMedia('(pointer:fine)').matches && !reduced) {
      portalStage.addEventListener('pointermove', function (e) {
        var box = portalStage.getBoundingClientRect();
        hoverX = ((e.clientX - box.left) / box.width - 0.5) * 2;
        hoverY = ((e.clientY - box.top) / box.height - 0.5) * 2;
      });
      portalStage.addEventListener('pointerleave', function () {
        hoverX = 0; hoverY = 0;
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0] ? entries[0].isIntersecting : true;
      }, { threshold: 0.08 }).observe(portalStage);
    }

    // -------------------------------------------------------------------------
    // Main 60fps 3D Animation Loop
    // -------------------------------------------------------------------------
    var lastTs = 0;
    function animate(now) {
      requestAnimationFrame(animate);
      if (!inView && !spinActive && !isDragging) {
        lastTs = now;
        return;
      }

      var dt = lastTs ? Math.min(64, now - lastTs) : 16;
      lastTs = now;

      currentOpen += (targetOpen - currentOpen) * 0.11;
      curHX += (hoverX - curHX) * 0.08;
      curHY += (hoverY - curHY) * 0.08;

      var e = easeOutQuart(currentOpen);

      // Physical lid angle: closed = +PI/2 (folded flat on top of keyboard), open = -0.26 rad (~105° studio open!)
      var closedLidRotX = Math.PI / 2 - 0.032;
      var openLidRotX = -0.255;
      lidPivot.rotation.x = closedLidRotX + (openLidRotX - closedLidRotX) * e;

      // Subtle screen bounce illumination onto the Space Black keyboard deck
      screenBounceLight.intensity = clamp((e - 0.25) / 0.65, 0, 1.25);

      var floatLift = 0;
      if (spinActive) {
        var rawT = clamp((now - spinStartTs) / SPIN_MS, 0, 1);
        var easedT = easeInOutCubic(rawT);
        rotY = spinStartY + (spinEndY - spinStartY) * easedT;
        floatLift = 0.14 * Math.sin(rawT * Math.PI);
        rotX += (0.09 - rotX) * 0.08;

        if (rawT >= 0.24 && !spinPillsDimmed) {
          spinPillsDimmed = true;
          if (portalPills) portalPills.classList.add('is-swapping');
        }
        if (rawT >= 0.48 && !spinSwapped) {
          spinSwapped = true;
          applyProductData(spinTargetIdx, false);
        }
        if (rawT >= 0.68 && spinPillsDimmed) {
          spinPillsDimmed = false;
          if (portalPills) portalPills.classList.remove('is-swapping');
        }
        if (rawT >= 1) {
          spinActive = false;
          rotY = spinEndY;
          if (portalPills) portalPills.classList.remove('is-swapping');
          if (mbpSpinBtn) mbpSpinBtn.classList.remove('is-spinning');
        }
      } else if (isDragging) {
        // Check if the user manually spun the MacBook past the back (180°): magically queue the next product while back faces camera!
        var facingBack = Math.cos(rotY) < -0.68;
        if (facingBack && !manualBackCrossed && currentOpen > 0.65) {
          manualBackCrossed = true;
          var nextOnDrag = activeIdx + (manualDragDir >= 0 ? 1 : -1);
          applyProductData(nextOnDrag, true);
        } else if (Math.cos(rotY) > 0.55) {
          manualBackCrossed = false;
        }
      } else {
        // Weighted rotational inertia after user flicks with finger or mouse!
        if (Math.abs(velY) > 0.0004 || Math.abs(velX) > 0.0004) {
          rotY += velY;
          rotX = clamp(rotX + velX, -0.26, 0.42);
          velY *= 0.945;
          velX *= 0.90;

          var inertiaBack = Math.cos(rotY) < -0.68;
          if (inertiaBack && !manualBackCrossed && currentOpen > 0.65) {
            manualBackCrossed = true;
            var nextOnFlick = activeIdx + (velY >= 0 ? 1 : -1);
            applyProductData(nextOnFlick, true);
          } else if (Math.cos(rotY) > 0.55) {
            manualBackCrossed = false;
          }
        } else {
          // Gentle studio pitch return + subtle living ambient hover
          rotX += (0.08 - rotX) * 0.05;

          // Auto-advance 360° showcase timer when open, visible & idle near front
          if (!reduced && inView && currentOpen > 0.84 && !isHoverSwitcher) {
            var dwellMs = SHOWCASE[activeIdx].dwell;
            dwellElapsed += dt;
            var pct = clamp(dwellElapsed / dwellMs, 0, 1);
            var activeProg = swBtns[activeIdx] && swBtns[activeIdx].querySelector('.sw-prog');
            if (activeProg) activeProg.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
            if (dwellElapsed >= dwellMs) {
              triggerSpinTo((activeIdx + 1) % SHOWCASE.length, 1);
            }
          }
        }
      }

      // Apply 3D root orientation + subtle desktop pointer orbit + graceful weightless hover
      var orbitAmt = clamp((e - 0.65) / 0.35, 0, 1);
      var idleBob = reduced ? 0 : Math.sin(now * 0.0017) * 0.032 * orbitAmt;
      laptopRoot.rotation.y = rotY + (isDragging ? 0 : curHX * 0.09 * orbitAmt);
      laptopRoot.rotation.x = rotX + (isDragging ? 0 : -curHY * 0.05 * orbitAmt);
      laptopRoot.position.y = -0.68 + (1 - e) * -0.14 + floatLift + idleBob;

      // Soft contact shadow breathes cleanly with elevation & opening state
      shadowPlane.material.opacity = clamp((0.58 + 0.24 * e) - floatLift * 1.4, 0.35, 0.85);
      var shScale = 1 - floatLift * 0.5;
      shadowPlane.scale.set(shScale, shScale, 1);

      // Update live screen canvas (MI AMP intro sky pan, APPI, Webs a medida fast scroll)
      paintScreen(now, e);

      // Sync surrounding hero DOM elements smoothly with opening state
      var uiRise = clamp((e - 0.42) / 0.50, 0, 1);
      if (mbpDragHint) {
        mbpDragHint.style.opacity = (uiRise * (userInteractedOnce ? 0.55 : 0.92)).toFixed(3);
      }
      if (mbpSwitcher) {
        mbpSwitcher.style.opacity = uiRise.toFixed(3);
        mbpSwitcher.style.transform = 'translate3d(0, ' + ((1 - uiRise) * 14).toFixed(1) + 'px, 0)';
      }
      if (mbpCaption) {
        mbpCaption.style.opacity = uiRise.toFixed(3);
        mbpCaption.style.transform = 'translate3d(0, ' + ((1 - uiRise) * 16).toFixed(1) + 'px, 0)';
      }
      if (mbpCue) {
        var cueOp = clamp(1 - e * 3.2, 0, 1);
        mbpCue.style.opacity = cueOp.toFixed(3);
        mbpCue.style.pointerEvents = cueOp > 0.15 ? 'auto' : 'none';
      }
      if (portalOrbits) {
        portalOrbits.style.transform =
          'translate3d(' + (-curHX * 14 * orbitAmt).toFixed(1) + 'px, ' + (-curHY * 9 * orbitAmt).toFixed(1) + 'px, 0)';
      }
      if (mbpAurora) {
        mbpAurora.style.opacity = (0.48 + 0.50 * e).toFixed(3);
      }

      renderer.render(scene, camera);
    }

    applyProductData(0, false);
    computeTarget();
    currentOpen = targetOpen;
    resizeRenderer();
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMacBook3D);
  } else {
    initMacBook3D();
  }
})();
