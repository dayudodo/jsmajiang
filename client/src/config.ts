type Pai = string

namespace config {


    export const LIMIT_IN_ROOM = 3; //房间玩家人数上限
    export const UI_LEFT_INDEX = 0
    export const UI_RIGHT_INDEX = 2
    /** 客户端玩家UI中的序号，比如shouPai3, out3 */
    export const GOD_INDEX = 3
    /** 用户操作最大等待时间 */
    export const MAX_WAIT_TIME = 10
    /**弹出框背景透明度*/
    export const BackGroundAlpha = 0.5;
    /**out牌中多少数量换行 */
    export const OutLineBreakCount = 13
    /** 本玩家手牌与左边杠、碰牌的缝隙 */
    export const X_GAP = 30
    /**左右玩家杠、碰牌与手牌的间隙 */
    export const Y_GAP = 10
    /**组牌（杠、碰组）缩小比率 */
    export const GROUP_RATIO = 0.9
}

