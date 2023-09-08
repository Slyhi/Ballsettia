namespace BallItems {
    export class GnomeDustPouch extends EquipmentItem {
        getName() { return 'Gnome Dust Pouch'; }
        getDesc() {
            return `At the start of battle, shrink the equipped ball and nearby allies to half of their size`;
        }

        constructor(x: number, y: number) {
            super(x, y, 'items/gnomedustpouch', 421);
        }
    }
}