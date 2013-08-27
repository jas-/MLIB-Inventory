$(document).ready(function(){
	/* Mappings for monitors data source */
	var monitors = {
		source: {
			datafields:[
				{ name:		'Hostname',		type: 'string' },
				{ name:		'Model',			type: 'string' },
				{ name:		'SKU',				type: 'string' },
				{ name:		'Serial',			type: 'string' }
			],
			datatype: "json"
		},
		columns: [
			{ text: 'Hostname',		datafield: 'Hostname',		width: '20%' },
			{	text: 'Model',
				datafield: 'Model',
				width: '10%',
				columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					doRequest('models', api.models.url, methods.all, false, function(obj){
						console.log(JSON.stringify(obj));
						editor.jqxDropDownList({
							autoDropDownHeight: true,
							source: model_obj2arr(obj)
						});
					});
				}
			},
			{ text: 'SKU',				datafield: 'SKU',					width: '20%' },
			{ text: 'UUIC',				datafield: 'UUIC',				width: '20%' }
		]
	};
});