namespace BallItems {
    export class PhoenixFeather extends EquipmentItem {
        getName() { return 'Phoenix Feather'; }
        getDesc() { return `Immune to fire\n\nOn death, light the killer on fire\n\nBurning balls take [r]1<sword>/s[/r]`; }

        constructor(x: number, y: number) {
            super(x, y, 'items/phoenixfeather', 426);
        }
    }
}