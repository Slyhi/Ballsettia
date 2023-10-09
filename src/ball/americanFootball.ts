namespace Balls {
    export class AmericanFootball extends Ball {
        getName(): string { return 'American Football'; }
        getDesc(): string { return `When this ball is on enemy side of the arena for [lb]${this.stayLength}s[/lb]${this.stayLength===5?' [gold](max)[/gold]':''} gain [gold]<coin>1[/gold]`; }
        getShopDmg(): number { return 1; }
        getShopHp(): number { return 3; }
        getModName(): string[] { return [ModNames.BALLSETTIA]; }

        get stayLength(): number { return Math.round(20*Math.exp(0.05-0.05*this.level) + 5); }

        private static footballRatio: number = 1.625;
        private stayTime: number = 0;

        constructor(config: Ball.Config) {
            super('balls/americanfootball', 8, config);

            this.addAbility('update', AmericanFootball.update);
        }

        postUpdate() {
            super.postUpdate();
            this.mask.texture = new AnchoredTexture(
                AmericanFootball.textureMaskForFootball(
                    this,
                    AmericanFootball.footballRatio*this.radius*this.ballScale*this.moveScale,
                    this.radius*this.ballScale*this.moveScale,
                    0xFFFFFF, 1,
                    this.state === Ball.States.BATTLE ? (M.atan2(this.v.y, this.v.x) + 90) : 0
                    ), 
                0.5, 0.5
            );
        }

        static cache_filledFootball: Dict<BasicTexture> = {};
        // Create the shape of american football
        static textureMaskForFootball(source: Ball, radiusX: number, radiusY: number, fillColor: number, fillAlpha: number = 1, angle: number = 0): BasicTexture {
            radiusY = Math.round(Math.abs(radiusY));
            angle = Math.round(M.mod(angle, 360));
            let key = `${radiusX},${radiusY},${angle}${source.state === Ball.States.BATTLE ? '': ',NONBATTLE'}`;
            if (!AmericanFootball.cache_filledFootball[key]) {
                let boundBox = Math.max(radiusY, radiusX);
                let result = new BasicTexture(boundBox*2, (source.state===Ball.States.BATTLE?boundBox:radiusY)*2, 'AmericanFootball.textureMaskForFootball');
                Draw.footballSolid(result, result.width/2, result.height/2, radiusX, radiusY, angle, { color: fillColor, alpha: fillAlpha, thickness: 0 });
                result.immutable = true;
                AmericanFootball.cache_filledFootball[key] = result;
            }
            return AmericanFootball.cache_filledFootball[key];
        }
        
        private static update(source: AmericanFootball, world: World): void {
            if (source.state !== Ball.States.BATTLE) return;
            let team = Ball.getTeamForColorAprilFools(source.team);
            if ((team === 'friend' && source.x < world.width/2) || (team === 'neutral' && source.y < world.height/2) || (team === 'enemy' && source.x > world.width/2)) return;
            source.stayTime += source.delta;
            while (source.stayTime >= source.stayLength) {
                addStartShopEffect({
                    type: 'gold',
                    gold: 1,
                    sourceSquadIndex: source.squadIndexReference,
                });

                source.flash(0xFFFFFF, 1, 0.2);
                world.playSound('mariocoin', { humanized: false });
                source.stayTime -= source.stayLength;
            }
        }
    }
}