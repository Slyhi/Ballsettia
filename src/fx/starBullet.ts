/// <reference path="./projectile.ts" />

class StarBullet extends Projectile {
    private damage: number;
    private radius: number;
    private speedFlame: Sprite;

    constructor(x: number, y: number, v: Vector2, source: Ball, damage: number, radius: number) {
        super(source, {
            x, y,
            texture: 'star',
            layer: Battle.Layers.fx,
            v: v,
            angle: v.angle + 90,
            bounds: new CircleBounds(0, 0, 5),
            tags: [Tags.DELAY_RESOLVE(source.team)],
        });

        this.damage = damage;
        this.radius = radius;

        this.speedFlame = this.addChild(new Sprite({
            texture: 'speedflame',
            tint: 0xFFAA00,
            blendMode: Texture.BlendModes.ADD,
            copyFromParent: ['layer'],
            scaleX: 0.8,
        }));

        this.addChild(new StatViewer({ type: 'damage', getDamage: () => this.damage }, 4, 3));
    }

    postUpdate() {
        super.postUpdate();

        World.Actions.orderWorldObjectAfter(this.speedFlame, this);
        this.speedFlame.angle = this.angle;
        this.speedFlame.scaleY = M.lerp(1, 1.1, Tween.Easing.OscillateSine(8)(this.life.time));
    }

    update(): void {
        super.update();

        let collisions = this.world.select.overlap(this.bounds, [Battle.PhysicsGroups.balls, Battle.PhysicsGroups.walls]);

        let ballHit = <Ball>collisions.find(c => c instanceof Ball && c.team !== this.source.team);
        let wallHit = collisions.find(c => c.physicsGroup === Battle.PhysicsGroups.walls);

        if (ballHit) {
            this.world.addWorldObject(new Explosion(this.x, this.y, this.radius, { ally: 0, enemy: this.damage }, this.source));
            this.kill();
        } else if (wallHit) {
            this.world.playSound('hitwall');
        }
    }
}