const Global = require('Global');
const EventType = {
    ONJOIN: 1,
    PLAYERCONTROL: 2,
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
                cc.systemEvent.emit("spawnPlayer", content);
                break;
            case EventType.PLAYERCONTROL:
            console.log("EVENT RECEIVED: Player control")    
            cc.systemEvent.emit("playerControl", content);
                break;
            }
            
        }
        cc.systemEvent.on("spawnPlayer", this.spawnPlayer, this);
        cc.systemEvent.on("joinedRoom", this.joinConfirmed, this);
        cc.systemEvent.on("playerControl", this.playerControl, this);
        Global.LBC.connectToRegionMaster("asia");
        this.testConnect = () => this.checkConnect();
        this.schedule(this.testConnect, 2);

        this.eventMgr = cc.director.getScene().getChildByName('EventManager').getComponent('eventManager');
        this.playerMgr = cc.director.getScene().getChildByName('PlayerManager').getComponent('playerManager');
        this.cameraMgr = cc.find('Canvas/player_camera');
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
        let id = Global.LBC.myActor().actorNr;
        Global.LBC.myActor().raiseEvent(EventType.ONJOIN, {x: 100, y: 0, id: id, isOwnPlayer: false}, Photon.LoadBalancing.Constants.ReceiverGroup.Others);
        cc.systemEvent.off("joinedRoom");

        // Placeholder own Player spawn
        this.spawnPlayer({x: 300, y: 0, id: Global.LBC.myActor().actorNr, isOwnPlayer: true});
        let playerNode = this.playerMgr.getPlayerNode(id);
        // this.cameraMgr.getComponent('player_camera').assignTarget(playerNode);
    },

    spawnPlayer: function(content) {
        this.eventMgr.spawnPlayer(content);
    },

    playerControl: function(content) {
        console.log('Received input {id: '+content.id+', content:' + content);
        this.playerMgr.receiveInput(content.id, content);
    }

    // update (dt) { },
});
