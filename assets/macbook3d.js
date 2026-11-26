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
    // 3 Flagship Products in Exact Sequence
    // -------------------------------------------------------------------------
    var SHOWCASE = [
      {
        key: 'miamp',
        theme: 'theme-miamp',
        accent: '#54e3b4',
        glowColor: 0x62e5be,
        dwell: 7000,
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
        dwell: 6200,
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
        dwell: 7800,
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
    // High-Performance WebGL Renderer Setup
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

    var FOV_DEG = 16.5;
    var TAN_HALF_FOV = Math.tan((FOV_DEG * Math.PI) / 360);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(FOV_DEG, 16 / 10, 0.1, 80);
    var baseCamZ = 10.6;
    var curCamZ = 10.6;
    var spinDollyAmt = 2.0;
    var OPEN_CAM_Y = 0.80;
    var OPEN_LOOK_Y = 0.36;
    var curLookY = OPEN_LOOK_Y;
    camera.position.set(0, OPEN_CAM_Y, baseCamZ);
    camera.lookAt(0, curLookY, 0);

    // -------------------------------------------------------------------------
    // Procedural Studio HDRI Environment Map (Apple-Grade Metallic Reflections)
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

    addStudioPanel(0xf4f7ff, [0, 8, 1], [Math.PI / 2, 0, 0], 14, 9, 2.2);
    addStudioPanel(0xdce6ff, [0, 3.2, 9], [0, Math.PI, 0], 10, 4.5, 1.35);
    addStudioPanel(0x8874ff, [-9, 2.8, 0.5], [0, Math.PI / 2, 0], 9, 5, 1.65);
    addStudioPanel(0xbdf642, [9, 2.5, 0.5], [0, -Math.PI / 2, 0], 8, 4.2, 1.15);
    addStudioPanel(0xe4ecff, [0, 4.5, -9], [0.22, 0, 0], 12, 5.5, 1.9);
    addStudioPanel(0x283044, [0, -6, 0], [-Math.PI / 2, 0, 0], 16, 16, 0.85);

    var envRT = pmrem.fromScene(envScene, 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xd8e2ff, 0x161924, 0.92));

    var keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
    keyLight.position.set(4.5, 7.5, 6.2);
    scene.add(keyLight);

    var rimLeft = new THREE.DirectionalLight(0x8b70ef, 0.72);
    rimLeft.position.set(-6.5, 3.0, -3.5);
    scene.add(rimLeft);

    var rimRight = new THREE.DirectionalLight(0xc8f810, 0.45);
    rimRight.position.set(6.5, 2.2, -4.0);
    scene.add(rimRight);

    var screenBounceLight = new THREE.PointLight(0x62e5be, 0.42, 3.8, 2);
    screenBounceLight.position.set(0, 1.35, -0.35);

    // -------------------------------------------------------------------------
    // Geometry Helpers (CNC Chamfered Rounded Aluminum Slabs)
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
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, bevel, 0);
      geo.computeVertexNormals();
      return geo;
    }

    // -------------------------------------------------------------------------
    // Procedural Space Black Keyboard + Trackpad + Speaker Grilles Texture
    // -------------------------------------------------------------------------
    function createKeyboardDeckTexture() {
      var cw = 1536, ch = 972;
      var c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      var ctx = c.getContext('2d');

      var bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, '#22262e');
      bgGrad.addColorStop(0.5, '#272c35');
      bgGrad.addColorStop(1, '#1f232b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      for (var i = 0; i < 4500; i++) {
        ctx.fillStyle = (i & 1) ? 'rgba(255,255,255,0.014)' : 'rgba(0,0,0,0.02)';
        ctx.fillRect(Math.random() * cw, Math.random() * ch, 2, 1);
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

      var kx = 188, ky = 72, kw = 1160, kh = 474;
      rrect(kx - 4, ky - 4, kw + 8, kh + 8, 22);
      ctx.fillStyle = '#090a0d';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      rrect(kx, ky, kw, kh, 18);
      ctx.fillStyle = '#0c0d11';
      ctx.fill();

      ctx.fillStyle = 'rgba(6, 7, 10, 0.78)';
      for (var side = 0; side < 2; side++) {
        var sx0 = side === 0 ? 52 : 1384;
        for (var col = 0; col < 10; col++) {
          for (var row = 0; row < 44; row++) {
            var dx = sx0 + col * 10.5 + (row % 2 ? 4.5 : 0);
            var dy = 90 + row * 10.0;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      var rows = [
        { h: 55, keys: [
          ['esc', 1.45], ['F1', 1], ['F2', 1], ['F3', 1], ['F4', 1], ['F5', 1], ['F6', 1],
          ['F7', 1], ['F8', 1], ['F9', 1], ['F10', 1], ['F11', 1], ['F12', 1], ['TOUCH', 1.15]
        ]},
        { h: 66, keys: [
          ['º', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['delete', 1.65]
        ]},
        { h: 66, keys: [
          ['tab', 1.55], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.1]
        ]},
        { h: 66, keys: [
          ['caps', 1.8], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['return', 1.85]
        ]},
        { h: 66, keys: [
          ['shift', 2.32], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['shift', 2.33]
        ]},
        { h: 71, keys: [
          ['fn', 1], ['ctrl', 1], ['opt', 1], ['cmd', 1.32], ['', 5.35], ['cmd', 1.32], ['opt', 1], ['◀', 0.9], ['▲▼', 0.92], ['▶', 0.9]
        ]}
      ];

      var padX = 16, padY = 15, gap = 9;
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
            ctx.arc(curX + kwKey / 2, curY + khKey / 2, 15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(180, 192, 210, 0.34)';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (label === '▲▼') {
            ctx.fillStyle = '#0a0b0e';
            ctx.fillRect(curX, curY + khKey / 2 - 2, kwKey, 4);
            ctx.fillStyle = 'rgba(232, 238, 248, 0.65)';
            ctx.font = '600 12px sans-serif';
            ctx.fillText('▲', curX + kwKey / 2, curY + khKey * 0.27);
            ctx.fillText('▼', curX + kwKey / 2, curY + khKey * 0.75);
          } else if (label) {
            ctx.fillStyle = 'rgba(232, 238, 248, 0.72)';
            ctx.font = label.length > 2 ? '600 12px system-ui, sans-serif' : '600 17px system-ui, sans-serif';
            ctx.fillText(label, curX + kwKey / 2, curY + khKey / 2 + 1);
          }
          curX += kwKey + gap;
        }
        curY += rowDef.h + gap;
      }

      var tx = 442, ty = 580, tw = 652, th = 342;
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
    // TRANSPARENT POPUPS "P●" STICKER DECAL ON SEAMLESS SPACE BLACK LID
    // -------------------------------------------------------------------------
    var stickerCanvas = document.createElement('canvas');
    stickerCanvas.width = 512;
    stickerCanvas.height = 512;
    var stickerCtx = stickerCanvas.getContext('2d');
    var stickerTex = new THREE.CanvasTexture(stickerCanvas);
    stickerTex.encoding = THREE.sRGBEncoding;
    stickerTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    function drawPopupsSticker(markImg) {
      var w = stickerCanvas.width, h = stickerCanvas.height;
      stickerCtx.clearRect(0, 0, w, h);

      if (markImg && markImg.complete && markImg.naturalWidth > 0) {
        var srcW = markImg.naturalWidth * (460 / 1200);
        var srcH = markImg.naturalHeight;
        var drawW = 390;
        var drawH = drawW * (srcH / srcW);
        var dx = (w - drawW) / 2;
        var dy = (h - drawH) / 2;

        stickerCtx.drawImage(markImg, 0, 0, srcW, srcH, dx, dy, drawW, drawH);

        var dotX = dx + drawW * 0.7908;
        var dotY = dy + drawH * 0.2090;
        var dotR = drawW * 0.1157;

        var glow = stickerCtx.createRadialGradient(dotX, dotY, dotR * 0.25, dotX, dotY, dotR * 1.9);
        glow.addColorStop(0, 'rgba(198,248,17,0.44)');
        glow.addColorStop(1, 'rgba(198,248,17,0)');
        stickerCtx.fillStyle = glow;
        stickerCtx.beginPath();
        stickerCtx.arc(dotX, dotY, dotR * 1.9, 0, Math.PI * 2);
        stickerCtx.fill();

        var dg = stickerCtx.createRadialGradient(dotX - dotR * 0.28, dotY - dotR * 0.28, dotR * 0.1, dotX, dotY, dotR);
        dg.addColorStop(0, '#e8ff85');
        dg.addColorStop(0.55, '#c6f811');
        dg.addColorStop(1, '#9ece00');
        stickerCtx.fillStyle = dg;
        stickerCtx.beginPath();
        stickerCtx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
        stickerCtx.fill();
      } else {
        stickerCtx.fillStyle = '#c6f811';
        stickerCtx.beginPath();
        stickerCtx.arc(w / 2, h / 2, 34, 0, Math.PI * 2);
        stickerCtx.fill();
      }
      stickerTex.needsUpdate = true;
    }
    drawPopupsSticker(null);

    // -------------------------------------------------------------------------
    // High-Speed GPU Screen Canvas Texture (1280 x 802 = Exact 16:10 Full-Bleed!)
    // Zero mipmap regen + smart dirty flag -> locked 60/120fps fluidity!
    // -------------------------------------------------------------------------
    var screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1280;
    screenCanvas.height = 802;
    var sctx = screenCanvas.getContext('2d', { alpha: false });
    sctx.fillStyle = '#07090e';
    sctx.fillRect(0, 0, 1280, 802);

    var screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.encoding = THREE.sRGBEncoding;
    screenTex.generateMipmaps = false;
    screenTex.minFilter = THREE.LinearFilter;
    screenTex.magFilter = THREE.LinearFilter;
    screenTex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

    var screenDirty = true;
    var imgs = {
      miamp: new Image(),
      appi: new Image(),
      webs: new Image(),
      mark: new Image()
    };
    imgs.miamp.onload = function () { screenDirty = true; };
    imgs.appi.onload = function () { screenDirty = true; };
    imgs.webs.onload = function () { screenDirty = true; };
    imgs.mark.onload = function () { drawPopupsSticker(imgs.mark); };
    imgs.miamp.src = 'assets/miamp-real-intro.webp';
    imgs.appi.src = 'assets/appi-screen-full.webp';
    imgs.webs.src = 'assets/webs-medida-scroll.webp';
    imgs.mark.src = 'assets/logo-mark.webp';

    // -------------------------------------------------------------------------
    // Build True Cinema 16:10 Solid 3D Space Black MacBook Pro 16"
    // Balanced center-of-mass pivot (base offset +0.52) for ultra-smooth 360° spin!
    // -------------------------------------------------------------------------
    var W = 3.76, D = 2.38, BH = 0.122, LH = 0.044, R = 0.145;
    var Z_OFF = 0.52;

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
      metalness: 0.20,
      roughness: 0.09,
      envMapIntensity: 1.2
    });

    var laptopRoot = new THREE.Group();
    scene.add(laptopRoot);

    // 1) UNIBODY CHASSIS BASE
    var baseGroup = new THREE.Group();
    baseGroup.position.z = Z_OFF;
    laptopRoot.add(baseGroup);

    var baseChassis = new THREE.Mesh(makeChamferedSlab(W, D, BH, R, 0.018), matAluminum);
    baseGroup.add(baseChassis);

    var deckGeo = new THREE.PlaneGeometry(W - 0.10, D - 0.10);
    deckGeo.rotateX(-Math.PI / 2);
    var deckMat = new THREE.MeshStandardMaterial({
      map: createKeyboardDeckTexture(),
      metalness: 0.22,
      roughness: 0.64,
      envMapIntensity: 0.72
    });
    var deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, BH + 0.0012, 0);
    baseGroup.add(deckMesh);

    var footGeo = new THREE.CylinderGeometry(0.115, 0.122, 0.022, 24);
    var footPositions = [
      [-W / 2 + 0.34, -0.011, -D / 2 + 0.30],
      [ W / 2 - 0.34, -0.011, -D / 2 + 0.30],
      [-W / 2 + 0.34, -0.011,  D / 2 - 0.30],
      [ W / 2 - 0.34, -0.011,  D / 2 - 0.30]
    ];
    for (var fi = 0; fi < footPositions.length; fi++) {
      var foot = new THREE.Mesh(footGeo, matRubber);
      foot.position.set(footPositions[fi][0], footPositions[fi][1], footPositions[fi][2]);
      baseGroup.add(foot);
    }

    var thumbNotch = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.036, 0.024), matAluminumDark);
    thumbNotch.position.set(0, BH - 0.024, D / 2 - 0.006);
    baseGroup.add(thumbNotch);

    var hingeBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, W * 0.66, 20), matAluminumDark);
    hingeBarrel.rotation.z = Math.PI / 2;
    hingeBarrel.position.set(0, BH - 0.014, -D / 2 + 0.038);
    baseGroup.add(hingeBarrel);

    var rearVent = new THREE.Mesh(new THREE.BoxGeometry(W * 0.62, 0.034, 0.018), matPortMetal);
    rearVent.position.set(0, BH * 0.52, -D / 2 + 0.004);
    baseGroup.add(rearVent);

    function addPort(x, y, z, pw, ph, sideSign) {
      var rim = new THREE.Mesh(new THREE.BoxGeometry(0.010, ph + 0.012, pw + 0.014), matPortRim);
      rim.position.set(x, y, z);
      baseGroup.add(rim);
      var hole = new THREE.Mesh(new THREE.BoxGeometry(0.014, ph, pw), matPortMetal);
      hole.position.set(x + sideSign * 0.0015, y, z);
      baseGroup.add(hole);
    }
    var pY = BH * 0.54;
    addPort(-W / 2 + 0.002, pY, -0.74, 0.145, 0.036, -1);
    addPort(-W / 2 + 0.002, pY, -0.48, 0.095, 0.028, -1);
    addPort(-W / 2 + 0.002, pY, -0.30, 0.095, 0.028, -1);
    var audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 16), matPortMetal);
    audioJack.rotation.z = Math.PI / 2;
    audioJack.position.set(-W / 2 + 0.002, pY, -0.10);
    baseGroup.add(audioJack);
    addPort(W / 2 - 0.002, pY, -0.72, 0.165, 0.036, 1);
    addPort(W / 2 - 0.002, pY, -0.46, 0.095, 0.028, 1);
    addPort(W / 2 - 0.002, pY, -0.18, 0.245, 0.024, 1);

    baseGroup.add(screenBounceLight);

    // 2) HINGED 16:10 FULL-BLEED CINEMA DISPLAY LID (Seamless Space Black Aluminum + POPUPS Sticker!)
    var lidPivot = new THREE.Group();
    lidPivot.position.set(0, BH + 0.004, -D / 2 + 0.055 + Z_OFF);
    laptopRoot.add(lidPivot);

    var lidShape = makeRoundedRectShape(W - 0.024, D - 0.024, R - 0.012);
    var lidGeo = new THREE.ExtrudeGeometry(lidShape, {
      depth: LH - 0.016,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
      curveSegments: 20
    });
    lidGeo.translate(0, D / 2, -(LH - 0.016) / 2);
    lidGeo.computeVertexNormals();
    var lidBody = new THREE.Mesh(lidGeo, matAluminum);
    lidPivot.add(lidBody);

    // Transparent POPUPS "P●" Sticker Decal on the seamless Space Black aluminum lid (identical closed & 180°!)
    var stickerGeo = new THREE.PlaneGeometry(1.12, 1.12);
    stickerGeo.rotateY(Math.PI);
    var stickerMat = new THREE.MeshStandardMaterial({
      map: stickerTex,
      transparent: true,
      alphaTest: 0.02,
      metalness: 0.18,
      roughness: 0.22,
      envMapIntensity: 1.25,
      depthWrite: false
    });
    var popupsStickerMesh = new THREE.Mesh(stickerGeo, stickerMat);
    popupsStickerMesh.position.set(0, D / 2, -(LH / 2) - 0.0034);
    lidPivot.add(popupsStickerMesh);

    var bezelShape = makeRoundedRectShape(W - 0.048, D - 0.048, R - 0.020);
    var bezelMesh = new THREE.Mesh(new THREE.ShapeGeometry(bezelShape, 18), matGlassBezel);
    bezelMesh.position.set(0, D / 2, LH / 2 + 0.0015);
    lidPivot.add(bezelMesh);

    // 100% Edge-to-Edge Borderless Display (ZERO bottom bar, ZERO notch!)
    var scrW = W - 0.10; // 3.66
    var scrH = D - 0.10; // 2.28  (exact 1.605 ratio matching 1280x802 / 1600x1002!)
    var scrY = D / 2;

    var screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(scrW, scrH),
      new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })
    );
    screenMesh.position.set(0, scrY, LH / 2 + 0.0034);
    lidPivot.add(screenMesh);

    var glassSheen = new THREE.Mesh(
      new THREE.PlaneGeometry(scrW, scrH),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.052,
        metalness: 0.9,
        roughness: 0.06,
        envMapIntensity: 1.45,
        depthWrite: false
      })
    );
    glassSheen.position.set(0, scrY, LH / 2 + 0.0048);
    lidPivot.add(glassSheen);

    // Soft Floor Contact Shadow
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
      new THREE.PlaneGeometry(5.4, 3.85),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shCanvas),
        transparent: true,
        depthWrite: false,
        opacity: 0.78
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.04, Z_OFF + 0.05);
    laptopRoot.add(shadowPlane);

    laptopRoot.position.set(0, -0.78, 0);

    // -------------------------------------------------------------------------
    // Silky Native-Refresh (60/120fps) Screen Painter with Smart GPU Upload Caching
    // -------------------------------------------------------------------------
    var activeIdx = 0;
    var slideStartTs = performance.now();
    var lastStaticWake = -1;
    var lastLampPaint = 0;

    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var damp = function (cur, tgt, lambda, dtSec) { return cur + (tgt - cur) * (1 - Math.exp(-lambda * dtSec)); };
    var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };
    var easeInOutQuint = function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2; };
    var easeInOutSine = function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; };

    function paintScreen(now, openAmt) {
      var item = SHOWCASE[activeIdx];
      var elapsed = (now - slideStartTs) / 1000;
      var awake = clamp((openAmt - 0.16) / 0.50, 0, 1);
      var wakeChanged = Math.abs(awake - lastStaticWake) > 0.004;

      // Determine whether this frame genuinely needs a canvas repaint + WebGL upload
      var isAnimating = false;
      if (item.key === 'webs' && !reduced) {
        isAnimating = true; // continuous silky live scroll at full native Hz!
      } else if (item.key === 'miamp' && !reduced) {
        if (elapsed < 3.15) {
          isAnimating = true; // silky sky-to-plugin crane-down at full native Hz!
        } else if (now - lastLampPaint >= 33) {
          isAnimating = true; // gentle 30Hz warm amber pilot lamp breathe
          lastLampPaint = now;
        }
      }

      if (!screenDirty && !wakeChanged && !isAnimating) return;
      screenDirty = false;
      lastStaticWake = awake;

      var cw = screenCanvas.width, ch = screenCanvas.height;
      sctx.fillStyle = '#07090e';
      sctx.fillRect(0, 0, cw, ch);

      if (item.key === 'miamp' && imgs.miamp.complete && imgs.miamp.naturalWidth > 0) {
        var natW = imgs.miamp.naturalWidth;
        var natH = imgs.miamp.naturalHeight;
        var halfH = natH / 2;
        var panT = 0;
        if (reduced) {
          panT = 1;
        } else if (elapsed < 0.95) {
          // Ultra-gentle sky float
          panT = 0.012 * Math.sin(elapsed * 2.2);
        } else if (elapsed < 3.00) {
          // Apple-smooth quintic crane-down from coastal sky + MI AMP logo onto real plugin!
          panT = easeInOutQuint((elapsed - 0.95) / 2.05);
        } else {
          panT = 1;
        }
        var sy = clamp(panT, 0, 1) * halfH;
        sctx.drawImage(imgs.miamp, 0, sy, natW, halfH, 0, 0, cw, ch);

        if (panT > 0.92) {
          var lampPulse = 0.26 + 0.22 * Math.sin(elapsed * 4.2);
          var lx = cw * 0.6375;
          var ly = ch * 0.6747;
          var lg = sctx.createRadialGradient(lx, ly, 2, lx, ly, 42);
          lg.addColorStop(0, 'rgba(255, 138, 42, ' + (lampPulse * 0.72).toFixed(3) + ')');
          lg.addColorStop(1, 'rgba(255, 90, 20, 0)');
          sctx.fillStyle = lg;
          sctx.beginPath();
          sctx.arc(lx, ly, 42, 0, Math.PI * 2);
          sctx.fill();
        }
      } else if (item.key === 'appi' && imgs.appi.complete && imgs.appi.naturalWidth > 0) {
        sctx.drawImage(imgs.appi, 0, 0, cw, ch);
      } else if (item.key === 'webs' && imgs.webs.complete && imgs.webs.naturalWidth > 0) {
        // Silky continuous sinusoidal fast scroll across the entire custom web showcase!
        var wNatW = imgs.webs.naturalWidth;
        var wNatH = imgs.webs.naturalHeight;
        var viewSrcH = wNatW * (ch / cw);
        var maxSrcY = Math.max(0, wNatH - viewSrcH);

        var cycle = 7.0;
        var p = reduced ? 0 : ((elapsed % cycle) / cycle);
        var frac = 0;
        if (p < 0.07) {
          frac = 0;
        } else if (p < 0.67) {
          frac = easeInOutSine((p - 0.07) / 0.60);
        } else if (p < 0.80) {
          frac = 1;
        } else {
          frac = 1 - easeInOutSine((p - 0.80) / 0.20);
        }
        var srcY = frac * maxSrcY;
        sctx.drawImage(imgs.webs, 0, srcY, wNatW, viewSrcH, 0, 0, cw, ch);

        var barH = ch * 0.28;
        var barY = 16 + frac * (ch - barH - 32);
        sctx.fillStyle = 'rgba(12, 14, 18, 0.28)';
        sctx.fillRect(cw - 11, barY, 5, barH);
      }

      if (awake < 0.995) {
        sctx.fillStyle = 'rgba(5, 7, 11, ' + ((1 - awake) * 0.94).toFixed(3) + ')';
        sctx.fillRect(0, 0, cw, ch);
      }

      screenTex.needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // Silky UI Sync (Pills, Aurora, Caption Bar, Switcher Tabs)
    // -------------------------------------------------------------------------
    function applyProductData(idx, dimPillsBrief) {
      activeIdx = ((idx % SHOWCASE.length) + SHOWCASE.length) % SHOWCASE.length;
      slideStartTs = performance.now();
      screenDirty = true;
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
    // Frame-Rate-Independent 360° Drag + Weighted Inertia + Studio Dolly Zoom
    // -------------------------------------------------------------------------
    var targetOpen = reduced ? 1 : 0;
    var currentOpen = reduced ? 1 : 0;
    var inView = true;
    var isHoverSwitcher = false;

    var rotY = 0;
    var rotX = 0.05;
    var velY = 0; // radians / second!
    var velX = 0;
    var hoverX = 0, hoverY = 0, curHX = 0, curHY = 0;

    var SPIN_MS = 1620;
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

    var isDragging = false;
    var dragStartX = 0, dragStartY = 0;
    var lastDragX = 0, lastDragY = 0;
    var lastDragTs = 0;
    var dragTotalDist = 0;
    var touchAxis = null;

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

    var dom = renderer.domElement;
    dom.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      spinActive = false;
      if (mbpSpinBtn) mbpSpinBtn.classList.remove('is-spinning');
      if (portalPills) portalPills.classList.remove('is-swapping');
      dragStartX = lastDragX = e.clientX;
      dragStartY = lastDragY = e.clientY;
      lastDragTs = performance.now();
      dragTotalDist = 0;
      velY = 0; velX = 0;
      dwellElapsed = 0;
      manualBackCrossed = Math.cos(rotY) < -0.5;
      dom.classList.add('is-dragging');
      hideDragHint();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var now = performance.now();
      var dtDrag = Math.max(0.008, (now - lastDragTs) / 1000);
      lastDragTs = now;
      var dx = e.clientX - lastDragX;
      var dy = e.clientY - lastDragY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragTotalDist += Math.hypot(dx, dy);

      var dRotY = dx * 0.0082;
      var dRotX = dy * 0.0044;
      if (Math.abs(dx) > 0.5) manualDragDir = dx > 0 ? 1 : -1;
      rotY += dRotY;
      rotX = clamp(rotX + dRotX, -0.22, 0.40);
      velY = clamp(velY * 0.55 + (dRotY / dtDrag) * 0.45, -14, 14);
      velX = clamp(velX * 0.55 + (dRotX / dtDrag) * 0.35, -4, 4);
      dwellElapsed = 0;
    });

    window.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      dom.classList.remove('is-dragging');
      if (dragTotalDist < 7 && currentOpen > 0.7 && Math.cos(rotY) > 0.55) {
        var item = SHOWCASE[activeIdx];
        if (item.external) {
          window.open(item.href, '_blank', 'noopener');
        } else {
          window.location.href = item.href;
        }
      }
    });

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
      lastDragTs = performance.now();
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

      if (touchAxis === 'v') return;
      if (touchAxis === 'h') {
        e.preventDefault();
        var now = performance.now();
        var dtDrag = Math.max(0.008, (now - lastDragTs) / 1000);
        lastDragTs = now;
        lastDragX = t.clientX;
        lastDragY = t.clientY;
        dragTotalDist += Math.hypot(dx, dy);
        var dRotY = dx * 0.0112;
        var dRotX = dy * 0.0034;
        if (Math.abs(dx) > 0.5) manualDragDir = dx > 0 ? 1 : -1;
        rotY += dRotY;
        rotX = clamp(rotX + dRotX, -0.20, 0.34);
        velY = clamp(velY * 0.50 + (dRotY / dtDrag) * 0.50, -16, 16);
        velX = clamp(velX * 0.55 + (dRotX / dtDrag) * 0.30, -3.5, 3.5);
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
        var top = portalStage.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    }

    function computeTarget() {
      if (reduced) { targetOpen = 1; return; }
      var rect = portalStage.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var startY = vh * 0.90;
      var endY = vh * 0.14;
      var raw = (startY - rect.top) / Math.max(210, startY - endY);
      targetOpen = clamp(raw, 0, 1);
    }

    // Exact Screen-Plane Projection Math so the MacBook Reaches Near Left & Right Edges on BOTH PC & Phone!
    function resizeRenderer() {
      var rect = canvasHost.getBoundingClientRect();
      var w = Math.max(260, Math.round(rect.width));
      var h = Math.max(240, Math.round(rect.height));
      renderer.setSize(w, h, false);
      var asp = w / h;
      camera.aspect = asp;

      // Exact Apple-Keynote 16.5° telephoto bounding-box solver!
      // Projects the true 3D corners of the open MacBook (top bezel + front keyboard lip)
      // so the lateral edges reach as close as possible to both viewport edges on PC AND mobile
      // while NEVER clipping the top bezel or during full 360° spins!
      var openYOff = -0.76;
      var openRx = 0.05;
      var openLidA = -0.18;
      var hingeY = BH - 0.004;
      var hingeZ = -D / 2 + Z_OFF;

      function xformCorner(lx, ly, lz, ry) {
        var y1 = ly * Math.cos(openRx) - lz * Math.sin(openRx);
        var z1 = ly * Math.sin(openRx) + lz * Math.cos(openRx);
        var x2 = lx * Math.cos(ry) + z1 * Math.sin(ry);
        var z2 = -lx * Math.sin(ry) + z1 * Math.cos(ry);
        return [x2, y1 + openYOff, z2];
      }
      function lidCorner(lx, ly, ry) {
        var yh = hingeY + ly * Math.cos(openLidA);
        var zh = hingeZ + ly * Math.sin(openLidA);
        return xformCorner(lx, yh, zh, ry);
      }
      function kbdCorner(lx, lz, ry) {
        return xformCorner(lx, BH, lz + Z_OFF, ry);
      }
      function projNDC(pt, camZ) {
        var fy = OPEN_LOOK_Y - OPEN_CAM_Y;
        var fz = -camZ;
        var fl = Math.hypot(fy, fz);
        fy /= fl; fz /= fl;
        var uy = -fz, uz = fy;
        var dy = pt[1] - OPEN_CAM_Y;
        var dz = pt[2] - camZ;
        var depth = dy * fy + dz * fz;
        var py = dy * uy + dz * uz;
        return [
          pt[0] / (depth * TAN_HALF_FOV * asp),
          py / (depth * TAN_HALF_FOV)
        ];
      }

      var targetMaxW = w <= 640 ? 0.965 : (w <= 1080 ? 0.955 : 0.95);
      var tlOpen = lidCorner(-W / 2, D, 0);
      var kfOpen = kbdCorner(W / 2, D / 2, 0);

      var lo = 5.0, hi = 28.0;
      for (var it = 0; it < 26; it++) {
        var mid = (lo + hi) * 0.5;
        var pTL = projNDC(tlOpen, mid);
        var pKF = projNDC(kfOpen, mid);
        if (Math.abs(pKF[0]) <= targetMaxW && pTL[1] <= 0.94 && pKF[1] >= -0.96) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      baseCamZ = hi;

      // Exact 360° spin dolly pull-back so no rotating corner ever clips on any aspect ratio!
      var slo = 0.0, shi = 14.0;
      for (var sit = 0; sit < 18; sit++) {
        var sm = (slo + shi) * 0.5;
        var ok = true;
        for (var deg = 0; deg < 360; deg += 20) {
          var rRad = (deg * Math.PI) / 180;
          var corners = [
            lidCorner(-W / 2, D, rRad), lidCorner(W / 2, D, rRad),
            kbdCorner(-W / 2, D / 2, rRad), kbdCorner(W / 2, D / 2, rRad),
            kbdCorner(-W / 2, -D / 2, rRad), kbdCorner(W / 2, -D / 2, rRad)
          ];
          for (var c = 0; c < corners.length; c++) {
            var sp = projNDC(corners[c], baseCamZ + sm);
            if (Math.abs(sp[0]) > 0.96 || Math.abs(sp[1]) > 0.96) {
              ok = false;
              break;
            }
          }
          if (!ok) break;
        }
        if (ok) shi = sm; else slo = sm;
      }
      spinDollyAmt = shi;
      if (curCamZ < 1 || Math.abs(curCamZ - baseCamZ) > 6) curCamZ = baseCamZ;

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
      }, { threshold: 0.06 }).observe(portalStage);
    }

    // -------------------------------------------------------------------------
    // Main Silky 60/120fps Delta-Time-Damped 3D Loop
    // -------------------------------------------------------------------------
    var lastTs = 0;
    function animate(now) {
      requestAnimationFrame(animate);
      if (!inView && !spinActive && !isDragging) {
        lastTs = now;
        return;
      }

      var dtMs = lastTs ? Math.min(50, now - lastTs) : 16.67;
      var dtSec = dtMs / 1000;
      lastTs = now;

      // Frame-rate-independent exponential spring damping (identically silky at 60Hz, 90Hz, 120Hz, 144Hz!)
      currentOpen = damp(currentOpen, targetOpen, 7.2, dtSec);
      curHX = damp(curHX, hoverX, 5.2, dtSec);
      curHY = damp(curHY, hoverY, 5.2, dtSec);

      var e = easeOutQuart(currentOpen);

      // Physical lid hinge: closed flat on base -> sleek open 100° cinema angle
      var closedLidRotX = Math.PI / 2 - 0.032;
      var openLidRotX = -0.18;
      lidPivot.rotation.x = closedLidRotX + (openLidRotX - closedLidRotX) * e;

      // POPUPS sticker stays 100% upright & non-mirrored BOTH closed AND spun 180° open!
      popupsStickerMesh.rotation.z = e < 0.62 ? Math.PI : 0;

      screenBounceLight.intensity = clamp((e - 0.25) / 0.65, 0, 0.45);

      var closedPitchOffset = 0.46 * (1 - e);
      var floatLift = 0;
      var wantDolly = 0;

      if (spinActive) {
        var rawT = clamp((now - spinStartTs) / SPIN_MS, 0, 1);
        var easedT = easeInOutQuint(rawT);
        rotY = spinStartY + (spinEndY - spinStartY) * easedT;
        var arc = Math.sin(rawT * Math.PI);
        floatLift = 0.08 * arc;
        wantDolly = spinDollyAmt * arc; // silky camera pull-back during spin so giant corners NEVER clip!
        rotX = damp(rotX, 0.05, 5.0, dtSec);

        if (rawT >= 0.26 && !spinPillsDimmed) {
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
        wantDolly = spinDollyAmt * 0.92;
        var facingBack = Math.cos(rotY) < -0.68;
        if (facingBack && !manualBackCrossed && currentOpen > 0.65) {
          manualBackCrossed = true;
          var nextOnDrag = activeIdx + (manualDragDir >= 0 ? 1 : -1);
          applyProductData(nextOnDrag, true);
        } else if (Math.cos(rotY) > 0.55) {
          manualBackCrossed = false;
        }
      } else {
        // Silky frame-rate-independent rotational inertia after finger/mouse flick!
        if (Math.abs(velY) > 0.025 || Math.abs(velX) > 0.02) {
          rotY += velY * dtSec;
          rotX = clamp(rotX + velX * dtSec, -0.22, 0.40);
          velY *= Math.pow(0.052, dtSec);
          velX *= Math.pow(0.018, dtSec);
          wantDolly = spinDollyAmt * clamp(Math.abs(Math.sin(rotY)) + (Math.cos(rotY) < 0 ? 1 : 0), 0, 1);

          var inertiaBack = Math.cos(rotY) < -0.68;
          if (inertiaBack && !manualBackCrossed && currentOpen > 0.65) {
            manualBackCrossed = true;
            var nextOnFlick = activeIdx + (velY >= 0 ? 1 : -1);
            applyProductData(nextOnFlick, true);
          } else if (Math.cos(rotY) > 0.55) {
            manualBackCrossed = false;
          }
        } else {
          velY = 0; velX = 0;
          rotX = damp(rotX, 0.05, 4.2, dtSec);
          // Also keep safe dolly zoom if user left the laptop parked sideways/backwards!
          var turnedFactor = clamp(1 - Math.cos(rotY), 0, 1);
          wantDolly = spinDollyAmt * turnedFactor * 0.85;

          if (!reduced && inView && currentOpen > 0.84 && !isHoverSwitcher) {
            var dwellMs = SHOWCASE[activeIdx].dwell;
            dwellElapsed += dtMs;
            var pct = clamp(dwellElapsed / dwellMs, 0, 1);
            var activeProg = swBtns[activeIdx] && swBtns[activeIdx].querySelector('.sw-prog');
            if (activeProg) activeProg.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
            if (dwellElapsed >= dwellMs) {
              triggerSpinTo((activeIdx + 1) % SHOWCASE.length, 1);
            }
          }
        }
      }

      // Smoothly damp camera studio dolly & viewing height (Apple-Keynote 16.5° telephoto framing!)
      curCamZ = damp(curCamZ, baseCamZ + wantDolly, 5.8, dtSec);
      var targetLookY = OPEN_LOOK_Y + 0.08 * (1 - e);
      curLookY = damp(curLookY, targetLookY, 5.5, dtSec);
      camera.position.set(0, OPEN_CAM_Y + 0.14 * (1 - e), curCamZ);
      camera.lookAt(0, curLookY, 0);

      var orbitAmt = clamp((e - 0.65) / 0.35, 0, 1);
      var idleBob = reduced ? 0 : Math.sin(now * 0.0016) * 0.022 * orbitAmt;
      laptopRoot.rotation.y = rotY + (isDragging ? 0 : curHX * 0.075 * orbitAmt);
      laptopRoot.rotation.x = rotX + closedPitchOffset + (isDragging ? 0 : -curHY * 0.04 * orbitAmt);
      laptopRoot.position.y = -0.76 + (1 - e) * 1.18 + floatLift + idleBob;

      shadowPlane.material.opacity = clamp((0.52 + 0.24 * e) - floatLift * 1.4, 0.30, 0.80);
      var shScale = 1 - floatLift * 0.45;
      shadowPlane.scale.set(shScale, shScale, 1);

      paintScreen(now, e);

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
    curCamZ = baseCamZ;
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMacBook3D);
  } else {
    initMacBook3D();
  }
})();
