/// <reference path="./projectile.ts" />

class WebBullet extends Projectile {
    private slowFactor: number;
    private slowTime: number;
    private webLife: number;

    constructor(x: number, y: number, v: Vector2, source: Ball, slowFactor: number, slowTime: number, webLife: number) {
        super(source, {
            x, y,
            texture: 'slyhi/webbullet',
            tint: Ball.getTeamForColorAprilFools(source.team) === 'friend' ? 0xFFFFFF : 0xABABAB,
            effects: { outline: { color: 0x000000 } },
            layer: Battle.Layers.fx,
            v: v,
            angle: v.angle + 90,
            bounds: new CircleBounds(0, 0, 5),
            tags: [Tags.DELAY_RESOLVE(source.team)],
        });

        this.slowFactor = slowFactor;
        this.slowTime = slowTime;
        this.webLife = webLife;
    }

    update() {
        super.update();

        let collisions = this.world.select.overlap(this.bounds, [Battle.PhysicsGroups.balls, Battle.PhysicsGroups.walls]);

        let ball = <Ball>collisions.find(c => c instanceof Ball && c.team !== this.source.team);
        let wall = collisions.find(c => c.physicsGroup === Battle.PhysicsGroups.walls);

        if (ball) {
            ball.addSlow('yarn', this.slowFactor, this.slowTime);
            this.kill();
        } else if (wall) {
            this.world.playSound('hitwall', { limit: 5 });
            this.world.addWorldObject(new WebTrap(this.x, this.y, vec2(0, 0), this.source, this.slowFactor, this.slowTime, this.webLife));
            this.kill();
        }
    }
}