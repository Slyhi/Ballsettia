namespace Balls {
    export class PresentBall extends Ball {
        getName() { return 'Present Ball'; }
        getDesc() { return `[gold]Permanently[/gold] copy the type of the closest ally if it survives a battle\n\n[r]If not,[/r] drop a candycane and [r]permanently remove this ball from your squad[/r]`; }
        getShopDmg() { return 1; }
        getShopHp() { return 6; }
        getShopRelativePosition() { return vec2(0, 2); }
        getModName() { return [ModNames.BALLSETTIA]; }

        private bow: Sprite;
        private currentTarget: Ball;
        private renderFacade: Ball;

        constructor(config: Ball.Config) {
            super('balls/presentball', 8, config);

            this.bow = this.addChild(new Sprite({
                texture: 'slyhi/presentbow',
                copyFromParent: ['layer'],
            }));

            this.addAbility('onDeath', PresentBall.onDeath, { nullifyable: false, canActivateTwice: false });
            this.addAbility('onStartShop', PresentBall.onStartShop, { nullifyable: false, canActivateTwice: false });
        }

        update() {
            super.update();

            this.updateClosestTarget();
            this.updateRenderFacade();

            if (this.renderFacade) {
                this.setBallScale(this.renderFacade.radius / this.radius * this.renderFacade.ballScale);
                this.renderFacade.setMoveScale(this.moveScale);
            } else {
                this.setBallScale(1);
            }
        }

        updateClosestTarget() {
            if (!this.alive) return;
            if (this.state !== Ball.States.PREP) return;

            let closestAlly = PresentBall.getClosestAlly(this, this.world);
            if (!closestAlly) {
                this.currentTarget = undefined;
                return;
            }

            let ballMover = this.world.select.type(BallMover, false);
            if (ballMover && ballMover.movingThing === this) {
                return;
            }

            this.currentTarget = closestAlly;
        }

        updateRenderFacade() {
            if (!this.currentTarget) {
                this.renderFacade = undefined;
                return;
            }

            if (!this.renderFacade || this.renderFacade.properties.type !== this.currentTarget.properties.type || this.renderFacade.level !== this.level) {
                this.renderFacade = squadBallToWorldBall({
                    x: 0, y: 0,
                    properties: {
                        type: this.currentTarget.properties.type,
                        damage: this.dmg,
                        health: this.hp,
                        equipment: -1,
                        level: this.level,
                        metadata: {},
                    }
                }, undefined, -1, this.team);

                if (this.renderFacade.properties.type === 11) {
                    this.renderFacade.changeBaseTextureAndRadius('mimictextures/turret', this.renderFacade.radius);
                } else if (this.renderFacade.properties.type === 53) {
                    this.renderFacade.changeBaseTextureAndRadius('mimictextures/cannon', this.renderFacade.radius);
                } else if (this.renderFacade.properties.type === 109) {
                    this.renderFacade.changeBaseTextureAndRadius('mimictextures/boomer', this.renderFacade.radius);
                } else if (this.renderFacade.properties.type === 130) {
                    this.renderFacade.changeBaseTextureAndRadius('mimictextures/scrapcannon', this.renderFacade.radius);
                }
            }

            if (this.renderFacade) {
                this.renderFacade.alpha = M.lerp(0.5, 0.8, Tween.Easing.OscillateSine(1)(this.life.time));
            }
        }

        render(texture: Texture, x: number, y: number) {
            super.render(texture, x, y);

            if (this.renderFacade) {
                this.renderFacade.render(texture, x, y);
            }
        }

        postUpdate() {
            super.postUpdate();
            this.bow.alpha = this.alpha;
            this.bow.scale = this.ballScale * this.moveScale;
            this.bow.effects.outline.color = this.effects.outline.color;
            this.bow.effects.outline.enabled = this.effects.outline.enabled;
            World.Actions.orderWorldObjectAfter(this.bow, this);
        }

        private static onDeath(source: PresentBall, world: World, killedBy: Ball) {
            world.addWorldObject(new Explosion(source.x, source.y, source.physicalRadius, { ally: 0, enemy: 0 }));
            world.addWorldObject(newXmasPuff(source.x, source.y, Battle.Layers.fx, 'medium'));
            world.playSound('popper');

            for (let i = 0; i < source.level; i++) {
                world.addWorldObject(new Candycane(source.x, source.y, Ball.Random.inDisc(60, 120), source, 1));
            }
            if (!source.squad) return;
            ShopActions.removeBallFromSquad(source);
        }

        private static onStartShop(source: PresentBall, world: World) {
            PresentBall.copyClosestAlly(source, world);
        }

        private static copyClosestAlly(source: PresentBall, world: World) {
            let closestAlly = PresentBall.getClosestAlly(source, world);
            if (!closestAlly) {
                source.currentTarget = undefined;
                return;
            }

            let metadata = O.deepClone(source.properties.metadata);
            metadata.obtainedWithBall = 'bows';

            let newBall = world.addWorldObject( squadBallToWorldBall({
                x: source.x,
                y: source.y,
                properties: {
                    type: closestAlly.properties.type,
                    damage: source.dmg,
                    health: source.hp,
                    equipment: source.equipment ? source.equipment.equipmentType : -1,
                    level: source.level,
                    metadata: metadata,
                },
            }, source.squad, source.squadIndexReference, source.team, false, false));

            newBall.timesKilledEnemy = source.timesKilledEnemy;
            newBall.showAllStats();

            source.squad.balls.push({
                x: newBall.x,
                y: newBall.y,
                properties: newBall.properties,
            });

            world.addWorldObject(newXmasPuff(newBall.x, newBall.y, Battle.Layers.fx, 'medium'));
            world.playSound('confetti');
            
            ShopActions.removeBallFromSquad(source);
            source.removeFromWorld();
        }

        private static getClosestAlly(source: PresentBall, world: World) {
            if (source.isInShop || source.isInYourSquadScene) return undefined;
            let validBalls = getAlliesNotSelf(world, source).filter(ball =>
                !ball.isInShop && !ball.isInYourSquadScene && !(ball instanceof Dove) && !(ball instanceof PresentBall));
            return M.argmin(validBalls, ball => G.distance(source, ball));
        }
    }
}