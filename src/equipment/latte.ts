/*unfinished*/
/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class Latte extends OrbitEquipment {
        getName() { return 'Latte'; }
        getDesc() {
            return `At the start of battle, shrink thHe equipped ball and nearby allies to half of their size`;
        }

        constructor() {
            super('equipments/latte', 'items/latte');

            this.addAbility('onEquip', Latte.onEquip);
            this.addAbility('onDeath', Latte.onDeath);
        }

        private static onEquip(equipment: Latte, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE && source.state !== Ball.States.BATTLE) return;
            source.buff(0, 1);
        }

        private static onDeath(equipment: Latte, source: Ball, world: World, killedBy: Ball): void {
            if (source.team !== 'friend') return;
            if (!youArePlaying(world)) return;
            if (source.squadIndexReference < 0) return;
            if (hasStartShopEffect('buff', source.squadIndexReference)) return;

            addStartShopEffect({
                type: 'buff',
                sourceSquadIndex: source.squadIndexReference,
                health: 1,
                damage: 0,
            });
        }
    }
}