// import MJ from '../server/Majiang'
var MJ = require("../server_build/Majiang");

describe("Base is", function() {
  it("应为将", function() {
    expect(MJ.isAA("b1 b1")).toBe(true);
  });
  it("should将", function() {
    expect(MJ.isAA("b1b1")).toBe(true);
  });
  it("should一句话", function() {
    expect(MJ.isAAA("b1 b1 b1")).toBe(true);
    //reg版本的检测，其实只有两条。
    expect(MJ.isAAA_reg("b1 b1 b1")).toBe(true);
  });
  it("should一句话false", function() {
    expect(MJ.isAAA("b1 b1   b2")).toBe(false);
  });

  //暂时
  //     describe('is4A group', function() {
  //         it(`0 should is4A 'b1 b1 b1 b1' true`, function() {
  //             let str = 'b1 b1 b1 b1'
  //             expect(is4A(str)).toBe(true)
  //         });
  //         it(`0 should is4A 'b1b1b1b1' true`, function() {
  //             let str = 'b1b1b1b1'
  //             expect(is4A(str)).toBe(true)
  //         });
  //         it("0.0 should is4A 'b1 b1 b1 b1' true", function() {
  //             let str = 'b1 b1 b1 b1'
  //             expect(is4A_reg(str)).toBe(true)
  //         });
  //         it(`1 should is4A  false`, function() {
  //             let str = 'b1 b2 b1 b1'
  //             expect(is4A(str)).toBe(false)
  //         });
  //         it(`2 should is4A  false`, function() {
  //             let str = 'b1 b1 b2 b1'
  //             expect(is4A(str)).toBe(false)
  //         });
  //         it(`3 should is4A  false`, function() {
  //             let str = 'b1 b1 b1 b2'
  //             expect(is4A(str)).toBe(false)
  //         });
  //         it('4 should vlaid4A throw error', function() {
  //             let str = 'b1'
  //             expect(is4A.bind(null, str)).toThrowError(/must have/)
  //         });
  //     });

  //     describe('ABC group', function() {
  //         it('should isABC true', function() {
  //             expect(isABC('b1 b2 b3')).toBe(true)
  //         });
  //         it('should isABC true', function() {
  //             expect(isABC('f7 f8 f9')).toBe(true)
  //         });
  //         it('should isABC false', function() {
  //             expect(isABC('b1 b2 b4')).toBe(false)
  //         });
  //         it('should isABC throw null error', function() {
  //             expect(isABC).toThrowError(/empty/)
  //             // expect(foo(1)).toThrowError(/foo/)
  //         });
  //         it('should isABC throw values error', function() {
  //             let str = 'b1 b2 b4 b5'
  //             expect(isABC.bind(null, str)).toThrowError(/must have/)
  //         });
  //     });

  //     describe('2ABC group', function() {
  //         it('1 should is2ABC true', function() {
  //             let str = 'b1 b2 b3 b4 b5 b6'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('1.1 should is2ABC true', function() {
  //             let str = 'b1 b2 b3 b5 b4 b6'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('1.2 should is2ABC true', function() {
  //             let str = 'b1 b2 b3 t5 t4 t6'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('2 should is2ABC true', function() {
  //             let str = 'b1 b2 b2 b3 b3 b4'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('3 should is2ABC true', function() {
  //             let str = 'b1 b1 b1 t3 t4 t5'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('4 should is2ABC 非框', function() {
  //             let str = 'b1 b2 b3 b3 b3 b3'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('5 should is2ABC true', function() {
  //             let str = 'b1 b2 b3 zh zh zh'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('5.1 should is2ABC true', function() {
  //             let str = 'b1 b1 b2 b2 b3 b3'
  //             expect(is2ABC(str)).toBe(true)
  //         });
  //         it('6 should is2ABC false', function() {
  //             let str = 'b1 b2 t2 b3 b3 b5'
  //             expect(is2ABC(str)).toBe(false)
  //         });
  //         it('7 should is2ABC true', function() {
  //             let str = 'fa fa fa b1 t1 zh'
  //             expect(is2ABC(str)).toBe(false)
  //         });
  //         it('7 should is2ABC true', function() {
  //             let str = 'fa fa fa b1 t1 zh'
  //             expect(is2ABC(str)).toBe(false)
  //         });
  //     });

  //     describe('is3ABC group', function() {
  //         it('is3ABC 正规九张牌', function() {
  //             let str = 'b1 b2 b3 fa fa fa t1 t2 t3'
  //             expect(is3ABC(str)).toBe(true)
  //         });
  //         it('is3ABC 九张 122334123', function() {
  //             let str = 'b1 b2 b2 b3 b3 b4 t1 t2 t3'
  //             expect(is3ABC(str)).toBe(true)
  //         });
  //         it('is3ABC 九张 112233456', function() {
  //             let str = 'b1 b1 b2 b2 b3 b3 b4 b5 b6'
  //             expect(is3ABC(str)).toBe(true)
  //         });
  //         it('is3ABC 九张 123445566', function() {
  //             let str = 'b1 b2 b3 b4 b4 b5 b5 b6 b6'
  //             expect(is3ABC(str)).toBe(true)
  //         });
  //     });

  //     describe('is4ABC group', function() {
  //         it('is4ABC 12张牌', function() {
  //             let str = 'b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6'
  //             expect(is4ABC(str)).toBe(true)
  //             let str1 = 'b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4'
  //             expect(is4ABC(str1)).toBe(true)
  //         });
  //         it('is4ABC 12张牌 前6错位', function() {
  //             let str = 'b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4'
  //             expect(is4ABC(str)).toBe(true)
  //         });
  //         it('is4ABC 12张牌，中间错位', function() {
  //             let str = 'zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3'
  //             expect(is4ABC(str)).toBe(true)
  //         });
  //         it('is4ABC 12张牌 前9 112233', function() {
  //             let str = 'b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9'
  //             expect(is4ABC(str)).toBe(true)
  //         });
  //         it('is4ABC 12张牌 后9 112233', function() {
  //             let str = 'b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7'
  //             expect(is4ABC(str)).toBe(true)
  //         });
  //         it('is4ABC 12 false', function() {
  //             let str = 'b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh'
  //             expect(is4ABC(str)).toBe(false)
  //         });
  //         it('is4ABC 12张牌', function() {
  //             let str = 'b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6'
  //             expect(is4ABC(str)).toBe(true)
  //         });
  //     });
  // });

  // describe('屁胡', function() {
  //     it('普通屁胡', function() {
  //         let str = 'b1 b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh zh'
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     it('多个同花色规则屁胡', function() {
  //         let str = 'b1 b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa'
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     it('带杠屁胡', function() {
  //         let str = 't1 t2 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh'
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     it('双杠屁胡', function() {
  //         let str = 'b1 b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5'
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     it('屁胡清一色', function() {
  //         let str = 'b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7'
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     it('少张屁胡', function() {
  //         let str = "b1 b1 b1 b2 b3 b7 b7 b7 b7 b8 b9"
  //         expect(isPihu(str)).toBe(true)
  //     });
  //     describe('false', function() {
  //         it('should behave...', function() {
  //             let str = 'b1 b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9'
  //             expect(isPihu(str)).toBe(false)
  //         });
  //         it('将都没有', function() {
  //             let str = 'b1b2b3'
  //             expect(isPihu(str)).toBe(false)
  //         });
  //     });
  // });

  // describe('特殊胡', function() {
  //     it('七对及龙七对', function() {
  //         let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 t9"
  //         expect(isQidui(str)).toBe(true)
  //         expect(isNongQiDui(str)).toBe(true)
  //     });
  //     it('清一色', function() {
  //         let str = 'b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7 b7'
  //         expect(isYise(str)).toBe(true)
  //     });
  //     it('碰碰胡将在后', function() {
  //         let str = 'b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di di'
  //         expect(isPengpeng(str)).toBe(true)
  //     });
  //     it('碰碰胡将在前', function() {
  //         let str = 'di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa'
  //         expect(isPengpeng(str)).toBe(true)
  //     });
  //     it('碰碰糊带1杠', function() {
  //         let str = 'b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 t5'
  //         expect(isPengpeng(str)).toBe(true)
  //     });
  //     it('碰碰糊带2杠', function() {
  //         let str = 'b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 fa fa fa t5 t5'
  //         expect(isPengpeng(str)).toBe(true)
  //     });
  //     it('碰碰糊带3杠', function() {
  //         let str = 'b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 t5'
  //         expect(isPengpeng(str)).toBe(true)
  //     });
  //     it('碰碰糊带3杠少将', function() {
  //         let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh"
  //         let na_pai = "b2"
  //         expect(isPengpeng(str + na_pai)).toBe(true)
  //     });
  //     it('卡五星', function() {
  //         let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5"
  //         let na_pai = 'b5'
  //         expect(isKaWuXinG(str, na_pai)).toBe(true)
  //     });
  //     it('三杠卡五星', function() {
  //         let str = "b1 b1 b1 b1 b2 b2 b2 b2 b4 b6 t3 t3 t3 t3 t5 t5"
  //         let na_pai = 'b5'
  //         expect(isKaWuXinG(str, na_pai)).toBe(true)
  //     });
  //     it('清一色卡五星', function() {
  //         let str = 'b1 b1 b1 b2 b3 b4 b6 b7 b7 b7 b7 b8 b9'
  //         let na_pai = 'b5'
  //         expect(isKaWuXinG(str, na_pai)).toBe(true)
  //         expect(isYise(str + na_pai)).toBe(true)
  //     });
  //     describe('false', function() {
  //         it('非七对', function() {
  //             let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 t8"
  //             expect(isQidui(str)).toBe(false)
  //         });
  //         it('不是清一色', function() {
  //             let str = 'b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7 fa'
  //             expect(isYise(str)).toBe(false)
  //         })
  //         it('不是碰碰胡', function() {
  //             let str = 'b1 b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di'
  //             expect(isPengpeng(str)).toBe(false)
  //         });
  //         it('可胡但不是卡五星', function() {
  //             let str = 't1 t2 t3 t4 t5 t6 b6 b7 b7 b7 b7 b8 b9'
  //             var na_pai = 'b5'
  //             expect(isKaWuXinG(str, na_pai)).toBe(false)
  //             expect(isPihu(str + na_pai)).toBe(true)
  //         });
  //         it('胡五条但不是卡', function() {
  //             let str = "fa fa fa t2 t2 t3 t4 t6 t7 t8 zh zh zh"
  //             var na_pai = "t5"
  //             expect(isKaWuXinG(str, na_pai)).toBe(false)
  //             expect(isPihu(str + na_pai)).toBe(true)
  //         });
  //     });
});

// describe('胡啥牌', function() {
//     it('清一色听牌', function() {
//         let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7"
//         expect(whoIsHu(str)).toEqual(["b5", "b7"])
//     });
//     it('清一色听7张', function() {
//         let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 b9 b9 b9"
//         expect(whoIsHu(str)).toEqual([
//             "b1","b3","b4","b6","b7","b8","b9"
//         ])
//     });

//     it('双将倒', function() {
//         let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa"
//         expect(whoIsHu(str)).toEqual(["di", "zh"])
//     });
//     it('单钓将', function() {
//         let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8"
//         expect(whoIsHu(str)).toEqual(["b3", "b6", "b8", "b9"])
//     });
//     it('清一色听牌false', function() {
//         let str = 'b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5'
//         expect(whoIsHu(str)).toBe(false)
//     });
// });

describe("合理性项目", function() {
  //这个没有任何意义，因为在检测的时候会多添加到5张牌。
  // it('不能有五张牌', function() {
  // 	//todo:检查牌面正确性
  // 	let str= 'b1 b2 b2 b2 b3  t1 t1 t1 t1 t2 t2 t3 t3'
  // 	expect(whoIsHu.bind(null,str)).toThrowError(/irregular/)
  // });
});
