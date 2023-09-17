/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class Latte extends OrbitEquipment {
        getName() { return 'Latte'; }
        getDesc() { return `On Enter Battle, leave a pool of latte which increase balls speed in latte art direction`; }

        get latteSpeed() { return 4; }
        get latteRadius() { return 35; }
        get latteTime() { return 35; }

        private isUsable: boolean

        constructor() {
            super('equipments/latte', 'items/latte');

            this.isUsable = true
            this.addAbility('update', Latte.update);
        }

        onAdd(): void {
            super.onAdd();
            this.addChild(new AbilityRadius(this.getParent(), () => this.latteRadius, 0x8F563B, 0x78452D, 0.6));
        }

        private static update(equipment: Latte, source: Ball, world: World) {
            if (source.v.magnitude === 0 || source.state !== Ball.States.BATTLE) return;
            if (equipment.isUsable === false) return;
            Latte.createPool(equipment, source, source.x, source.y, source.v.clone(), world);
            equipment.isUsable = false
        }

        private static createPool(equipment: Latte, source: Ball, x: number, y: number, v: Vector2, world: World) {
            world.addWorldObject(new LattePool(x, y, source, v.normalize(), equipment.latteSpeed, equipment.latteTime, equipment.latteRadius));
            world.playSound('slosh');
        }
    }
}