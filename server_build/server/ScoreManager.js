"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//每一个玩家的数据保存在此类中
const config = require("./config");
/**算分管理器 */
class ScoreManager {
    static other_players(person, players) {
        // console.log("查找本玩家%s的其它玩家", person.username);
        let o_players = players.filter(p => p.user_id != person.user_id);
        // console.log(o_players.map(p => p.username));
        return o_players;
    }
    /**所有玩家的一局得分，计算结果直接保存到各player的oneju_score中 */
    static calculate_oneju_score(players) {
        let all_hu_players = players.filter(p => p.hupai_zhang != null);
        all_hu_players.forEach(hu_player => {
            let score = 0; //本局总分
            //如果自摸，其它两家出钱
            hu_player.hupai_data.all_hupai_typesCode.forEach(code => {
                let hu_item = config.HuPaiSheet.find(item => item.type == code);
                score += hu_item.multiple * config.base_score;
            });
            //todo:所有的胡都包括屁胡，所以可能需要减去屁胡的分，如果只有屁胡就不用减，或者直接就在获取hupai_data的时候处理？
            //单独的屁胡其实是不可能胡的，最小的胡也是屁胡+自摸！
            if (hu_player.is_zimo) {
                //自摸后需要扣除其它两个玩家的相应分数！
                this.other_players(hu_player, players).forEach(p => this.cal_fang_score(p, hu_player.hupai_data.all_hupai_typesCode));
                //然后再翻倍
                score = score * 2;
            }
        });
    }
    /**算player扣多少分，根据别人的typesCode */
    static cal_fang_score(player, typesCode) { }
}
exports.ScoreManager = ScoreManager;
//# sourceMappingURL=ScoreManager.js.map