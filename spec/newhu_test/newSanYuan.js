import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConvertor";
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor.pais(strs)
}
function to_number(str) {
    return PaiConvertor.ToNumber(str)
}


//repeatTwiceOnly是专门为小三元服务的，因为要判断是否只重复了二次，不能有三次的情况！
//正则的话还没有找到限制重复次数的用法
// test("should repeatTwiceOnly", t => {
//   let str = "t1t2b1b1b1";
//   t.is(NMajiangAlgo.isRepeatTwiceOnly(str, "b1"), false);
//   str = "t1t2b1b1fafa";
//   t.is(NMajiangAlgo.isRepeatTwiceOnly(str, "b1"), true);
// });
test("should 小三元", t => {
    let str = "b1 b1 b1 b2 b3 di di di fa fa zh zh zh";
    let na_pai = to_number("b1")
    let group_shoupai = {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [], shouPai: pais(str)
    };
    t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), true);
    t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("group should 小三元", t => {
    let str = "fa b1 b1 b1 b2 b3 fa";
    let na_pai = to_number("b1")
    let group_shoupai = {
        anGang: pais(['zh']),
        mingGang: [],
        peng: pais(['di']),
        selfPeng: [], shouPai: pais(str)
    };
    t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), true);
    t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("should 大三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh fa fa";
  let na_pai = to_number("fa")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});
test("should 大三元, 三元有杠", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh zh fa fa";
  let na_pai = to_number("fa")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});
test("小三元碰碰胡", t => {
  let str = "t2 t2 di di";
  let na_pai = to_number("t2")
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["zh"]),
    peng: pais(["fa","b1"]),
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), true);
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("should 大三元2", t => {
  let str = "fa fa b1 b1 b1 b2 b3 di di di zh zh zh ";
  let na_pai = to_number("fa")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});

test("should not 大小三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh t1 t1";
  let na_pai = to_number("b1")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("should not 大小三元2", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh t1 t1";
  let na_pai = to_number("t1")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(NMajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});