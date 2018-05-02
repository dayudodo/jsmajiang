var mj;
(function (mj) {
    var manager;
    (function (manager) {
        var AudioManager = mj.manager.AudioManager;
        class GameSoundObserver {
            constructor() { }
            onPaiOut(sex, pai) {
                AudioManager.paiOut(sex, pai);
            }
            onPaiClick(pai) {
                AudioManager.paiClick();
            }
            onGang(sex) {
                AudioManager.gang(sex);
            }
            onPeng(sex) {
                AudioManager.peng(sex);
            }
            onChi(sex) {
                AudioManager.chi(sex);
            }
            onDealCard() {
                AudioManager.dealCard();
            }
            onButtonClick() {
                AudioManager.buttonClick();
            }
            onTimeupAlarm() {
                AudioManager.timeupAlarm();
            }
            onStopTimeupAlarm() {
                AudioManager.stopTimeupAlarm();
            }
            onEnter() {
                AudioManager.enter();
            }
        }
        manager.GameSoundObserver = GameSoundObserver;
    })(manager = mj.manager || (mj.manager = {}));
})(mj || (mj = {}));
//# sourceMappingURL=GameSoundObserver.js.map