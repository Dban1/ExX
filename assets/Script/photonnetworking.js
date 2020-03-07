// const Photon = require('Photon-Javascript_SDK');
const Global = require('Global');

cc.Class({
    extends: cc.Component,
    
    onLoad () {
        Global.LBC = new Photon.LoadBalancing.LoadBalancingClient(1, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        Global.LBC.onJoinRoom = function(createdByMe) {
            cc.systemEvent.emit("joinedRoom");
        }
        Global.LBC.onEvent = function(code, content, actorNr) {
            switch(code) {
                case 0:
                    console.log("EVENT RECEIVED: " + content.a);
                    break;
            }
        }
        cc.systemEvent.on("joinedRoom", this.joinConfirmed, this);
        Global.LBC.onLobbyStats = function(errCode, errMsg, lobbies) {
            console.log("onLobbyStats: errorCode " + errCode
            + ",errMsg: " + errMsg
            + ",lobbies: " + lobbies);
        }
        Global.LBC.connectToRegionMaster("asia");
        this.testConnect = () => this.checkConnect();
        this.schedule(this.testConnect, 2);
    },

    checkConnect: function() {
        if(Global.LBC.isConnectedToMaster()) {
            let label = cc.find("Network Rooms Label");
            label.getComponent(cc.Label).string = "Connected!";
            if (Global.LBC.availableRooms().length == 0) {    
                Global.LBC.createRoom();
            } else {
                Global.LBC.joinRandomRoom();
            }
            this.unschedule(this.testConnect);
        }
    },

    joinConfirmed: function() {
        console.log("joined room: " + Global.LBC.myRoom().name);
        Global.LBC.myActor().raiseEvent(0, {a: 1}, Photon.LoadBalancing.Constants.ReceiverGroup.Others);
        cc.systemEvent.off("joinedRoom");
    },

    update (dt) {

    },
});
