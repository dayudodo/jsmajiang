module mj.model {
    export class Player {
        public username: string
        public user_id: string
        public shou_pai: string[] = []
        public used_pai: string[] = []
        public room_name: string
        public hupai_zhang: string

        constructor() {
        }
        da_pai(pai: string) {
            this.shou_pai.push(pai) //打牌的时候才会把牌保存到手牌中统一处理！
            let firstIndex = this.shou_pai.indexOf(pai);
            if (firstIndex > -1) {
                this.shou_pai.splice(firstIndex, 1);
                this.used_pai.push(pai);
            } else {
                throw new Error(
                    `我居然打了张不存在的牌？${pai}`
                );
            }
        }
    }
}