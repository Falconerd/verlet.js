import "./styles.css";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 720;
const height = 480;

const BOUNCE = 0.9;
const GRAVITY = 0.5;
const FRICTION = 0.99;
const ITERATIONS = 4;
const SLEEP_DISTANCE = 0.3;

const bodies = [];

let time_last_frame = Date.now();
let paused = false;

createBody(
  [
    { x: 50, y: 50, oldx: 10, oldy: 50 },
    { x: 100, y: 50, oldx: 100, oldy: 50 },
    { x: 100, y: 100, oldx: 100, oldy: 100 },
    { x: 50, y: 100, oldx: 50, oldy: 100 }
  ],
  [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2]
  ]
);

createBody(
  [
    { x: 100, y: 100, oldx: 90, oldy: 100 },
    { x: 200, y: 100, oldx: 200, oldy: 100 },
    { x: 200, y: 200, oldx: 200, oldy: 200 },
    { x: 100, y: 200, oldx: 100, oldy: 200 }
  ],
  [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2]
  ]
);

// createBody(
//   [
//     { x: 300, y: 100, oldx: 300, oldy: 100 },
//     { x: 200, y: 100, oldx: 200, oldy: 100 },
//     { x: 200, y: 200, oldx: 200, oldy: 200 },
//     { x: 100, y: 200, oldx: 100, oldy: 200 }
//   ],
//   [
//     [0, 1],
//     [1, 2],
//     [2, 3],
//     [3, 0],
//     [0, 2]
//   ]
// );

ctx.strokeStyle = "#00ff00";
ctx.strokeWidth = 2;

update();

document.addEventListener('click', (e) => {
  console.log(e);
  const x = e.clientX;
  const y = e.clientY;

  const hw = Math.random() * 50;
  const hh = Math.random() * 50;

  const a = { x: x - hw, y: y - hh };
  const b = { x: x + hw, y: y - hh };
  const c = { x: x + hw, y: y + hh };
  const d = { x: x - hw, y: y + hh };

  createBody(
    [
      { ...a, oldx: a.x, oldy: a.y },
      { ...b, oldx: b.x, oldy: b.y },
      { ...c, oldx: c.x, oldy: c.y },
      { ...d, oldx: d.x, oldy: d.y },
    ],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2]
    ]
  );
});

document.addEventListener('keypress', (e) => {
  if (e.key === ' ') {
    paused = !paused;
  }
})

function update() {
  if (paused) {
    requestAnimationFrame(update);
    return;
  }
  const now = Date.now();
  const dt = now - time_last_frame;
  time_last_frame = now;
  /*
  updatePoints();
  constrainPoints();
  updateSticks();
  sleepCheck(dt);
  updateOrigins();
  updateRotation();

  renderSticks();
  renderPoints();
  renderRotation();
  */
  ctx.clearRect(0, 0, width, height);
  renderDebug(dt);
  requestAnimationFrame(update);
}

function updatePoints() {
  for (const b of bodies) {
    if (b.asleep) continue;
    const points = b.points;
    for (const p of points) {
      const vx = (p.x - p.oldx) * FRICTION;
      const vy = (p.y - p.oldy) * FRICTION;

      p.oldx = p.x;
      p.oldy = p.y;
      p.x += vx;
      p.y += vy;
      p.y += GRAVITY;
    }
  }
}

function constrainPoints() {
  for (const b of bodies) {
    if (b.asleep) continue;
    const points = b.points;
    for (const p of points) {
      const vx = (p.x - p.oldx) * FRICTION;
      const vy = (p.y - p.oldy) * FRICTION;

      if (p.x > width) {
        p.x = width;
        p.oldx = p.x + vx * BOUNCE;
      } else if (p.x < 0) {
        p.x = 0;
        p.oldx = p.x + vx * BOUNCE;
      }
      if (p.y > height) {
        p.y = height;
        p.oldy = p.y + vy * BOUNCE;
      } else if (p.y < 0) {
        p.y = 0;
        p.oldy = p.y + vy * BOUNCE;
      }
    }
  }
}

function updateSticks() {
  for (const b of bodies) {
    if (b.asleep) continue;
    const sticks = b.sticks;
    for (let i = 0; i < ITERATIONS; ++i) {
      for (const s of sticks) {
        const p0 = s.p0;
        const p1 = s.p1;
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = s.length - dist;
        const pct = diff / dist / 2;
        const ox = dx * pct;
        const oy = dy * pct;

        s.p0.x -= ox;
        s.p0.y -= oy;
        s.p1.x += ox;
        s.p1.y += oy;
      }
    }
  }
}

function updateOrigins() {
  for (const b of bodies) {
    if (b.asleep) continue;
    const { x, y } = calculateOrigin(b.points);
    b.oldorigin.x = b.origin.x;
    b.oldorigin.y = b.origin.y;
    b.origin.x = x;
    b.origin.y = y;
  }
}

function updateRotation() {
  for (const b of bodies) {
    if (b.asleep) continue;
    const cax = b.points[0].x - b.origin.x;
    const cay = b.points[0].y - b.origin.y;
    const theta = Math.atan2(cay, cax);
    b.rotation = theta - b.otheta;
  }
}

function renderPoints() {
  for (const b of bodies) {
    const points = b.points;
    ctx.strokeStyle = "#0f0";
    if (b.asleep) {
      ctx.strokeStyle = 'yellow';
    }
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#001c00";
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(b.origin.x, b.origin.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.stroke();
  }
}

function renderSticks() {
  for (const b of bodies) {
    const sticks = b.sticks;
    for (var s of sticks) {
      ctx.beginPath();
      ctx.moveTo(s.p0.x, s.p0.y);
      ctx.lineTo(s.p1.x, s.p1.y);
      ctx.strokeStyle = '#00ff00';
      if (b.asleep) {
        ctx.strokeStyle = 'yellow';
      }
      ctx.stroke();
    }
  }
}

function renderRotation() {
  for (const b of bodies) {
    const rot = b.rotation;
    const x = b.origin.x + 20 * Math.cos(rot);
    const y = b.origin.y + 20 * Math.sin(rot);
    ctx.strokeStyle = '#00ff00';
    if (b.asleep) {
      ctx.strokeStyle = 'yellow';
    }
    ctx.moveTo(b.origin.x, b.origin.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function renderDebug(dt) {
  ctx.font = '12px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText(`dt: ${dt}`, width - 100, 16);
}

function sleepCheck(dt) {
  for (const b of bodies) {
    if (distance(b.origin, b.oldorigin) < SLEEP_DISTANCE) {
      b.still_time += dt;
      if (b.still_time > 1000) {
        b.asleep = true;
      }
    }
  }
}

function distance(p0, p1) {
  var dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function createBody(points, edges) {
  const origin = calculateOrigin(points);
  const b = {
    origin,
    oldorigin: { ...origin },
    points,
    sticks: [],
    rotation: 0,
    still_time: 0,
    asleep: false
  };

  // for every point, create a stick to every other point
  // for (let i = 0; i < points.length; ++i) {}

  for (const e of edges) {
    const p0 = points[e[0]];
    const p1 = points[e[1]];
    b.sticks.push({
      p0,
      p1,
      length: distance(p0, p1),
    });
  }

  // Move point to origin then calc angle
  const cax = b.points[0].x - origin.x;
  const cay = b.points[0].y - origin.y;

  // Original angle to point 0, used to calc rot
  b.otheta = Math.atan2(cay, cax);

  bodies.push(b);
}

function calculateOrigin(points) {
  const sumx = points.reduce((acc, val) => acc + val.x, 0);
  const sumy = points.reduce((acc, val) => acc + val.y, 0);
  const cx = sumx / points.length;
  const cy = sumy / points.length;

  return { x: cx, y: cy };
}
