Ti.include('../lib/hatena_util.js');
var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
oAuthAdapter.loadAccessToken('hatena');
var haikuResponse = oAuthAdapter.send({
    url : 'http://h.hatena.ne.jp/api/statuses/public_timeline.json',
    parameters : null,
    title : 'ハイク',
    successMessage: '',
    errorMessage: 'Error'
});
if (haikuResponse) {
    haikuResponse = eval("(" + haikuResponse + ")");
    var tableView = Ti.UI.createTableView({data:null}); 
    for (var i = 0 , len = haikuResponse.length; i < len ; i++) {
        var item = haikuResponse[i];
        tableView.appendRow(Hatena.Util.createHaikuRow(item));
    }
    Ti.UI.currentWindow.add(tableView);
}
