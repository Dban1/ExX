const Global = require('Global');
const EventType = {
    ONJOIN: 1,
}
cc.Class({
    extends: cc.Component,
    
    onLoad () {
        Global.LBC = new Photon.LoadBalancing.LoadBalancingClient(1, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        Global.LBC.onJoinRoom = function(createdByMe) {
            cc.systemEvent.emit("joinedRoom");
        }
        Global.LBC.onEvent = function(code, content, actorNr) {
            switch(code) {
            case EventType.ONJOIN:
                console.log("EVENT RECEIVED: New player in");
                cc.systemEvent.emit("spawnPlayer", content);
                break;
            }
            
        }
        cc.systemEvent.on("spawnPlayer", this.spawnPlayer, this);
        cc.systemEvent.on("joinedRoom", this.joinConfirmed, this);
        Global.LBC.connectToRegionMaster("asia");
        this.testConnect = () => this.checkConnect();
        this.schedule(this.testConnect, 2);

        this.eventMgr = cc.director.getScene().getChildByName('EventManager').getComponent('eventManager');
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
        Global.LBC.myActor().raiseEvent(EventType.ONJOIN, {x: 50, y: 50}, Photon.LoadBalancing.Constants.ReceiverGroup.Others);
        cc.systemEvent.off("joinedRoom");
    },

    spawnPlayer: function(content) {
        console.log("SPAWNING PLAYER");
        this.eventMgr.spawnPlayer(true);
    }

    // update (dt) {

    // },
});
