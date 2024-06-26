namespace Balls {
    export class Baseball extends Ball {
        getName(): string { return 'Baseball'; }
        getDesc(): string { return `When this ball circles half of the arena, gain [gold]<coin>1[/gold] (max [lb]${this.maxGold}[/lb])`; }
        getShopDmg(): number { return 1; }
        getShopHp(): number { return 3; }
        getCredits(): string[] { return [CreditsNames.EVERYONE]; }
        getModName(): string[] { return [ModNames.BALLSETTIA]; }

        get maxGold(): number { return 1 + this.level; }

        private sumAngle: number = 0;
        private storeAngle: number;
        private currentGold: number = 0;

        constructor(config: Ball.Config) {
            super('balls/baseball', 8, config);

            this.addAbility('update', Baseball.update);
        }
        
        private static update(source: Baseball, world: World): void {
            if (source.state !== Ball.States.BATTLE || source.currentGold >= source.maxGold) return;

            let newAngle: number = M.mod(M.atan2(world.height/2 - source.y, world.width/2 - source.x), 360) + M.angleDiff(5,5);

            if (!source.storeAngle) { source.storeAngle = newAngle; }

            source.sumAngle += M.mod((newAngle - source.storeAngle + 180), 360) - 180;
            source.storeAngle = newAngle;
            
            while (source.sumAngle >= 180 || source.sumAngle <= -180 ) {
                
                if (source.sumAngle >= 180) source.sumAngle -= 180;
                else if (source.sumAngle <= -180) source.sumAngle += 180;

                if (source.shouldActivateAbilityTwice()) {
                    source.doAfterTime(0.5, () => Baseball.gainGold(source, world));
                }
            }

            if (source.currentGold >= source.maxGold) {
                world.addWorldObject(newPuff(source.x, source.y, Battle.Layers.fx, 'medium'));
                source.changeBaseTextureAndRadius('balls/baseballspent', source.radius);
            }
        }

        private static gainGold(source: Baseball, world: World) {
            if (source.currentGold >= source.maxGold) return;
            addStartShopEffect({
                type: 'gold',
                gold: 1,
                sourceSquadIndex: source.squadIndexReference,
            });

            source.currentGold++;
            source.flash(0xFFFFFF, 1, 0.2);
            world.playSound('buyball', { humanized: false });
        }
    }
}