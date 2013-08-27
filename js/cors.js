$(document).ready(function(){
	/* Mappings for cors data source */
	var cors = {
		source: {
			datafields:[
				{ name:		'Application',type: 'string' },
				{ name:		'URL',				type: 'string' },
				{ name:		'IP',					type: 'string' },
			],
			datatype: "json"
		},
		columns: [
			{ text: 'Application',datafield: 'Application',	width: '20%' },
			{ text: 'URL',				datafield: 'URL',					width: '20%' },
			{ text: 'IP',					datafield: 'IP',					width: '10%' }
		]
	};
});