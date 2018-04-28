var mj;
(function (mj) {
    var utils;
    (function (utils) {
        var Sprite = laya.display.Sprite;
        var Event = laya.events.Event;
        var Image = laya.ui.Image;
        /**
         * @author dayudodo@gmail.com 2018/4/28.
         */
        var LayaUtils = /** @class */ (function () {
            function LayaUtils() {
            }
            LayaUtils.clone = function (node) {
                var i;
                if (node instanceof Image) {
                    // var image:Image = new Image(node);
                    var image = node;
                    var distImage = new Image();
                    this.copyAttri(distImage, image);
                    distImage.skin = image.skin;
                    distImage.sizeGrid = image.sizeGrid;
                    for (var i_1 = 0; i_1 < image.numChildren; i_1++) {
                        distImage.addChild(this.clone(image.getChildAt(i_1)));
                    }
                    return distImage;
                }
                else if (node instanceof Sprite) {
                    var sprite = node;
                    var distSprite = new Sprite();
                    this.copyAttri(distSprite, sprite);
                    for (var i_2 = 0; i_2 < node.numChildren; i_2++) {
                        distSprite.addChild(this.clone(node.getChildAt(i_2)));
                    }
                    return distSprite;
                }
                else {
                    throw new Error("不支持的类型:" + typeof node);
                }
            };
            LayaUtils.copyAttri = function (dist, sprite) {
                dist.pos(sprite.x, sprite.y);
                dist.size(sprite.width, sprite.height);
                dist.scale(sprite.scaleX, sprite.scaleY);
                dist.pivot(sprite.pivotX, sprite.pivotY);
                dist.skew(sprite.skewX, sprite.skewY);
            };
            LayaUtils.handlerButton = function (btn) {
                btn.pivot(btn.width / 2, btn.height / 2);
                btn.pos(btn.x + btn.width / 2, btn.y + btn.height / 2);
                btn.on(Event.MOUSE_DOWN, btn, function () {
                    btn.scale(0.85, 0.85);
                });
                btn.on(Event.MOUSE_UP, btn, function () {
                    btn.scale(1, 1);
                });
                btn.on(Event.MOUSE_OUT, btn, function () {
                    btn.scale(1, 1);
                });
            };
            LayaUtils.random = function (max) {
                return Math.floor(Math.random() * max);
            };
            return LayaUtils;
        }());
        utils.LayaUtils = LayaUtils;
    })(utils = mj.utils || (mj.utils = {}));
})(mj || (mj = {}));
//# sourceMappingURL=LayaUtils.js.map