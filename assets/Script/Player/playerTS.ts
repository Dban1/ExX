import import_fsm = require('./player_fsm');
import Global = require('./../Global');
import player_control_enum = require('./player_control_enum');

const LEFT_DIR = 1;
const RIGHT_DIR = 2;
const EventType = {
    ONJOIN: 1,
    PLAYERCONTROL: 2,
    SPAWNPLAYER: 3,
    SYNCPLAYER: 4,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property
    maxSpeed: number = 260;
    
    @property
    gravity: number = -2600;
    
    @property
    acceleration: number = 3500;
    
    @property
    jumpSpeed: number = 200;
    
    @property
    drag: number = 2000;

    @property
    isOwnPlayer: boolean = false;
    
    @property
    playerId: number = -1;
    
    isOnFloor: boolean;
    _moveFlag: number;
    isJump: boolean;
    touchingCount: number;
    usingSkill: number;
    body: cc.RigidBody;
    animation: cc.Animation;
    animState: cc.AnimationState;
    skillAnim: cc.Animation;
    skillAnimState: cc.AnimationState;
    skillSound: cc.AudioClip;
    fsm: any;
    LBC: Photon.LoadBalancing.LoadBalancingClient;
    playerSyncTimer: ReturnType<typeof setInterval>;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.isOwnPlayer) {
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

        // this.playerSyncTimer = setInterval(() => this.syncMyPlayer(this), 2000);
        this.schedule(() => {
            this.syncMyPlayer(this);
        }, 2);
    }

    start () {

    }

    // update (dt) {}

    getVelocity(): cc.Vec2 {
        return this.node.getComponent(cc.RigidBody).linearVelocity;
    }

    setVelocity(x, y): void {
        this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(x, y);
    }

    onKeyDown(event) {
        if (this.playerId != this.LBC.myActor().actorNr) {return;}
        let controlEnum = player_control_enum.NEUTRAL;
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag |= RIGHT_DIR;
                controlEnum = player_control_enum.RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag |= LEFT_DIR;
                controlEnum = player_control_enum.LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                if (this.isOnFloor) {this.isJump = true};
                controlEnum = player_control_enum.JUMP;
                break;
            case cc.macro.KEY.c:
                this.usingSkill = 1;
                controlEnum = player_control_enum.ATTACK;
                break;
        }
        this.LBC.raiseEvent(EventType.PLAYERCONTROL, {controlEnum: controlEnum, id: this.playerId, keyDown: 1}, {receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others});
    }

    receiveInput(event) {
        switch(event.controlEnum) {
            case player_control_enum.RIGHT_DIR:
                if (event.keyDown) {
                    this._moveFlag |= RIGHT_DIR;
                }
                else {this._moveFlag &= ~RIGHT_DIR;}
                break;
            case player_control_enum.LEFT_DIR:
                if (event.keyDown) {this._moveFlag |= LEFT_DIR;}
                else {this._moveFlag &= ~LEFT_DIR;}
                break;
            case player_control_enum.JUMP:
                if (event.keyDown) {
                    if (this.isOnFloor) {this.isJump = true};
                } else {
                    this.isJump = false;
                }
                break;
            case player_control_enum.ATTACK:
                this.usingSkill = 1;
                break;
        }
    }

    onKeyUp(event) {
        if (this.playerId != this.LBC.myActor().actorNr) {return;}
        let controlEnum = player_control_enum.NEUTRAL;
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this._moveFlag &= ~RIGHT_DIR;
                controlEnum = player_control_enum.RIGHT_DIR;
                break;
            case cc.macro.KEY.left:
                this._moveFlag &= ~LEFT_DIR;
                controlEnum = player_control_enum.LEFT_DIR;
                break;
            case cc.macro.KEY.space:
                this.isJump = false;
                controlEnum = player_control_enum.JUMP;
                break;
        }
        this.LBC.raiseEvent(EventType.PLAYERCONTROL, {controlEnum: controlEnum, id: this.playerId, keyDown: 0}, {receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others});
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        var normal = contact.getManifold().localNormal;
        if(normal.x == 0) {
            this.isOnFloor = true;
        }
    }

    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        // if (--this.touchingCount == 0) {this.isOnFloor = false};
        let normal = contact.getManifold().localNormal;
        if(normal.x == 0) {
            this.isOnFloor = false;
        }
    }

    /**
     * Raises LBC event to other players to sync my own player
     */
    syncMyPlayer(ref: cc.Component) {
        let myPlayerInfo: any = {}
        let myPlayer: cc.Vec2 = ref.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        myPlayerInfo.x = myPlayer.x;
        myPlayerInfo.y = myPlayer.y;
        myPlayerInfo.id = Global.LBC.myActor().actorNr;
        myPlayerInfo.isOwnPlayer = false;
        Global.LBC.raiseEvent(EventType.SYNCPLAYER, myPlayerInfo, {receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others});
    }

    lerp(value1: number, value2: number, amount: number) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }

    update(dt: number) {
        this.fsm.process(this, dt);
    }
}
