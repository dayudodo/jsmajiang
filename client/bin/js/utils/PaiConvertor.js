var mj;
(function (mj) {
    var utils;
    (function (utils) {
        var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
        var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
        // 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
        var ZHIPAI = ["zh", "fa", "di"];
        //数字麻将表，加速版本
        var N_BING = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var N_TIAO = [10, 11, 12, 13, 14, 15, 16, 17, 18];
        var N_ZHIPAI = [31, 32, 33];
        class PaiConvertor {
            //转换b1到11， t1到22，
            static ToNumber(str) {
                let index = BING.indexOf(str);
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
            static ToShou(str) {
                return `shou_${this.ToNumber(str)}.png`;
            }
            static ToZheng(str) {
                return `zheng_${this.ToNumber(str)}.png`;
            }
            static ToCe(str) {
                return `ce_${this.ToNumber(str)}.png`;
            }
            /**
             * 转换类似于zh,fa的字符串到shou_31.png, shou_32.png的字符串
             * @param all_pais 所有服务器发过来的牌
             */
            static ToShouArray(all_pais) {
                return all_pais.map(item => {
                    return this.ToShou(item);
                });
            }
            static ToZhengArray(all_pais) {
                return all_pais.map(item => {
                    return this.ToZheng(item);
                });
            }
        }
        utils.PaiConvertor = PaiConvertor;
    })(utils = mj.utils || (mj.utils = {}));
})(mj || (mj = {}));
//# sourceMappingURL=PaiConvertor.js.map