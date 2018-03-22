//以前还不熟悉如何复制一个数组
Array.prototype.repeat = function(times) {
  var result = [];
  for (var i = 0; i < times; i++) {
    this.map(item => {
      result.push(item);
    });
  }
  return result;
};

const BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
const TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
const ZHIPAI = ["zh", "fa", "di"];

export const all_pai = BING.repeat(4)
  .concat(TIAO.repeat(4))
  .concat(ZHIPAI.repeat(4));

export var PORT = 3333;
export const FIRST_SHOUPAI_COUNT = 13;
export const LIMIT_IN_ROOM = 3;
export const MaxWaitTime = 10; //碰、杠牌时等待用户多少秒
export const CountDownInterval = 1000; //碰、杠牌倒数的时间间隔
export const WantPeng = 1;
export const WantGang = 2;

//此表中的type其实就是Majinang类中判断胡的方法，名称一致！
export const HuPaiSheet = [
  { type: "HuisYise", name: "清一色", score: 1 },
  { type: "HuisKaWuXing", name: "卡五星", score: 1 },
  { type: "HuisQidui", name: "七对", score: 1 },
  { type: "HuisNongQiDui", name: "龙七对", score: 1 },
  { type: "HuisPengpeng", name: "碰碰胡", score: 1 },
  { type: "HuisXiaoShanYuan", name: "小三元", score: 1 },
  { type: "HuisDaShanYuan", name: "大三元", score: 1 },
  { type: "HuisGangShangKai", name: "杠上开花", score: 2 },
  { type: "HuisGangShangPao", name: "杠上炮", score: 1 },
  { type: "HuisPihu", name: "屁胡", score: 1 }
];

// var output = ''
// var HuPaiStr = HuPaiSheet.forEach((item,index)=>{
//   var template = `export const ${item.type} = ${index}\n`
//   output = output + template
// })
// console.log(output)
//start自动生成代码, 运行上面的代码
export const HuisYise = 0;
export const HuisKaWuXing = 1;
export const HuisQidui = 2;
export const HuisNongQiDui = 3;
export const HuisPengpeng = 4;
export const HuisXiaoShanYuan = 5;
export const HuisDaShanYuan = 6;
export const HuisGangShangKai = 7;
export const HuisGangShangPao = 8;
export const HuisPihu = 9;
//end自动生成代码
