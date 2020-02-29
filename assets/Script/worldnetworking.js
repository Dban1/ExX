const Colyseus = require('colyseus');

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.client = new Colyseus.Client("ws://127.0.0.1:2567");

        this.client.create("battle", {/* options */}).then(room => {
            console.log("joined successfully", room);
          }).catch(e => {
            console.error("join error", e);
          });

        this.client.getAvailableRooms("battle").then(rooms => {
        rooms.forEach((room) => {
            console.log(room.roomId);
            console.log(room.clients);
            console.log(room.maxClients);
            console.log(room.metadata);
        });
        }).catch(e => {
        console.error(e);
        });
    },

    start () {

    },

    // update (dt) {},
});
