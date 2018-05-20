import test from "ava";
import { MajiangAlgo, checkValidAndReturnArr } from "../../server_build/server/MajiangAlgo";
// var Majiang = require("../server/Majiang");

//repeatTwiceOnly是专门为小三元服务的，因为要判断是否只重复了二次，不能有三次的情况！
//正则的话还没有找到限制重复次数的用法
// test("should repeatTwiceOnly", t => {
//   let str = "t1t2b1b1b1";
//   t.is(MajiangAlgo.isRepeatTwiceOnly(str, "b1"), false);
//   str = "t1t2b1b1fafa";
//   t.is(MajiangAlgo.isRepeatTwiceOnly(str, "b1"), true);
// });
test("should 大三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh fa fa";
  let na_pai = "fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});
test("should 大三元, 三元有杠", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh zh fa fa";
  let na_pai = "fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});
test("should 大三元", t => {
  let str = "fa fa b1 b1 b1 b2 b3 di di di zh zh zh ";
  let na_pai = "fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), true);
});
test("should 小三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di fa fa zh zh zh";
  let na_pai = "b1";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), true);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("group should 小三元", t => {
  let str = "fa b1 b1 b1 b2 b3 fa";
  let na_pai = "b1";
  let group_shoupai = {
    anGang: ['zh'],
    mingGang: [],
    peng: ['di'],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), true);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("should not 大小三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh t1 t1";
  let na_pai = "b1";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});
test("should not 大小三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh t1 t1";
  let na_pai = "t1";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisXiaoShanYuan(group_shoupai, na_pai), false);
  t.is(MajiangAlgo.HuisDaShanYuan(group_shoupai, na_pai), false);
});