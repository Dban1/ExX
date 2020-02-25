const StateMachine = require('./../state-machine');
const LEFT_DIR = 1;
const RIGHT_DIR = 2;

exports.player_fsm = function(noder) {
    console.log("creating");
    this.fsm = new StateMachine({
        init: 'idle',
        transitions: [
            { name: 'walk', from: 'idle', to: 'walk' },
            { name: 'walk', from: 'jump', to: 'walk' },
            { name: 'jump', from: 'idle', to: 'jump' },
            { name: 'jump', from: 'walk', to: 'jump' },
            { name: 'idle', from: 'walk', to: 'idle' },
            { name: 'idle', from: 'jump', to: 'idle' }
        ],
        methods: {
            onWalk: function () { noder.animState = noder.animation.play("player_walk"); },
            onJump: function () { noder.animState = noder.animation.play("player_jump"); },
            onIdle: function () { noder.animState = noder.animation.play("player_stand"); }
        }
    }),

    this.process = function(ref, dt) {
        var speed = ref.body.linearVelocity;
        switch (this.fsm.state) {
            case 'idle': {
                if (!ref.isOnFloor || ref.isJump) {
                    this.fsm.jump();
                    break;
                }
                if (ref._moveFlag === LEFT_DIR) {
                    if (ref.node.scaleX < 0) {
                        ref.node.scaleX *= -1;
                    }
                    this.fsm.walk();
                    break;
                } else if (ref._moveFlag === RIGHT_DIR) {
                    if (ref.node.scaleX > 0) {
                        ref.node.scaleX *= -1;
                    }
                    console.log("right yose");
                    this.fsm.walk();
                    break;
                }
                if(speed.x != 0) {
                    var d = ref.drag * dt;
                    if(Math.abs(speed.x) <= d) {
                        speed.x = 0;
                    } else {
                        speed.x -= speed.x > 0 ? d : -d;
                    }
                }
                ref.body.linearVelocity = speed;
                break;
            }
            case 'walk': {
                if (!ref.isOnFloor || ref.isJump) {
                    this.fsm.jump();
                    break;
                }
                if (ref._moveFlag === LEFT_DIR) {
                    if (ref.node.scaleX < 0) {
                        ref.node.scaleX *= -1;
                    }
                    speed.x -= ref.acceleration * dt;
                    if (speed.x < -ref.maxSpeed) {
                        speed.x = -ref.maxSpeed;
                    }
                } else if (ref._moveFlag === RIGHT_DIR) {
                    if (ref.node.scaleX > 0) {
                        ref.node.scaleX *= -1;
                    }
                    speed.x += ref.acceleration * dt;
                    if(speed.x > ref.maxSpeed) {
                        speed.x = ref.maxSpeed;
                    }
                } else {
                    if(speed.x != 0) {
                        var d = ref.drag * dt;
                        if(Math.abs(speed.x) <= d) {
                            speed.x = 0;
                            if (ref.isOnFloor) {
                                this.fsm.idle();
                            }
                        } else {
                            speed.x -= speed.x > 0 ? d : -d;
                        }
                    }
                }
                ref.body.linearVelocity = speed;
                break;
            }
            case 'jump': {
                if (ref._moveFlag === LEFT_DIR) {
                    if (ref.node.scaleX < 0) {
                        ref.node.scaleX *= -1;
                    }
                    speed.x -= ref.acceleration * dt * 0.2;
                    if (speed.x < -ref.maxSpeed) {
                        speed.x = -ref.maxSpeed;
                    }
                } else if (ref._moveFlag === RIGHT_DIR) {
                    speed.x += ref.acceleration * dt * 0.2;
                    if (ref.node.scaleX > 0) {
                        ref.node.scaleX *= -1;
                    }
                    if (speed.x > ref.maxSpeed) {
                        speed.x = ref.maxSpeed;
                    }
                }
                ref.body.linearVelocity = speed;
                if (ref.isOnFloor && ref.isJump) {
                    speed.y = 300+ ref.jumpSpeed;
                    ref.body.linearVelocity = speed;
                    ref.isJump = false;
                    break;
                }
                if (ref.isOnFloor) {
                    if (ref._moveFlag === 0) {
                        this.fsm.idle();
                    } else {
                        this.fsm.walk();
                    }    
                }
                break;
            }
        }
    };
}

