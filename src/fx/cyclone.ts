/// <reference path="./projectile.ts" />

class Cyclone extends Projectile {
    private dmgRadius: number;
    private dps: number;
    private enemyEffectiveness: number;
    private windLife: number;
    private getEffect: Function;

    constructor(x: number, y: number, v: Vector2, source: Ball, dmgRadius: number, dps: number, enemyEffectiveness: number, windLife: number, immediate?: boolean) {
        super(source, {
            x, y,
            texture: 'slyhi/cyclone',
            tint: Ball.getTeamForColorAprilFools(source.team) === 'friend' ? 0xFFFFFF : 0xABABAB,
            effects: { outline: { color: 0x000000, alpha: 1 } },
            layer: Battle.Layers.fx,
            alpha: 0.75,
            scale: dmgRadius/10,
            v: v,
            angle: v.angle + 90,
            bounds: new CircleBounds(0, 0, dmgRadius/2),
            tags: [Tags.DELAY_RESOLVE(source.team)],
        });

        this.dmgRadius = dmgRadius;
        this.dps = dps;
        this.enemyEffectiveness = enemyEffectiveness;
        this.windLife = windLife;
        this.getEffect = () => {
            return false;
        };

        if (!immediate) {
            this.alpha = 0;
            this.scale = dmgRadius/20;
            this.runScript(S.simul(
                S.tween(0.2, this, 'alpha', 0, 0.5, Tween.Easing.InQuad),
                S.tween(0.2, this, 'scale', dmgRadius/20, dmgRadius/10, Tween.Easing.InQuad),
            ));
        }
    }

    postUpdate() {
        super.postUpdate();
        
        this.angle = Math.round(M.mod(this.angle + 90*this.delta, 360));
        if (this.life.time > this.windLife/2) {
            // Graph for this curve -> https://www.desmos.com/calculator/ax3yka4jum
            let alpha = M.lerp(0.33, 0.75, Math.round((Math.sin(Math.exp((5.2976*this.life.time)/this.windLife)) + 1)*5)/10);
            this.alpha = alpha;
            this.effects.outline.alpha = alpha;
        }
    }

    update() {
        super.update();

        this.world.playSound('slyhi/wind', {limit: 4}); // This line used make the game crash for some reason

        let collisions = this.world.select.overlap(this.bounds, [Battle.PhysicsGroups.balls, Battle.PhysicsGroups.walls]);
        let wall = collisions.find(c => c.physicsGroup === Battle.PhysicsGroups.walls);

        if (wall) {
            this.world.playSound('hitwall');
            this.kill();
        }

        let pullBalls = getEnemies(this.world, this.source).filter(ball => G.distance(ball, this) <= this.dmgRadius*9 && this.isBallAffected(ball));
        if (pullBalls.length === 0) return;
        for (let ball of pullBalls) {

            let effectiveness = this.enemyEffectiveness;
            let pullForce = 8000;
            let magnitudeClamp = M.mapClamp(this.enemyEffectiveness, 1, 2, 100, 2000);
            let pullPos = this.getPosition();
            
            let force = PhysicsUtils.inverseLinear(pullPos.subtract(ball), pullForce * effectiveness).clampMagnitude(magnitudeClamp);
            ball.v.add(force.scale(this.source.delta));
        }
        
        let dmgBalls = pullBalls.filter(ball => G.distance(ball, this) <= this.dmgRadius);
        if (dmgBalls.length === 0) return;
        for (let ball of dmgBalls) {
            ball.leechFor(this.dps*this.delta, this.source);
            this.cooldownBall(ball);
            if (!this.getEffect()) {
                if (ball.isChilling()) {
                    this.getEffect = () => {
                        ball.addChilling(this.source, 0.1);
                        return true;
                    };
                    this.tint = Ball.getTeamForColorAprilFools(this.source.team) === 'friend' ? 0x00FFFF : 0x00ABAB;
                } else if (ball.isBurning()) {
                    this.getEffect = () => {
                        ball.addBurning(this.source, 0.1);
                        return true;
                    };
                    this.tint = Ball.getTeamForColorAprilFools(this.source.team) === 'friend' ? 0xFF8F00 : 0xAB6000;
                }
            }
        }

        if (this.life.time > this.windLife) {
            this.kill();
        }
    }

    onCollide(collideWith: Physics.Collision) {
        super.onCollide(collideWith);
        if (collideWith.other.obj instanceof Ball && collideWith.other.obj.team !== this.source.team) {
            this.cooldownBall(collideWith.other.obj);
        }
    }

    private isBallAffected(ball: Ball) {
        return this.getBallTimer(ball).done;
    }

    private cooldownBall(ball: Ball) {
        this.getBallTimer(ball).reset();
    }

    private getBallTimer(ball: Ball) {
        if (!ball.data.cycloneTimer) ball.data.cycloneTimer = ball.addTimer(0.2);
        return ball.data.cycloneTimer as Timer;
    }
}