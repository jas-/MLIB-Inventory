$(document).ready(function(){
	/* Mappings for rma data source */
	var rma = {
		source: {
			datafields:[
				{ name:		'Date',				type: 'string' },
				{ name:		'Hostname',		type: 'string' },
				{ name:		'Model',			type: 'string' },
				{ name:		'SKU',				type: 'string' },
				{ name:		'UUIC',				type: 'string' },
				{ name:		'Serial',			type: 'string' },
				{ name:		'Part',				type: 'string' },
				{ name:		'Notes',			type: 'string' },
			],
			datatype: "json"
		},
		columns: [
			{ text: 'Date',				datafield: 'Date',				width: '20%' },
			{ text: 'Hostname',		datafield: 'Hostname',		width: '20%' },
			{ text: 'Model',			datafield: 'Model',				width: '20%', columntype: 'dropdownlist' },
			{ text: 'SKU',				datafield: 'SKU',					width: '20%' },
			{ text: 'UUIC',				datafield: 'UUIC',				width: '20%' },
			{ text: 'Serial',			datafield: 'Serial',			width: '20%' },
			{ text: 'Part',				datafield: 'Part',				width: '20%' },
			{ text: 'Notes',			datafield: 'Notes',				width: '10%' }
		]
	};
});