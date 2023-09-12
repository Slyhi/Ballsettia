namespace BallItems {
    export class Spore extends EquipmentItem {
        getName() { return 'Spore'; }
        getDesc() { return `[r]Every instance of damage received is increased by ${this.flatDamageChange}<sword>[/r]`; }

        constructor(x: number, y: number) {
            super(x, y, 'items/spore', 419);
        }

        flatDamageChange = 1;
    }
}