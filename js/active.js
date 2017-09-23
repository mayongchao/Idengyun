// 活动 ，专题列通用
$(function(){
	var listType = $('#nav-tab').attr('list-type'), //存储列表类型
		scrollWid = 0,
		sindex = 0, 	//tab切换时的索引，拉动时加载本tab的内容
		sid, 	//分类ie
		spage,	// 分页
		listData = {}; 

	// 占位
	var tombsign = '<div class="tombsign" style="display: block;"><div></div><div></div><div></div></div>';

	//导航固定宽度
	$('#nav-tab li').each(function(){
		scrollWid += parseInt($(this).outerWidth());
	});
	$('.nav-inner').width(scrollWid);

	/*
	 * 页面加载默认展示上次点击的分类，如果没有则第一个分类
	*/

	storage = localStorage.getItem('mtmyListCate');

	// 先判断是否存在mtmyListCate
	if(storage !== null){
		storage = JSON.parse(storage); // 获取属性 storage.typeId区分文章还是专题
		sid = storage.sId;

		$('#nav-tab li').each(function(i, e){
			if($(this).attr('id') == sid){
				$(this).addClass('active').siblings().removeClass('active');
				sid = $('#nav-tab .active').attr('id');
				spage = $('#nav-tab .active').attr('data-page');
				sindex = i;
			}
			
		});

	}

	$('.loading').fadeOut();
	// 页面第一次加载
	loadComment(sid,spage,sindex);

	// 点击分类
	$('#nav-tab li').click(function(){
		var $this = $(this);
			sindex = $this.index();
			sid = $this.attr('id');
			spage = $this.attr('data-page');
		// 滑块效果
		moveBox(sindex);
		
		$this.addClass('active').siblings().removeClass('active');
		if (spage == '1'){
			try{
				// 根据type类型存储活动还是专题 
				listData = {"typeId":listType,"sId":sid}; 
				localStorage.setItem('mtmyListCate', JSON.stringify(listData));
				
			}catch(e){}
			
			loadComment(sid,spage,sindex);
		}else{
			$('#con').find('.tab-inner').eq(sindex).siblings().hide();
			$('#con').find('.tab-inner').eq(sindex).fadeIn();
		}	
	});
	// 拉动加载
	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop(),
			scrollHeight = $(document).height(),
			windowHeight = $(this).height();
	　　if(scrollTop + windowHeight == scrollHeight){
			loadComment(sid,spage,sindex);
	　　}

	});
	// moveBox
	function moveBox(i){
		$('#nav-tab').animate({scrollLeft:($('#nav-tab').scrollLeft()) + ($('#nav-tab li').eq(i).offset().left) +'px'}, 300);
	}

	function loadComment(id,page,index){
		// 如果没找到分类，默认加载第一条
		var $i = index || $('#nav-tab li').eq(0).index(),
			$id = id || $('#nav-tab li').eq(0).attr('id'),
			$page = page || 1,
			element = $('#'+$id),
			obj = $('#con').find('.tab-inner').eq($i);

		obj.show().siblings().hide();

		// 没有数据了不加载
		if(!element.data('nomore') && !element.data('isload')){
			// 加载数据
			$.ajax({
				url:'../js/data.php',
				data:{
					// id:$id,
					// page:$page,
				},
				dataType: "json",
				type:"get",
				beforeSend:function(){
					element.data('isload',true); //防止快速拉动加载重复数据
					obj.append(tombsign);
				},
				success: function(data) {
				
					// 添加数据
					var str='';
					// 活动类只有一张图，图片高度有限，分页条数大一些
					for (var i = 5; i >= 0; i--) {
						str +='<a href="" class="art-item">'
							+'<div class="BGImg">'
								+'<img src="http://resource.idengyun.com/resource/images/2017/04/f8bc98d0-3aa6-477b-9dca-ccc519c3753d.jpg" alt="" />'
							+'</div>'
						+'</a>';
					};
					
					obj.find('.tombsign').remove();
					element.data('isload', false);
					obj.append(str);
					$page++;
					spage = $page;
					$('#'+$id).attr("data-page",$page);
					// 判断到底啦
					if ($page>=5){
						element.data('nomore',true);
						obj.append('<div class="no-more"></div>');
					};
					
				},
				error:function(err){
					$('addload').fadeOut();
					msgAlert('网络请求超时');
				}
			});
		}	
	}

	// 提示方法
	var $load = $('#addload'),
		$tip = $load.find('.spiner');
	function msgAlert(text){
		$tip.addClass('warning').append('<p class="text">'+text+'</p>');
		$load.fadeIn();
		setTimeout(function(){
			$load.fadeOut(500,function(){
				$tip.empty().removeClass('warning');
			})
		},1000);
	};

});
