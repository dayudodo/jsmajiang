namespace mj.utils {
  var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
  var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
  // 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
  var ZHIPAI = ["zh", "fa", "di"];

  //数字麻将表，加速版本
  var N_BING = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var N_TIAO = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  var N_ZHIPAI = [31, 32, 33];

  export class PaiConverter {
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
    static ToShou(pai_name: Pai): string {
      return `shou_${this.ToNumber(pai_name)}.png`;
    }
    /**
     * 返回类似于ui/majiang/shou_??.png的字符串，用于替换麻将牌的显示
     * @param str 
     */
    static skinOfShou(pai_name: Pai): string {
      return `ui/majiang/${this.ToShou(pai_name)}`
    }
    static skinOfShouBack():string{
      return `ui/majiang/zheng_an.png`
    }
    /** 打出牌的样子，以zheng开头的图形 */
    static skinOfZheng(pai_name: Pai): string {
      return `ui/majiang/${this.ToZheng(pai_name)}`
    }
    /** 别家打出牌的样子，以ce开头的图形 */
    static skinOfCe(pai_name: Pai): string {
      return `ui/majiang/${this.ToCe(pai_name)}`
    }
    static ToZheng(pai_name: Pai): string {
      return `zheng_${this.ToNumber(pai_name)}.png`;
    }
    /**
     * 转化成左右风格的牌面（牌是横着的），以ce开头的图片
     * @param str 
     */
    static ToCe(pai_name: Pai): string {
      return `ce_${this.ToNumber(pai_name)}.png`;
    }

    /** 转换类似于zh,fa的字符串到shou_31.png, shou_32.png的字符串 */
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
    /** 转换成以ce开头的横牌url数组，比如fa,zh变成ce_31.png, ce_32.png */
    static ToCeArray(all_pais: Array<string>): Array<string> {
      return all_pais.map(item => {
        return this.ToCe(item);
      });
    }
    /** 根据countNum计算出其图片skin */
    static CountDownNumSkin(countNum: number): Array<string> {
      if (countNum > 99) { console.warn('最多只能显示2位数字！') }
      let num1, num0
      if (countNum > 9) {
        num1 = new String(countNum)[0]
        num0 = new String(countNum)[1]
      } else {
        num1 = "0"
        num0 = new String(countNum)[0]
      }
      return [`ui/game/${num1}.png`, `ui/game/${num0}.png`]
    }

  }
}
