import test from "ava";
import { MajiangAlgo, checkValidAndReturnArr } from "../../server_build/server/MajiangAlgo";

test("不是碰碰胡", function (t) {
  let str = "b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di";
  let na_pai = "b1";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), false);
});

test("碰碰胡将在后", function (t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di ";
  let na_pai = "di";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰胡将在前", function (t) {
  let str = "di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa ";
  let na_pai = "fa";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带1杠", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠", function (t) {
  let str = "b2 b2 b2 b2 b1 b1 b1 b1 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function (t) {
  let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh t1 t1 t1";
  let na_pai = "b2";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function (t) {
  let str = "b2 zh zh zh zh t1 t1 t1";
  let na_pai = "b2";
      let group_shoupai = {
    anGang: ['fa'],
    mingGang: ['t1'],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function (t) {
  let str = "b2 t1 t1 t1";
  let na_pai = "b2";
      let group_shoupai = {
    anGang: ['fa'],
    mingGang: ['t1','zh'],
    peng: [],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠少将", function (t) {
  let str = "b2 t1 t1 t1";
  let na_pai = "b2";
      let group_shoupai = {
    anGang: [],
    mingGang: ['t1','zh'],
    peng: ['fa'],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠少将 false", function (t) {
  let str = "b2 t1 t1 t1";
  let na_pai = "b1";
      let group_shoupai = {
    anGang: [],
    mingGang: ['t1','zh'],
    peng: ['fa'],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), false);
});
test("碰碰糊带2杠少将 false", function (t) {
  let str = "b2 t1 t1 t1";
  let na_pai = "fa";
      let group_shoupai = {
    anGang: [],
    mingGang: ['t1','zh'],
    peng: ['fa'],
    shouPai: checkValidAndReturnArr(str)
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), false);
});