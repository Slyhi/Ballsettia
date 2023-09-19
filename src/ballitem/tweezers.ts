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
            if (!ball.equipment) return false;
            return getItemTypeForEquipmentType(ball.equipment.equipmentType) === -1 ? false : true;
        }

        onApplyToBall(ball: Ball): void {
            let itemID = getItemTypeForEquipmentType(ball.equipment.equipmentType);
            let itemThing: Shop.StockThing = {
                type: 'item',
                itemType: itemID,
                frozen: false,
            }
            Shop.addOneThing(ball.world, itemThing, this.shopSpot, true);
            ball.world.addWorldObject(newPuff(ball.x, ball.y, Battle.Layers.fx, 'small'));
            ball.breakEquipment();
        }
    }
}