/*unfinished, editing*/
/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class IcyBlast extends Equipment {
        getName() { return 'Icy Blast'; }
        getDesc() { return `At the start of battle, [lb]freeze[/lb] and [lb]chill[/lb] nearby enemies for ${this.freezeTime} seconds`; }

        get freezeTime() { return 5; }
        get chillTime() { return 5; }
        get freezeRadius() { 
            let parent = this.getParent();
            return (!parent || parent.isInShop || parent.isInYourSquadScene) ? parent.physicalRadius-8 + 16 : 45;
        }

        constructor() {
            super({
                texture: new AnchoredTexture(Texture.filledStar(44*0.84, 44*1.16, 6, 0x00C1C1, 0.52, 0), 0.5, 0.5),
                copyFromParent: ['layer'],
                breakIcon: 'items/icyblast',
                effects: { outline: { color: 0x00FFFF } },
            });

            this.addAbility('onPreBattle', IcyBlast.onPreBattle);
        }

        postUpdate(): void {
            super.postUpdate();
            this.scale = (this.freezeRadius - 1) / 44;
            if (this.parent) World.Actions.orderWorldObjectAfter(this, this.parent);
        }

        getEquipmentTexture() {
            return AssetCache.getTexture('items/icyblast');
        }

        private static onPreBattle(equipment: IcyBlast, source: Ball, world: World) {
            IcyBlast.καιΞεχνώ(equipment, source, world);

            source.runScript(function*() {
                equipment.effects.addSilhouette.color = 0xFFFFFF;
                equipment.effects.silhouette.amount = 1;
                yield [
                    S.tween(0.2, equipment.effects.silhouette, 'amount', 1, 0),
                    S.tween(0.2, equipment, 'alpha', 1, 0, Tween.Easing.InQuad),
                    S.tween(0.2, equipment.effects.outline, 'alpha', 1, 0, Tween.Easing.InQuad),
                ];
                equipment.effects.silhouette.amount = 1;
                equipment.effects.silhouette.enabled = false;

                source.unequip();
            });
        }

        private static καιΞεχνώ(equipment: IcyBlast, source: Ball, world: World) {
            let enemyBalls = getEnemies(world, source).filter(enemy => G.distance(source, enemy) < equipment.freezeRadius + enemy.physicalRadius);
            if (enemyBalls.length === 0) return;

            for (let ball of enemyBalls) {
                ball.addFreezing(source, equipment.freezeTime, equipment.chillTime);
                world.addWorldObject(newPuff(ball.x, ball.y, Battle.Layers.fx, 'small'));
            }

            let allyBalls = getAlliesNotSelf(world, source).filter(ally => G.distance(source, ally) < equipment.freezeRadius + ally.physicalRadius);
            if (allyBalls.length === 0) return;

            for (let ball of allyBalls) {
                if (ball.isBurning()) {
                    A.filterInPlace(ball.statusEffects, e => e.type !== 'burning');
                    world.addWorldObject(newPuff(ball.x, ball.y, Battle.Layers.fx, 'small'));
                }
            }
        }
    }
}
