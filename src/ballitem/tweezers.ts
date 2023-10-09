namespace BallItems {
    export class Tweezers extends BallItem {
        getName() { return 'Tweezers'; }
        getDesc() { return `Unequip equipment and put it back into the shop`; }
        getShopCost() { return 1; }
        getModName() { return [ModNames.BALLSETTIA]; }
        
        constructor(x: number, y: number) {
            super(x, y, 'items/tweezers');
        }

        canApplyToBall(ball: Ball): boolean {
            return !!ball.equipment && ball.equipment.removable;
        }

        onApplyToBall(ball: Ball): void {
            if (getItemTypeForEquipmentType(ball.equipment.equipmentType) === -1) {
                ball.breakEquipment();
                return;
            }
            let itemID = getItemTypeForEquipmentType(ball.equipment.equipmentType);
            let itemThing: Shop.StockThing = {
                type: 'item',
                itemType: itemID,
                frozen: true,
            }
            Shop.addOneThing(ball.world, itemThing, this.shopSpot, true);
            ball.world.addWorldObject(newPuff(ball.x, ball.y, Battle.Layers.fx, 'small'));
            if (ball.equipment.equipmentType === 22) ball.equip(21);
            else if (ball.equipment.equipmentType === 23) ball.equip(22);
            else ball.breakEquipment();
        }
    }
}