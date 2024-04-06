class LattePool extends WorldObject {
    private source: Ball;

    radius: number;
    private convayV: Vector2;
    private latteMask: TextureFilters.Mask.WorldObjectMaskConfig;
    private latteArt: Sprite;

    constructor(x: number, y: number, source: Ball, direction: Vector2, speed: number, time: number, radius: number) {
        super({
            x, y,
            layer: Battle.Layers.onground,
        });

        this.source = source;
        this.radius = radius;
        this.convayV = direction.setMagnitude(speed)
        
        this.latteMask = {
            offsetx: 0,
            offsety: 0,
            texture: Ball.textureMaskForRadius(this.radius),
            type: 'local'
        }

        this.latteArt = this.addChild(new Sprite({
            texture: `slyhi/latteart/${Ball.Random.int(0, 3)}`,
            blendMode: Texture.BlendModes.NORMAL,
            copyFromParent: ['layer'],
            angle: this.convayV.angle - 90,
            mask: this.latteMask,
        }));

        let pool = this;
        
        pool.runScript(function*() {
            yield S.tween(0.5, pool, 'radius', 0, radius);
            yield S.tween(time, pool, 'radius', radius, 10);
            yield S.tween(0.5, pool, 'radius', 10, 0);
            pool.kill();
        });
    }

    update(): void {
        super.update();

        let validBalls = !this.world ? [] : this.world.select.typeAll(Ball).filter(ball => G.distance(ball, this) <= ball.physicalRadius + this.radius && ball.alive && !ball.dead);

        for (let ball of validBalls) {
            ball.v.add(this.convayV.x * this.delta, this.convayV.y * this.delta);
        }
    }

    render(texture: Texture, x: number, y: number): void {
        let team = Ball.getTeamForColorAprilFools(this.source.team);
        let tint1 = team === 'friend' ? 0xBF6F4A : 0xC6A992;
        let tint2 = team === 'friend' ? 0x8A4836 : 0x7A624E;

        Draw.brush.color = Color.lerpColorByLch(tint1, tint2, Tween.Easing.OscillateSine(0.20)(this.life.time));
        Draw.brush.alpha = 1;
        Draw.circleSolid(texture, x, y, this.radius);

        this.latteMask.texture = Ball.textureMaskForRadius(this.radius)
        World.Actions.orderWorldObjectAfter(this.latteArt, this);

        super.render(texture, x, y);
    }
}