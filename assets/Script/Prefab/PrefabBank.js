// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        monster: {
            type: cc.Prefab,
            default: null
        },
        test: {
            type:cc.Integer,
            default:5
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.loader.loadRes("prefab/Monster/monster", function(err, fab) {
            if (err) {
                console.log(err);
                return;
            }
            this.monster = fab;
            console.log("loaded successfully: " + (fab instanceof cc.Prefab));
        });
        cc.instantiate(this.monster);
    },

    start () {

    },

    // update (dt) {},
});
