class StarExplosion extends Sprite {
    private radius: number;
    private damageTo: { ally: number, enemy: number };
    private source: Ball;

    constructor(x: number, y: number, radius: { damage: number, inner?: number, outer?: number }, damageTo: { ally: number, enemy: number }, source?: Ball) {
        super({
            x, y,
            texture: new AnchoredTexture(Texture.filledStar(radius.inner??radius.damage*0.5527864, radius.outer??radius.damage*1.4472136, 5, 0xFFFFFF, 1, (90 + Ball.Random.int(0, 71))), 0.5, 0.5),
            layer: Battle.Layers.fx,
        });

        this.radius = radius.damage;
        this.damageTo = damageTo;
        this.source = source;

        this.runScript(S.chain(
            S.wait(0.1),
            S.call(() => this.tint = 0x000000),
            S.wait(0.1),
            S.call(() => this.kill()),
        ));
    }

    onAdd() {
        super.onAdd();
        (global.theater ?? this.world).runScript(shake(this.world, 1, 0.1));

        let balls = this.world.select.typeAll(Ball);
        for (let ball of balls) {
            if (G.distance(this, ball) > this.radius + ball.physicalRadius) continue;
            if (this.source && ball.team === this.source.team && this.damageTo.ally !== 0) ball.takeDamage(this.damageTo.ally, this.source, 'other');
            if (this.source && ball.team !== this.source.team && this.damageTo.enemy !== 0) ball.takeDamage(this.damageTo.enemy, this.source, 'other');
        }
    }
}