var config;
(function (config) {
    config.LIMIT_IN_ROOM = 3; //房间玩家人数上限
    config.UI_LEFT_INDEX = 0;
    config.UI_RIGHT_INDEX = 2;
    /** 客户端玩家UI中的序号，比如shouPai3, out3 */
    config.GOD_INDEX = 3;
    /** 用户操作最大等待时间 */
    config.MAX_WAIT_TIME = 10;
    /**弹出框背景透明度*/
    config.BackGroundAlpha = 0.5;
    /**out牌中多少数量换行 */
    config.OutLineBreakCount = 13;
    /** 手牌与左边杠、碰牌的缝隙 */
    config.GAP = 20;
})(config || (config = {}));
//# sourceMappingURL=config.js.map