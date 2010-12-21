Ti.include('../lib/hatena_util.js');
var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
oAuthAdapter.loadAccessToken('hatena');
// 「マイダイアリー」取得
var diaryResponse = oAuthAdapter.send({
    url : 'http://d.hatena.ne.jp/' + Ti.App.Properties.getString("hatena.url_name") + '/atom/blog',
    parameters : null,
    title : 'Hatena',
    successMessage : '',
    errorMessage : 'Error',
    method : "GET",
    resultByXML : true
});
if (diaryResponse) {
    Ti.API.info(diaryResponse);
    var entries = Hatena.Util.diaryEntryListXML2JSON(diaryResponse);
    var tableView = Ti.UI.createTableView({data:null}); 
    for (var i = 0, len = entries.entries.length; i < len ; i++) {
        var item = entries.entries[i];
        tableView.appendRow(Hatena.Util.createDiaryRow(item));
    }
    Ti.UI.currentWindow.add(tableView);
}
