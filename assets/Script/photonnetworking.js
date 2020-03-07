// const Photon = require('Photon-Javascript_SDK');

cc.Class({
    extends: cc.Component,
    
    onLoad () {
        this.loadBalancingClient = new Photon.LoadBalancing.LoadBalancingClient(1, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        this.loadBalancingClient.onJoinRoom = function(createdByMe) {
            cc.systemEvent.emit("joinedRoom");
        }
        this.loadBalancingClient.onEvent = function(code, content, actorNr) {
            switch(code) {
                case 0:
                    console.log(" has joined");
                    break;
            }
        }
        cc.systemEvent.on("joinedRoom", this.joinConfirmed, this);
        this.loadBalancingClient.onLobbyStats = function(errCode, errMsg, lobbies) {
            console.log("onLobbyStats: errorCode " + errCode
            + ",errMsg: " + errMsg
            + ",lobbies: " + lobbies);
        }
        this.loadBalancingClient.connectToRegionMaster("asia");
        this.testConnect = () => this.checkConnect();
        this.schedule(this.testConnect, 2);
    },

    checkConnect: function() {
        if(this.loadBalancingClient.isConnectedToMaster()) {
            let label = cc.find("Network Rooms Label");
            label.getComponent(cc.Label).string = "Connected!";
            if (this.loadBalancingClient.availableRooms().length == 0) {    
                this.loadBalancingClient.createRoom();
            } else {
                this.loadBalancingClient.joinRandomRoom();
            }
            this.unschedule(this.testConnect);
        }
    },

    joinConfirmed: function() {
        console.log("joined room: " + this.loadBalancingClient.myRoom().name);
        cc.systemEvent.off("joinedRoom");
    },

    update (dt) {

    },
});
