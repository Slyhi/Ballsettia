// Uranium fever has done and got me down
class Uranium extends Sprite {
    private source: Ball;
    private aura: Sprite;
    private auraRadius: number;
    private lifeTime: number;

    constructor(x: number, y: number, v: Vector2, source: Ball, auraRadius: number, lifeTime: number) {
        super({
            x, y,
            texture: 'slyhi/uranium',
            animations: [
                Animations.fromTextureList({ name: 'blink', textureRoot: 'slyhi/uranium', textures: [0, 1], frameRate: 8, count: Infinity }),
            ],
            effects: { post: { filters: [new BallTeamColorFilter(Ball.getTeamColor(source.team))] }},
            layer: Battle.Layers.onground,
            v: v,
            physicsGroup: Battle.PhysicsGroups.droppables,
            bounds: new CircleBounds(0, 0, 5),
        });

        this.source = source;
        this.auraRadius = auraRadius;
        this.aura = this.addChild(new Sprite({
            texture: 'aura',
            tint: 0xEEFF00,
            blendMode: Texture.BlendModes.ADD,
            scale: this.auraRadius / 64,
            copyFromParent: ['layer'],
        }));
        this.lifeTime = lifeTime;
    }

    postUpdate(): void {
        this.aura.alpha = M.lerp(0.8, 1.0, (Math.sin(4*this.aura.life.time) + 1)/2);
        this.aura.scale = M.lerpTime(this.aura.scale, this.auraRadius / 64, 100, this.delta);
        World.Actions.orderWorldObjectBefore(this.aura, this);
    }

    update(): void {
        super.update();
        if (this.life.time > this.lifeTime) this.kill();
        PhysicsUtils.applyFriction(this.v, 100, 100, this.delta);
        this.setSpeed(M.clamp(this.getSpeed(), 0, 100));
        let validBalls = getEnemies(this.source.world, this.source).filter(ball => G.distance(ball, this.source) < this.auraRadius);
        for (let ball of validBalls) {
            ball.addRadioactivity(0.1);
        }
    }
}