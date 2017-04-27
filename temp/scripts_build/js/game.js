"use strict";
cc._RFpush(module, 'be740OC+ZdLJbeMsYWW/y50', 'game');
// js\game.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _claw = require('claw');

var _claw2 = _interopRequireDefault(_claw);

var _rule = require('rule');

var _rule2 = _interopRequireDefault(_rule);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _starPrompt = require('starPrompt');

var _starPrompt2 = _interopRequireDefault(_starPrompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = cc.Class({
    extends: cc.Component,
    properties: {
        startBtn: {
            default: null,
            type: cc.Node
        },
        border: {
            default: null,
            type: cc.Node
        },
        pitAround: {
            default: null,
            type: cc.Node
        },
        stakeLayout: {
            default: null,
            type: cc.Node
        },
        stakeBtns: {
            default: [],
            type: cc.Node
        },
        ruleBtn: {
            default: null,
            type: cc.Node
        },
        addBtn: {
            default: null,
            type: cc.Node
        },
        giftBtn: {
            default: null,
            type: cc.Node
        },
        claw: {
            default: null,
            type: _claw2.default
        },
        rule: {
            default: null,
            type: _rule2.default
        },
        prompt: {
            default: null,
            type: _prompt2.default
        },
        stake: {
            default: null,
            type: cc.Node
        },
        result: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Node
        },
        scoreBkg: {
            default: null,
            type: cc.Node
        },
        voice: {
            default: null,
            type: cc.Node
        },
        activityBox: {
            default: null,
            type: cc.Node
        },
        starBox: {
            default: null,
            type: cc.Node
        },
        qMark: {
            default: null,
            type: cc.Node
        },
        starResultTip: {
            default: null,
            type: cc.Node
        },
        starPrompt: {
            default: null,
            type: _starPrompt2.default
        }
    },
    onLoad: function onLoad() {
        this.init();
        this.listen();
        window._main.api.monitor('进入游戏', 1);
        window._main.api.onEvent('进入游戏');
    },
    init: function init() {

        window._main.audio.bgm.play();
        //
        this.bgm = window._main.audio.bgm.isPlaying;

        this.voice.getComponent(cc.Sprite).spriteFrame = this.bgm ? window._main.spriteFrames.voiceOn : window._main.spriteFrames.voiceClose;

        // 坑下围 zIndex < gift.zIndex
        this.pitAround.zIndex = 1;

        // 场次id
        this.matchId = null;

        // 隐藏结果提示框
        this.result.active = false;

        // 隐藏获奖记录
        window._main.record.node.active = false;

        // 设置边框的 zIndex
        this.border.zIndex = 3;

        // 按钮 zIndex
        this.stakeLayout.zIndex = this.startBtn.zIndex = 3;

        this.stake.zIndex = 3;

        // 设置音效按钮 zIndex
        this.voice.zIndex = 3;

        // 下注值
        this.stakeValue = null;

        // 获取场次
        // this.getModelList()
        this.matchId = 4;

        this.getPrizeList();
    },
    setMatch: function setMatch(index, id) {
        var btn = this.stakeBtns[index];

        btn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.stakeBtnPress;

        var text = btn.getChildByName('text');
        text.stopAllActions();
        text.runAction(cc.jumpTo(1, 0, 9, 10, 3));

        // 设置 当前下注值
        this.setStake(index);

        // 设置 当前场次 id
        this.matchId = id;

        this.getPrizeList();
    },
    setStake: function setStake(val) {
        switch (val) {
            case 1:
                this.stake.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.matchM;
                break;
            case 2:
                this.stake.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.matchL;
                break;
            default:
                this.stake.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.matchS;
                break;
        }
    },


    // 获取可玩场次
    getModelList: function getModelList() {
        var _this2 = this;

        window._main.api.getModelList().then(function (res) {
            if (res.data.ok) {

                res.data.r.forEach(function (item, i) {
                    _this2.stakeBtns[i].active = true;
                    _this2.stakeBtns[i].getChildByName('text').getComponent(cc.Label).string = item.name;

                    _this2.stakeBtns[i]._matchId = item.id;
                    _this2.stakeBtns[i]._openState = item.openState;
                    _this2.stakeBtns[i]._value = item.goldExpend;

                    // 非开放状态
                    if (!item.openState) {
                        _this2.stakeBtns[i].getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.stakeBtnDisable;
                    } else if (_this2.stakeValue === null) {
                        _this2.stakeValue = item.goldExpend;
                        _this2.setMatch(i, item.id);
                    }
                });
            }
        });
    },


    // 获取奖品列表
    getPrizeList: function getPrizeList() {
        window._main.api.getPrizeList(this.matchId).then(function (res) {
            if (res.data.ok) {
                window._main.gift.build(res.data.r);
            }
        });
    },
    showResult: function showResult(results) {
        var _this3 = this;

        if (results.grabResultInt === 3) {
            this.result.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('image/game/result-win', cc.SpriteFrame);
        } else {
            this.result.getComponent(cc.Sprite).spriteFrame = cc.loader.getRes('image/game/result-fail', cc.SpriteFrame);
        }

        this.starResultTip.active = results.getStars;

        this.result.active = true;
        this.result.getChildByName('list').getChildByName('text').getComponent(cc.Label).string = results.grabResultStr;
        this.result.runAction(cc.sequence(cc.jumpBy(.5, 0, 0, 10, 3), cc.callFunc(function () {
            setTimeout(function () {
                _this3.result.active = false;
            }, 1000);
        })));
    },
    update: function update() {
        if (this.bgm && !window._main.audio.bgm.isPlaying) window._main.audio.bgm.play();
    },
    activityBoxShow: function activityBoxShow() {
        var _this4 = this;

        this.activityBox.active = true;
        setTimeout(function () {
            _this4.activityBox.active = false;
        }, 3000);
    },
    updateStars: function updateStars() {
        this.starBox.children.forEach(function (star, i) {
            if (i < window._main.user.starsNum) {
                star.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.starYellow;
            } else {
                star.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.starGray;
            }
        });
    },
    listen: function listen() {
        var _this5 = this;

        var _this = this;
        // 点击 问号 和 星星
        this.qMark.on(cc.Node.EventType.TOUCH_START, this.activityBoxShow, this);

        this.starBox.on(cc.Node.EventType.TOUCH_START, this.activityBoxShow, this);
        // 音效按钮
        this.voice.on(cc.Node.EventType.TOUCH_START, function () {});
        this.voice.on(cc.Node.EventType.TOUCH_END, function () {
            _this.bgm ^= 1;
            this.getComponent(cc.Sprite).spriteFrame = _this.bgm ? window._main.spriteFrames.voiceOn : window._main.spriteFrames.voiceClose;

            _this.bgm ? window._main.audio.bgm.resume() : window._main.audio.bgm.pause();
        });
        // 开始按钮
        this.startBtn.on(cc.Node.EventType.TOUCH_START, function () {
            window._main.audio.clickStart.play();
            _this5.startBtn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.startBtnPress;
        });
        this.startBtn.on(cc.Node.EventType.TOUCH_END, function () {
            _this5.startBtn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.startBtnNormal;
            // if (this.matchId === null) alert('请先下注')
            if (window._main.user.balance <= 0) {
                window._main.shop.show();
            } else _this5.claw.fall();
        });

        // 下注按钮
        this.stakeBtns.forEach(function (btn, index) {
            btn._index = index;
            btn.on(cc.Node.EventType.TOUCH_START, function (event) {

                // 禁选
                if (!btn._openState) {
                    event.stopPropagation();
                    return;
                }

                var val = btn._value;
                if (val > window._main.user.balance) {
                    window._main.shop.show();
                    return;
                }
                _this5.stakeValue = val;

                _this5.stakeBtns.forEach(function (btn) {
                    if (btn._openState) {
                        btn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.stakeBtnNormal;
                    } else {
                        btn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.stakeBtnDisable;
                    }
                    // 移除其他特效
                    btn.getChildByName('text').stopAllActions();
                    btn.getChildByName('text').runAction(cc.moveTo(0, 0, 18));
                });

                btn.getComponent(cc.Sprite).spriteFrame = window._main.spriteFrames.stakeBtnPress;

                var text = btn.getChildByName('text');

                text.stopAllActions();
                text.runAction(cc.jumpTo(1, 0, 9, 10, 3));

                // 下注
                _this5.setStake(btn._index);

                if (btn._matchId !== _this5.matchId) {
                    switch (btn._index) {
                        case 0:
                            window._main.api.monitor('500场', 3);
                            break;
                        case 1:
                            window._main.api.monitor('1000场', 4);
                            break;
                        case 2:
                            window._main.api.monitor('2000场', 5);
                            break;
                    }
                }

                // 设置 当前场次 id
                _this5.matchId = btn._matchId;

                // 获取奖品列表
                _this5.getPrizeList();

                /*
                * 高级场切换
                */
                _this5.claw.setModel(_this5.matchId);
            });
        });

        // 规则按钮
        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, function () {
            _this5.ruleBtn.scale = .95;
        });
        this.ruleBtn.on(cc.Node.EventType.TOUCH_END, function () {
            _this5.ruleBtn.scale = 1;
            _this5.rule.show();
        });

        // giftBtn
        this.giftBtn.on(cc.Node.EventType.TOUCH_START, function () {
            _this5.giftBtn.scale = .95;
        });
        this.giftBtn.on(cc.Node.EventType.TOUCH_END, function () {
            _this5.giftBtn.scale = 1;
            window._main.record.show();
        });

        this.scoreBkg.on(cc.Node.EventType.TOUCH_END, function () {
            window._main.shop.show();
        });
    }
});

cc._RFpop();