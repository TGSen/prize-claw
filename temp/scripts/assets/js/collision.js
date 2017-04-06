"use strict";
cc._RFpush(module, '18034riVSlP5pWZgaxovXRH', 'collision');
// js\collision.js

'use strict';

cc.Class({
    extends: cc.Component,
    onLoad: function onLoad() {
        this.init();
    },
    init: function init() {
        this.main = cc.director.getScene().getChildByName('main').getComponent('main');
    },
    onCollisionEnter: function onCollisionEnter(other, self) {
        /* 检测爪子状态
        * 非 grab 状态
        * 不作碰撞处理
        */
        if (this.main.game.claw.state !== 'grab') return;
        if (self.node.name === 'left') {
            this.main.game.claw.catched = this.checkLeft(other, self);
        } else if (self.node.name === 'right') {
            this.main.game.claw.catched = this.checkRight(other, self);
        } else console.error('请检查组件名设置');

        if (this.main.game.claw.catched) {
            this.main.game.claw.gift = other.node;
        }
    },
    onCollisionStay: function onCollisionStay(other, self) {},
    checkLeft: function checkLeft(gift, claw) {
        // 转成世界坐标
        var pos = {
            gift: gift.node.convertToWorldSpace(0, 0),
            claw: claw.node.convertToWorldSpace(0, 0)
        };

        var delta = pos.gift.x - pos.claw.x;

        if (delta > 20) return true;
        return false;
    },
    checkRight: function checkRight(gift, claw) {
        // 转成世界坐标
        var pos = {
            gift: gift.node.convertToWorldSpace(0, 0),
            claw: claw.node.convertToWorldSpace(0, 0)
        };

        var delta = pos.claw.x - pos.gift.x;

        if (delta > 10) return true;

        return false;
    }
});

cc._RFpop();