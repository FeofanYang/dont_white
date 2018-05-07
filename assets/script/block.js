// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        _type: null,
        _mainScript: null,
    },

    init: function (type,mainScript) {
        this._type = type;
        this._mainScript = mainScript;
        // 触摸方块
        this.node.on("touchstart",function(){
            // 判断连点
            if(this._mainScript.isStop){
                this._mainScript.isStop = false;
                if(this._type == "doge"){
                    // 摸到doge
                    this._mainScript.reson = '踩到doge';
                    this._mainScript.gameOver();
                }else{
                    let blockRow = this.node.name.split("#")[0];
                    if(parseInt(blockRow) !== (this._mainScript._curTouchRow + 1)){
                        // 摸到偏上的格子
                        this._mainScript.reson = '踩到偏上的格子';
                        this._mainScript.gameOver();
                    }else{
                        // 摸到正确的格子
                        this._mainScript.move();
                    }
                }
            }
        }.bind(this))
    },
});
