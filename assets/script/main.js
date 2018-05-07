// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
// https://www.bilibili.com/video/av9164686/

cc.Class({
    extends: cc.Component,

    properties: {
        movePanel: cc.Node,
        dogePrefab: cc.Prefab,
        blackPrefab: cc.Prefab,
        initRow: 8,
        initCol: 4,
        _newTopRow: null,
        _curBottomRow: null,
        _curTouchRow: -1,
        _startPosition: null,
        // 开始页面UI
        stratPage: cc.Node,
        btnStart: cc.Node,
        btnRule: cc.Node,
        rulePage: cc.Node,
        btnRuleClose: cc.Node,
        // 结束页面
        endPage: cc.Node,
        resonDisplay: {
            default: null,
            type: cc.Label,
        },
        endSocreDisplay: {
            default: null,
            type: cc.Label,
        },
        btnAgain: cc.Node,
        // score 的引用
        socreDisplay: {
            default: null,
            type: cc.Label,
        },
        timerDisplay: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this.stratPage.on('touchstart',function(e){
            e.stopPropagation();
        });
    },

    create: function () {
        this._newTopRow = 8;
        this._curBottomRow = 0;
        this._startPosition = this.movePanel.position;
        this.score = 0;
        this.timer = 20;
        this.isStop = true;
        this.isTimeOut = true;

        // 加载 填满
        for(let row = 0;row < 8;row++){
            let randomBlackCol = Math.floor( Math.random() * 4 );
            for(let col = 0;col < 4;col++){
                let block = null;
                let name = null;
                if(randomBlackCol==col){
                    block = cc.instantiate(this.blackPrefab);
                    block.getComponent("block").init("black",this);
                }else{
                    block = cc.instantiate(this.dogePrefab);
                    block.getComponent("block").init("doge",this);
                }
                this.movePanel.addChild(block);
                block.name = row + "#" + col;
                block.position = cc.pMult(cc.v2(col,row),150);
            }
        }
        // 启动倒计时
        this.schedule(function() {
            this.timer--;
            if(this.timer <= 0){
                this.reson = '时间到';
                if(this.isTimeOut){ this.gameOver(); }
                return;
            }
            this.timerDisplay.string = 'Time: ' + this.timer.toString();
        }, 1);
    },

    move: function () {
        let movePosition = cc.v2(this._startPosition.x,(this._startPosition.y + (this._curBottomRow + 1) * -150));

        this.movePanel.runAction(cc.sequence(
            cc.moveTo(0.1,movePosition),
            cc.callFunc(this.updateRender.bind(this))
        ));

        this.score += 1;
        this.socreDisplay.string = 'Score: ' + this.score.toString();
    },

    updateRender: function() {
        // 解锁连点状态
        this.isStop = true;
        let row = this._newTopRow;
        let randomBlackCol = Math.floor( Math.random() * 4 );
        for(let col = 0;col < 4;col++){
            let block = null;
            let name = null;
            if(randomBlackCol==col){
                block = cc.instantiate(this.blackPrefab);
                block.getComponent("block").init("black",this);
            }else{
                block = cc.instantiate(this.dogePrefab);
                block.getComponent("block").init("doge",this);
            }
            this.movePanel.addChild(block);
            block.name = row + "#" + col;
            block.position = cc.pMult(cc.v2(col,row),150);
        }
        // remove bottom row
        let oldRow = this._curBottomRow;
        for(let col = 0;col < 4;col++){
            this.movePanel.getChildByName(oldRow + "#" + col).removeFromParent();
        }
        this._newTopRow++;
        this._curBottomRow++;
        this._curTouchRow++;
    },

    gameOver: function () {
        this.isTimeOut = false;
        this.endSocreDisplay.string = '最终得分为: ' + this.score.toString();
        this.resonDisplay.string = this.reson + '，游戏结束！';
        this.endPage.active = true;
        this.endPage.on('touchstart',function(e){
            e.stopPropagation();
        });
    },

    // 按钮脚本
    btn_start: function () {
        this.stratPage.active = false;
        this.create();
    },

    btn_rule: function () {
        this.rulePage.active = true;
    },

    btn_ruleClose: function () {
        this.rulePage.active = false;
    },

    btn_again: function () {
        cc.director.loadScene('main-scene');
    },
});
