/*unfinished*/
namespace Balls {
    export class AmericanFootball extends Ball {
        getName() { return 'American Football'; }
        getDesc() { return `Do nothing, for now ;)`; }
        getShopDmg() { return 1; }
        getShopHp() { return 3; }
        getModName() { return [ModNames.BALLSETTIA]; }

        private footballCurve: Sprite;

        constructor(config: Ball.Config) {
            super('balls/footballcurve', 8, config);
            
            this.footballCurve = this.addChild(new Sprite({
                texture: 'slyhi/footballcurve',
                tint: Ball.getTeamColor(config.team),
                copyFromParent: ['layer'],
            }));

            this.addAbility('onStartShop', Powerball.onStartShop);
        }

        postUpdate() {
            super.postUpdate();
            this.footballCurve.alpha = this.alpha;
            this.footballCurve.scale = this.ballScale * this.moveScale;
            this.footballCurve.angle = this.angle;
            this.footballCurve.effects.outline.color = this.effects.outline.color;
            this.footballCurve.effects.outline.enabled = this.effects.outline.enabled;
            World.Actions.orderWorldObjectAfter(this.footballCurve, this);
        }

        static onStartShop(source: Ball, world: World) {
            addStartShopEffect({
                type: 'gold',
                sourceSquadIndex: source.squadIndexReference,
                gold: Powerball.getGoldGain(source),
            });
        }
    }
}