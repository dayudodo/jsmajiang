namespace mj.utils {
  var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
  var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
  // 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
  var ZHIPAI = ["zh", "fa", "di"];

  //数字麻将表，加速版本
  var N_BING = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var N_TIAO = [9,10, 11, 12, 13, 14, 15, 16, 17];
  var N_ZHIPAI = [31, 32, 33];

  export class PaiConvertor {
    //转换b1到11， t1到22，
    static ToNumber(str: string): number {
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
    static ToShou(str: string): string {
      return `shou_${this.ToNumber(str)}.png`;
    }
    /**
     * 返回类似于ui/majiang/shou_??.png的字符串，用于替换麻将牌的显示
     * @param str 
     */
    static skinOfShou(str:string):string{
      return `ui/majiang/${this.ToShou(str)}`
    }
    static ToZheng(str: string): string {
      return `zheng_${this.ToNumber(str)}.png`;
    }
    /**
     * 转化成左右风格的牌面（牌是横着的），以ce开头的图片
     * @param str 
     */
    static ToCe(str: string): string {
      return `ce_${this.ToNumber(str)}.png`;
    }

    /**
     * 转换类似于zh,fa的字符串到shou_31.png, shou_32.png的字符串
     * @param all_pais 所有服务器发过来的牌
     */
    static ToShouArray(all_pais: Array<string>): Array<string> {
      return all_pais.map(item => {
        return this.ToShou(item);
      });
    }

    static ToZhengArray(all_pais: Array<string>): Array<string> {
      return all_pais.map(item => {
        return this.ToZheng(item);
      });
    }
    /**
     * 转换成以ce开头的横牌url数组，比如fa,zh变成ce_31.png, ce_32.png
     * @param all_pais 
     */
    static ToCeArray(all_pais: Array<string>): Array<string> {
      return all_pais.map(item => {
        return this.ToCe(item);
      });
    }
  }
}
