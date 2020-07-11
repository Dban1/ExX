const Global = require('./../Global')
const PlayerManager = require('./../Player/playerManager');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.LBC = Global.LBC;
        this.cameraMain = cc.find("Canvas/player_camera");
        this.cameraBack1 = cc.find("Canvas/CameraManager/backlayer1_camera");
        this.cameraBack2 = cc.find("Canvas/CameraManager/backlayer2_camera");
        this.playerMgr = cc.director.getScene().getChildByName('PlayerManager').getComponent('playerManager');
    },

    spawnPlayer(content) {
        var self = this;
        cc.loader.loadRes("prefab/Player/player", function(err, fab) {
            if (err) {
                console.log(err);
                return;
            }
            let player = cc.instantiate(fab);
            player.setParent(cc.director.getScene().getChildByName('Player_Layer'));
            player.setPosition(content.x, content.y);
            console.log("Spawning player id: " + content.id);
            player.getComponent('playerTS').playerId = content.id;
            self.playerMgr.registerPlayer(content.id, player);
            if (content.isOwnPlayer) {
                self.cameraMain.getComponent('player_camera').assignTarget(player);
                self.cameraBack1.getComponent('player_camera').assignTarget(player);
                self.cameraBack2.getComponent('player_camera').assignTarget(player);
            }
        });
    }
});