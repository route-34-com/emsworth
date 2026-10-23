(function () {
  const vert = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseStr;
    uniform float uScroll;
    uniform float uReveal;
    uniform vec3 uRipple;
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vLift;
    void main() {
      vUv = uv;
      vec3 p = position;
      float calm = 1.0 + (1.0 - uReveal) * 3.5;
      float t = uTime;
      float w = sin(p.x * 1.1 + t * 0.8) * 0.09
              + sin(p.y * 1.6 + t * 1.1 + p.x * 0.7) * 0.07
              + sin((p.x * 0.8 - p.y) * 2.6 + t * 1.7) * 0.025;
      w *= calm;
      vec2 m = uv - uMouse;
      m.x *= 1.6;
      float d = length(m);
      float bump = exp(-d * d * 28.0) * uMouseStr * 0.32;
      float rd = length((uv - uRipple.xy) * vec2(1.6, 1.0));
      float age = uRipple.z;
      float ring = sin((rd - age * 0.55) * 38.0) * exp(-age * 1.6) * smoothstep(age * 0.55 + 0.12, age * 0.55, rd) * smoothstep(0.0, 0.05, age) * 0.09;
      p.z += w + bump + ring;
      float s = uScroll;
      float fold = s * s;
      p.z += fold * pow(uv.y, 1.6) * 2.6 + sin(uv.y * 6.0 + t) * s * 0.25;
      p.y += fold * uv.y * 1.2;
      p.x += sin(uv.y * 3.14) * s * 0.4;
      p.y += (1.0 - uReveal) * 1.4 * (1.0 - uv.y * 0.3);
      vLift = bump + ring;
      vPos = p;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }`;

  const frag = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uRes;
    uniform float uReveal;
    uniform float uStripe;
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vLift;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main() {
      vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
      vec2 uv = vUv;
      vec3 teal = vec3(0.047, 0.235, 0.227);
      vec3 tealHi = vec3(0.10, 0.36, 0.34);
      vec3 sand = vec3(1.0, 0.93, 0.878);
      vec3 peach = vec3(0.937, 0.80, 0.70);

      float jx = uv.x * 9.0 + sin(uv.y * 7.0) * 0.9;
      float rib = smoothstep(0.42, 0.5, abs(fract(jx) - 0.5));
      float jy = uv.y * 14.0 + sin(uv.x * 11.0 + 1.3) * 0.6;
      float rib2 = smoothstep(0.44, 0.5, abs(fract(jy) - 0.5)) * 0.6;
      vec3 col = mix(teal, tealHi, max(rib, rib2) * 0.55);

      float st1 = smoothstep(0.0, 0.003, uv.x - uStripe) * smoothstep(0.0, 0.003, uStripe + 0.025 - uv.x);
      float st2 = smoothstep(0.0, 0.003, uv.x - uStripe - 0.05) * smoothstep(0.0, 0.003, uStripe + 0.062 - uv.x);
      float stripe = max(st1, st2);
      float band = smoothstep(0.0, 0.004, uv.y - 0.86) * smoothstep(0.0, 0.004, 0.93 - uv.y);
      vec2 dc = floor(uv * vec2(180.0, 260.0));
      float dobby = mod(dc.x + dc.y, 2.0);
      col = mix(col, mix(teal * 0.82, tealHi, dobby * 0.6), band);
      col = mix(col, sand, stripe);

      vec2 lp = uv * vec2(620.0, 420.0);
      vec2 cell = floor(lp);
      vec2 f = fract(lp) - 0.5;
      float h = hash(cell);
      f += (vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5) * 0.35;
      float loop = smoothstep(0.5, 0.1, length(f));
      float pile = mix(0.72, 1.12, loop) * mix(0.9, 1.08, h);
      col *= mix(pile, 1.0, stripe * 0.65);

      vec3 L = normalize(vec3(-0.45, 0.7, 0.75));
      float diff = clamp(dot(n, L), 0.0, 1.0);
      vec3 V = vec3(0.0, 0.0, 1.0);
      vec3 H = normalize(L + V);
      float spec = pow(clamp(dot(n, H), 0.0, 1.0), 40.0);
      float sheen = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 2.0);
      vec3 lit = col * (0.42 + diff * 0.78);
      lit += spec * mix(0.04, 0.55, stripe) * sand;
      lit += sheen * 0.18 * peach;
      float vig = smoothstep(1.25, 0.35, length((gl_FragCoord.xy / uRes) - vec2(0.55, 0.55)));
      lit *= mix(0.55, 1.0, vig);
      lit *= uReveal;
      gl_FragColor = vec4(lit, 1.0);
    }`;

  function Cloth(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0c3c3a, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStr: { value: 0 },
      uScroll: { value: 0 },
      uReveal: { value: 0 },
      uRipple: { value: new THREE.Vector3(0.5, 0.5, 10) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uStripe: { value: 0.665 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, side: THREE.DoubleSide });
    mat.extensions = { derivatives: true };
    let mesh;
    const group = new THREE.Group();
    group.rotation.x = -0.16;
    group.rotation.z = 0.04;
    scene.add(group);

    const COVER = 1.32;
    function build() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      uniforms.uStripe.value = w / h < 0.9 ? 0.83 : 0.665;
      const vh = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      const vw = vh * camera.aspect;
      if (mesh) { group.remove(mesh); mesh.geometry.dispose(); }
      const seg = w < 700 ? 90 : 170;
      const geo = new THREE.PlaneGeometry(vw * COVER, vh * COVER, seg, Math.round(seg * (vh / vw)) + 20);
      mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }
    build();

    const target = new THREE.Vector2(0.5, 0.5);
    let str = 0, strTarget = 0, lastMove = 0;
    function toUv(cx, cy) {
      const r = canvas.getBoundingClientRect();
      const nx = (cx - r.left) / r.width - 0.5;
      const ny = 0.5 - (cy - r.top) / r.height;
      return [0.5 + nx / COVER, 0.5 + ny / COVER - 0.03];
    }
    function onMove(e) {
      const pt = e.touches ? e.touches[0] : e;
      const [u, v] = toUv(pt.clientX, pt.clientY);
      target.set(u, v);
      strTarget = 1;
      lastMove = performance.now();
    }
    function onDown(e) {
      const pt = e.touches ? e.touches[0] : e;
      const [u, v] = toUv(pt.clientX, pt.clientY);
      uniforms.uRipple.value.set(u, v, 0);
    }
    const hero = canvas.parentElement;
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerdown', onDown, { passive: true });
    hero.addEventListener('pointerleave', () => (strTarget = 0));

    let visible = true, raf = 0, prev = performance.now();
    new IntersectionObserver((en) => {
      visible = en[0].isIntersecting;
      if (visible && !raf) { prev = performance.now(); loop(); }
    }).observe(canvas);

    function loop() {
      raf = 0;
      if (!visible) return;
      const now = performance.now();
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      uniforms.uTime.value += dt;
      uniforms.uRipple.value.z += dt;
      if (now - lastMove > 1400) strTarget = 0;
      str += (strTarget - str) * 0.06;
      uniforms.uMouseStr.value = str;
      uniforms.uMouse.value.lerp(target, 0.09);
      group.rotation.y += ((uniforms.uMouse.value.x - 0.5) * 0.08 - group.rotation.y) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150); });

    return {
      uniforms,
      pulse(u = 0.5, v = 0.5) { uniforms.uRipple.value.set(u, v, 0); },
    };
  }

  window.EmsworthCloth = function (canvas) {
    try {
      if (!window.THREE) return null;
      return Cloth(canvas);
    } catch (e) {
      console.warn('Cloth disabled', e);
      return null;
    }
  };
})();
