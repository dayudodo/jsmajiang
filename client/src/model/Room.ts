module mj.model {
    export class Room {
        public players: Player[] = []
        /** 前一玩家打的牌，因为会影响客户端显示，所以保存在此！ */
        public table_dapai : Pai
        public dapai_player: Player

        constructor() { }
        /** 左手玩家，在此确定玩家的UI顺序 */
        public left_player(person) { 
            let index = person.seat_index - 1
            index = (index == -1 ? config.LIMIT_IN_ROOM - 1 : index)
            let player = this.players.find(p => p.seat_index == index)
            if (player) { player.ui_index = config.UI_LEFT_INDEX }
            return player
        }
        /** 右手玩家，在此确定玩家的UI顺序 */
        public right_player(person) {
            let index = person.seat_index + 1
            index = (index == config.LIMIT_IN_ROOM ? 0 : index)
            let player = this.players.find(p => p.seat_index == index)
            if (player) { player.ui_index = config.UI_RIGHT_INDEX }
            return player
        }
        /** 除了person外的其它玩家们 */
        public other_players(person: Player): Array<Player> {
            return this.players.filter(p => p.user_id != person.user_id);

        }

    }
}