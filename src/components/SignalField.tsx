"use client";

import { useEffect, useRef } from "react";

/**
 * Signal from noise.
 *
 * Particles rest as scattered noise until the visitor moves the pointer
 * in the first fold. That gesture starts an endless slow cycle in which
 * the noise resolves into one of the shapes an AI PM actually pulls out
 * of messy data, holds it, dissolves, and reforms as the next:
 *
 *   CLUSTERS  — raw observations separating into distinct themes
 *   CURVE     — a noisy trace converging, plotted against axes
 *   ATTENTION — a sparse matrix: what the model decided mattered
 *
 * Every figure is just a target point set, so the morph, the pacing and
 * the pointer gate are shared. Colour carries the same idea as position:
 * noise is faint mist-gray, resolved signal is saturated Klein blue.
 */

const CAMERA_Z = 110;
const FOV = 45;
/* Half-width of the drawing area in world units. Every figure is laid
   out relative to this, so raising it scales the whole composition —
   wider curve, larger matrix, further-apart clusters — rather than
   just zooming in. */
const EXTENT = 34;

/**
 * Seconds for one full figure-to-figure cycle.
 *
 * There is no hold phase. The blend runs continuously and is eased with
 * smootherstep, which is slow near both ends and quick through the
 * middle — so a figure lingers long enough to read without the motion
 * ever actually stopping.
 */
const CYCLE = 13;

/** Shorter cycle for the one transition triggered by hovering, so the
 *  concept arrives promptly instead of a full cycle later. */
const SWITCH_CYCLE = 5;

/** Per-particle arrival spread. Must match `lead` in the vertex shader
 *  — the CPU-side snapshot reproduces the shader exactly, and any
 *  divergence shows up as a jump at the moment of a hover. */
const LEAD = 0.3;
/** Seconds for the dust to first gather once started. */
const REVEAL = 2.4;

/* ── helpers ──────────────────────────────────────────────────────── */

/** Box–Muller, for cluster spread that looks sampled rather than drawn. */
function gaussian() {
  let u = 0;
  while (u === 0) u = Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const write = (
  out: Float32Array,
  i: number,
  x: number,
  y: number,
  z: number,
) => {
  const i3 = i * 3;
  out[i3] = x;
  out[i3 + 1] = y;
  out[i3 + 2] = z;
};

/* ── figures ──────────────────────────────────────────────────────── */

/** Observations separating into themes. */
function buildClusters(out: Float32Array, count: number) {
  const k = 4 + Math.floor(Math.random() * 2); // 4..5 clusters

  /* Rejection-sample centres so clusters read as separate, not as one
     smear — the gaps *are* the figure. Spread is kept well under half
     the minimum separation; at wider spreads the tails of neighbouring
     clusters meet and the whole thing reads as a single blob. */
  const centers: { x: number; y: number; s: number; w: number }[] = [];
  let guard = 0;
  while (centers.length < k && guard++ < 600) {
    const x = (Math.random() - 0.5) * 2 * (EXTENT - 5);
    const y = (Math.random() - 0.5) * 2 * (EXTENT - 5);
    if (centers.some((c) => Math.hypot(c.x - x, c.y - y) < 21)) continue;
    centers.push({
      x,
      y,
      s: 2.4 + Math.random() * 1.8,
      w: 0.6 + Math.random(),
    });
  }

  const totalW = centers.reduce((a, c) => a + c.w, 0);
  let i = 0;
  centers.forEach((c, idx) => {
    const share =
      idx === centers.length - 1
        ? count - i
        : Math.round((c.w / totalW) * count);
    for (let n = 0; n < share && i < count; n++, i++) {
      write(
        out,
        i,
        c.x + gaussian() * c.s,
        c.y + gaussian() * c.s,
        gaussian() * 1.6,
      );
    }
  });
  for (; i < count; i++) write(out, i, 0, 0, 0);
}

/** A noisy trace converging — evals, training, any metric settling. */
function buildCurve(out: Float32Array, count: number) {
  const x0 = -EXTENT;
  const x1 = EXTENT;
  const yBase = -EXTENT + 6;

  const decay = 2.4 + Math.random() * 2.2;
  const amp = 30 + Math.random() * 10;

  // Axes make it read as a chart rather than as a squiggle.
  const axisShare = Math.round(count * 0.16);
  const half = Math.round(axisShare / 2);

  let i = 0;
  for (let n = 0; n < half && i < count; n++, i++) {
    write(out, i, x0 + Math.random() * (x1 - x0), yBase, gaussian() * 0.5);
  }
  for (let n = 0; n < half && i < count; n++, i++) {
    write(out, i, x0, yBase + Math.random() * (EXTENT - yBase + 10), gaussian() * 0.5);
  }

  // The trace itself: noisy early, tightening as it converges.
  for (; i < count; i++) {
    const t = Math.random();
    const x = x0 + t * (x1 - x0);
    const y = yBase + 2 + amp * Math.exp(-decay * t);
    const jitter = gaussian() * (0.4 + 3.4 * Math.exp(-decay * t));
    write(out, i, x, y + jitter, gaussian() * 1.2);
  }
}

/** A sparse attention matrix — what the model decided mattered. */
function buildAttention(out: Float32Array, count: number) {
  const N = 7 + Math.floor(Math.random() * 3); // 7..9 tokens
  const cell = (EXTENT * 2) / N;
  const pad = cell * 0.16;

  // The diagonal always attends to itself; each row also attends to a
  // few others. That sparsity is what makes it read as attention
  // rather than as a chequerboard.
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < N; r++) {
    cells.push({ r, c: r });
    const extra = 1 + Math.floor(Math.random() * 2);
    for (let e = 0; e < extra; e++) {
      const c = Math.floor(Math.random() * N);
      if (c !== r && !cells.some((x) => x.r === r && x.c === c)) {
        cells.push({ r, c });
      }
    }
  }

  // A frame anchors the cells as a matrix, the way the axes anchor the
  // curve. Without it the lit cells read as squares floating in space.
  const frameShare = Math.round(count * 0.1);
  let i = 0;
  for (let n = 0; n < frameShare && i < count; n++, i++) {
    const t = Math.random() * 4;
    const u = (t % 1) * 2 * EXTENT - EXTENT;
    const side = Math.floor(t);
    const x = side === 0 ? u : side === 1 ? EXTENT : side === 2 ? -u : -EXTENT;
    const y = side === 0 ? EXTENT : side === 1 ? -u : side === 2 ? -EXTENT : u;
    write(out, i, x, y, gaussian() * 0.4);
  }

  const per = Math.floor((count - frameShare) / cells.length);
  for (const { r, c } of cells) {
    const cx = -EXTENT + (c + 0.5) * cell;
    const cy = EXTENT - (r + 0.5) * cell;
    for (let n = 0; n < per && i < count; n++, i++) {
      write(
        out,
        i,
        cx + (Math.random() - 0.5) * (cell - pad * 2),
        cy + (Math.random() - 0.5) * (cell - pad * 2),
        gaussian() * 0.9,
      );
    }
  }
  // Remainder joins the last cell rather than piling up at the origin.
  const last = cells[cells.length - 1];
  const lx = -EXTENT + (last.c + 0.5) * cell;
  const ly = EXTENT - (last.r + 0.5) * cell;
  for (; i < count; i++) {
    write(
      out,
      i,
      lx + (Math.random() - 0.5) * (cell - pad * 2),
      ly + (Math.random() - 0.5) * (cell - pad * 2),
      gaussian() * 0.9,
    );
  }
}

const AMBIENT = [buildClusters, buildCurve, buildAttention];

/**
 * Picks an ambient figure, never the same one twice in a row.
 *
 * Draws uniformly from the figures that aren't `prev`. Picking at
 * random and nudging on collision looks equivalent but isn't — it
 * hands (prev + 1) two thirds of the draws and starves the third
 * figure.
 */
function buildAmbientFigure(out: Float32Array, count: number, prev: number) {
  const choices = AMBIENT.map((_, i) => i).filter((i) => i !== prev);
  const idx = choices[Math.floor(Math.random() * choices.length)];
  AMBIENT[idx](out, count);
  return idx;
}

/* ── concept figures (on hover) ───────────────────────────────────── */

/**
 * Rasterises a drawing to an offscreen canvas and scatters particles
 * across its dark pixels.
 *
 * Icons and letterforms have no closed-form description to sample the
 * way the clusters and curve do, so they are drawn once with the 2D
 * context and read back as a point set. Everything downstream — the
 * morph, the scatter, the colour ramp — is unchanged.
 */
const CANVAS_SIZE = 360;

function sampleDrawing(
  out: Float32Array,
  count: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
) {
  const S = CANVAS_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    buildClusters(out, count); // no 2D context — fall back to a shape
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx, S);

  const data = ctx.getImageData(0, 0, S, S).data;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (data[(y * S + x) * 4] < 128) {
        xs.push(x);
        ys.push(y);
      }
    }
  }

  if (xs.length === 0) {
    buildClusters(out, count);
    return;
  }

  for (let i = 0; i < count; i++) {
    const k = Math.floor(Math.random() * xs.length);
    // Sub-pixel jitter, or the particles land on a visible lattice.
    const x = xs[k] + Math.random();
    const y = ys[k] + Math.random();
    write(
      out,
      i,
      (x / S - 0.5) * 2 * EXTENT,
      (0.5 - y / S) * 2 * EXTENT,
      gaussian() * 0.8,
    );
  }
}

type Concept = {
  label: string;
  icon: (ctx: CanvasRenderingContext2D, S: number) => void;
};

/** The four concepts, each an icon over its own word. */
const CONCEPTS: Concept[] = [
  {
    label: "Prioritization",
    // Ranked bars, longest first.
    icon: (ctx, S) => {
      const top = S * 0.14;
      const widths = [86, 64, 44];
      const h = 14;
      const gap = 20;
      widths.forEach((w, i) => {
        const y = top + i * (h + gap);
        ctx.beginPath();
        ctx.arc(S / 2 - 66, y + h / 2, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(S / 2 - 48, y, w, h);
      });
    },
  },
  {
    label: "Positioning",
    // Target with crosshair ticks.
    icon: (ctx, S) => {
      const cx = S / 2;
      const cy = S * 0.28;
      const r = 46;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - r - 20, cy);
      ctx.lineTo(cx - r + 4, cy);
      ctx.moveTo(cx + r - 4, cy);
      ctx.lineTo(cx + r + 20, cy);
      ctx.moveTo(cx, cy - r - 20);
      ctx.lineTo(cx, cy - r + 4);
      ctx.moveTo(cx, cy + r - 4);
      ctx.lineTo(cx, cy + r + 20);
      ctx.stroke();
    },
  },
  {
    label: "Process",
    // Three linked nodes.
    icon: (ctx, S) => {
      const cy = S * 0.28;
      const xs = [S / 2 - 66, S / 2, S / 2 + 66];
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(xs[0] + 22, cy);
      ctx.lineTo(xs[1] - 22, cy);
      ctx.moveTo(xs[1] + 22, cy);
      ctx.lineTo(xs[2] - 22, cy);
      ctx.stroke();
      xs.forEach((x, i) => {
        ctx.beginPath();
        ctx.arc(x, cy, 18, 0, Math.PI * 2);
        if (i === 1) ctx.stroke();
        else ctx.fill();
      });
    },
  },
  {
    label: "People",
    // Three figures, the middle one nearer.
    icon: (ctx, S) => {
      const cy = S * 0.26;
      const person = (x: number, s: number) => {
        ctx.beginPath();
        ctx.arc(x, cy - 10 * s, 16 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, cy + 46 * s, 30 * s, Math.PI, 0);
        ctx.fill();
      };
      person(S / 2 - 62, 0.82);
      person(S / 2 + 62, 0.82);
      person(S / 2, 1);
    },
  },
];

function buildConcept(out: Float32Array, count: number, index: number) {
  const concept = CONCEPTS[index % CONCEPTS.length];
  sampleDrawing(out, count, (ctx, S) => {
    concept.icon(ctx, S);

    /* Uppercase and tracked out, matching the label style used
       everywhere else. */
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        "3px";
    }

    const text = concept.label.toUpperCase();
    const face = `"Inter Tight", ui-sans-serif, system-ui, sans-serif`;

    /* Fit the word to the canvas rather than picking a fixed size.
       "PRIORITIZATION" is twice the length of "PEOPLE", and at one
       size either the long word overflows or the short one is too
       small for its strokes to survive being drawn in dots. */
    let fs = Math.round(S * 0.15);
    ctx.font = `500 ${fs}px ${face}`;
    while (ctx.measureText(text).width > S * 0.9 && fs > 10) {
      fs -= 1;
      ctx.font = `500 ${fs}px ${face}`;
    }

    ctx.fillText(text, S / 2, S * 0.74);
  });
}

/* ── shaders ──────────────────────────────────────────────────────── */

const VERTEX = /* glsl */ `
  attribute vec3 aNoise;
  attribute vec3 aFigA;
  attribute vec3 aFigB;
  attribute float aRand;

  uniform float uBlend;
  uniform float uDetour;
  uniform float uReveal;
  uniform float uTime;
  uniform float uSize;

  varying float vReveal;

  // Slower at both ends than smoothstep, with no flat region — the
  // figure dwells long enough to read without the motion halting.
  float smootherstep(float x) {
    x = clamp(x, 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
  }

  void main() {
    vec3 noisePos = aNoise;
    noisePos.x += sin(uTime * 0.22 + aRand * 6.283) * 1.5;
    noisePos.y += cos(uTime * 0.19 + aRand * 6.283) * 1.5;
    noisePos.z += sin(uTime * 0.15 + aRand * 3.141) * 1.5;

    // Stagger per particle so figures assemble rather than snap.
    // Mirrored by LEAD on the CPU side — keep the two in step.
    float lead = aRand * 0.3;
    float b = smootherstep((uBlend - lead) / (1.0 - lead));

    vec3 figure = mix(aFigA, aFigB, b);

    /* Resolved figures breathe. Without this the particles are exactly
       static whenever the blend is near an endpoint, which reads as the
       animation having stopped rather than as a shape holding still.
       Amplitude stays under a point-width so the figure never smears. */
    figure += vec3(
      sin(uTime * 0.47 + aRand * 6.283),
      cos(uTime * 0.41 + aRand * 5.117),
      sin(uTime * 0.33 + aRand * 3.141)
    ) * 0.4;

    float r = clamp((uReveal - lead) / (1.0 - lead), 0.0, 1.0);
    r = smoothstep(0.0, 1.0, r);

    /* Travel between figures by way of the noise cloud. Interpolating
       one figure straight into another parks every particle in the gap
       between two unrelated shapes, which reads as a blob; scattering
       and re-gathering keeps it legible and restates the theme on
       every transition. */
    r *= 1.0 - uDetour * 0.72;
    vReveal = r;

    vec3 pos = mix(noisePos, figure, r);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.8 + r * 0.8) * (300.0 / -mv.z);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uNoiseColor;
  uniform vec3 uSignalColor;

  varying float vReveal;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;

    float mask = smoothstep(0.5, 0.12, d);

    // Hold the ink back until the figure has nearly formed, or the
    // halfway point reads as a dense cloud of in-flight particles.
    vec3 col = mix(uNoiseColor, uSignalColor, pow(vReveal, 1.4));
    float alpha = mask * mix(0.18, 0.92, pow(vReveal, 1.7));

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function SignalField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void import("three").then((THREE) => {
      if (disposed || !mount) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        return; // no WebGL — the hero renders without the field
      }

      const COUNT = window.innerWidth < 768 ? 5000 : 9000;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setClearAlpha(0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        FOV,
        mount.clientWidth / mount.clientHeight || 1,
        0.1,
        1000,
      );
      camera.position.z = CAMERA_Z;

      const noise = new Float32Array(COUNT * 3);
      const figA = new Float32Array(COUNT * 3);
      const figB = new Float32Array(COUNT * 3);
      const rand = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        noise[i3] = (Math.random() - 0.5) * 92;
        noise[i3 + 1] = (Math.random() - 0.5) * 92;
        noise[i3 + 2] = (Math.random() - 0.5) * 42;
        rand[i] = Math.random();
      }

      let lastAmbient = buildAmbientFigure(figA, COUNT, -1);
      lastAmbient = buildAmbientFigure(figB, COUNT, lastAmbient);

      const attrA = new THREE.BufferAttribute(figA, 3);
      const attrB = new THREE.BufferAttribute(figB, 3);
      attrA.setUsage(THREE.DynamicDrawUsage);
      attrB.setUsage(THREE.DynamicDrawUsage);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(noise, 3));
      geometry.setAttribute("aNoise", new THREE.BufferAttribute(noise, 3));
      geometry.setAttribute("aFigA", attrA);
      geometry.setAttribute("aFigB", attrB);
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 90);

      const uniforms = {
        uBlend: { value: 0 },
        uDetour: { value: 0 },
        uReveal: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 2.3 },
        uNoiseColor: { value: new THREE.Color("#a1a1a1") },
        uSignalColor: { value: new THREE.Color("#002fa7") },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
      });

      const group = new THREE.Group();
      group.add(new THREE.Points(geometry, material));
      scene.add(group);

      if (reduceMotion) {
        uniforms.uReveal.value = 1;
        group.rotation.set(-0.08, -0.12, 0);
        renderer.render(scene, camera);
        cleanup = () => {
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
        return;
      }

      // Unstarted: dust at rest. One frame, then nothing until the
      // pointer moves in the first fold.
      renderer.render(scene, camera);

      let armed = false;
      let visible = true;
      let raf = 0;
      let startedAt = 0;
      let cycleOrigin = 0;
      let cycleDuration = CYCLE;

      /* Hovering the field swaps the whole figure set from the ambient
         shapes to the four concepts, and back again on leave. */
      let mode: "ambient" | "concept" = "ambient";
      let hoveringField = false;
      let conceptIndex = -1;

      const buildNext = (out: Float32Array) => {
        if (mode === "concept") {
          conceptIndex = (conceptIndex + 1) % CONCEPTS.length;
          buildConcept(out, COUNT, conceptIndex);
        } else {
          lastAmbient = buildAmbientFigure(out, COUNT, lastAmbient);
        }
      };

      const smootherstep = (x: number) => {
        const c = Math.min(1, Math.max(0, x));
        return c * c * c * (c * (c * 6 - 15) + 10);
      };

      /**
       * Freezes the exact position every particle is currently rendered
       * at into `out`, reproducing the vertex shader term for term.
       *
       * A uniform CPU-side mix is not good enough here. The shader
       * staggers arrival per particle and, mid-transition, has most of
       * them out in the noise cloud — so a naive snapshot teleports the
       * field to a fully-formed figure the instant you hover.
       *
       * The figure drift is subtracted back out at the end: at u = 0 the
       * shader re-adds it, so leaving it in would double it.
       */
      const snapshotInto = (out: Float32Array, u: number, tSec: number) => {
        const detour = Math.pow(Math.sin(Math.PI * u), 8) * 0.88;
        const reveal = Math.min(1, tSec / REVEAL);

        for (let i = 0; i < COUNT; i++) {
          const i3 = i * 3;
          const r = rand[i];
          const inv = 1 - r * LEAD;
          const b = smootherstep((u - r * LEAD) / inv);
          const rev = smootherstep((reveal - r * LEAD) / inv) * (1 - detour * 0.72);

          const dnx = Math.sin(tSec * 0.22 + r * 6.283) * 1.5;
          const dny = Math.cos(tSec * 0.19 + r * 6.283) * 1.5;
          const dnz = Math.sin(tSec * 0.15 + r * 3.141) * 1.5;

          const dfx = Math.sin(tSec * 0.47 + r * 6.283) * 0.4;
          const dfy = Math.cos(tSec * 0.41 + r * 5.117) * 0.4;
          const dfz = Math.sin(tSec * 0.33 + r * 3.141) * 0.4;

          const fx = figA[i3] + (figB[i3] - figA[i3]) * b + dfx;
          const fy = figA[i3 + 1] + (figB[i3 + 1] - figA[i3 + 1]) * b + dfy;
          const fz = figA[i3 + 2] + (figB[i3 + 2] - figA[i3 + 2]) * b + dfz;

          const nx = noise[i3] + dnx;
          const ny = noise[i3 + 1] + dny;
          const nz = noise[i3 + 2] + dnz;

          out[i3] = nx + (fx - nx) * rev - dfx;
          out[i3 + 1] = ny + (fy - ny) * rev - dfy;
          out[i3 + 2] = nz + (fz - nz) * rev - dfz;
        }
      };

      /* Switching sets shouldn't wait out the rest of the cycle — a
         hover has to answer promptly. Freeze exactly what is on screen
         into A, put the new set's first figure into B, and restart on a
         shorter cycle so the concept lands in a couple of seconds. */
      const switchMode = (next: "ambient" | "concept", now: number) => {
        if (mode === next) return;
        mode = next;

        const u = Math.min(1, (now - cycleOrigin) / 1000 / cycleDuration);
        snapshotInto(figA, u, (now - startedAt) / 1000);
        buildNext(figB);
        attrA.needsUpdate = true;
        attrB.needsUpdate = true;

        cycleOrigin = now;
        cycleDuration = SWITCH_CYCLE;
      };

      /* Built off the render frame. It is only needed once the blend
         lifts off zero, which smootherstep makes gradual, so there is
         no rush and no dropped frame. */
      const scheduleNextFigure = () => {
        const build = () => {
          buildNext(figB);
          attrB.needsUpdate = true;
        };
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(build, { timeout: 1500 });
        } else {
          setTimeout(build, 0);
        }
      };

      const target = { rx: 0, ry: 0 };
      const current = { rx: 0, ry: 0 };

      // "First fold" = the hero section this canvas sits in.
      const zone: HTMLElement = mount.closest("section") ?? mount;

      const start = (now: number) => {
        if (armed) return;
        armed = true;
        startedAt = now;
        cycleOrigin = now;
        if (!raf) raf = requestAnimationFrame(frame);
      };

      /* Touch devices have no pointer movement to wait for — gating on
         it there would leave a permanently frozen field. On a coarse
         pointer the field starts as soon as it scrolls into view. */
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      const within = (e: PointerEvent, el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        );
      };

      const onPointerMove = (e: PointerEvent) => {
        const now = performance.now();

        /* Hover is tracked against the canvas itself, while arming
           watches the whole first fold — the two zones are different on
           purpose, so the field is alive before you reach it. */
        const overField = within(e, mount);
        if (overField !== hoveringField) {
          hoveringField = overField;
          if (armed) switchMode(overField ? "concept" : "ambient", now);
        }

        if (!within(e, zone)) return;
        start(now);

        // Gentle parallax; the motion is autonomous, this only tilts it.
        const box = mount.getBoundingClientRect();
        const ndcX = ((e.clientX - box.left) / box.width) * 2 - 1;
        const ndcY = -(((e.clientY - box.top) / box.height) * 2 - 1);
        target.ry = ndcX * 0.16;
        target.rx = -ndcY * 0.12;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });

      // Touch: tapping the field cycles the concepts.
      const onPointerDown = (e: PointerEvent) => {
        if (!coarsePointer || !within(e, mount)) return;
        const now = performance.now();
        start(now);
        if (mode === "concept") {
          // Same seamless hand-off as a mode switch, just without
          // changing set — freeze what's on screen, then morph on.
          const u = Math.min(1, (now - cycleOrigin) / 1000 / cycleDuration);
          snapshotInto(figA, u, (now - startedAt) / 1000);
          buildNext(figB);
          attrA.needsUpdate = true;
          attrB.needsUpdate = true;
          cycleOrigin = now;
          cycleDuration = SWITCH_CYCLE;
        } else {
          switchMode("concept", now);
        }
      };
      window.addEventListener("pointerdown", onPointerDown, { passive: true });

      const onResize = () => {
        if (!mount.clientWidth || !mount.clientHeight) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        if (!armed) renderer.render(scene, camera);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && coarsePointer) start(performance.now());
          if (visible && armed && !raf) raf = requestAnimationFrame(frame);
        },
        { threshold: 0 },
      );
      io.observe(mount);

      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (visible && armed && !raf) {
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      function frame(now: number) {
        const t = (now - startedAt) / 1000;
        uniforms.uTime.value = t;
        uniforms.uReveal.value = Math.min(1, t / REVEAL);

        /* One continuous cycle, no phases. On wrap the figure just
           shown becomes A and a fresh one is built into B — the blend
           is 0 at that instant, so mix(A, B, 0) is exactly what was
           already on screen and nothing jumps.

           The origin is reset on every wrap rather than deriving the
           phase with floor(), so that `cycleDuration` can change
           between cycles without the phase jumping. */
        const raw = (now - cycleOrigin) / 1000 / cycleDuration;
        let u = raw;

        if (raw >= 1) {
          figA.set(figB);
          attrA.needsUpdate = true;
          cycleOrigin = now;
          cycleDuration = CYCLE; // the shortened switch cycle is one-shot
          u = 0;
          scheduleNextFigure();
        }

        // Raw phase; the shader eases it, so the per-particle stagger
        // is applied to time rather than to an already-eased value.
        uniforms.uBlend.value = u;
        /* Scatter through noise mid-transition, then re-gather.
           The power is high on purpose. Position is a straight mix
           between the noise and figure buffers, and the noise cloud is
           wider than the figures — so even 10% of noise left in leaves
           a jitter larger than a cluster's own spread and the figure
           stops reading. Anything short of a narrow, deep spike keeps
           the field permanently blurred. */
        uniforms.uDetour.value = Math.pow(Math.sin(Math.PI * u), 8) * 0.88;

        /* Finer dots for the concepts. At the ambient size a dot is
           wider than a letter stroke, so the counters fill in and the
           word reads as a blob rather than as type. */
        const wantSize = mode === "concept" ? 1.3 : 2.3;
        uniforms.uSize.value += (wantSize - uniforms.uSize.value) * 0.06;

        current.rx += (target.rx - current.rx) * 0.03;
        current.ry += (target.ry - current.ry) * 0.03;
        // Kept shallow — these figures are charts, and a steep tilt
        // makes them unreadable.
        group.rotation.x = current.rx - 0.05 + Math.sin(t * 0.05) * 0.03;
        group.rotation.y = current.ry + Math.sin(t * 0.08) * 0.09;

        renderer.render(scene, camera);
        raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("visibilitychange", onVisibility);
        ro.disconnect();
        io.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      /* pointer-events stay off so the canvas never intercepts text
         selection — the start gesture is read from window coordinates
         against the hero section's rect instead. */
      className="pointer-events-none relative aspect-square w-full max-w-[680px]"
    />
  );
}
