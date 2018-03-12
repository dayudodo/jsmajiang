import _ from "lodash";
import * as config from "./../config";

//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
export class  Room{
    constructor(){
        // this.allowed_users_count
        //应该是唯一的，用户需要根据这个id进入房间
        this.id = null;
        this.players = []
    }
    //用户加入房间，还需要告诉其它的用户我已经加入了
    join_me(person){
        this.players.push(person)
        // tellOtherPeopleIamIn();
    }
    get_player(socket_id){
        // _.find(this.players, {socket_id: socket_id})
        this.players.find(p=>p.socket_id == socket_id)
    }
    start_game(){

    }
    exit_game(socket_id){
        _.remove(this.players, function (item) {
            item.socket_id == socket_id
        })
    }
    end_game(){

    }
    //有用户掉线就需要暂停游戏，但是时间不能太长，
    pause_game(){

    }
    //继续游戏，哪个掉线后需要发送其掉线前的数据
    resume_game(){

    }
}
