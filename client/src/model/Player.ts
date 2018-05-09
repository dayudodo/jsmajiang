module mj.model {
    /**手牌组，根据这些来进行手牌的显示 */
    interface ShoupaiConstuctor {
        anGang: Array<Pai>
        mingGang: Array<Pai>
        peng: Array<Pai>
        /** 剩余的牌，也可能会有3连续牌，说明没有遇到碰牌 */
        shouPai: Array<Pai>
    }
    export class Player {
        public username: string
        public user_id: string
        private _flat_shou_pai: Array<Pai> = []
        public group_shou_pai: ShoupaiConstuctor = {
            anGang: [],
            mingGang: [],
            peng: [],
            shouPai: []
        }
        public arr_dapai: Pai[] = []
        public room_name: string
        public hupai_zhang: string
        private _received_pai: Pai
        /**         是否是庄家         */
        public east = false;
        /**         玩家的席位！         */
        public seat_index = null;
        /**玩家的积分 */
        public score = 0;
        /** 在界面中的序号，左玩家是0，右玩家是2, 上玩家是1，自己是3 */
        public ui_index: number = null;

        constructor() { }
        /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
        set flat_shou_pai(arr_pai: Array<Pai>) {
            this._flat_shou_pai = arr_pai;
            this.group_shou_pai.shouPai = arr_pai;
        }
        /** 玩家手牌数组 */
        get flat_shou_pai(): Array<Pai> {
            return this._flat_shou_pai;
        }
        /** 手牌中增加一张牌 */
        add_shoupai(pai: Pai) {
            this._flat_shou_pai.push(pai);
            this.group_shou_pai.shouPai.push(pai)
        }
        /** 从牌数组中删除一张牌 */
        private delete_pai(arr: Array<Pai>, pai: Pai): boolean {
            let firstIndex = arr.indexOf(pai);
            if (firstIndex > -1) {
                arr.splice(firstIndex, 1);
                return true;
            } else {
                return false;
            }
        }
        /**从手牌中删除一张牌，同时也会删除group_shou_pai中的！ */
        delete_shoupai(pai: Pai): boolean {
            let shouResult = this.delete_pai(this._flat_shou_pai, pai);
            this._flat_shou_pai.sort(); //删除元素之后排序
            let groupShouResult = this.delete_pai(this.group_shou_pai.shouPai, pai);
            this.group_shou_pai.shouPai.sort();
            return shouResult && groupShouResult
        }
        /**玩家收到的牌，有三种途径：服务器发的牌，碰、杠到的牌 */
        set received_pai(pai: Pai) {
            this._received_pai = pai;
            this.add_shoupai(pai)
        }
        get received_pai() {
            return this._received_pai;
        }
        /**         从玩家手牌中删除pai         */
        da_pai(pai: Pai) {
            if (this.delete_shoupai(pai)) {
                this.arr_dapai.push(pai);
            } else {
                throw new Error(`${this.username}居然打了张不存在的牌？${pai}`);
            }
            this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
        }
        confirm_peng(pai: Pai) {
            //首先从手牌中删除三张牌，变成peng: pai
            for (var i = 0; i < 3; i++) {
                this.delete_pai(this.group_shou_pai.shouPai, pai)
            }
            this.group_shou_pai.peng.push(pai)
        }
        confirm_mingGang(pai: Pai) {
            //首先从手牌中删除三张牌，变成peng: pai
            for (var i = 0; i < 4; i++) {
                this.delete_pai(this.group_shou_pai.shouPai, pai)
            }
            this.group_shou_pai.mingGang.push(pai)
        }
        confirm_anGang(pai: Pai) {
            //首先从手牌中删除三张牌，变成peng: pai
            for (var i = 0; i < 4; i++) {
                this.delete_pai(this.group_shou_pai.shouPai, pai)
            }
            this.group_shou_pai.anGang.push(pai)
        }
        /** 最后一张打出的牌在out中的坐标，out结构为2行*12列 */
        get last_out_coordinate(): [number, number] {
            let line = 0, row = 0
            let len = this.arr_dapai.length
            if (len >= config.OutLineBreakCount) {
                line = 1
                row = len - config.OutLineBreakCount
            } else {
                line = 0
                row = (len == 0 ? 0 : len - 1)
            }
            return [line, row]
        }

    }
}