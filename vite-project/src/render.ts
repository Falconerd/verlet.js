import { Vec2 } from './vec2';
import { Particle } from './particle';
import { World } from './world';

export const canvas: HTMLCanvasElement = document.getElementById<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

const WIDTH = 720;
const HEIGHT = 480;

const BACKGROUND_COLOR = '#fff';
const PARTICLE_COLOR = '#82ccaa';
const ORIGIN_COLOR = '#f44';
const EDGE_COLOR = '#ccc';
const RENDER_PARTICLE_RADIUS = 2;

export function render(world: World, alpha: number, nearby_particle: Particle | null): void {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.strokeStyle = EDGE_COLOR;

        for (const particle of world.particles) {
                for (const distance_constraint of particle.distance_constraints) {
                        const particle_b = distance_constraint.particle_b;
                        ctx.beginPath();
                        ctx.moveTo(particle.position.x + particle.velocity.x * alpha, particle.position.y + particle.velocity.y * alpha);
                        ctx.lineTo(particle_b.position.x + particle_b.velocity.x * alpha, particle_b.position.y + particle_b.velocity.y * alpha);
                        ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(particle.position.x + particle.velocity.x * alpha, particle.position.y + particle.velocity.y * alpha, RENDER_PARTICLE_RADIUS, 0, 2 * Math.PI);
                ctx.fill();
        }

        if (nearby_particle) {
                ctx.beginPath();
                ctx.arc(nearby_particle.position.x + nearby_particle.velocity.x * alpha, nearby_particle.position.y + nearby_particle.velocity.y * alpha, RENDER_PARTICLE_RADIUS * 4, 0, 2 * Math.PI);
                ctx.fill();
        }
}
