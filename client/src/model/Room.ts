module mj.model {
    export class Room {
        public players: Player[] = []
        constructor() { }

        public left_player(person) { //左手玩家
            let index = person.seat_index - 1
            index = (index == -1 ? config.LIMIT_IN_ROOM - 1 : index)
            let player = this.players.find(p => p.seat_index == index)
            if (player) { player.ui_index = config.UI_LEFT_INDEX }
            return player
        }
        public right_player(person) { //右手玩家
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