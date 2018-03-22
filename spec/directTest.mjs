//专门测试一些单独的方法，直接放在其它测试框架中貌似也并不太好用，关键是我想跑一跑调试！
import { Majiang } from "../server/Majiang";

let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh ";
let na_pai = 'zh'
console.log(Majiang.HuPaiNames(str, na_pai))


str = "b1 b2 b3 b4 b5 b6 b7 b8 b9 b1 b2 b3 b4 ";
na_pai = "b4";
console.log(Majiang.HuPaiNames(str, na_pai));

str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 b4 b4 b4 b5 ";
na_pai = "b5";
console.log(Majiang.HuPaiNames(str, na_pai));

str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 b7 ";
na_pai = "b7";
console.log(Majiang.HuPaiNames(str, na_pai));