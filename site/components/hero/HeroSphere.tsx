'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                     */
/* ------------------------------------------------------------------ */

/** Generate an icosphere (subdivided icosahedron) as a flat triangle list. */
function icosphere(subdivisions: number): Float32Array {
  const phi = (1 + Math.sqrt(5)) / 2;
  // 12 base vertices
  const baseVerts: [number, number, number][] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const norm = (v: [number, number, number]): [number, number, number] => {
    const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const verts = baseVerts.map(norm);

  // 20 base faces
  let faces: [number, number, number][] = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  const midCache = new Map<string, number>();
  const midpoint = (a: number, b: number): number => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    if (midCache.has(key)) return midCache.get(key)!;
    const va = verts[a], vb = verts[b];
    const mid = norm([(va[0]+vb[0])/2, (va[1]+vb[1])/2, (va[2]+vb[2])/2]);
    verts.push(mid);
    midCache.set(key, verts.length - 1);
    return verts.length - 1;
  };

  for (let s = 0; s < subdivisions; s++) {
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
      next.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);
    }
    faces = next;
  }

  const out = new Float32Array(faces.length * 9);
  let i = 0;
  for (const [a, b, c] of faces) {
    for (const vi of [a, b, c]) {
      out[i++] = verts[vi][0];
      out[i++] = verts[vi][1];
      out[i++] = verts[vi][2];
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const VERT = `
  attribute vec3 pos;
  uniform mat4 mvp;
  uniform float time;
  varying vec3 vNormal;

  void main() {
    float breathe = sin(time * 0.6 + pos.y * 3.14) * 0.014;
    vec3 p = pos * (1.0 + breathe);
    vNormal = pos;
    gl_Position = mvp * vec4(p, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec3 vNormal;
  uniform vec3 accent;
  uniform float time;

  void main() {
    vec3 n = normalize(vNormal);

    // Key light — top front-left
    vec3 light = normalize(vec3(-0.5, 1.2, 1.0));
    float diff = max(0.0, dot(n, light));

    // Specular highlight
    vec3 half_v = normalize(light + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(0.0, dot(n, half_v)), 24.0);

    // Fresnel rim glow
    float fresnel = pow(1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0))), 2.5);

    // Slow pulse
    float pulse = 0.5 + 0.5 * sin(time * 0.7);

    // Surface: dark base → vivid accent on lit face
    vec3 base = accent * 0.18;
    vec3 lit  = accent * (0.85 + pulse * 0.12);
    vec3 col  = mix(base, lit, diff * 0.9);

    // Add specular + rim
    col += vec3(0.9, 0.95, 1.0) * spec * 0.5;
    col += accent * fresnel * (0.6 + pulse * 0.3);

    // Gamma
    col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));
    gl_FragColor = vec4(col, 0.96);
  }
`;

const WIRE_VERT = `
  attribute vec3 pos;
  uniform mat4 mvp;
  uniform float time;
  void main() {
    float breathe = sin(time * 0.6 + pos.y * 3.14) * 0.014;
    vec3 p = pos * (1.0 + breathe);
    gl_Position = mvp * vec4(p, 1.0);
  }
`;

const WIRE_FRAG = `
  precision mediump float;
  uniform vec3 accent;
  uniform float alpha;
  void main() {
    gl_FragColor = vec4(accent * 1.2, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/* Matrix helpers (no gl-matrix needed)                                */
/* ------------------------------------------------------------------ */

type Mat4 = Float32Array;

function mat4(): Mat4 { return new Float32Array(16); }

/**
 * All matrices are column-major (WebGL / OpenGL convention).
 * Index: m[col * 4 + row]
 */
function perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
  const m = mat4();
  const f = 1 / Math.tan(fov / 2);
  // col 0
  m[0] = f / aspect;
  // col 1
  m[5] = f;
  // col 2
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  // col 3
  m[14] = (2 * far * near) / (near - far);
  return m;
}

function identity(): Mat4 {
  const m = mat4();
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

/** Multiply two column-major 4×4 matrices: out = a * b */
function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = mat4();
  for (let col = 0; col < 4; col++)
    for (let row = 0; row < 4; row++)
      for (let k = 0; k < 4; k++)
        out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
  return out;
}

/** Pure rotation matrix around Y (column-major). */
function makeRotY(a: number): Mat4 {
  const c = Math.cos(a), s = Math.sin(a);
  const m = mat4();
  m[0] = c;  m[2] = s;   // col0: [c,0,s,0]
  m[5] = 1;              // col1: [0,1,0,0]
  m[8] = -s; m[10] = c; // col2: [-s,0,c,0]
  m[15] = 1;
  return m;
}

/** Pure rotation matrix around X (column-major). */
function makeRotX(a: number): Mat4 {
  const c = Math.cos(a), s = Math.sin(a);
  const m = mat4();
  m[0] = 1;              // col0: [1,0,0,0]
  m[5] = c;  m[6] = s;  // col1: [0,c,s,0]
  m[9] = -s; m[10] = c; // col2: [0,-s,c,0]
  m[15] = 1;
  return m;
}

/** Pure translation matrix (column-major). */
function makeTranslate(tx: number, ty: number, tz: number): Mat4 {
  const m = identity();
  m[12] = tx; m[13] = ty; m[14] = tz;
  return m;
}

/* ------------------------------------------------------------------ */
/* WebGL helpers                                                        */
/* ------------------------------------------------------------------ */

function cssColor(name: string): [number, number, number] {
  const p = document.createElement('span');
  p.style.color = `var(${name})`;
  document.body.appendChild(p);
  const rgb = getComputedStyle(p).color.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  p.remove();
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function linkProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function HeroSphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      return;
    }

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) { setReady(true); return; }

    /* ---- Programs ---- */
    const solidProg = linkProgram(gl, VERT, FRAG);
    const wireProg  = linkProgram(gl, WIRE_VERT, WIRE_FRAG);
    if (!solidProg || !wireProg) { setReady(true); return; }

    /* ---- Geometry ---- */
    const triData  = icosphere(3); // ~1280 triangles
    const wireData = icosphere(2); // ~320 triangles, converted to line segments

    // Build wireframe edge list from a coarser sphere
    const wireLines: number[] = [];
    for (let i = 0; i < wireData.length; i += 9) {
      // triangle edges a-b, b-c, c-a
      for (const [s, e] of [[0,3],[3,6],[6,0]] as const) {
        for (let k = 0; k < 3; k++) wireLines.push(wireData[i + s + k], wireData[i + e + k]);
      }
    }
    const wireBuf = new Float32Array(wireLines);

    const triVbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, triVbo);
    gl.bufferData(gl.ARRAY_BUFFER, triData, gl.STATIC_DRAW);

    const wireVbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, wireVbo);
    gl.bufferData(gl.ARRAY_BUFFER, wireBuf, gl.STATIC_DRAW);

    /* ---- Uniforms ---- */
    let accentColor: [number, number, number] = [0.43, 0.55, 1.0];

    const readColors = () => {
      accentColor = cssColor('--color-accent');
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    /* ---- Resize ---- */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.round(canvas.clientWidth  * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* ---- Mouse parallax ---- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouse.ty = (0.5 - e.clientY / window.innerHeight) * 0.4;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    /* ---- Render loop ---- */
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const t0 = performance.now();
    let raf = 0;
    let first = true;

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const w = canvas.width, h = canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect  = w / h;
      const proj    = perspective(Math.PI / 5, aspect, 0.1, 100);
      const angleY  = t * 0.22 + mouse.x * 0.8;
      const angleX  = mouse.y * 0.6 + Math.sin(t * 0.12) * 0.08;
      const model   = multiply(
        multiply(makeTranslate(0, 0, -3.2), makeRotX(angleX)),
        makeRotY(angleY),
      );
      const mvp     = multiply(proj, model);

      /* -- Solid pass -- */
      gl.useProgram(solidProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, triVbo);
      const pos1 = gl.getAttribLocation(solidProg, 'pos');
      gl.enableVertexAttribArray(pos1);
      gl.vertexAttribPointer(pos1, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(gl.getUniformLocation(solidProg, 'mvp'), false, mvp);
      gl.uniform1f(gl.getUniformLocation(solidProg, 'time'), t);
      gl.uniform3fv(gl.getUniformLocation(solidProg, 'accent'), accentColor);
      gl.drawArrays(gl.TRIANGLES, 0, triData.length / 3);

      /* -- Wireframe pass -- */
      gl.useProgram(wireProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, wireVbo);
      const pos2 = gl.getAttribLocation(wireProg, 'pos');
      gl.enableVertexAttribArray(pos2);
      gl.vertexAttribPointer(pos2, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(gl.getUniformLocation(wireProg, 'mvp'), false, mvp);
      gl.uniform1f(gl.getUniformLocation(wireProg, 'time'), t);
      gl.uniform3fv(gl.getUniformLocation(wireProg, 'accent'), accentColor);
      gl.uniform1f(gl.getUniformLocation(wireProg, 'alpha'), 0.28);
      gl.drawArrays(gl.LINES, 0, wireBuf.length / 3);

      if (first) { first = false; setReady(true); }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onPointer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="size-full"
      style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease-out',
      }}
    />
  );
}
