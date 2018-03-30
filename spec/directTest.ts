//专门测试一些单独的方法，直接放在其它测试框架中貌似也并不太好用，关键是我想跑一跑调试！
import { Majiang } from "../server/Majiang";

//屁胡
let str: string = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh ";
let na_pai: string = "zh";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)))

//[ '清一色', '屁胡' ]
str = "b1 b2 b3 b4 b5 b6 b7 b8 b9 b1 b2 b3 b4 ";
na_pai = "b4";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)))

//[ '清一色', '碰碰胡', '屁胡' ]
str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 b4 b4 b4 b5 ";
na_pai = "b5";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//[ '七对', '屁胡' ]
str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 t7 ";
na_pai = "t7";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//[ '清一色', '七对', '屁胡' ]
str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 b7 ";
na_pai = "b7";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//[ '卡五星', '屁胡' ]
str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
na_pai = "b5";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//[ '七对', '龙七对' ], 奇怪，七对检测出屁胡，而龙七对则不会！
str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 ";
na_pai = "t9";
console.log(Majiang.HuPaiNames(str, na_pai))
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//大三元，屁胡
str = "b1 b1 b1 b2 b3 di di di zh zh zh fa fa";
na_pai = "fa";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//小三元，屁胡
str = "fa b1 b1 b1 b2 b3 di di di zh zh zh fa ";
na_pai = "b1";
console.log(Majiang.HuPaiNames(str, na_pai));
console.log(Majiang.isDaHu(Majiang.HupaiTypeCodeArr(str, na_pai)));

//胡什么牌及类型
str = "fa b1 b1 b1 b2 b3 di di di zh zh zh fa ";
console.dir(Majiang.HuWhatPai(str))

//是大胡听牌
str = "fa b1 b1 b1 b2 b3 di di di zh zh zh fa ";
console.dir(Majiang.isDaHuTing(str))

//不是大胡听牌，只是个屁胡
str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh ";
console.dir(Majiang.HuWhatPai(str))
console.log("是否是大胡听牌：",Majiang.isDaHuTing(str))

//啥也不是，连屁胡都不是！
str = "b1 b2 b3 b4 b7 b8 t4 t5 t8 fa fa fa zh ";
console.dir(Majiang.HuWhatPai(str))
console.log("是否是大胡听牌：",Majiang.isDaHuTing(str))