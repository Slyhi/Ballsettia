namespace BallItems {
    export class RedHerring extends EquipmentItem {
        getName() { return 'Red Herring'; }
        getDesc() { return `All effects have 50% chance to target equipped ball instead`; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/redherring', 423);
        }
    }
}