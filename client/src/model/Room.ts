module mj.model {
    export class Room {
        public players: Player[] = []
        constructor() { }

        public left_player(person) { //左手玩家
            let index = person.seat_index - 1
            index = index == -1 ? config.LIMIT_IN_ROOM - 1 : index
            return this.players[index]
        }
        public right_player(person) { //右手玩家
            let index = person.seat_index + 1
            index = index == config.LIMIT_IN_ROOM ? 0 : index
            return this.players[index]
        }
    }
}