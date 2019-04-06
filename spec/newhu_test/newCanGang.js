import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter";
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs)
  }
  function to_number(str){
    return PaiConvertor.ToNumber(str)
  }



//能否杠
test("能杠fa", function(t) {
    let str = pais("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
    t.is(NMajiangAlgo._canGang(str, to_number("fa")), true);
  });
  test("能杠t2", function(t) {
    let str = pais("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
    t.is(NMajiangAlgo._canGang(str, to_number("t2")), true);
  });
 
  test("flat能扛", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
    };
    let flatShou =NMajiangAlgo.flat_shou_pai(group_shou_pai)
    t.is(NMajiangAlgo._canGang(flatShou, to_number("b1")), true);
  })
  
  test("group peng能扛", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
    };
    let flatShou =NMajiangAlgo.flat_shou_pai(group_shou_pai)
    t.is(NMajiangAlgo._canGang(flatShou, to_number("b1")), true);
    //没有亮牌的时候，如果你是碰的牌，那么别人打的牌是不能杠的！
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), false), false);
  });
  test("group 没有亮，selfPeng能扛", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: pais(["b1"]),
      selfPengCount: 1,
      peng: [],
      shouPai: pais("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
    };
    
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), false), true);
  });
  test("group 杠牌在亮牌中，亮牌后不能扛", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: pais(["b1"]),
      selfPengCount: 1,
      peng: [],
      shouPai: pais("b2 b3 b4 b5 b6 b7 b9 b9 b9 t4")
    };
    let flatShou =NMajiangAlgo.flat_shou_pai(group_shou_pai)
    t.is(NMajiangAlgo._canGang(flatShou, "b9"), true);
    t.is(NMajiangAlgo.canGang(group_shou_pai, "b9", true), false);
  });
  test("group 亮牌不能碰,但是可以杠", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
    };
    let isLiang = true, selfMo = true
    let canPengShou = NMajiangAlgo.canPeng(group_shou_pai.shouPai,to_number("t3"),isLiang)
    t.is(canPengShou, false)
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), isLiang, selfMo), true);
  });

  test("碰之后，别人打的牌不能扛，只能靠自己摸扛", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
    }
    let isLiang = true, selfMo = true
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), isLiang, !selfMo), false);
  });
  test("碰之后，自己摸的牌即使亮倒，也可以扛，擦炮是也！", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
    }
    let isLiang = true, selfMo = true
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), isLiang, selfMo), true)
  });
  test("碰之后，自己摸的牌不亮倒可以扛，这是擦炮！", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: [],
      selfPengCount: 0,
      peng: pais(["b1"]),
      shouPai: pais("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
    }
    let isLiang = true, selfMo = true
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b1"), !isLiang, selfMo), true)
  });

  test("group 能杠，但是先碰，拿牌可以杠selfPeng", function(t) {
    let group_shou_pai = {
      // anGang: ["zh"],
      anGang: [],
      anGangCount: 0,
      mingGang: [],
      selfPeng: ["b1"],
      selfPengCount: 1,
      peng: [],
      shouPai: pais("b1 b3 b4 t1 t1 t2 t2 t3 t3 fa")
    }
    let isLiang = true
    t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("b2"), isLiang), true);
  });
//   test("group 不能扛自己摸的牌", function(t) {
//     let group_shou_pai = {
//       // anGang: ["zh"],
//       anGang: [],
//       anGangCount: 0,
//       mingGang: [],
//       selfPeng: [],
//       // selfPengCount: 1,
//       peng: [],
//       shouPai: pais("b1 b1 b1 b3 b4 t1 t1 t3 t3 t4 t5 t6 fa fa")
//     };
//     let isLiang = true, selfMo = true
//     t.is(NMajiangAlgo.canGang(group_shou_pai, to_number("t3"), !isLiang, selfMo), false);
//   })