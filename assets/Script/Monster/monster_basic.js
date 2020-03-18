/**
 * Monster_basic traits:
 * - Non-aggressive
 * - Non-vengeance
 * - Non-skilled
 */
const StateMachine = require("./../state-machine");
const StateMachineHistory = require("./../state-machine-history");
const Random = require("Random");
const LEFT_DIR = 1;
const RIGHT_DIR = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        walkAnim: cc.AnimationClip,
        idleAnim: cc.AnimationClip,
        hitAnim: cc.AnimationClip,
        dieAnim: cc.AnimationClip,
        jumpAnim: cc.AnimationClip,

        hasJump: cc.Boolean,

        maxSpeed: 50,
        gravity: -1000,
        acceleration: 3500,
        jumpSpeed: 50,
        drag: 100,

        hp: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isOnFloor = false;
        this._moveFlag = 0;
        this.isJump = false;
        this.touchingCount = 0;
        this.usingSkill = 0;
        this.randomGen = new Random(this.node.x);
        this.randomTime = 2;
        this.hit = 0;
        this.prevState = 'idle';

        this.body = this.node.getComponent(cc.RigidBody);
        this.animation = this.node.getChildByName("anim").getComponent(cc.Animation);
        this.animState = this.animation.getAnimationState(this.idleAnim);
        
        this.fsm = this.createFsm(this)

    },

    createFsm: function(noder) {
        var fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'walk', from: ['idle', 'hit'], to: 'walk' },
                { name: 'idle', from: ['walk', 'hit'], to: 'idle' },
                { name: 'hit', from: ['walk', 'idle', 'jump'], to: 'hit'}
            ],
            plugins: [
                new StateMachineHistory()
            ],
            methods: {
                onWalk: function () { noder.animState = noder.animation.play(noder.walkAnim.name);},
                onIdle: function () { noder.animState = noder.animation.play(noder.idleAnim.name);},
                onHit: function() { noder.animState = noder.animation.play(noder.hitAnim.name); noder.getHit();}
            }
        });
        return fsm;
    },
    randomDir: function() {
        this._moveFlag = Math.floor(Math.random() * 3);
        this.randomTime = 1 + this.randomGen.nextFloat() * 2;
    },
    
    process: function(dt) {
        var speed = this.body.linearVelocity;
        switch (this.fsm.state) {
            case 'idle': {
                if (this.hit > 0) {
                    this.fsm.hit();
                    break;
                }
                if (this._moveFlag === LEFT_DIR) {
                    if (this.node.scaleX < 0) {
                        this.node.scaleX *= -1;
                    }
                    this.fsm.walk();
                    break;
                } else if (this._moveFlag === RIGHT_DIR) {
                    if (this.node.scaleX > 0) {
                        this.node.scaleX *= -1;
                    }
                    this.fsm.walk();
                    break;
                }
                if(speed.x != 0) {
                    var d = this.drag * dt;
                    if(Math.abs(speed.x) <= d) {
                        speed.x = 0;
                    } else {
                        speed.x -= speed.x > 0 ? d : -d;
                    }
                }
                this.body.linearVelocity = speed;
                break;
            }
            case 'walk': {
                if (this.hit > 0) {
                    this.prevState = this.fsm.state;
                    this.fsm.hit();
                    break;
                }
                if (this._moveFlag === LEFT_DIR) {
                    if (this.node.scaleX < 0) {
                        this.node.scaleX *= -1;
                    }
                    speed.x -= this.acceleration * dt;
                    if (speed.x < -this.maxSpeed) {
                        speed.x = -this.maxSpeed;
                    }
                } else if (this._moveFlag === RIGHT_DIR) {
                    if (this.node.scaleX > 0) {
                        this.node.scaleX *= -1;
                    }
                    speed.x += this.acceleration * dt;
                    if(speed.x > this.maxSpeed) {
                        speed.x = this.maxSpeed;
                    }
                } else {
                    this.fsm.idle();
                }
                this.body.linearVelocity = speed;
                break;
            }
            case 'jump': {
                if (this.hit) {
                    this.fsm.hit();
                    break;
                }
                if (this._moveFlag === LEFT_DIR) {
                    if (this.node.scaleX < 0) {
                        this.node.scaleX *= -1;
                    }
                    speed.x -= this.acceleration * dt * 0.2;
                    if (speed.x < -this.maxSpeed) {
                        speed.x = -this.maxSpeed;
                    }
                } else if (this._moveFlag === RIGHT_DIR) {
                    speed.x += this.acceleration * dt * 0.2;
                    if (this.node.scaleX > 0) {
                        this.node.scaleX *= -1;
                    }
                    if (speed.x > this.maxSpeed) {
                        speed.x = this.maxSpeed;
                    }
                }
                this.body.linearVelocity = speed;
                if (this.isOnFloor && this.isJump) {
                    speed.y = 300+ this.jumpSpeed;
                    this.body.linearVelocity = speed;
                    this.isJump = false;
                    break;
                }
                if (this.isOnFloor) {
                    if (this._moveFlag === 0) {
                        this.fsm.idle();
                    } else {
                        this.fsm.walk();
                    }    
                }
                break;
            }
            case 'hit': {
                break;
            }
        }
    },

    getHit: function() {
        this.randomTime = 0.4;
        var speed = this.body.linearVelocity;
        if (this.hit &= RIGHT_DIR) {
            if (this.node.scaleX < 0) {
                this.node.scaleX *= -1;
            }
            speed.x = 100;
            speed.y = 100;
        } else {
            if (this.node.scaleX > 0) {
                this.node.scaleX *= -1;
            }
            speed.x = -100;
            speed.y = 100;
        }
        this.body.linearVelocity = speed;
        return;
    },

    update(dt) {
        this.process(dt);
        this.randomTime -= dt;
        if (this.randomTime <= 0 ) {
            switch(this.fsm.state) {
            case 'hit':
                this.hit = 0;
                this.fsm.historyBack();
                break;
            default:
                this.randomDir();
                break;
            }
        }
    }
});
