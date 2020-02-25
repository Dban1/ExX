// const Photon = require('Photon-Javascript_SDK');

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.loadBalancingClient = new Photon.LoadBalancing.LoadBalancingClient(0, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        this.loadBalancingClient.onLobbyStats = function(errCode, errMsg, lobbies) {
            console.log("onLobbyStats: errorCode " + errCode
            + ",errMsg: " + errMsg
            + ",lobbies: " + lobbies);
        }
        console.log('yea');
        this.loadBalancingClient.connect({lobbyStats : true});
        // this.chatClient = new Photon.Chat.ChatClient(0, 'e4e8e1d7-7dfe-421e-8621-3d176263ba88', '1.0');
        // this.chatClient.connectToRegionFrontEnd('asia');
    },

    update (dt) {
    },
});
