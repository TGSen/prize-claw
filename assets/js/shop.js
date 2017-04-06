export default cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },

        close: {
            default: null,
            type: cc.Node
        },

        layout: {
            default: null,
            type: cc.Node
        },

        item: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        this.init()
        this.listen()
    },

    init() {
        /*
        * 初始化时
        * 获取 main 组件
        */
        this.main = cc.director.getScene()
            .getChildByName('main').getComponent('main')

        /*
        * 创建空借点
        * 抵消 layout 的 coupon
        */
        this.empty = new cc.Node()
        this.empty.name = 'empty'
        this.empty.height = 26
    },

    listen() {
        this.mask.on(
            cc.Node.EventType.TOUCH_START,
            event => {
                event.stopPropagation()
            }
        )

        /*
        * 关闭按钮
        */
        this.close.on(
            cc.Node.EventType.TOUCH_START,
            () => {
                this.close.scale = .95
            }
        )

        this.close.on(
            cc.Node.EventType.TOUCH_END,
            () => {
                this.close.scale = 1
                this.hide()
            }
        )
    },



    show() {
        if (this.node.active) this.node.opacity = 0
        else {
            this.node.active = true
            this.node.opacity = 0
        }
        this.node.runAction(cc.fadeIn(.5))




        this.main.api.goodsList()
        .then(res => {
            if (res.data.ok) {
                if (res.data.r.length === 0) {
                    return
                }

                let i = 0
                const
                    children = this.layout.children,
                    list = res.data.r

                children.forEach(child => {
                    child.active = false
                })

                let needEmpty = false

                // 有空节点则 remove
                const empty = this.layout.getChildByName('empty')
                empty ? empty.removeFromParent() : null

                const load = () => {
                    const
                        item = list[i]
                    let child = children[i]
                    if (!child) {
                        child = cc.instantiate(this.item)
                        this.layout.addChild(child)
                    }
                    child.active = true

                    child._goodsId = item.id

                    child.getChildByName('layout').getChildByName('more')
                        .getComponent(cc.Label).string = `${item.promotionQuantity}金币`

                    child.getChildByName('layout').getChildByName('less')
                        .getComponent(cc.Label).string = `${item.quantity}金币`

                    child.getChildByName('btn').getChildByName('text')
                        .getComponent(cc.Label).string = `￥${item.price / 100}`

                    child.getChildByName('coupon').active =
                    child.getChildByName('layout').getChildByName('less').active =
                    item.promotionState


                    if (!child._bind) {

                        child._bind = true
                        // 购买监听
                        child.getChildByName('btn').on(
                            cc.Node.EventType.TOUCH_START,
                            function() {
                                this.scale = .95
                            }
                        )

                        child.getChildByName('btn').on(
                            cc.Node.EventType.TOUCH_END,
                            event => {
                                event.target.scale = 1
                                this.main.api.purchase(child._goodsId)
                                .then(res => {
                                    if (res.data.ok) {
                                        location.href = res.data.r
                                    }
                                })
                            }
                        )
                    }

                    if (item.promotionState && i === 0) {
                        needEmpty = true
                    }

                    cc.loader.load(item.img, (err, texture) => {
                        if (err) console.log(err)
                        else {
                            child.getChildByName('image').getComponent(cc.Sprite)
                                .spriteFrame = new cc.SpriteFrame(texture)

                            child.getChildByName('layout').x = -45
                        }
                        if (++i < list.length) load()
                        else if (needEmpty) {
                            this.layout.addChild(this.empty)
                            this.empty.setSiblingIndex(0)
                        }
                    })
                }
                load()

            }
        })
    },

    hide() {
        this.node.runAction(cc.sequence(
            cc.fadeOut(.5),
            cc.callFunc(() => {
                this.node.active = false
            })
        ))
    }
})