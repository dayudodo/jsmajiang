var mj;
(function (mj) {
    var manager;
    (function (manager) {
        var AudioManager = mj.manager.AudioManager;
        var GameSoundObserver = /** @class */ (function () {
            function GameSoundObserver() {
            }
            GameSoundObserver.prototype.onPaiOut = function (sex, pai) {
                AudioManager.paiOut(sex, pai);
            };
            GameSoundObserver.prototype.onPaiClick = function (pai) {
                AudioManager.paiClick();
            };
            GameSoundObserver.prototype.onGang = function (sex) {
                AudioManager.gang(sex);
            };
            GameSoundObserver.prototype.onPeng = function (sex) {
                AudioManager.peng(sex);
            };
            GameSoundObserver.prototype.onChi = function (sex) {
                AudioManager.chi(sex);
            };
            GameSoundObserver.prototype.onDealCard = function () {
                AudioManager.dealCard();
            };
            GameSoundObserver.prototype.onButtonClick = function () {
                AudioManager.buttonClick();
            };
            GameSoundObserver.prototype.onTimeupAlarm = function () {
                AudioManager.timeupAlarm();
            };
            GameSoundObserver.prototype.onStopTimeupAlarm = function () {
                AudioManager.stopTimeupAlarm();
            };
            GameSoundObserver.prototype.onEnter = function () {
                AudioManager.enter();
            };
            return GameSoundObserver;
        }());
        manager.GameSoundObserver = GameSoundObserver;
    })(manager = mj.manager || (mj.manager = {}));
})(mj || (mj = {}));
//# sourceMappingURL=GameSoundObserver.js.map