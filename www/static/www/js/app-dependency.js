$(function() {
  $('#service_dependency_finished').click(
	function() {		
		var serviceKey="";
		var serviceId="";
		$("input[name='inlineCheckbox1']:checkbox").each(function() {
			if ($(this).is(":checked")) {
				var str = $(this).val().split("_");
				if (str.length == 3) {
					if (serviceKey != "") {
						serviceKey = serviceKey + ","
					}
					serviceKey = serviceKey + str[0]+":"+str[2]
				}
			}
		});
		$("#createService").val(serviceKey)
		
		$("input[name='delineCheckbox1']:checkbox").each(function() {
			if ($(this).is(":checked")) {
				var str = $(this).val().split("_");
				if (str.length == 3) {
					if (serviceId != "") {
						serviceId = serviceId + ","
					}
					serviceId = serviceId + str[0]
				}
			}
		});
		$("#hasService").val(serviceId)
		
		var tenantName = $('#tenantName').val();
		var service_name = $('#service_name').val();
		var _data = $("form").serialize();
		$("#service_dependency_finished").attr('disabled', "true")	
		$.ajax({
			type : "post",
			url : "/apps/" + tenantName + "/"+ service_name + "/app-dependency/",
			data : _data,
			cache : false,
			beforeSend : function(xhr, settings) {
				var csrftoken = $.cookie('csrftoken');
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			},
			success : function(msg) {
				var dataObj = msg;
				if (dataObj["status"] == "success") {
					window.location.href = "/apps/" + tenantName + "/"
							+ service_name + "/app-waiting/"
				} else if (dataObj["status"] == "owed"){
    				swal("余额不足请及时充值")
    			} else if (dataObj["status"] == "expired"){
					swal("试用已到期")
				} else if (dataObj["status"] == "over_memory") {
    				swal("资源已达上限，不能创建");
    				$("#service_dependency_finished").removeAttr('disabled')
    			} else if (dataObj["status"] == "over_money") {
    				swal("余额不足，不能创建");
    				$("#service_dependency_finished").removeAttr('disabled')
    			} else {
					swal("创建失败")
					$("#service_dependency_finished").removeAttr('disabled')
				}
			},
			error : function() {
				swal("系统异常,请重试");
				$("#service_dependency_finished").removeAttr('disabled')
			}
		})
	})
});
