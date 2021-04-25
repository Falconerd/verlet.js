import { Vec2 } from './vec2';
import { Particle } from './particle';

export class World {
        particles: Particle[] = [];
        constraint_solves: number = 3;
        world_boundary: Vec2;
        gravity: number = 0.9;

        constructor(world_boundary: Vec2) {
                this.world_boundary = Vec2.init(world_boundary.x, world_boundary.y);
        }

        static init(world_boundary: Vec2): World {
                return new World(world_boundary);
        }

        step(): void {
                for (let i = 0; i < this.constraint_solves; ++i) {
                        for (const particle of this.particles) {
                                for (const distance_constraint of particle.distance_constraints) {
                                        const p0 = distance_constraint.particle_a.position;
                                        const p1 = distance_constraint.particle_b.position;
                                        const distance_x = p1.x - p0.x;
                                        const distance_y = p1.y - p0.y;
                                        const distance = p1.dist(p0);
                                        const difference = distance_constraint.length - distance;
                                        const alpha = difference / distance / 2;
                                        const offset_x = distance_x * alpha;
                                        const offset_y = distance_y * alpha;
                                        p0.x -= offset_x;
                                        p0.y -= offset_y;
                                        p1.x += offset_x;
                                        p1.y += offset_y;
                                }

                                if (particle.position.y > this.world_boundary.y) {
                                        particle.position.y = this.world_boundary.y;
                                        particle.old_position.y = particle.position.y + (particle.position.y - particle.old_position.y) * particle.bounciness;
                                }

                                if (particle.position.x > this.world_boundary.x) {
                                        particle.position.x = this.world_boundary.x;
                                        particle.old_position.x = particle.position.x + (particle.position.x - particle.old_position.x) * particle.bounciness;
                                }

                                if (particle.position.x < 0) {
                                        particle.position.x = 0;
                                        particle.old_position.x = particle.position.x + (particle.position.x - particle.old_position.x) * particle.bounciness;
                                }
                        }
                }

                for (const particle of this.particles) {
                        const velocity = particle.position.sub(particle.old_position).scale(0.999);
                        particle.old_position.x = particle.position.x;
                        particle.old_position.y = particle.position.y;
                        particle.position.x += velocity.x;
                        particle.position.y += velocity.y;
                        particle.position.y += this.gravity;
                        particle.velocity.x = velocity.x;
                        particle.velocity.y = velocity.y;
                }
        }
}
