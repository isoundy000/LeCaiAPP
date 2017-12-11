/**
 * Created by lyf on 2017/7/17.
 * 输入提款密码
 */
var G_INPUTPASSWORDLAYER = null;
var InputPassWordLayer = cc.Layer.extend({
    _mobileNumBox:null,
    _verificationCode:null,
    _jineData:null,// 提现金额
    _bankId:null,// 提现银行卡
    ctor:function (jineData,bankId) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var self = this;
        this._jineData = jineData;
        this._bankId = bankId;
        G_INPUTPASSWORDLAYER = this;

        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.6),GC.W,GC.H);
        this.addChild(this._layerColor);

        var bgImg=cc.Sprite.create(res.png_img_shezhimimaBg);
        bgImg.x=GC.W/2;
        bgImg.y=GC.H/2;
        this.addChild(bgImg);

        var bgImg_s=cc.Sprite.create(res.png_img_shezhimimaBg_s);
        bgImg_s.setNormalizedPosition(0.5, 0.9);
        bgImg.addChild(bgImg_s);

        var jingeText = new cc.LabelTTF("输入提款密码","微软雅黑", 35);
        jingeText.setNormalizedPosition(0.5, 0.9);
        bgImg.addChild(jingeText);

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.5);
        this.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H / 2+30;
        this._mobileNumBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceHolder("请输入密码");
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setMaxLength(15);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);

        // var line2 = new cc.Sprite(res.png_btn_enter_wode);
        // line2.setNormalizedPosition(0.5, 0.46);
        // this.addChild(line2);
        // this._verificationCode = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        // this._verificationCode.x = GC.W / 2;
        // this._verificationCode.y = this._mobileNumBox.y - this._mobileNumBox.height - 60;
        // this._verificationCode.setPlaceHolder("请再次输入密码");
        // this._verificationCode.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        // this._verificationCode.setPlaceholderFontSize(30);
        // this._verificationCode.setDelegate(this);
        // this._verificationCode.setMaxLength(15);
        // this._verificationCode.setName("verificationCode");
        // this._verificationCode.setFontSize(28);
        // this.addChild(this._verificationCode);

        var zhuyiText = new cc.LabelTTF("为了您的资金安全,每次都会进行提款密码认"+"\n"+"证，请牢记您的提款密码","微软雅黑", 25);
        zhuyiText.setNormalizedPosition(0.5, 0.35);
        zhuyiText.setColor(cc.color(255,255,0,0));
        bgImg.addChild(zhuyiText);

        var noBtn = new ccui.Button(res.png_btn_cancel,res.png_btn_cancel);
        noBtn.setNormalizedPosition(0.3, 0.12);
        noBtn.setTitleText("取消");
        noBtn.setTitleColor(cc.color(17,28,67));
        noBtn.setTitleFontSize(30);
        noBtn.setPressedActionEnabled(true);
        noBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            G_INPUTPASSWORDLAYER.close();
        });
        bgImg.addChild(noBtn);


        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.70, 0.12);
        yesBtn.setTitleText("确定");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(G_INPUTPASSWORDLAYER._mobileNumBox.getString() != "")
            {
                var reqUrl = GC.URL + "user/applyCashCommit?"
                    + "apply_cash="+G_INPUTPASSWORDLAYER._jineData
                    + "&pay_password="+G_INPUTPASSWORDLAYER._mobileNumBox.getString()
                    + "&bank_id="+G_INPUTPASSWORDLAYER._bankId
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                cc.log(G_INPUTPASSWORDLAYER._bankId);
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                            G_INPUTPASSWORDLAYER.close();
                            if(WITHDRAWALSLAYER)
                                WITHDRAWALSLAYER.removeFromParent();
                        });
                        G_INPUTPASSWORDLAYER.addChild(chenggong);

                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        G_INPUTPASSWORDLAYER.addChild(chenggong);
                    }
                })
            }else {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请输入密码");
            }
        });
        bgImg.addChild(yesBtn);

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length >= 8)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_INPUTPASSWORDLAYER,res.png_img_tishikuang,"密码最少8位");
                    // G_INPUTPASSWORDLAYER._mobileNumBox.setString("");
                }
                break;
            case"verificationCode":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && (G_INPUTPASSWORDLAYER._mobileNumBox.getString()) == editBox.getString())
                {
                }else
                {
                    var alertStr = new th.AlertLayer(G_INPUTPASSWORDLAYER,res.png_img_tishikuang,"两次机密码不一致，请重新输入");
                    // G_INPUTPASSWORDLAYER._verificationCode.setString("");
                }
                break;
        }
    },
    onEnter:function(){
        this._super();
        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});