# CYBER CORE

CYBER CORE is a futuristic cybersecurity-themed React + TypeScript + Vite landing page built around a real-time 3D energy core rendered with React Three Fiber and Drei. It is designed to feel like a polished developer portfolio experience rather than a generic template, with near-black surfaces, cyan and violet accent lighting, restrained motion, and a protected network aesthetic.

## Features

- Real-time WebGL scene created in code with React Three Fiber and Drei
- Mouse and touch rotation through OrbitControls
- Cyan, violet, and emerald material presets
- Wireframe toggle for the energy core geometry
- Pause/resume animation state and reduced-motion support
- Reset controls to restore defaults
- Live status display for selected palette and animation state
- Keyboard-accessible controls and visible focus styles
- Responsive mobile-first layout with constrained overflow
- Lazy-loaded 3D scene with a practical loading fallback

## Installation and run instructions

1. Open the project folder in the terminal.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local address printed by Vite in the browser.

## Production build

```bash
npm run build
```

## Performance-conscious implementation notes

- The 3D scene is split into a dedicated component and loaded lazily with React.lazy and Suspense.
- Geometry is intentionally lightweight: a small number of torus rings, a central icosahedron, and a limited Sparkles particle field.
- The scene does not use heavy post-processing, large textures, or remote asset dependencies.
- Mobile-friendly settings reduce the render scale and limit the number of interactive elements.
- Motion respects the system reduced-motion preference and can be paused manually.
- The layout avoids horizontal overflow and keeps the scene constrained within a responsive panel.

## FE-10 performance review

This section is based on implementation choices and browser behavior, not fabricated measurements.

- First meaningful paint: improved by avoiding large remote assets and keeping the initial bundle focused on the React entry and a lazy-loaded 3D module.
- Interactions: orbit controls are lightweight, and the scene avoids expensive post-processing or heavy asset decoding.
- Runtime efficiency: the energy core uses a compact set of geometries and low particle counts, which keeps CPU/GPU demand manageable for mid-range devices.
- Motion safety: reduced-motion support prevents unnecessary animation when the system requests a calmer experience.
- Browser checks: use the Chrome Performance panel or Lighthouse to observe render timing, animation frame stability, and network payload size after the app loads.

Actual benchmark numbers should be collected locally in the target browser because GPU, CPU, and device state vary significantly between machines.

## How to check browser load performance and frame rate

Use the browser DevTools performance tools:

1. Open Chrome DevTools.
2. Go to the Performance tab.
3. Press Record and reload the page.
4. Inspect the timeline for script execution, rendering, and frame drops.
5. Use the FPS meter or the Rendering panel to evaluate smoothness.
6. In Lighthouse, run a performance pass to review initial load metrics such as LCP and interactions.

Do not assume a specific value without measuring it on the target machine and browser. The project is designed to be efficient, but the real performance result depends on the hardware and browser configuration.

## Future improvements

- Add orbit focus presets and a more advanced camera choreography.
- Include optional system diagnostic overlays or data cards that animate with the core.
- Add a theme selector with deeper visual states for enterprise security dashboards.
- Expand the 3D scene with subtle layered rings, scanning lines, or motion-reactive signal fields.
- Add automated visual regression checks or a minimal Storybook-like control panel for preset testing.
