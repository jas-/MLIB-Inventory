$(document).ready(function(){

	$('#add-computer').offline({
		appID:'MLIB-Inventory',
		debug: true,
		callback: function(){
			_message($(this));
		}
	});
});
