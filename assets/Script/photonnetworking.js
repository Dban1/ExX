// const Photon = require('Photon-Javascript_SDK');

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.loadBalancingClient = new Photon.LoadBalancing.LoadBalancingClient(1, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        this.loadBalancingClient.onLobbyStats = function(errCode, errMsg, lobbies) {
            console.log("onLobbyStats: errorCode " + errCode
            + ",errMsg: " + errMsg
            + ",lobbies: " + lobbies);
        }
        this.loadBalancingClient.connectToRegionMaster("asia");
        this.testConnect = () => this.checkConnect();
        this.schedule(this.testConnect,
            2);
    },

    checkConnect: function() {
        if(this.loadBalancingClient.isConnectedToMaster()) {
            let label = cc.find("Network Rooms Label");
            label.getComponent(cc.Label).string = "Connected!";
            this.loadBalancingClient.createRoom();
            this.unschedule(this.testConnect);
        }
    },
    update (dt) {

    },
});
