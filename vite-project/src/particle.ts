import { Vec2 } from './vec2';
import { DistanceConstraint, UnilateralDistanceConstraint } from './constraints';

export class Particle {
        position: Vec2;
        old_position: Vec2;
        velocity: Vec2;
        distance_constraints: DistanceConstraint[] = [];
        unilateral_distance_constraints: UnilateralDistanceConstraint[] = [];
        bounciness: number = 0.8;

        constructor(position: Vec2) {
                this.position = Vec2.init(position.x, position.y);
                this.old_position = Vec2.init(position.x, position.y);
                this.velocity = Vec2.zero();
        }

        static init(position: Vec2): Particle {
                return new Particle(position);
        }

        createDistanceConstraint(other: Particle, length: number): void {
                const constraint = DistanceConstraint.init(this, other, length);
                this.distance_constraints.push(constraint);
        }

        createUnilateralDistanceConstraint(other: Particle, activation_distance: number, length: number): void {
                const constraint = UnilateralDistanceConstraint.init(this, other, activation_distance, length);
                this.unilateral_distance_constraints.push(constraint);
        }
}
