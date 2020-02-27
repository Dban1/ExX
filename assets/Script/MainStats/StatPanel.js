var MainStats = require("Stats");
cc.Class({
    extends: cc.Component,

    properties: {
        username: "lolol",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.getComponent(cc.Label).string = MainStats.getUsername();
    },

    start () {

    },

    // update (dt) {},
});
