namespace BallItems {
    export class Infection extends EquipmentItem {
        getName() { return 'Infection'; }
        getDesc() { return `Summons a ${buffText(1, 2)} Skeleton on death`; }
        getShopCost() { return 0; }

        constructor(x: number, y: number) {
            super(x, y, 'items/infection', 31);
        }
    }
}