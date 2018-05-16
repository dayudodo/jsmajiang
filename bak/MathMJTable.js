var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = ["zh", "fa", "di"];

//数字麻将表，加速版本
var N_BING = [11, 12, 13, 14, 15, 16, 17, 18, 19];
var N_TIAO = [22, 22, 23, 24, 25, 26, 27, 28, 29];
var N_ZHIPAI = [1, 2, 3];

//转换b1到11， t1到22，
function convertStrToNumber(str) {
  let index = BING.indexOf(str);
  //   console.log('index:', index)
  if (index > -1) {
    return N_BING[index];
  }
  index = TIAO.indexOf(str);
  if (index > -1) {
    return N_TIAO[index];
  }
  index = ZHIPAI.indexOf(str);
  if (index > -1) {
    return N_ZHIPAI[index];
  }
  if (index == -1) {
    throw new Error(`错误的参数${str}`);
  }
}

function convertArrToNumArr(long_str) {
  let str_arr = long_str.split(/\s+/);
  // console.dir(str_arr)
  return str_arr.map(str => {
    return convertStrToNumber(str);
  });
}

export { convertStrToNumber, convertArrToNumArr };
// export function convertNumberToStr() {}

// String.prototype.convertStrToNumber = function(str) {
//   let index = BING.indexOf(str);
//   if (index > -1) {
//     return N_BING[index];
//   }
//   index = TIAO.indexOf(str);
//   if (index > -1) {
//     return N_TIAO[index];
//   }
//   index = ZHIPAI.indexOf(str);
//   if (index > -1) {
//     return N_ZHIPAI[index];
//   }
// };
