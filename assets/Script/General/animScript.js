const LEFT_DIR = 1;
const RIGHT_DIR = 2;

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        damage: cc.Integer,
        effectName: cc.String,
        hitSound: {
            type: cc.AudioClip,
            default: null,
        },
    },

    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
        this.animState = this.anim.getAnimationState();
        // this.mobCount = 1;
    },

    onCollisionEnter: function(self, other) {
        // other == this body, self == external body
        // if (this.mobCount-- <= 0) {return;}
        let selfw = self.node.convertToWorldSpaceAR(cc.v2());
        let otherw = other.node.convertToWorldSpaceAR(cc.v2());
        if (selfw.x > otherw.x) { //monster on left side
            self.node.getComponent("monster_basic").hit = RIGHT_DIR;
        } else {
            self.node.getComponent("monster_basic").hit = LEFT_DIR;
        }

        // spawn hit effects
        var spawnedEffect = cc.instantiate(this.parentNode.getChildByName('effects'));
        spawnedEffect.parent = cc.director.getScene();
        spawnedEffect.setPosition(selfw.x, selfw.y);
        spawnedEffect.getComponent(cc.Animation).play(this.effectName);

        // play hit effect
        cc.audioEngine.playEffect(this.hitSound);

        // Damage calculation
        self.node.getComponent("monster_basic").hp -= this.damage;
        console.log(self.node.getComponent("monster_basic").hp + " is my new HP");
    },

    startAnim: function() {
        this.node.getComponent(cc.BoxCollider).enabled = true;
    },

    endAnim: function() {
        this.node.getComponent(cc.BoxCollider).enabled = false;
        this.animState = this.anim.play("skill_empty");
        // this.mobCount = 1;
    },

    dieAnim: function() {
        this.parentNode.destroy();
        console.log("destroy executed?");
    },

    destroyAnim: function() {
        console.log(this.parent);
        this.node.destroy();
    }
});
