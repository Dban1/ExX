const import_fsm = require('player_fsm');
const LEFT_DIR = 1;
const RIGHT_DIR = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 350,
        gravity: -1000,
        acceleration: 3500,
        jumpSpeed: 50,
        drag: 100
    },

    getVelocity: function () {
        return this.node.getComponent(cc.RigidBody).linearVelocity;
    },

    setVelocity: function (x, y) {
        this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(x, y);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.isOnFloor = false;
        this._moveFlag = 0;
        this.isJump = false;
        this.touchingCount = 0;

        this.body = this.node.getComponent(cc.RigidBody);
        this.animation = this.node.getChildByName("anim").getComponent(cc.Animation);
        this.animState = this.animation.getAnimationState("player_attack");

        this.fsm = new import_fsm.player_fsm(this);
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag |= RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag |= LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                if (this.isOnFloor) {this.isJump = true};
                break;
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("contact");
        this.touchingCount++;
        this.isOnFloor = true;
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        console.log("left contact");
        if (--this.touchingCount == 0) {this.isOnFloor = false};
    },

    onKeyUp: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag &= ~RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag &= ~LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                this.isJump = false;
                break;
        }
        console.log(event.keyCode + " up");
    },

    start() {

    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },

    update(dt) {
        var speed = this.body.linearVelocity;
        this.fsm.process(this, dt);
    },
});
