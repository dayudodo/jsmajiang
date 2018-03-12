//每一个玩家的数据保存在此类中
import * as config from "./../config";

export class Player {
  //初始化第一手牌，肯定是有13张

  //连接之后，用户就会有一个socket_id，一个socket其实就是一个连接了
  constructor({shou_pai, socket_id, user_id, user_name}) {
    this.room_id = null
    this.socket_id = socket_id
    this.user_id = user_id
    //用户是否连接？有可能掉线！
    this.connect = true
    //用户是否已经准备好，全部准备好后就可以开始了
    this.ready = false
    //用户是否是东家
    this.east = false
    //用户名称，以后可以显示微信名称
    this.user_name = ''

    // let _len = shou_pai.length;
    // if (_len != config.first_shouPai_COUNT) {
    //   throw new Error(
    //     `初始化第一手牌应等于${config.FIRST_SHOUPAI_COUNT}, 现在：${_len}`
    //   );
    // }
    this.shou_pai = shou_pai;
  }
  join_room(room_id){
    this.room_id = room_id
  }
  //用户也可以自己退出房间，不过会有一定的惩罚
  exit_room(){

  }
  receive_pai(pai) {
    this.shou_pai.push(pai);
  }
}

var p = new Player({
  shou_pai:"zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" "), 
  socket_id:456, 
  user_id: 1,
  user_name: ''}
);
p.receive_pai("b1");
p.receive_pai("b2");
p.receive_pai("c1");
p.receive_pai("c2");
p.receive_pai("fa");
p.receive_pai("fa");

console.dir(p);
