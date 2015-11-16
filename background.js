/**
 * 插件主要功能
 * 1.打开浏览器和新建标签页时设置默认主页；
 * 2.查询云端数据，同步到本地存储；
 * 3.切换标签页时，判断当前网址是否被收藏，进而改变page action图标；
 */

//打开浏览器时，更改默认浏览器首页。
chrome.tabs.update({url:"home.html"});

Bmob.initialize("6dd5862b3c27e3b644588d5fdd950f6c", "fb6fc3fbf86829ad2e5791efd8020ccd");

//新建标签页时，更改默认浏览器首页。
chrome.tabs.onCreated.addListener(function(tab) {
	if (tab.url=="chrome://newtab/") {
		chrome.tabs.update({url:"home.html"});		
	}
	chrome.browserAction.setIcon({path:"icon_heart_normal.png"});
});

//切换标签页时
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	//...
	chrome.browserAction.setIcon({path:"icon_heart.png", tabId:tabId});
});

//查询云端数据。
//...