import test from "ava"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

var room = new Room()
var player = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: pais(["b1"]),
    selfPeng: pais(["b2"]),
    shouPai: pais(["b1", "b2", "t7", "t7", "t7", "t7", "fa"])
  },
  socket: null,
  username: "jack1",
  user_id: "10001"
})
test("能够杠的牌有三张", function(t) {
  let gangPais = player.canGangPais()
  // console.log(gangPais)
  let result = pais("b1 b2 t7")
  t.deepEqual(gangPais, result)
})

test("result_shou_pai在deepClone之后与group不相同", function(t) {
  let player = new Player({
    group_shou_pai: {
      anGang: pais(["b1"]),
      mingGang: [],
      peng: [],
      selfPeng: pais(["t1", "b2"]),
      shouPai: pais(["zh", "zh", "t7", "t8", "t9"])
    },
    socket: null,
    username: "jack1",
    user_id: "10001"
  })
  // t.is( player.result_shou_pai.shouPai == player.group_shou_pai.shouPai, false  );

  t.deepEqual(player.result_shou_pai.anGang, [])
  t.deepEqual(player.result_shou_pai.mingGang, pais(["b1"]))
  t.deepEqual(player.result_shou_pai.selfPeng, [])
  t.deepEqual(player.result_shou_pai.peng, pais(["t1", "b2"]))
  //原始的值不会被改变！
  t.deepEqual(player.group_shou_pai.peng, [])
})

//todo: room里面应该有个4A的判断，如果这牌也是4A，就不需要再出现隐藏的选项了！
test("应该有两个可以隐藏的3牌", function(t) {
  let player = new Player({
    group_shou_pai: {
      anGang: pais(["b1"]),
      mingGang: [],
      peng: [],
      selfPeng:[],
      shouPai: pais(["b2","b2","b2","t1","t1","t1","zh", "zh", "t7", "t8", "t9"]),
    },
    socket: null,
    username: "jack1",
    user_id: "10001"
  });

  t.deepEqual(
    player.PaiArr3A(),
    pais(["b2","t1"])
  );
});

test("group中shouPai不空之边界检查", function(t) {
  player = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng:[],
      shouPai: pais("b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh")
    },
    socket: null,
    username: "jack1",
    user_id: "10001"
  });
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    pais("b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh")
  );
});

test("正确得到flat_shoupai", function(t) {
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    pais("b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh")
  );
});

test("打牌并碰之后正确得到flat_shoupai", function(t) {
  player.mo_pai=3
  player.da_pai(17);
  player.mo_pai=3
  player.da_pai(18);
  player.da_pai(19);

  player.confirm_peng(3);
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    pais("b1 b1 b1 b1 b2 b2 b2 b2 b3 b3 b3 t1 t1 t1 zh zh")
  );
  t.deepEqual(player.arr_dapai, pais("t7 t8 t9"))
});
// var player2 = new Player({
//     group_shou_pai: {
//       anGang: [],
//       mingGang: [],
//       peng: pais(["b1"]),
//       selfPeng:pais(["b2"]),
//       shouPai: pais(["b1", "b2", "t7", "t7", "t7","t7","fa"])
//     },
//     socket: null,
//     username: 'rose2',
//     user_id: '10002'
//   });
// var player3 = new Player({
//     group_shou_pai: {
//       anGang: [],
//       mingGang: [],
//       peng: pais(["b1"]),
//       selfPeng:pais(["b2"]),
//       shouPai: pais(["b1", "b2", "t7", "t7", "t7","t7","fa"])
//     },
//     socket: null,
//     username: 'tom3',
//     user_id: '10003'
//   });
