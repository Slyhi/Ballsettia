/*unfinished*/
namespace Balls {
    export class Reverser extends Ball {
        getName() { return 'Reverser'; }
        getDesc() { return `Any effect that targets this ball have [lb]${this.reversePercent}%[/lb] chance to return the effect to the sender (max [lb]60%[/lb])`; }
        getShopDmg() { return 6; }
        getShopHp() { return 9; }
        getModName() { return [ModNames.BALLSETTIA]; }

        get reversePercent() { return Math.min(10*this.level, 60); }
        get reverseChance() { return this.reversePercent/100; }

        constructor(config: Ball.Config) {
            super('balls/reverser', 8, config);

            this.addAbility('onStartShop', Powerball.onStartShop);
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