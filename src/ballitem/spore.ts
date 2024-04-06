namespace BallItems {
    export class Spore extends EquipmentItem {
        getName() { return 'Spore'; }
        getDesc() { return `[r]Every instance of damage received is increased by ${this.flatDamageChange}<sword>[/r]`; }
        getShopCost() { return 0; }

        constructor(x: number, y: number) {
            super(x, y, 'items/spore', 14);
        }

        flatDamageChange = 1;
    }
}