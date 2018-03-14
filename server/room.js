import _ from "lodash";
import * as config from "./../config";

let room_valid_names = ["ange","jack","rose"]
//用户自然是属于一个房间，房间里面有几个人可以参加由房间说了算
export class  Room{
    constructor(){
        // this.allowed_users_count
        //应该是唯一的，用户需要根据这个id进入房间
        this.id = null;
        this.players = []
    }
    //创建一个唯一的房间号，其实可以用redis来生成一个号，就放在内存里面
    static make(){
        //暂时用模拟的功能，每次要创建的时候，其实都是用的数组中的一个名称
        return room_valid_names.pop();
    }
    //用户加入房间，还需要告诉其它的用户我已经加入了
    join_player(person){
        this.players.push(person)
        // tellOtherPeopleIamIn();
    }
    get_player(socket_id){
        // _.find(this.players, {socket_id: socket_id})
        this.players.find(p=>p.socket_id == socket_id)
    }
    get count(){
        return this.players.length
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
