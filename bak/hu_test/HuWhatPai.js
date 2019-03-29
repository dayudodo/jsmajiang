import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";
import * as config from "../../server_build/server/config";

// '胡啥牌'
test("清一色听牌", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b5", "b7"]);
});
test("group清一色胡b5", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b6 b7 b7";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    selfPeng: [],
    peng: ["b5"],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["b5"]);
});
test("group清一色胡b5 杠掉后false", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b6 b7 b7";
  let group_shoupai = {
    anGang: [],
    mingGang: ["b5"],
    peng: [],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, []);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, []);
});

test("清一色听7张", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 b9 b9 b9";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, [
    "b1",
    "b3",
    "b4",
    "b6",
    "b7",
    "b8",
    "b9"
  ]);
});
test("group清一色胡多张", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b9"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [
    "b1",
    "b3",
    "b4",
    "b6",
    "b7",
    "b9"
  ]);
});

test("双将倒", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["di", "zh"]);
});
test("group双将倒", function(t) {
  let str = "zh zh di di b1 b2 b3";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["t2", "t3"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["di", "zh"]);
});

test("清一色胡的宽", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b3", "b6", "b8", "b9"]);
});
test("group清一色碰7后只胡一", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b8";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b7"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["b8"]);
});

test("清一色听牌false", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
  t.deepEqual(MajiangAlgo.HuWhatPai(str), {
    all_hupai_zhang: [],
    all_hupai_typesCode: [],
    hupai_dict: {}
  });
});
test("group清一色听牌false", function(t) {
  let str = "b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
  let group_shoupai = {
    anGang: ["b1"],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai), {
    all_hupai_zhang: [],
    all_hupai_typesCode: [],
    hupai_dict: {}
  });
});

test("碰碰胡听牌", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
});
test("碰碰胡带杠听牌", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
});
test("group后碰碰胡听牌只胡一", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 t2";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["t1"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["t2"]);
});

test("龙七对听牌", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisQidui,
    config.HuisNongQiDui,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t9"]);
});
test("group龙七对听牌", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisQidui,
    config.HuisNongQiDui,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["t9"]);
});

test("仅屁胡 zh", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [config.HuisPihu]);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["zh"]);
});
test("group仅屁胡 zh", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6  zh";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["fa"],
    selfPeng: [],
    shouPai: getArr(str)
  };

  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["zh"]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).hupai_dict, {
    zh: [config.HuisPihu]
  });
});

test("大小三元 b1 b4 fa", function(t) {
  let str = "b1 b1  b1 b2 b3 di di di zh zh zh fa fa";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, [
    config.HuisXiaoShanYuan,
    config.HuisDaShanYuan,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b1", "b4", "fa"]);
});
test("大小三元group b1 b4 fa", function(t) {
  let str = "b1 b1  b1 b2 b3 fa fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["di", "zh"],
    selfPeng: [],
    shouPai: getArr(str)
  };

  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisXiaoShanYuan,
    config.HuisDaShanYuan,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [
    "b1",
    "b4",
    "fa"
  ]);
});
test("大小三元group 并碰碰胡", function(t) {
  let str = "t1 t1 t1 fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["di", "zh"],
    selfPeng: ["b1"],
    shouPai: getArr(str)
  };

  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, [
    config.HuisPengpeng,
    config.HuisXiaoShanYuan,
    config.HuisPihu
  ]);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["fa"]);
});
test("大小三元group 有一杠，胡 b1 b4 fa", function(t) {
  let str = "b1 b1  b1 b2 b3 fa fa";
  let group_shoupai = {
    anGang: [],
    mingGang: ["zh"],
    peng: ["di"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, [
    "b1",
    "b4",
    "fa"
  ]);
});

test("空", function(t) {
  let str = "b1 b2 b3 b4 b7 b8 t4 t5 t8 fa fa fa zh";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_typesCode, []);
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, []);
});
test("group也空", function(t) {
  let str = "b1 b2 b3 b4 b7 b8 t4 t5 t8 zh";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["fa"],
    selfPeng: [],
    shouPai: getArr(str)
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_typesCode, []);
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, []);
});

test("flat可胡，group不能，啥牌也不胡", function(t) {
  let group_shoupai = {
    anGang: [],
    mingGang: ["b1"],
    peng: ["fa", "b2"],
    selfPeng: [],
    shouPai: ["b3", "b4", "t4", "t5"]
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, []);
});

test("group胡2，3饼", function(t) {
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ["b1", "b8"],
    selfPeng: [],
    shouPai: getArr("b2 b2 b3 b3 b5 b6 b7")
  };
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["b2", "b3"]);
});
test("group胡1,4条", function(t) {
  let group_shoupai = { anGang: [],
      mingGang: [],
      peng: [ 't1' ],
      selfPeng: [],
      shouPai: [ 'b1', 'b1', 't2', 't3', 't6', 't7', 't8', 'zh', 'zh', 'zh' ] }
  t.deepEqual(MajiangAlgo.HuWhatGroupPai(group_shoupai).all_hupai_zhang, ["t1", "t4"]);
});
