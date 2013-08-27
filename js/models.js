$(document).ready(function(){
	/* Mappings for models data source */
	var models = {
		source: {
			datafields:[
				{ name:		'Model',			type: 'string' },
				{ name:		'EOWD',				type: 'string' },
				{ name:		'OPD',				type: 'string' },
				{ name:		'Description',type: 'string' },
				{ name:		'Notes',			type: 'string' }
			],
			datatype: "json"
		},
		columns: [
			{ text: 'Model',			datafield: 'Date',				width: '20%' },
			{ text: 'EOWD',				datafield: 'EOWD',				width: '20%' },
			{ text: 'OPD',				datafield: 'OPD',					width: '20%' },
			{ text: 'Description',datafield: 'Description',	width: '20%' },
			{ text: 'Notes',			datafield: 'Notes',				width: '10%' }
		]
	};
});