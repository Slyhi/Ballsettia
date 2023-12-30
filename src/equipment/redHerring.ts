/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class RedHerring extends OrbitEquipment {
        getName() { return 'Red Herring'; }
        getDesc() {
            return `Somes effects have 50% chance to target equipped ball instead`;
        }

        constructor() {
            super('equipments/redherring', 'items/redherring');
        }

        chanceToTauntOtherAbilities = 0.5;
    }
}