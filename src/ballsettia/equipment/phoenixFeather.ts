/// <reference path="../../equipment/orbitEquipment.ts" />

namespace Equipments {
    export class PhoenixFeather extends OrbitEquipment {
        getName() { return 'Phoenix Feather'; }
        getDesc() { return `Take 50% less damage from the burning or chilling effect and burn the killer for [lb]${this.burnTime}s[/lb] on death`; }
        get burnTime() { return this.getParentLevel(); }
        
        BurnChillReduction = true;

        constructor() {
            super('equipments/phoenixfeather', 'items/phoenixfeather')

            this.addAbility('onDeath', PhoenixFeather.onDeath);
        }

        private static onDeath(equipment: PhoenixFeather, source: Ball, world: World, killedBy: Ball): void {
            killedBy.addBurning(source, equipment.burnTime);
            world.addWorldObject(newPuff(killedBy.x, killedBy.y, Battle.Layers.fx, 'small'));
        }

        private getParentLevel() {
            return this.getParent()?.level ?? 1;
        }
    }
}