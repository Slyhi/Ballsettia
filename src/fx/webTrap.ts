class WebTrap extends Sprite {
    private source: Ball;
    private slowFactor: number;
    private slowTime: number;
    private webLife: number;

    constructor(x: number, y: number, v: Vector2, source: Ball, slowFactor: number, slowTime: number, webLife: number) {
        super({
            x, y,
            texture: 'slyhi/webtrap',
            tint: Ball.getTeamForColorAprilFools(source.team) === 'friend' ? 0xFFFFFF : 0x808080,
            effects: { outline: { color: 0x000000 } },
            layer: Battle.Layers.onground,
            v: v,
            angle: Ball.Random.int(0, 359),
            physicsGroup: Battle.PhysicsGroups.droppables,
            bounds: new CircleBounds(0, 0, 10),
        });

        this.source = source;
        this.slowFactor = slowFactor;
        this.slowTime = slowTime;
        this.webLife = webLife;
    }

    onAdd(): void {
        super.onAdd();
        this.world.playSound('medkitout', { limit: 3 });
    }

    update(): void {
        super.update();
        this.webLife -= this.delta;
        if (this.webLife <= 0) { this.kill(); }
        
        PhysicsUtils.applyFriction(this.v, 100, 100, this.delta);
        this.setSpeed(M.clamp(this.getSpeed(), 0, 100));
        this.updateCollisions();
    }

    private updateCollisions(): void {
        let collisions = this.world.select.overlap(this.bounds, [Battle.PhysicsGroups.balls]);
        let validBalls = <Ball[]>collisions.filter(ball => ball instanceof Ball && ball.team !== this.source.team);
        if (validBalls.length === 0) return;

        let enemy = validBalls[0];

        enemy.addSlow('yarn', this.slowFactor, this.slowTime);
        this.kill();
    }

    kill(): void {
        this.world.playSound('medkitgrab');
        this.world.addWorldObject(newPuff(this.x, this.y, Battle.Layers.fx, 'small'));
        super.kill();
    }
}