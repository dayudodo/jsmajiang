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