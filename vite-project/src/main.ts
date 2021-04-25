import './style.css'
import { World } from './world';
import { Vec2 } from './vec2';
import { Particle } from './particle';
import { render } from './render';
import { canvas } from './render';

const mouse_position = Vec2.zero();
const time = {
        MS_PER_UPDATE: 20, // 1000 / MS_PER_UPDATE updates per second
        previous: Date.now(),
        lag: 0
}

const world = World.init(Vec2.init(720, 480));

// Create stuff to simulate
const a = Particle.init(Vec2.init(100, 100));
const b = Particle.init(Vec2.init(200, 100));
const c = Particle.init(Vec2.init(200, 200));
const d = Particle.init(Vec2.init(100, 200));
const e = Particle.init(Vec2.init(150, 50));
a.createDistanceConstraint(b, 100);
a.createDistanceConstraint(d, 100);
a.createDistanceConstraint(c, Math.SQRT2 * 100);
b.createDistanceConstraint(c, 100);
c.createDistanceConstraint(d, 100);
b.createDistanceConstraint(d, Math.SQRT2 * 100);
e.createDistanceConstraint(a, Math.SQRT2 * 50);
e.createDistanceConstraint(b, Math.SQRT2 * 50);
e.createDistanceConstraint(c, c.position.dist(e.position));
e.createDistanceConstraint(d, d.position.dist(e.position));
world.particles.push(a, b, c, d, e);

let nearby_particle: Particle | null = null;
let selected_particle: Particle | null = null;

// Update and render everything
function update(): void {
        const time_now = Date.now();
        const delta_time = time_now - time.previous;
        time.previous = time_now;
        time.lag += delta_time;

        let closest_distance = nearby_particle ? nearby_particle!.position.dist(mouse_position) : world.world_boundary.x * world.world_boundary.y;
        let found_particle = false;

        while (time.lag >= time.MS_PER_UPDATE) {
                world.step();
                time.lag -= time.MS_PER_UPDATE;

                for (const particle of world.particles) {
                        let distance = particle.position.dist(mouse_position);
                        if (distance <= closest_distance + 2 && distance < 20) {
                                closest_distance = distance;
                                nearby_particle = particle;
                                found_particle = true;
                        }
                }

                if (!found_particle && !selected_particle) {
                        nearby_particle = null;
                }

                if (selected_particle) {
                        selected_particle.position.x = mouse_position.x;
                        selected_particle.position.y = mouse_position.y;
                }
        }

        render(world, time.lag / time.MS_PER_UPDATE, nearby_particle);

        requestAnimationFrame(update);
}

update();

window.world = world;

canvas.addEventListener('mousemove', (e) => {
        mouse_position.x = e.offsetX;
        mouse_position.y = e.offsetY;
});

canvas.addEventListener('mousedown', () => {
        if (nearby_particle) {
                selected_particle = nearby_particle;
        }
});

canvas.addEventListener('mouseup', () => {
        selected_particle = null;
});

canvas.addEventListener('mouseout', () => {
        selected_particle = null;
        nearby_particle = null;
});
