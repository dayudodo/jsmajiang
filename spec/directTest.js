//专门测试一些单独的方法，直接放在其它测试框架中貌似也并不太好用，关键是我想跑一跑调试！
import { Majiang } from "../server/Majiang";

let str = "b1 b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh zh";
console.log(Majiang.isPihu(str))