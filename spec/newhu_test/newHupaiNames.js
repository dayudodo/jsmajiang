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


//哪种胡类型
test("屁胡", function (t) {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = to_number("zh")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["屁胡"]);
});
test("清一色 屁胡", function (t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b9 b1 b2 b3 b4";
  let na_pai = to_number("b4")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["清一色", "屁胡"]);
});
test("清一色 碰碰胡 屁胡", function (t) {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 b4 b4 b4 b5";
  let na_pai = to_number("b5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["清一色", "碰碰胡"]);
});
test("清一色 七对 屁胡", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 b7";
  let na_pai = to_number("b7")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["清一色", "七对"]);
});
test("七对 龙七对 屁胡", function (t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
  let na_pai = to_number("t9")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["七对", "龙七对"]);
});
test("小三元 屁胡", function (t) {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh fa fa";
  let na_pai = to_number("b1")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  // console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  // console.log(NMajiangAlgo.HupaiTypeCodeArr(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["小三元", "暗四归"]);
});
test("大三元屁胡", function (t) {
  let str = "b1 b1 b2 b3 di di di zh zh zh fa fa fa";
  let na_pai = to_number("b1")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
//   console.log(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai));
  t.deepEqual(NMajiangAlgo.HuPaiNames(group_shoupai, na_pai), ["大三元"]);
});

// //todo: [ '卡五星', '屁胡' ]
// str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
// na_pai = "b5";
// console.log(NMajiangAlgo.HuPaiNames(str, na_pai));
// console.log(NMajiangAlgo.isDaHu(NMajiangAlgo.HupaiTypeCodeArr(str, na_pai)));