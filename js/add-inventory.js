$(document).ready(function(){

	$("#add").live('pagebeforecreate',function(event){
		return false;
	});

	$("#add").live('pagecreate pageshow',function(event){
		$('#add-computer').offline({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this));
			}
		});
	});

	function _message(obj){
		if (obj!='') {
			$.each(obj, function(key,value){
				$.each(value, function(k,v){
					if(k=='error'){
						$('#message-add').html('<div class="error">'+v+'</div>').fadeIn(1000);
					}
					if(k=='warning'){
						$('#message-add').html('<div class="warning">'+v+'</div>').fadeIn(1000);
					}
					if(k=='info'){
						$('#message-add').html('<div class="info">'+v+'</div>').fadeIn(1000);
					}
					if(k=='success'){
						$('#message-add').html('<div class="success">'+v+'</div>').fadeIn(1000);
					}
				});
			});
		} else {
			$('#message-add').html('<div class="warning">Empty response for request</div>').fadeIn(1000);
		}
	}

	setTimeout(function() {	$('#message-add').fadeOut(); }, 2000);
});
