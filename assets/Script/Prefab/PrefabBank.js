cc.Class({
    extends: cc.Component,

    properties: {
        monster: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        cc.loader.loadRes("prefab/Monster/monster", function(err, fab) {
            if (err) {
                console.log(err);
                return;
            }
            self.node.getComponent("PrefabBank").monster = fab;
        });
        // this.schedule(() => {
        //     console.log(this.monster);
        //     let node = cc.instantiate(this.monster);
        //     node.parent = cc.director.getScene().getChildByName("Monster_Layer");
        //     node.setPosition(0, 300);
        // }, 2);
    },

    start () {

    },

    // update (dt) {},
});
