import * as _ from "lodash";
import { MajiangAlgo } from "./MajiangAlgo";
import { Player } from "./player";
//每一个玩家的数据保存在此类中
import * as config from "./config";
import { Room } from "./room";

/**算分管理器 */
export class ScoreManager {
  static other_players(person, players): Array<Player> {
    // console.log("查找本玩家%s的其它玩家", person.username);
    let o_players = players.filter(p => p.user_id != person.user_id);
    // console.log(o_players.map(p => p.username));
    return o_players;
  }
  /**所有玩家的一局得分，计算结果直接保存到各player的oneju_score中 */
  static cal_oneju_score(players: Player[]) {
    let all_hu_players = players.filter(p => p.hupai_zhang != null);
    all_hu_players.forEach(hu_player => {
      let score = 0; //本局总分
      let all_typesCode = hu_player.win_data.all_hupai_typesCode;
      //如果自摸，其它两家出钱
      all_typesCode.forEach(code => {
        score += this.scoreOf(code);
      });
      //杠牌算分，暗杠、擦炮两家给钱，这些应该由room负责保存胡牌代码。

      //todo:所有的胡都包括屁胡，所以可能需要减去屁胡的分，如果只有屁胡就不用减，或者直接就在获取hupai_data的时候处理？
      //单独的屁胡其实是不可能胡的，最小的胡也是屁胡+自摸！
      if (hu_player.is_zimo) {
        //自摸后需要扣除其它两个玩家的相应分数！
        this.other_players(hu_player, players).forEach(p => {
          p.oneju_score -= this.cal_fang_score(all_typesCode);
        });
        //todo: 自摸的算番
      } else {
        //不是自摸，有人放炮，扣除放炮者的分数！
        let fang_player = players.find(p => true == p.is_fangpao);
        fang_player.oneju_score -= this.cal_fang_score(all_typesCode);
      }

      //杠单独算


      hu_player.oneju_score = score;
    });
  }
  /**计算某种胡code的分数 */
  static scoreOf(code: number): number {
    let hu_item = config.HuPaiSheet.find(item => item.type == code);
    return hu_item.multiple * config.base_score;
  }
  /**某种杠code的分数 */
  static gangScoreOf(code: number): number {
    let hu_item = config.GangSheet.find(item => item.type == code);
    return hu_item.multiple * config.base_score;
  }
  /**typesCode中的所有杠分 */
  static cal_gang_score(typesCode: number[]): number {
    let score = 0;
    let gangCodes = typesCode.filter(
      code => config.HuisGang == code || config.HuisAnGang == code || config.HuisCaPao == code
    );
    gangCodes.forEach(code => {
      score += this.gangScoreOf(code);
    });
    return score;
  }
  /**算player扣多少分，根据别人的typesCode */
  static cal_fang_score(typesCode: number[]): number {
    let score = 0;
    typesCode.forEach(code => {
      score += this.scoreOf(code);
    });
    return score;
  }
}
