const Global = require('Global')

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var LBC = Global.LBC;
        
    },

    spawnPlayer(boolean) {
        cc.loader.loadRes("prefab/Player/player", function(err, fab) {
            if (err) {
                console.log(err);
                return;
            }
            let player = cc.instantiate(fab);
            player.setParent(cc.director.getScene().getChildByName('Player_Layer'));
            player.setPosition(300, 0);
            player.getComponent('player').isOwnPlayer = false;
        });
    }
});
