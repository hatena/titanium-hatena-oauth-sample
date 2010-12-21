Ti.include('../lib/hatena_util.js');
var oAuthAdapter = Ti.App.HatenaOAuthAdapter;
oAuthAdapter.loadAccessToken('hatena');
// 「ともだちの新着」へPOST
/*
oAuthAdapter.send({
    url : 'http://h2.hatena.ne.jp/touch/post.text',
    parameters: [['body', 'from titanium mobile']],
    title:  'タイムラインへ投稿',
    successMessage: 'Published.',
    errorMessage: 'Not published.'
});
*/
// 「ともだちの新着」取得
var timelineResponse = oAuthAdapter.send({
    url : 'http://n.hatena.ne.jp/timeline.json',
    parameters : null,
    title : 'ともだちの新着取得',
    successMessage: '',
    errorMessage: 'Error'
});
if (timelineResponse) {
    timelineResponse = eval("(" + timelineResponse + ")");
    var tableView = Ti.UI.createTableView({data:null}); 
    for (var i = 0 , len = timelineResponse.items.length; i < len ; i++) {
        var item = timelineResponse.items[i];
        tableView.appendRow(Hatena.Util.createTimelineRow(item));
    }
    Ti.UI.currentWindow.add(tableView);
}
