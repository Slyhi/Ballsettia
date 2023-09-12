/*unfinished*/
/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class RedHerring extends OrbitEquipment {
        getName() { return 'Red Herring'; }
        getDesc() {
            return `At the start of battle, shrink thHe equipped ball and nearby allies to half of their size`;
        }

        constructor() {
            super('equipments/redherring', 'items/redherring');

            this.addAbility('onEquip', RedHerring.onEquip);
            this.addAbility('onDeath', RedHerring.onDeath);
        }

        private static onEquip(equipment: RedHerring, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE && source.state !== Ball.States.BATTLE) return;
            source.buff(0, 1);
        }

        private static onDeath(equipment: RedHerring, source: Ball, world: World, killedBy: Ball): void {
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