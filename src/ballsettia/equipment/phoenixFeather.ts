/// <reference path="../../equipment/orbitEquipment.ts" />

namespace Equipments {
    export class PhoenixFeather extends OrbitEquipment {
        getName() { return 'Phoenix Feather'; }
        getDesc() { return `Immune to fire\n\nOn death, light the killer on fire for [lb]${this.burnTime}s[/lb]`; }

        get burnTime() { return Math.floor(4*Math.log(this.getParentLevel()+1) - 1); }
        
        fireImmunity = true;

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