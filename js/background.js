/**
 * 插件主要功能
 * 1.打开浏览器和新建标签页时设置默认主页；
 * 2.查询云端数据，同步到本地存储；
 * 3.切换标签页时，判断当前网址是否被收藏，进而改变page action图标；
 */

//打开浏览器时，更改默认浏览器首页。
//据验证，打开浏览器的第一个tab的ID是2
chrome.tabs.get(2, function(tab){
	//不经过服务器直接打开本地文件
	if (tab.url.indexOf("file:") != 0) {
		chrome.tabs.update({url:"home.html"});
	}
});


//新建标签页时，更改默认浏览器首页。
chrome.tabs.onCreated.addListener(function(tab) {
	if (tab.url == "chrome://newtab/") {
		chrome.tabs.update({url:"home.html"});		
	}
	chrome.browserAction.setIcon({path:"icon_heart_normal.png"});
});

//切换标签页时
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	chrome.browserAction.setIcon({path:"icon_heart.png", tabId:tabId});
});
