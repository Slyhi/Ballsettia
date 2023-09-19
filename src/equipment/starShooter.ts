/// <reference path="./orbitEquipment.ts" />

namespace Equipments {
    export class StarShooter extends OrbitEquipment {
        getName() { return 'Shooting Star'; }
        getDesc() { return `On enter battle, sacrifice [gold]all of its <star>[/gold] to shoot them at random enemies for [r]${this.starDamage}<sword>[/r] splash damage for each [gold]<star>[/gold] sacrifice`; }

        get starDamage() { return 2; }
        get starRadius() { return 25; }

        private shootTime: number;

        constructor() {
            super('equipments/starshooter', 'items/starshooter');

            this.preBattleAbilityInitialWaitTime = 0.5;
            this.shootTime = Ball.Random.float(0.5, 1);

            this.addAbility('onPreBattle', StarShooter.onPreBattle);
            this.addAbility('update', StarShooter.update);
        }

        private static onPreBattle(equipment: StarShooter, source: Ball, world: World) {
            if (source.state !== Ball.States.PRE_BATTLE || source.level <= 1) return;
            let enemies = getEnemies(world, source);
            let speed = 200;

            while (source.level > 1) {
                let target = Ball.Random.element(enemies);
                StarShooter.shootStar(equipment, source, target, world, speed);
            }
        }

        private static update(equipment: StarShooter, source: Ball, world: World) {
            if (source.state !== Ball.States.BATTLE || source.level <= 1) return;
            let enemyBalls = getEnemies(world, source);
            let target = M.argmin(enemyBalls, ball => G.distance(source, ball));
            let speed = 500;

            equipment.shootTime += equipment.delta;
            while (source.level > 1 && equipment.shootTime >= 1) {
                StarShooter.shootStar(equipment, source, target, world, speed);
                equipment.shootTime -= 1;
            }
        }

        private static shootStar(equipment: StarShooter, source: Ball, target: Ball, world: World, speed: number) {
            source.levelDown()
            let starSpeed = Ball.Random.float(speed - 50, speed + 50);
            let starV = target.getPosition().subtract(source).setMagnitude(starSpeed);

            world.addWorldObject(new StarBullet(source.x, source.y, starV, source, equipment.starDamage, equipment.starRadius))

            world.playSound('shoot', { humanized: false }).speed = Random.float(0.95, 1.05);
            source.didShootProjectile(1);
        }
    }
}