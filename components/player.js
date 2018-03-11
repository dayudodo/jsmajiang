//每一个玩家的数据保存在此类中
import * as config from "./../config";

class Player {
  //初始化第一手牌，肯定是有13张

  constructor(first_shouPai) {
    this.status = {
      user_id: null,
      room_id: null,
      connect: true
    };
    let _len = first_shouPai.length;
    if (_len != config.FIRST_SHOUPAI_COUNT) {
      throw new Error(
        `初始化第一手牌应等于${config.FIRST_SHOUPAI_COUNT}, 现在：${_len}`
      );
    }
    this.current_pais = first_shouPai;
  }
  is_win(){

  }
  receive_pai(pai) {
    this.current_pais.push(pai);
  }
}

var p = new Player("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" "));
p.receive_pai("b1");
p.receive_pai("b2");
p.receive_pai("c1");
p.receive_pai("c2");
p.receive_pai("fa");
p.receive_pai("fa");

console.dir(p);
