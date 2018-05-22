module mj.model {

    /**手牌组，根据这些来进行手牌的显示 */
    export interface ShoupaiConstuctor {
        anGang: Array<Pai>;
        /**暗杠计数 */
        anGangCount?: number;
        mingGang: Array<Pai>;
        selfPeng:Array<Pai>;
        selfPengCount?: number;
        peng: Array<Pai>;
        /** 剩余的牌，也可能会有3连续牌，说明没有遇到碰牌 */
        shouPai: Array<Pai>;
        /**手牌计数 */
        shouPaiCount?: number;
    }
    export class Player {
        static filter_properties = [
            "username",
            "user_id",
            "seat_index",
            "group_shou_pai",
            "arr_dapai",
            "is_liang",
            "is_ting"
        ];
        public username: string
        public user_id: string
        private _flat_shou_pai: Array<Pai> = []
        public group_shou_pai: ShoupaiConstuctor = {
            anGang: [],
            mingGang: [],
            selfPeng:[],
            peng: [],
            shouPai: []
        }
        /**clone的界面元素全部保存在此 */
        public ui_clone_arr = []
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
        /** 手牌从哪个位置开始 */
        public shouPai_start_index = 0
        /**玩家group手牌中的shouPai数量 */
        public shouPaiCount
        /**玩家group手牌中的暗杠数量 */
        public anGangCount

        constructor() { }

        cloneValuesFrom(p2){
            Player.filter_properties.forEach(prop=>{
                this[prop] = p2[prop]
            })
        }
        /** 应该只初始化 一次，以后的添加删除通过add, delete来操作 */
        get flat_shou_pai(): Array<Pai> {
            let real_shoupai = [];
            this.group_shou_pai.anGang.forEach(pai => {
                for (let i = 0; i < 4; i++) {
                    real_shoupai.push(pai);
                }
            });
            this.group_shou_pai.mingGang.forEach(pai => {
                for (let i = 0; i < 4; i++) {
                    real_shoupai.push(pai);
                }
            });
            this.group_shou_pai.peng.forEach(pai => {
                for (let i = 0; i < 3; i++) {
                    real_shoupai.push(pai);
                }
            });
            real_shoupai = real_shoupai.concat(this.group_shou_pai.shouPai);
            return real_shoupai.sort();
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

        /**玩家收到的牌，保存到手牌及group手牌中 */
        set received_pai(pai: Pai) {
            this._received_pai = pai;
            this.group_shou_pai.shouPai.push(pai);
        }
        get received_pai() {
            return this._received_pai;
        }
        /**  从玩家手牌中删除pai并计算胡牌*/
        da_pai(pai: Pai) {
            if (this.delete_pai(this.group_shou_pai.shouPai, pai)) {
                this.arr_dapai.push(pai);
            } else {
                throw new Error(`${this.username}打了张非法牌？${pai}`);
            }
            this._received_pai = null; //打牌之后说明玩家的桌面牌是真的没有了
            this.group_shou_pai.shouPai.sort() //打牌之后还是需要重新排序下的，以和服务器保持一致。
        }
        /** arr_dapai中的index号换算成行列坐标 */
        coordinateOf(index: number): [number, number] {
            let line = 0, row = 0
            if (index >= config.OutLineBreakCount) {
                line = 1
                row = index - config.OutLineBreakCount
            } else {
                line = 0
                row = index
            }
            return [line, row]
        }

    }
}