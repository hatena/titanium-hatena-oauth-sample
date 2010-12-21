Ti.include('../lib/hatena_util.js');
var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
oAuthAdapter.loadAccessToken('hatena');
// 「最近のイマココ」取得
var cocoResponse = oAuthAdapter.send({
    url : 'http://c.hatena.com/api/v1/history.json',
    parameters: [["name",Ti.App.Properties.getString("hatena.url_name")]],
    title : '最近のイマココ取得',
    successMessage : '',
    errorMessage: 'Error',
    method : "GET"
});
if (cocoResponse) {
    cocoResponse = eval("(" + cocoResponse + ")");
    var tableView = Ti.UI.createTableView({data:null}); 
    for (var i = 0 , len = cocoResponse.checkins.length; i < len ; i++) {
        var item = cocoResponse.checkins[i];
        tableView.appendRow(Hatena.Util.createCocoImakokoRow(item));
    }
    Ti.UI.currentWindow.add(tableView);
}
