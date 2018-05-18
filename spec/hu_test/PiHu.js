
import test from "ava";
import { MajiangAlgo } from "../../server_build/MajiangAlgo"

// 屁胡
test("普通屁胡", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 t4 t5  fa fa fa zh zh";
  let na_pai = "t6";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("多个同花色规则屁胡", function (t) {
  let str = " b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("带杠屁胡", function (t) {
  let str = "t1 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh";
  let na_pai = "t2";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("双杠屁胡", function (t) {
  let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("三杠屁胡", function (t) {
  let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("单杠屁胡，其中四张连续并非杠", function (t) {
  let str = "b1 b1 b1 b1 b2 b3 di di di fa zh zh zh zh";
  let na_pai = "fa";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("屁胡清一色", function (t) {
  let str = "b1 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7";
  let na_pai = "b2";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("少张屁胡", function (t) {
  let str = " b1 b1 b2 b3 b7 b7 b7 b7 b8 b9";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), true);
});
test("非屁胡 should behave...", function (t) {
  let str = " b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), false);
});
test("非屁胡 将都没有", function (t) {
  let str = "b2b3";
  let na_pai = "b1";
  t.is(MajiangAlgo._HuisPihu(str, na_pai), false);
});
