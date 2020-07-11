// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component {
    @property
    playerMap = new Map<number, cc.Node>();

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerMap = new Map<number, cc.Node>();
    }
    
    registerPlayer(playerId: number, playerNode: cc.Node): void {
        this.playerMap.set(playerId, playerNode);
    }

    receiveInput(playerId: number, content: Object): void {
        let playerNode: cc.Node = this.playerMap.get(playerId);
        let playerComponent = playerNode.getComponent("playerTS");
        playerComponent.receiveInput(content);
    }

    getPlayerNode(playerId: number): cc.Node {
        return this.playerMap.get(playerId);
    }

    syncPlayer(playerId: number, content: any) {
        console.log("syncing player "+playerId+" to pos: "+content.x+", "+content.y);
        let player: cc.Node = this.playerMap.get(playerId);
        let playerTarget: cc.Vec2 = new cc.Vec2();
        playerTarget.x = content.x;
        playerTarget.y = content.y;
        player.setPosition(player.parent.convertToNodeSpaceAR(playerTarget));
    }

    // update (dt) {}
}
