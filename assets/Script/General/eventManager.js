const Global = require('./../Global')

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.LBC = Global.LBC;
        console.log("Printing LBC: " + this.LBC);
    },

    spawnPlayer(playerId) {
        cc.loader.loadRes("prefab/Player/player", function(err, fab) {
            if (err) {
                console.log(err);
                return;
            }
            let player = cc.instantiate(fab);
            player.setParent(cc.director.getScene().getChildByName('Player_Layer'));
            player.setPosition(300, 0);
            console.log("Printing LBC: " + this.LBC);
            player.getComponent('player').isOwnPlayer = (this.LBC.myActor().actorNr == playerId);
            player.getComponent('player').playerId = playerId;
        });
    }
});
