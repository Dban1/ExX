const server = require('colyseus').Server;

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.serv = new server({
            server: "lims",
        });
    },

    start () {

    },

    // update (dt) {},
});
