// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        parallaxX: {
            default: 0,
            type: cc.Float
        },
        parallaxY: {
            default: 0,
            type: cc.Float
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
        this.anchorPos = cc.Vec2(cc.winSize.width / 2, cc.winSize.height / 2);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2(0, 120));
        let chaseX = (targetPos.x - this.anchorPos.x) * this.parallaxX;
        let chaseY = (targetPos.y - this.anchorPos.y) * this.parallaxY;
        targetPos.x += chaseX;
        targetPos.y += chaseY;
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },

    assignTarget: function (playerNode) {
        this.target = playerNode;
    }
});
