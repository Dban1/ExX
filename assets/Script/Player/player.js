const import_fsm = require('player_fsm');
const Global = require('./../Global');
const playerControlEnum = require('./player_control_enum').player_control_enum;
const LEFT_DIR = 1;
const RIGHT_DIR = 2;
const EventType = {
    ONJOIN: 1,
    PLAYERCONTROL: 2,
}

export var PlayerScript = cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 260,
        gravity: -2600,
        acceleration: 3500,
        jumpSpeed: 200,
        drag: 2000,
        isOwnPlayer: false,
        playerId: -1,
    },

    getVelocity: function () {
        return this.node.getComponent(cc.RigidBody).linearVelocity;
    },

    setVelocity: function (x, y) {
        this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(x, y);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Set local input listeners for player
        if (this.Player) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }

        this.isOnFloor = false;
        this._moveFlag = 0;
        this.isJump = false;
        this.touchingCount = 0;
        this.usingSkill = 0;

        this.body = this.node.getComponent(cc.RigidBody);
        this.animation = this.node.getChildByName("anim").getComponent(cc.Animation);
        this.animState = this.animation.getAnimationState("player_attack");

        this.skillAnim = this.node.getChildByName("skill").getComponent(cc.Animation);
        this.skillAnimState = this.skillAnim.getAnimationState("skill_brandish");
        this.skillSound = this.node.getChildByName("sound").getComponent(cc.AudioSource).clip;

        this.fsm = new import_fsm.player_fsm(this);
        this.LBC = Global.LBC;
    },

    onKeyDown: function (event) {
        if (this.playerId != this.LBC.myActor().actorNr) {return;}
        let controlEnum = playerControlEnum.NEUTRAL;
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag |= RIGHT_DIR;
                controlEnum = playerControlEnum.RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag |= LEFT_DIR;
                controlEnum = playerControlEnum.LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                if (this.isOnFloor) {this.isJump = true};
                controlEnum = playerControlEnum.JUMP;
                break;
            case cc.macro.KEY.c:
                this.usingSkill = 1;
                controlEnum = playerControlEnum.ATTACK;
                break;
        }
        this.LBC.myActor().raiseEvent(EventType.PLAYERCONTROL, {controlEnum: controlEnum, id: this.playerId, keyDown: 1}, Photon.LoadBalancing.Constants.ReceiverGroup.Others);
        console.log("raised event from playerId22: "+this.playerId);
    },

    receiveInput: function(event) {
        switch(event.controlEnum) {
            case playerControlEnum.RIGHT_DIR:
                if (event.keyDown) {
                    this._moveFlag |= RIGHT_DIR;
                }
                else {this._moveFlag &= ~RIGHT_DIR;}
                break;
            case playerControlEnum.LEFT_DIR:
                if (event.keyDown) {this._moveFlag |= LEFT_DIR;}
                else {this._moveFlag &= ~LEFT_DIR;}
                break;
            case playerControlEnum.JUMP:
                if (event.keyDown) {
                    if (this.isOnFloor) {this.isJump = true};
                } else {
                    this.isJump = false;
                }
                break;
            case playerControlEnum.ATTACK:
                this.usingSkill = 1;
                break;
        }
    },

    onKeyUp: function (event) {
        if (this.playerId != this.LBC.myActor().actorNr) {return;}
        let controlEnum = playerControlEnum.NEUTRAL;
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag &= ~RIGHT_DIR;
                controlEnum = playerControlEnum.RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag &= ~LEFT_DIR;
                controlEnum = playerControlEnum.LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                this.isJump = false;
                controlEnum = playerControlEnum.JUMP;
                break;
        }
        this.LBC.myActor().raiseEvent(EventType.PLAYERCONTROL, {controlEnum: controlEnum, id: this.playerId, keyDown: 0}, Photon.LoadBalancing.Constants.ReceiverGroup.Others);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        var normal = contact.getManifold().localNormal;
        if(normal.x == 0) {
            this.isOnFloor = true;
        }
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        // if (--this.touchingCount == 0) {this.isOnFloor = false};
        let normal = contact.getManifold().localNormal;
        if(normal.x == 0) {
            this.isOnFloor = false;
        }
    },

    start() {

    },

    lerp: function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },

    update(dt) {
        this.fsm.process(this, dt);
    },
});
