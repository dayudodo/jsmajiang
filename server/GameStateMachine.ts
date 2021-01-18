import * as config from "./config"
import { Room } from "./room"
/**游戏状态机 */
export class GameStateMachine{
    public state: string = ""
    public room: Room

    stateMachine() {
        switch(this.state){
            case "dealCard":
                //发牌
                this.room.serverGameStart();
                this.state = "dealCardOver"
                break;
            case "waiting":
                // this.room.

                break;
            case "gameover":
                // this.room.clientRestartGame();
            default:
                break;
        }
    }

}