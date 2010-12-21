/*
 * The Adapter needs 2 external libraries (oauth.js, sha1.js) hosted at
 *  http://oauth.googlecode.com/svn/code/javascript/
 *
 * Save them locally in a lib subfolder
 */
Ti.include('lib/hatena_util.js');
Ti.include('lib/sha1.js');
Ti.include('lib/oauth.js');
Ti.include('lib/hatena_oauth_adapter.js');
Ti.include('lib/oauth_config.js');
Ti.App.HatenaOAuthAdapter = new OAuthAdapter({
    consumerSecret : consumerSecret,
    consumerKey : consumerKey,
    signatureMethod : 'HMAC-SHA1',
    userAgent : 'my oauth application'
});

var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
// load the access token for the service (if previously saved)
oAuthAdapter.loadAccessToken('hatena');
if (oAuthAdapter.isAuthorized() == false)  {
    // 未認証の場合
    // this function will be called as soon as the application is authorized
    var receivePin = function() {
        // get the access token with the provided pin/oauth_verifier
        var token = oAuthAdapter.getAccessToken('https://www.hatena.com/oauth/token');
        // save the access token
        oAuthAdapter.saveAccessToken('hatena');
        // http://developer.hatena.ne.jp/ja/documents/nano/apis/oauth#start
        oAuthAdapter.send({
            url : 'http://n.hatena.com/applications/start',
            parameters: null,
            title:  'アプリケーションの利用開始通知',
            successMessage: '',
            errorMessage: ''
        });
        showApplicationBase();
    };

    // show the authorization UI and call back the receive PIN function
    oAuthAdapter.showAuthorizeUI('https://www.hatena.ne.jp/touch/oauth/authorize?' +
        oAuthAdapter.getRequestToken('https://www.hatena.com/oauth/initiate',
            [['oauth_callback','oob'],['scope',oauthScope]]),
        receivePin);
} else {
    // 認証済の場合
    showApplicationBase();
}


function showApplicationBase() {
    // load the access token for the service (if previously saved)
    oAuthAdapter.loadAccessToken('hatena');
    // アカウント情報取得 
    var userResponse = oAuthAdapter.send({
        url : 'http://n.hatena.com/applications/my.json',
        parameters : null,
        title : 'アカウント情報取得',
        successMessage: '',
        errorMessage: 'Error',
        method : 'GET'
    });
    if (userResponse) {
        userResponse = eval("(" + userResponse + ")");
        Ti.App.Properties.setString("hatena.url_name", userResponse.url_name);
        Ti.App.Properties.setString("hatena.display_name", userResponse.display_name);
        Ti.App.Properties.setString("hatena.profile_image_url", userResponse.profile_image_url);
    }
    Titanium.UI.setBackgroundColor('#000');
    var tabGroup = Titanium.UI.createTabGroup();

    var win1 = Titanium.UI.createWindow({ 
        title:'ともだちの新着',
        url  : './window/timeline.js',
        backgroundColor:'#fff'
    });
    var tab1 = Titanium.UI.createTab({  
        icon:'KS_nav_views.png',
        title:'Timeline',
        window:win1
    });

    var win2 = Titanium.UI.createWindow({  
        title:'マイブックマーク',
        url  : './window/bookmark.js',
        backgroundColor:'#fff'
    });
    var tab2 = Titanium.UI.createTab({  
        icon:'KS_nav_ui.png',
        title:'Bookmark',
        window:win2
    });

    var win3 = Titanium.UI.createWindow({  
        title:'マイココ',
        url  : './window/coco.js',
        backgroundColor:'#fff'
    });
    var tab3 = Titanium.UI.createTab({  
        icon:'KS_nav_ui.png',
        title:'Coco',
        window:win3
    });

    var win4 = Titanium.UI.createWindow({  
        title:'マイダイアリー',
        url  : './window/diary.js',
        backgroundColor:'#fff'
    });
    var tab4 = Titanium.UI.createTab({  
        icon:'KS_nav_ui.png',
        title:'Diary',
        window:win4
    });

    tabGroup.addTab(tab1);  
    tabGroup.addTab(tab2);  
    tabGroup.addTab(tab3);  
    tabGroup.addTab(tab4);  

    tabGroup.open();
}


