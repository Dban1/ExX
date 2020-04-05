cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        // collisionManager.enabledDebugDraw = true;
        // collisionManager.enabledDrawBoundingBox = true;

        // Set volume for cc.AudioEngine
        cc.audioEngine.setEffectsVolume(0.05);

    }

    // update (dt) {},
});
