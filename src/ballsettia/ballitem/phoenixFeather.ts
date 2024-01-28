namespace BallItems {
    export class PhoenixFeather extends EquipmentItem {
        getName() { return 'Phoenix Feather'; }
        getDesc() { return `Immune to fire\n\nOn death, light the killer on fire\n\nGain more burntime for each [gold]<star>[/gold] on the equipped ball`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/phoenixfeather', 426);
        }
    }
}