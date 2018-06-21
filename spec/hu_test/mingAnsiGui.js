import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";

//哪种胡类型
test("非明四归", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "b8";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1", "b2"],
    selfPeng: [],
    shouPai: ["b3", "b4", "b5", "b6", "b7", "b8", "b8"]
  };
  t.is(MajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), false);
});
test("明四归", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "b2";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1", "b2"],
    selfPeng: [],
    shouPai: ["b3", "b4", "b5", "b6", "b7", "b8", "b8"]
  };
  t.is(MajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), true);
});

test("明四归，但是非暗四归", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "b2";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1", "b2"],
    selfPeng: [],
    shouPai: ["b3", "b4", "b5", "b6", "b7", "b8", "b8"]
  };
  t.is(MajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), false);
});

test("亮倒后明四归，不亮暗四归", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "t7";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: getArr("b4 b5 b6 b7 b8 b9 t6 t7 t7 t7 t8 t8 t9")
  };
  t.is(MajiangAlgo.HuisMingSiGui(group_shoupai, na_pai, true), true);
  t.is(MajiangAlgo.HuisMingSiGui(group_shoupai, na_pai, false), false);
  t.is(MajiangAlgo.HuisAnSiGui(group_shoupai, na_pai, true), false);
  t.is(MajiangAlgo.HuisAnSiGui(group_shoupai, na_pai, false), true);
});

test("暗四归，非明四归", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "b2";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1"],
    selfPeng: [],
    shouPai: ["b2","b2","b2","b3", "b4", "b5", "b6", "b7", "b8", "b8"]
  };
  t.is(MajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), true);
  t.is(MajiangAlgo.HuisMingSiGui(group_shoupai, na_pai), false);
});

test("暗四归SelfPeng", function (t) {
  // let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  let na_pai = "b2";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1"],
    selfPeng: ["b2"],
    shouPai: ["b3", "b4", "b5", "b6", "b7", "b8", "b8"]
  };
  t.is(MajiangAlgo.HuisAnSiGui(group_shoupai, na_pai), true);
});

