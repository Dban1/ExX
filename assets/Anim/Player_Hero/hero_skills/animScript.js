// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        console.log('oyea');
    },

    endAnim: function() {
        this.animState = this.anim.play("skill_empty");
        console.log(this.animState);
    }
});
