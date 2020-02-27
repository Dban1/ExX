/**
 * Monster_basic traits:
 * - Non-aggressive
 * - Non-vengeance
 * - Non-skilled
 */
const StateMachine = require("./../state-machine");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'walk', from: 'idle', to: 'walk' },
                { name: 'idle', from: 'walk', to: 'idle' },
                { name: 'hit', from: ['walk', 'idle'], to: 'hit'}
            ],
            methods: {
                onWalk: function () { noder.animState = noder.animation.play("hero_walk"); },
                onJump: function () { noder.animState = noder.animation.play("hero_jump"); },
                onIdle: function () { noder.animState = noder.animation.play("hero_stand"); },
                onHit: function() {}
            }
        })
    },


    update (dt) {},
});
