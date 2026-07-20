// ===== Three.js ambient particle background =====
// Floating particle field in accent blues with gentle drift and mouse parallax.
// Skips entirely if three.js failed to load or the user prefers reduced motion.
(function () {
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('bg3d');
  if (!canvas) return;

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const PARTICLE_COUNT = isMobile ? 140 : 320;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 220;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Soft round sprite so particles render as glowing dots, not squares
  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }
  const sprite = makeSprite();

  function makeCloud(count, color, size, spread) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spread * 2.4;  // x — wider than tall
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.4;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;        // z — depth
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: color,
      size: size,
      map: sprite,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }

  const cloudBlue = makeCloud(Math.floor(PARTICLE_COUNT * 0.6), 0xe8b54d, 3.2, 260);
  const cloudCyan = makeCloud(Math.floor(PARTICLE_COUNT * 0.25), 0xf5d78e, 2.4, 300);
  const cloudViolet = makeCloud(Math.floor(PARTICLE_COUNT * 0.15), 0x3b82f6, 2.8, 280);
  scene.add(cloudBlue, cloudCyan, cloudViolet);

  // Light theme: additive blending washes out on white, so switch to normal
  // blending with darker, fainter particles. Watches the theme toggle.
  function syncTheme() {
    const light = document.documentElement.classList.contains('light-theme');
    [cloudBlue, cloudCyan, cloudViolet].forEach((cloud) => {
      cloud.material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      cloud.material.opacity = light ? 0.35 : 0.75;
      cloud.material.needsUpdate = true;
    });
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Mouse parallax
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30;
    targetY = (e.clientY / window.innerHeight - 0.5) * 20;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    cloudBlue.rotation.y = t * 0.016;
    cloudCyan.rotation.y = -t * 0.012;
    cloudViolet.rotation.y = t * 0.009;
    cloudBlue.position.y = Math.sin(t * 0.18) * 6;
    cloudCyan.position.y = Math.cos(t * 0.14) * 8;

    // Ease camera toward mouse for parallax
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (-targetY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();
