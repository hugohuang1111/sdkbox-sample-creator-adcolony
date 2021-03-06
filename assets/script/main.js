// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        labelVideo: {
            default: null,
            type: cc.Label
        },
        labelV4VC: {
            default: null,
            type: cc.Label
        },
        labelCoin: {
            default: null,
            type: cc.Label
        },
        labelLogs: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.logs = [];
        if (this.checkCocosPlugin()) {
            this.initAdColony();
        }
    },

    // update (dt) {},

    checkCocosPlugin() {
        if ('undefined' == typeof cocos) {
            console.log('cocos is undefined');
            return false;
        }
        if ('undefined' == typeof cocos.plugin) {
            console.log('cocos.plugin is undefined');
            return false;
        }

        return true;
    },

    initAdColony() {
        if (!cc.sys.isMobile) {
            console.log('initAdColony just valid on mobile');
            return
        }
        console.log('Init AdColony');

        const dump = function (data) {
            console.log("  dump:");
            for (let key in data) {
                console.log("  - " + key.toString() + ": " + data[key].toString());
            }
        };
        const self = this;
        cocos.plugin.AdColony.setListener({
            onAdColonyChange : function (data, available) {
                // Called when AdColony finish loading
                console.log("onAdColonyChange");
                dump(data);
                console.log(available);

                if ( 'video' == data.name) {
                    self.labelVideo.string = '' + available;
                } else if ('v4vc' == data.name) {
                    self.labelV4VC.string = '' + available;
                } else {
                    self.showLog('unknow video: ' + data.name);
                }
                self.showLog('onAdColonyChange');
            },
            onAdColonyReward : function (data, currencyName, amount, success) {
                // Called when AdColony v4vc ad finish playing
                console.log("onAdColonyReward");
                dump(data);
                console.log("currencyName: " + currencyName.toString());
                console.log("amount: " + amount.toString());
                console.log("success: " + success.toString());

                let coin = parseInt(self.labelCoin.string);
                coin += amount;
                self.labelCoin.string = '' + coin;
                self.showLog('onAdColonyReward');
            },
            onAdColonyStarted : function (data) {
                // Called when ad starts playing
                console.log("onAdColonyStarted");
                dump(data);

                self.showLog('onAdColonyStarted');
            },
            onAdColonyFinished : function (data) {
                // Called when an ad finish displaying
                console.log("onAdColonyFinished");
                dump(data);

                self.showLog('onAdColonyFinished');
            },
            onAdColonyIapOpportunity : function(adInfo) {
                console.log("onAdColonyIapOpportunity");
                dump(data);

                self.showLog('onAdColonyIapOpportunity');
            },
        });
        cocos.plugin.AdColony.init();

        console.log('Init AdColony finish');

    },

    onShowVideo() {
        if (!cc.sys.isMobile) {
            console.log('onShowVideo just valid on mobile');
            return;
        }
        this.showAD('video');
    },

    onShowV4VC() {
        if (!cc.sys.isMobile) {
            console.log('onShowV4VC just valid on mobile');
            return;
        }
        this.showAD('v4vc');
    },

    showAD(adName) {
        const adStatus = cocos.plugin.AdColony.getAdStatus(adName);
        if (3 == adStatus) {
            cocos.plugin.AdColony.show(adName);
        } else {
            this.showLog(`AD ${adName} status: ${adStatus}, can't show for now`);
        }
    },

    onRequestVideo() {
        if (!cc.sys.isMobile) {
            console.log('onRequestVideo just valid on mobile');
            return;
        }
        this.requestAD('video');
    },

    onRequestV4VC() {
        if (!cc.sys.isMobile) {
            console.log('onRequestV4VC just valid on mobile');
            return;
        }
        this.requestAD('v4vc');
    },

    requestAD(adName) {
        cocos.plugin.AdColony.requestIntersitalAd(adName);
    },

    showLog(log) {
        console.log(log);
        this.logs.push(log);
        while(this.logs.length > 5) {
            this.logs.pop();
        }
        let combinLog = '';
        for (let key in this.logs) {
            combinLog += '\n';
            combinLog += this.logs[key];
        }
        this.labelLogs.string = combinLog;
    }

});
