if (typeof(Hatena) == 'undefined') {
    Hatena = {};
}
Hatena.Util = {};
Hatena.Util.getProfileIconUrl = function (name) {
    var pre = name.match(/^[\w-]{2}/)[0];
    return 'http://st-hatena.com/users/' + pre + '/' + name + '/profile.gif';
}
// http://developer.hatena.ne.jp/ja/documents/nano/timeline/nativelist
Hatena.Util.createTimelineRow = function (item) {
    var row = Ti.UI.createTableViewRow();
    row.height = "auto";
    var dc = item.data_category;
    if (dc == 3) {
        // friend
        row.className = "timeline_friend";
        var text = Ti.UI.createLabel({
            left      : 2,
            height    : 'auto',
            width     : 'auto',
            textAlign : 'left',
            text      : item.entity1.display_name + 'と' + item.entity2.display_name + 'がともだちになりました'
        });
        row.add(text);

    } else if (dc == 10) {
        // imakoko
        row.className = "timeline_imakoko";
        var author = Ti.UI.createImageView({
            image  : Hatena.Util.getProfileIconUrl(item.author.url_name),
            top    : 2,
            left   : 2,
            width  : 32,
            height : 32 
        });
        row.add(author);
        var spot = Ti.UI.createLabel({
            left      : 36,
            height    : 12,
            top       : 2,
            width     : 'auto',
            textAlign : 'left',
            font      : {fontSize: 10},
            color     : "#999999",
            text      : item.target.display_name
        });
        row.add(spot);
        var body = Ti.UI.createLabel({
            left      : 36,
            top       : 14,
            height    : 'auto',
            width     : 'auto',
            textAlign : 'left',
            text      : item.body_text
        });
        row.add(body);

    } else if (dc == 11) {
        // spot review
        row.className = "timeline_spotreview";
        var author = Ti.UI.createImageView({
            image  : Hatena.Util.getProfileIconUrl(item.author.url_name),
            top    : 2,
            left   : 2,
            width  : 32,
            height : 32 
        });
        row.add(author);
        var spot = Ti.UI.createLabel({
            left      : 36,
            height    : 12,
            top       : 2,
            width     : 'auto',
            textAlign : 'left',
            font      : {fontSize: 10},
            color     : "#999999",
            text      : item.target.display_name + "のレビュー"
        });
        row.add(spot);
        var body = Ti.UI.createLabel({
            left      : 36,
            top       : 14,
            height    : 'auto',
            width     : 'auto',
            textAlign : 'left',
            text      : item.body_text
        });
        row.add(body);
    } else if (dc == 2 || dc == 14 || dc == 15 || dc == 16 || dc == 17){
        // text entry
        row.className = "timeline_text";
        var author = Ti.UI.createImageView({
            image  : Hatena.Util.getProfileIconUrl(item.author.url_name),
            top    : 2,
            left   : 2,
            width  : 32,
            height : 32 
        });
        row.add(author);
        var body = Ti.UI.createLabel({
            left      : 36,
            height    : 'auto',
            width     : 'auto',
            textAlign : 'left',
            text      : item.body_text
        });
        row.add(body);
    } else if (dc == 43) {
        // start application
        Ti.API.info(item);
        row.className = "timeline_application";
        var application = Ti.UI.createImageView({
            image  : item.app_icon_url,
            top    : 2,
            left   : 2,
            width  : 32,
            height : 32 
        });
        row.add(application);
        var body = Ti.UI.createLabel({
            left      : 36,
            height    : 'auto',
            width     : 'auto',
            textAlign : 'left',
            text      : item.author.display_name + 'が' + item.app_name + 'の利用を開始しました'
        });
        row.add(body);
    }
    return row;
}
// http://developer.hatena.ne.jp/ja/documents/bookmark/apis/atom
Hatena.Util.bookmarkListXML2JSON = function(xml) {
    var elems = xml.getElementsByTagName("entry");
    var results = [];
    for (var i = 0, len = elems.length; i < len ; i++) {
        var item = elems.item(i);
        var bookmark = {};
        bookmark.title = item.getElementsByTagName('title').item(0).text;
        for (var j = 0, len2 = item.getElementsByTagName('link').length ; j < len2 ; j++) {
            var rel = item.getElementsByTagName('link').item(j).getAttribute('rel');
            var link = item.getElementsByTagName('link').item(j).getAttribute('href');
            if (rel == 'related') bookmark.link = link;
            else if (rel == 'alternate') bookmark.bookmarkLink = link;
            else if (rel == 'service.edit') bookmark.editUrl = link; 
        }
        Ti.API.debug(bookmark);
        results.push(bookmark);
    }
    return {bookmarks:results};
}
Hatena.Util.createBookmarkRow = function(item) {
    var row = Ti.UI.createTableViewRow();
    row.title = item.title;
    row.hasChild = true;
    row.addEventListener('click', function() {
        var win = Ti.UI.createWindow({
            title : item.title
        });
        var webview = Ti.UI.createWebView({
            url       : item.link
        });
        win.add(webview);
        Ti.UI.currentTab.open(win);
    });
    return row;
}
//http://developer.hatena.ne.jp/ja/documents/coco/apis/v1/heres
Hatena.Util.createCocoImakokoRow = function(item) {
    var row = Ti.UI.createTableViewRow();
    row.height = 'auto';
    var spotImage = Ti.UI.createImageView({
        image  : item.spot.image_url,
        top    : 2,
        left   : 2,
        width  : 32,
        height : 32 
    });
    row.add(spotImage);
    var spot = Ti.UI.createLabel({
        left      : 36,
        height    : 12,
        top       : 2,
        width     : 'auto',
        textAlign : 'left',
        font      : {fontSize: 10},
        color     : "#999999",
        text      : item.spot.name
    });
    row.add(spot);
    var body = Ti.UI.createLabel({
        left      : 36,
        top       : 14,
        height    : 'auto',
        width     : 'auto',
        textAlign : 'left',
        text      : item.body
    });
    row.add(body);
    return row;
}

// http://developer.hatena.ne.jp/ja/documents/diary/apis/atom 
Hatena.Util.diaryEntryListXML2JSON = function(xml) {
    var elems = xml.getElementsByTagName("entry");
    var results = [];
    for (var i = 0, len = elems.length; i < len ; i++) {
        var item = elems.item(i);
        var entry = {};
        entry.title = item.getElementsByTagName('title').item(0).text;
        entry.content = item.getElementsByTagName('content').item(0).text;
        for (var j = 0, len2 = item.getElementsByTagName('link').length ; j < len2 ; j++) {
            var rel = item.getElementsByTagName('link').item(j).getAttribute('rel');
            var link = item.getElementsByTagName('link').item(j).getAttribute('href');
            if (rel == 'alternate') entry.link = link;
            else if (rel == 'edit') entry.editUrl = link; 
        }
        Ti.API.debug(entry);
        results.push(entry);
    }
    return {entries:results};
}
Hatena.Util.createDiaryRow = function(item) {
    var row = Ti.UI.createTableViewRow();
    row.title = item.title;
    row.hasChild = true;
    row.addEventListener('click', function() {
        var win = Ti.UI.createWindow({
            title : item.title
        });
        var webview = Ti.UI.createWebView({
            url : item.link
        });
        win.add(webview);
        Ti.UI.currentTab.open(win);
    });
    return row;
}

//http://developer.hatena.ne.jp/ja/documents/haiku/apis/rest#auth
Hatena.Util.createHaikuRow = function(item) {
    var row = Ti.UI.createTableViewRow();
    row.height = 'auto';
    var authorImage = Ti.UI.createImageView({
        image  : item.user.profile_image_url,
        top    : 2,
        left   : 2,
        width  : 32,
        height : 32 
    });
    row.add(authorImage);
    var keyword = Ti.UI.createLabel({
        left      : 36,
        height    : 12,
        top       : 2,
        width     : 'auto',
        textAlign : 'left',
        font      : {fontSize: 10},
        color     : "#999999",
        text      : item.keyword
    });
    row.add(keyword);
    var body = Ti.UI.createLabel({
        left      : 36,
        top       : 14,
        height    : 'auto',
        width     : 'auto',
        textAlign : 'left',
        text      : item.text
    });
    row.add(body);
    row.link = item.link;
    row.addEventListener('click', function(e) {
        var win = Ti.UI.createWindow({
            title : item.keyword
        });
        var webview = Ti.UI.createWebView({
            url : item.link
        });
        win.add(webview);
        Ti.UI.currentTab.open(win);
    });
    return row;
}

