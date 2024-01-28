namespace Balls {
    export class RadioactiveBall extends Ball {
        getName() { return 'Radioactive Ball'; }
        getDesc() { return `Prevent enemies from healing or gain health`; }
        getShopDmg() { return 1; }
        getShopHp() { return 3; }

        private aura: Sprite;

        get auraRadius() {
            if ((this.isInShop || this.isInYourSquadScene) && !this.isBeingMoved()) return 20;
            return this.physicalRadius-8 + 30 * (1 + (this.level-1)*0.3);
        }

        constructor(config: Ball.Config) {
            super('balls/radioactiveball', 8, config);

            this.aura = this.addChild(new Sprite({
                texture: 'aura',
                tint: 0xFFFF00,
                blendMode: Texture.BlendModes.ADD,
                scale: this.auraRadius / 64,
                copyFromParent: ['layer'],
            }));

            this.addAbility('update', RadioactiveBall.update);
            this.addAbility('onDeath', RadioactiveBall.onDeath);
        }

        postUpdate(): void {
            super.postUpdate();

            this.aura.alpha = M.lerp(0.8, 1.0, (Math.sin(4*this.aura.life.time) + 1)/2);
            this.aura.scale = M.lerpTime(this.aura.scale, this.auraRadius / 64, 100, this.delta);
            World.Actions.orderWorldObjectBefore(this.aura, this);
        }

        setForInShop(): void {
            this.aura.scale = this.auraRadius / 64;
        }

        private static update(source: RadioactiveBall, world: World): void {
            if (source.state !== Ball.States.BATTLE) return;
            let validBalls = getEnemies(world, source).filter(ball => G.distance(ball, source) < ball.radius + source.auraRadius);
            for (let ball of validBalls) {
                ball.addRadioactivity(0.1);
            }
        }

        static onDeath(source: RadioactiveBall, world: World, killedBy: Ball): void {
            world.addWorldObject(new Explosion(source.x, source.y, source.physicalRadius, { ally: 0, enemy: 0 }));
            world.addWorldObject(newPuff(source.x, source.y, Battle.Layers.fx, 'medium'));
            let uraniumRadius = 15 * (1 + (source.level-1)*0.3)
            for (let i = 0; i < source.level; i++) {
                world.addWorldObject(new Uranium(source.x, source.y, Ball.Random.inDisc(75, 140), source, uraniumRadius, 60));
            }
        }
    }
}