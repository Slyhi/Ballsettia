/*unfinished*/
namespace BallItems {
    export class Tweezers extends BallItem {
        getName() { return 'Tweezers'; }
        getDesc() { return `Unequip equipment and put the unequipped equipment back into the shop.`; }
        getShopCost() { return 1; }
        getModName() { return [ModNames.BALLSETTIA]; }

        constructor(x: number, y: number) {
            super(x, y, 'items/tweezers');
        }

        onApplyToBall(ball: Ball): void {
            this.world.addWorldObject(new Buff(this.x, this.y, ball, { dmg: 0, hp: 1 }));
        }
    }
}