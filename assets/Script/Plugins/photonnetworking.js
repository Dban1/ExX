const Global = require('Global');
const EventType = {
    ONJOIN: 1,
    PLAYERCONTROL: 2,
    SPAWNPLAYER: 3,
    SYNCPLAYER: 4,
}
cc.Class({
    extends: cc.Component,
    
    onLoad () {
        this.eventMgr = cc.director.getScene().getChildByName('EventManager').getComponent('eventManager');
        this.playerMgr = cc.director.getScene().getChildByName('PlayerManager').getComponent('playerManager');
        this.cameraMgr = cc.find('Canvas/player_camera');

        Global.LBC = new Photon.LoadBalancing.LoadBalancingClient(1, 'af962eb6-4b15-4488-a09b-8243a448d4ba', '1.0');
        Global.LBC.onJoinRoom = function(createdByMe) {
            cc.systemEvent.emit("joinedRoom");
        }
        
        // Main event manager
        var self = this;
        Global.LBC.onEvent = function(code, content, actorNr) {
            switch(code) {
            case EventType.ONJOIN:
                cc.systemEvent.emit("spawnPlayer", content);
                let myPlayerInfo = {}
                let myPlayer = self.playerMgr.getPlayerNode(Global.LBC.myActor().actorNr);
                myPlayerInfo.x = myPlayer.x;
                myPlayerInfo.y = myPlayer.y;
                myPlayerInfo.id = Global.LBC.myActor().actorNr;
                myPlayerInfo.isOwnPlayer = false;
                Global.LBC.raiseEvent(EventType.SPAWNPLAYER, myPlayerInfo, {targetActors: [actorNr]});
                break;
            
            case EventType.PLAYERCONTROL:
                cc.systemEvent.emit("playerControl", content);
                break;

            case EventType.SPAWNPLAYER:
                cc.systemEvent.emit("spawnPlayer", content);
                break;
            
            case EventType.SYNCPLAYER:
                console.log("I'm receiving sync");
                cc.systemEvent.emit("syncPlayer", content);
                break;
            }
        }

        cc.systemEvent.on("spawnPlayer", this.spawnPlayer, this);
        cc.systemEvent.on("joinedRoom", this.joinConfirmed, this);
        cc.systemEvent.on("playerControl", this.playerControl, this);
        cc.systemEvent.on("syncPlayer", this.syncPlayer, this);
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
        let id = Global.LBC.myActor().actorNr;
        Global.LBC.raiseEvent(EventType.ONJOIN, {x: 100, y: 0, id: id, isOwnPlayer: false}, {receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others});
        cc.systemEvent.off("joinedRoom");

        // Placeholder own Player spawn
        this.spawnPlayer({x: 300, y: 0, id: Global.LBC.myActor().actorNr, isOwnPlayer: true});
    },

    spawnPlayer: function(content) {
        this.eventMgr.spawnPlayer(content);
    },

    playerControl: function(content) {
        this.playerMgr.receiveInput(content.id, content);
    },

    syncPlayer: function(content) {
        this.playerMgr.syncPlayer(content.id , content);
    }


    // update (dt) { },
});
