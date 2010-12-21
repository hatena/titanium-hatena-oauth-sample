Ti.include('../lib/hatena_util.js');
var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
oAuthAdapter.loadAccessToken('hatena');
// 「マイブックマーク」取得
var bookmarkResponse = oAuthAdapter.send({
    url : 'http://b.hatena.ne.jp/atom/feed',
    parameters : null,
    title : 'Hatena',
    successMessage : '',
    errorMessage : 'Error',
    method : "GET",
    resultByXML : true
});
if (bookmarkResponse) {
    var bookmarks = Hatena.Util.bookmarkListXML2JSON(bookmarkResponse);
    var tableView = Ti.UI.createTableView({data:null}); 
    for (var i = 0, len = bookmarks.bookmarks.length; i < len ; i++) {
        var item = bookmarks.bookmarks[i];
        tableView.appendRow(Hatena.Util.createBookmarkRow(item));
    }
    Ti.UI.currentWindow.add(tableView);
}
