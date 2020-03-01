// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const LEFT_DIR = 1;
const RIGHT_DIR = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
    },

    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.getAnimationState();
    },

    onCollisionEnter: function(self, other) {
        let selfw = self.node.convertToWorldSpaceAR(cc.v2());
        let otherw = other.node.convertToWorldSpaceAR(cc.v2());
        console.log(otherw.x+" vs "+selfw.x);
        if (selfw.x > otherw.x) { //monster on left side
            self.node.getComponent("monster_basic").hit = RIGHT_DIR;
            console.log("hit right dir");
        } else {
            self.node.getComponent("monster_basic").hit = LEFT_DIR;
            console.log("hit left dir");
        }
    },

    startAnim: function() {
        this.node.getComponent(cc.BoxCollider).enabled = true;
    },

    endAnim: function() {
        this.node.getComponent(cc.BoxCollider).enabled = false;
        this.animState = this.anim.play("skill_empty");
    }
});
