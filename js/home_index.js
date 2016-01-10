$(function(){
	window.defaultWebsites = 
	{
			"websites":
			[
				{"unique":"1", "title":"百度", "address":"http://www.baidu.com"},
				{"unique":"2", "title":"Google", "address":"http://www.google.com.hk"},
				{"unique":"3", "title":"网易", "address":"http://www.163.com"},
				{"unique":"4", "title":"新浪", "address":"http://www.sina.com.cn"},
				{"unique":"5", "title":"CSDN", "address":"http://www.csdn.com"},
				{"unique":"6", "title":"博客园", "address":"http://www.cnblogs.com"},
				{"unique":"7", "title":"开源中国", "address":"http://www.oschina.net"},
				{"unique":"8", "title":"LOFTER", "address":"http://www.lofter.com"},
				{"unique":"9", "title":"点点", "address":"http://www.diandian.com"},
				{"unique":"10", "title":"优酷视频", "address":"http://www.youku.com"},
				{"unique":"11", "title":"126邮箱", "address":"http://www.126.com"}
			]
	};
	var LocalStorageData = {
		_query:function(item){
			return window.localStorage[item];
		},
		_modify:function(item, data){
			window.localStorage[item] = data;
		},
		//读取收藏网站数据
		readData:function(){
			var str_json = this._query("websiteData");
			if(str_json) {
				return JSON.parse(str_json);
			} else {
				return null;
			}
		},
		//读取搜索引擎设置
		readEngineData:function(){
			return this._query("engine");
		},
		//写入搜索引擎设置
		writeEngineData:function(engine){
			this._modify("engine", engine);
		},
		//写入收藏网站数据
		writeData:function(data){
			this._modify("websiteData", data);
		}
	};
	
	//1.读取本地数据
	//2.创建dom节点
	var readLocalData = function(){
		var buildDom = function(json){
			var i = 0;
			var html;
			var jqDomTarget = $(".box a.new").parent();
			while(i<json.websites.length){
				html = '<div class="box sortable">\
					<a href="'+json.websites[i].address+'" title="'+json.websites[i].title+'" unique="'+json.websites[i].unique+'">'+json.websites[i].title+'</a>\
					<p><a href="javascript:void(0);" class="edit"><i class="fa fa-edit"></i></a><a href="javascript:void(0);" class="delete"><i class="fa fa-times"></i></a></p>\
					</div>';
				jqDomTarget.before(html);
				i++;
			}
			//收藏网站模块绑定事件
			websiteBindEvent();
		};
		var json = LocalStorageData.readData();
		if(!json) {
			json = window.defaultWebsites;
		}
		buildDom(json);
	};
	
	//dom节点操作后，读取全部dom数据组成json字符串，然后保存
	var updateLocalData = function(){
		var websiteJSON = {"websites":[]};
		var website = {};
		$(".sortable>a").each(function(){
			website = {"unique":$(this).attr("unique"), "title":$(this).html(), "address":$(this).attr("href")};
			websiteJSON.websites.push(website);
		});
		LocalStorageData.writeData(JSON.stringify(websiteJSON));
	};

	//网址收藏事件绑定
	var websiteBindEvent = function() {
		$(".box").unbind().hover(
				function(){
					if(!$(this).children("a").hasClass("new")) {
						$(this).children("p").show();
					}
				},
				function(){
					$(this).children("p").hide();
				}
		);
		//编辑
		$(".box a.edit").unbind().click(function(){
			var jqA = $(this).parent().prev();
			var editWebSite = function(){
				var title = arguments[0];
				var address = arguments[1];
				jqA.html(title);
				jqA.attr("href", address);
				//保存更新数据
				updateLocalData();
				noty({type:"success", text: "修改成功!", layout:"topCenter"});
			};
			$.noty.closeAll();
			openModalWindow(jqA, editWebSite);
		});
		//删除
		$(".box a.delete").unbind().click(function(){
			var jqWebsiteDel = $(this).parents(".box");
			$.noty.closeAll();
			//操作确认
			noty({type:"confirm", text: "确认删除该网站？", modal:true, layout:"center",
				buttons: [
				    {text: '确定', onClick: function($noty) {
					    	$noty.close();
					    	//移除UI节点
					    	jqWebsiteDel.remove();
					    	//保存更新数据
					    	updateLocalData();
					    	noty({type:"success", text: "删除成功!", layout:"topCenter"});
				        }
				    },
				    {text: '取消', onClick: function($noty) {
				        	$noty.close();
				    	}
				    }
				]
		    });
		});
	};
	
	readLocalData();
	
	//设置搜索输入框焦点
	$("#search-input").focus().on("focus", function(){
		$("#search-wrapper ul").hide();
	});
	
	//设置搜索引擎
	//读取本地存储,如果读取信息为空，则默认设置为百度
	var engineName = LocalStorageData.readEngineData();
	engineName = engineName?engineName:"baidu";
	$("#engine").attr("src", "img/logo_"+engineName+".png").attr("title", engineName);
	
	$("#search-engine-switch").click(function(){
		$("#search-wrapper ul").show();
	});
	
	$("#search-wrapper ul li").click(function(){
		var chooice = $(this).attr("value");
		if(chooice=="baidu") {
			$("#engine").attr("src", "img/logo_baidu.png").attr("title", "baidu");
		} else {
			$("#engine").attr("src", "img/logo_google.png").attr("title", "google");
		}
		LocalStorageData.writeEngineData(chooice);
		$(this).parent().hide();
		$("#search-input").focus();
	});
	
	var goSearch = function(){
		var engine = $("#engine").attr("title");
		var	searchUrl = "http://www.baidu.com/s?wd=";
		var keyWord = $("#search-input").val();
		if(!keyWord) {
			return;
		}
		if(engine=="baidu") {
			searchUrl += keyWord;
		} else {
			searchUrl = "http://www.google.com.hk/search?hl=zh-CN&source=hp&q="+keyWord;
		}
		window.location.href = searchUrl;
	};
	
	$("#search-button").click(function(){
		goSearch();
	});
	
	$("body").keypress(function(e){
		if($("#search-input").is(":focus")) {
			//回车键
			if(e.keyCode==13){
				goSearch();
			}
		}
	});
	
	//打开模态窗口
	var openModalWindow = function(eventSource, func){
		//创建弹出层
		var modalWindow = new jBox('Modal', {
		    title: "收藏网址编辑",
		    content: '<form id="new-website">\
        		<p><label>标题</label><input type="text" id="new-webTitle"/></p>\
        		<p><label>网址</label><input type="text" id="new-webAddress"/></p>\
        		<p><input type="button" class="button" value="关闭" id="new-cancel"/><input type="submit" value="提交" class="button" id="new-submit"/></p>\
        		</form>',
        	closeOnClick:false,
        	onClose: function() {
        			titleTrip?titleTrip.destroy():"";
        			addressTrip?addressTrip.destroy():"";
        			$("#jBox1").remove();
        		},
    		onCreated:function(){
        			if(eventSource) {
        				$("#new-webTitle").val(eventSource.html());
        				$("#new-webAddress").val(eventSource.attr("href"));
        			}
        		}
        	
		}).open();
		
		
		var titleTrip;
		var addressTrip;
		var title;
		var address;

		var validateForm = function(titleDom, addressDom){
	    	titleTrip?titleTrip.destroy():"";
	    	addressTrip?addressTrip.destroy():"";
	    	title = titleDom.val();
	    	address = addressDom.val();
	    	var result = true;
	    	if(!title) {
	    		result = false;
	    		titleTrip = new jBox("Tooltip", {
	    		    target: $("#new-webTitle"),
	    		    theme:"TooltipDark",
	    		    content:"请输入标题",
	    		    outside: 'y',
	    		    position: {
	    				x: 'right', y: 'center'
	    			}
	    		}).open();
	    		titleDom.focus().keydown(function(){
	    			titleTrip.destroy();
	    		});
	    	}
	    	if(!address) {
	    		result = false;
	    		addressTrip = new jBox("Tooltip", {
	    			target: $("#new-webAddress"),
	    			content:"请输入网址",
	    			theme:"TooltipDark",
	    			outside: 'y',
	    			position: {
	    				x: 'right', y: 'center'
	    			}
	    		}).open();
	    		addressDom.keydown(function(){
    				addressTrip.destroy();
    			});
	    		if(title) {
	    			addressDom.focus();
	    		}
	    	}
	    	return result;
	    };
	    $("#new-webTitle").focus();
	    //为创建的dom绑定事件 - 关闭按钮	
	    $("#new-cancel").click(function(){
	    	modalWindow.destroy();
	    });
	    //为创建的dom绑定事件 - 提交按钮 	
	    $("#new-website").submit(function(){
	    	//数据保存 ,包括验证表单，如果保存不成功，返回false，不提交表单
	    	if(!validateForm($("#new-webTitle"), $("#new-webAddress"))) {
	    		return false;
	    	}
	    	func(title, address);
	    	//模态窗口关闭
			modalWindow.destroy();
	    	return false;
	    });
	};
	
	//新增网址
	$(".box a.new").click(function(){
		var newWebsite = $(this).parent();
		var addWebSite = function(){
			var title = arguments[0];
			var address = arguments[1];
	    	//UI更新
	    	var insertNewWebsite = '<div class="box sortable">\
				<a href="'+address+'" title="'+title+'" unique="'+new Date().getTime()+'">'+title+'</a>\
				<p><a href="javascript:void(0);" class="edit"><i class="fa fa-edit"></i></a><a href="javascript:void(0);" class="delete"><i class="fa fa-times"></i></a></p>\
				</div>';
			newWebsite.before(insertNewWebsite);
			//保存更新数据
			updateLocalData();
			//收藏网站模块绑定事件
			websiteBindEvent();
			noty({type:"success", text: "添加网站成功!", layout:"topCenter"});
		};
		$.noty.closeAll();
		openModalWindow(null, addWebSite);
	});
	
	//鼠标拖拽排序
	$("#box-container").sortable({cursor: "move", items: ".sortable", update: function(event, ui){
		//保存更新数据
		updateLocalData();
	}});
	
});













