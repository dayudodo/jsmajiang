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
        class LayaUtils {
            constructor() {
            }
            static clone(node) {
                var i;
                if (node instanceof Image) {
                    // var image:Image = new Image(node);
                    var image = node;
                    var distImage = new Image();
                    this.copyAttri(distImage, image);
                    distImage.skin = image.skin;
                    distImage.sizeGrid = image.sizeGrid;
                    for (let i = 0; i < image.numChildren; i++) {
                        distImage.addChild(this.clone(image.getChildAt(i)));
                    }
                    return distImage;
                }
                else if (node instanceof Sprite) {
                    var sprite = node;
                    var distSprite = new Sprite();
                    this.copyAttri(distSprite, sprite);
                    for (let i = 0; i < node.numChildren; i++) {
                        distSprite.addChild(this.clone(node.getChildAt(i)));
                    }
                    return distSprite;
                }
                else {
                    throw new Error("不支持的类型:" + typeof node);
                }
            }
            static copyAttri(dist, sprite) {
                dist.pos(sprite.x, sprite.y);
                dist.size(sprite.width, sprite.height);
                dist.scale(sprite.scaleX, sprite.scaleY);
                dist.pivot(sprite.pivotX, sprite.pivotY);
                dist.skew(sprite.skewX, sprite.skewY);
            }
            static handlerButton(btn) {
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
            }
            static random(max) {
                return Math.floor(Math.random() * max);
            }
        }
        utils.LayaUtils = LayaUtils;
    })(utils = mj.utils || (mj.utils = {}));
})(mj || (mj = {}));
//# sourceMappingURL=LayaUtils.js.map