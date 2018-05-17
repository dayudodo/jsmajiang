//麻将算法的测试程序，里面也包括了胡牌的一些用例

import test from "ava";
import { MajiangAlgo } from "../server_build/MajiangAlgo";

// '胡啥牌'
test("清一色听牌", function (t) {
    let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
    t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b5", "b7"]);
  });
  test("清一色听7张", function (t) {
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

// test("双将倒", function (t) {
//   let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["di", "zh"]);
// });
// test("单钓将", function (t) {
//   let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b3", "b6", "b8", "b9"]);
// });
// test("清一色听牌false", function (t) {
//   let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str), {
//     all_hupai_zhang: [],
//     all_hupai_typesCode: [],
//     hupai_dict: {}
//   });
// });
// test("清一色听牌false", function (t) {
//   let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str), {
//     all_hupai_zhang: [],
//     all_hupai_typesCode: [],
//     hupai_dict: {}
//   });
// });


// test("碰碰胡听牌", function (t) {
//   let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
// });
// test("碰碰胡带杠听牌", function (t) {
//   let str = "b1 b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
// });
// test("龙七对听牌", function (t) {
//   let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
//   t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t9"]);
// });