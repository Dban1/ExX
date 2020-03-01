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
        this.schedule(() => this.checkConnect(),
            2);
    },

    checkConnect: function() {
        console.log("in here! " +this.loadBalancingClient.isConnectedToMaster());
        if(this.loadBalancingClient.isConnectedToMaster()) {
            let label = cc.find("Network Rooms Label");
            label.getComponent(cc.Label).string = "Connected!";
        }
    },
    update (dt) {
    },
});
