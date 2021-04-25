import { Particle } from './particle';

export class DistanceConstraint {
        particle_a: Particle;
        particle_b: Particle;
        length: number;

        constructor(particle_a: Particle, particle_b: Particle, length: number) {
                this.particle_a = particle_a;
                this.particle_b = particle_b;
                this.length = length;
        }

        static init(particle_a: Particle, particle_b: Particle, length: number): DistanceConstraint {
                return new DistanceConstraint(particle_a, particle_b, length);
        }
}

export class UnilateralDistanceConstraint {
        particle_a: Particle;
        particle_b: Particle;
        activation_distance: number;
        length: number;

        constructor(particle_a: Particle, particle_b: Particle, activation_distance: number, length: number) {
                this.particle_a = particle_a;
                this.particle_b = particle_b;
                this.activation_distance = activation_distance;
                this.length = length;
        }

        static init(particle_a: Particle, particle_b: Particle, activation_distance: number, length: number): UnilateralDistanceConstraint {
                return new UnilateralDistanceConstraint(particle_a, particle_b, activation_distance, length);
        }
}
