$(function(){
	$('.loading').fadeOut();
	$('.select-cnt').on('touchmove',function(e){
		e.preventDefault()
	});
	Hammer.plugins.fakeMultitouch();
	$('.drum').drum();
	
	// 省市区 变量
	var provinceVal,provinceText,cityVal,cityText,districtVal,districtText;

	// 弹出省市选框
	$('.btnRight,.modify').click(function(){
		$('#address').addClass('show');
	});
	var page = 2,
		is_continue = 0;	//是否继续加载
	/*
	 *省市区 三级联动
	*/ 
	var area = {};
	/*$.getJSON(jsRoot+'area.json', function(data){
		area = data;
	});*/
	$('#province').drum({	//省选框
		onChange: function(selected){
			provinced(selected);
		}
	});
	// 省操作
	var citys = '';
	function provinced(selected){
		$('#city').empty();
		$('#city').append('<option value="-1">请选择...</option>');
		$('#city').drum();
		cityVal = undefined;
		cityText = '请选择...';
		
		$('#district').empty();
		$('#district').append('<option value="-1">请选择...</option>');
		$('#district').drum();
		
		districtVal = undefined;
		districtText = '请选择...';
		if(selected.value == -1){
			$('.submitBtn').attr("disabled", true);
			return;
		}
		$('.submitBtn').removeAttr("disabled");
		provinceVal = selected.value;	//选择的value值
		provinceText = $(selected).find("option:selected").text();	//选择的文本值
		var cityItems = {};
		$(area).each(function(i, e){
			if(e.id == provinceVal){
				$(e.areas).each(function(j, ce){
					cityItems += '<option value="'+ce.id+'">'+ce.name+'</option>';
				});
				citys = e.areas;
				return false;
			}
		});
		$('#city').append(cityItems);
		$('#city').drum({ //市选框
			onChange: function(selected){
				cityd(selected);
				$('.submitBtn').attr("disabled", true);
				cityVal = selected.value;//选择的value值
				cityText = $(selected).find("option:selected").text();//选择的文本值
			}
		});
		cityItems = '';
	}
	// 市操作
	function cityd(selected){
		$('#district').empty();
		$('#district').append('<option value="-1">请选择...</option>');
		$('#district').drum();
		
		cityVal = selected.value;//选择的value值
		cityText = $(selected).find("option:selected").text();//选择的文本值
		
		districtVal = undefined;
		districtText = '请选择...';
		if(selected.value == -1){
			$('.submitBtn').attr("disabled", true);
			return;
		}
		
		$('.submitBtn').removeAttr("disabled");
		var districtItem = '';
		$(citys).each(function(i, e){
			if(e.id == cityVal){
				$(e.areas).each(function(j, de){
					districtItem += '<option value="'+de.id+'">'+de.name+'</option>';
				});
			}
		});
		
		$('#district').append(districtItem);
		if($('#district option').size() == 1){
			$('#district').append('<option value="">未设定</option>');
		}
		
		$('#district').drum({
			onChange: function(selected){
				if(selected.value == -1){
					$('.submitBtn').attr("disabled", true);
					return;
				}
				
				$('.submitBtn').removeAttr("disabled"); 
				districtVal = selected.value;//选择的value值
				districtText = $(selected).find("option:selected").text();//选择的文本值
			}
		});
		citys, districtItem = '';
	}

	// 三级联动确定按钮
	$('#address .submitBtn').click(function(){
		$('#address').removeClass('show');
		var franchisee_id = $('#franchisee_id').val();
		$.ajax({
			url: base+'office/queryShopByArea.do',
			type: 'post',
			data: {province: provinceVal, city: cityVal, district: districtVal, area_name: '',franchisee_id:franchisee_id},
			dataType: 'json',
			beforeSend: function () {
		        $('#addload').show();
		    }, success: function(data){
				$('#address-list').empty();
				$('#addload').fadeOut();
				
				//没有服务店铺
				if (data.data == "") {
					$('#address-list').append('<div class="empty empty-store"><p>抱歉，您当前选择区域暂无服务店铺！</p></div>');
				}else{
					//更新服务店铺列表
					$(data.data).each(function(i, e){
						$('#address-list').append('<div onclick="selectAddress(\'' + e.id +'\')" class="item">' +
								'<a class="item-title">' + e.name + '</a>' +
								'<a class="item-info">电话：' + e.phone + '</a>' +
								'<a class="item-info">地址：' + e.address + '</a>' +
								'<div class="clt-nav">' +
								'<a href="tel:' + e.phone + '"></a>' +
								'<a href="javascript:;"></a>' +
								'</div>' +
						'</div>')
					});
				}
				
				if(districtText == '未设定'){
					districtText = '';
				}
				
				if(undefined == provinceText || provinceText == '请选择...'){
					provinceText = '';
					provinceVal = '';
				}
				if(undefined == cityText || cityText == '请选择...'){
					cityText = '';
					cityVal = '';
				}
				
				if(undefined == districtText || districtText == '请选择...'){
					districtText = '';
					districtVal = '';
				}
				$('.select-address').text('所在地区：' + provinceText + ' '+ cityText + ' '+ districtText);
			}
		});	
	});


	// 取消按钮 隐藏联动区域
	$('#address .cencelBtn').click(function(){
		$('.submitBtn').attr("disabled", true); 
		$('#address').addClass('hide').removeClass('show');
	});

});

	var returnUrl = $('#returnUrl').val();
	function selectAddress(id){
		window.location.href = decodeURIComponent(returnUrl + encodeURIComponent('&shop_id=' + id));
	}
		