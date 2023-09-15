/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class StarShooter extends OrbitEquipment {
        getName() { return 'Shooting Star'; }
        getDesc() { return `On enter battle, sacrifice [gold]all of its <star>[/gold] to shoot at random enemies for [r]${this.starDamage}<sword>[/r] splash damage per [gold]1<star>[/gold]`; }

        get starDamage() { return 2; }
        get starRadius() { return 25; }
        get starSpeed() { return 500; }

        private shootTime: number;

        constructor() {
            super('equipments/shootingstar', 'items/shootingstar');

            this.preBattleAbilityInitialWaitTime = 0.5;
            this.shootTime = Ball.Random.float(0.5, 1);

            this.addAbility('onPreBattle', StarShooter.onPreBattle);
            this.addAbility('update', StarShooter.update);
        }

        private static onPreBattle(equipment: StarShooter, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE || source.level <= 1) return;
            let enemies = getEnemies(world, source);

            while (source.level > 1) {
                let target = Ball.Random.element(enemies);
                StarShooter.shootStar(equipment, source, target, world);
            }
        }

        private static update(equipment: StarShooter, source: Ball, world: World) {
            if (source.state !== Ball.States.BATTLE || source.level <= 1) return;
            let enemyBalls = getEnemies(world, source);
            let target = M.argmin(enemyBalls, ball => G.distance(source, ball));

            equipment.shootTime += equipment.delta;
            while (source.level > 1 && equipment.shootTime >= 1) {
                StarShooter.shootStar(equipment, source, target, world);
                equipment.shootTime -= 1;
            }
        }

        private static shootStar(equipment: StarShooter, source: Ball, target: Ball, world: World) {
            source.levelDown()
            let starSpeed = Ball.Random.float(equipment.starSpeed - 50, equipment.starSpeed + 50);
            let starV = target.getPosition().subtract(source).setMagnitude(starSpeed);

            world.addWorldObject(new StarBullet(source.x, source.y, starV, source, equipment.starDamage, equipment.starRadius))

            world.playSound('shoot', { humanized: false }).speed = Random.float(0.95, 1.05);
            source.didShootProjectile(1);
        }
    }
}