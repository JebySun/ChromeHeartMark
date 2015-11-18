$(document).ready(function() {
	
	Bmob.initialize("6dd5862b3c27e3b644588d5fdd950f6c", "fb6fc3fbf86829ad2e5791efd8020ccd");
	
	//禁用删除按钮
	//$("#btn-delete").attr("disabled", true); 
	
	$("#btn-mark").on("click", function(){
		chrome.browserAction.setIcon({path:"icon_heart.png"});
		//立即关闭会使改变图标失效，因此延迟关闭。
		setTimeout(function(){
			window.close();
		}, 100);
	});
	
	$("#btn-delete").on("click", function(){
		chrome.browserAction.setIcon({path:"icon_heart_normal.png"});
		//立即关闭会使改变图标失效，因此延迟关闭。
		setTimeout(function(){
			window.close();
		}, 100);
	});
	
	$("#btn-cancel").on("click", function(){
		//关闭browserAction的popup页面
		//window.close();
		testSave();
		
	});
	
	
	var testSave = function() {
		var GameScore = Bmob.Object.extend("ChromeMark");
		var gameScore = new GameScore();
		gameScore.set("title", "开源中国");
		gameScore.set("url", "https://www.oschina.com");
		gameScore.save(null, {
			success: function(object) {
				alert("创建成功！记录id="+object.id);
			},
			error: function(model, error) {
				alert("保存失败");
			}
		});
	};
	
	// 查询所有数据
	var testQueryAll = function() {
		var GameScore = Bmob.Object.extend("ChromeMark");
		var query = new Bmob.Query(GameScore);
		query.find({
			success: function(results) {
				//alert("共查询到 " + results.length + " 条记录");
				// 循环处理查询到的数据
				for (var i = 0; i < results.length; i++) {
					var obj = results[i];
					$("#list").append("<tr><td>"+obj.get('title')+"</td><td>&nbsp;&nbsp;"+obj.get('url')+"</td></tr>");
					//alert(object.id + "-" + obj.get("title"));
				}
			},
			error: function(error) {
				alert("查询失败: " + error.code + "-" + error.message);
			}
		});
	};
	
		
	testQueryAll();

	
});



