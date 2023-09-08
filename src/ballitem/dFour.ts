namespace BallItems {
    export class DFour extends EquipmentItem {
        getName() { return 'd4'; }
        getDesc() {
            let PLAY = `${GAME_MODE === 'vs' || GAME_MODE === 'spectate' ? 'LOCK IN' : 'PLAY'}`;
            return `On ${PLAY}, permanently gain/reduce status from ${buffText(-2, -2)} to ${buffText(2, 2)} randomly`;
        }

        constructor(x: number, y: number) {
            super(x, y, 'items/dfour', 420);
        }

        canApplyToBall(ball: Ball): boolean {
            return !ball.isInShop;
        }
    }
}