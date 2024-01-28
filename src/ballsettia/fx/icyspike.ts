/// <reference path="../../fx/projectile.ts" />

class IcySpike extends Projectile {
    private chillTime: number;
    private dmg: number;

    constructor(x: number, y: number, v: Vector2, source: Ball, chillTime: number, dmg: number = 0) {
        super(source, {
            x, y,
            texture: 'slyhi/icyspike',
            layer: Battle.Layers.fx,
            v: v,
            angle: v.angle + 90,
            bounds: new CircleBounds(0, 0, 5),
            tags: [Tags.DELAY_RESOLVE(source.team)],
        });

        this.chillTime = chillTime;
        this.dmg = dmg;

        this.addChild(new StatViewer({ type: 'damage', getDamage: () => this.dmg }, 4, 4));
    }

    update(): void {
        super.update();

        let collisions = this.world.select.overlap(this.bounds, [Battle.PhysicsGroups.balls, Battle.PhysicsGroups.walls]);

        let ball = <Ball>collisions.find(c => c instanceof Ball && c.team !== this.source.team);
        let wall = collisions.find(c => c.physicsGroup === Battle.PhysicsGroups.walls);

        if (ball) {
            ball.takeDamage(this.dmg, this.source, 'other');
            ball.addChilling(this.source, this.chillTime);
            this.kill();
        } else if (wall) {
            this.world.playSound('unfreeze', { limit: 5 });
            this.kill();
        }
    }

    kill() {
        let shattered = lazy(`icySpikeShattered/${this.getTextureKey()}`,
                        () => this.getTexture().subdivide(2, 2, 'IcySpike.kill').map(sd => {
                            sd.texture = new AnchoredTexture(sd.texture, 0.5, 0.5);
                            return sd;
                        }));

                        for (let shatter of shattered) {
            this.world.addWorldObject(new Sprite({
                x: this.x - 8 + shatter.x,
                y: this.y - 8 + shatter.y,
                texture: shatter.texture,
                alpha: this.alpha,
                layer: this.layer,
                v: Random.inCircle(150),
                vangle: 720*Random.sign(),
                life: 0.3,
                update: function() {
                    this.alpha = M.lerp(this.alpha, 0, Tween.Easing.InQuad(this.life.progress));
                }
            }));
        }
        super.kill();
    }
}