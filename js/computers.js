$(document).ready(function(){

  /* Mappings for computer data source */
	var computers = {
		source: {
			datafields:[
				{ name:		'Hostname',		type: 'string' },
				{ name:		'Model',			type: 'string' },
				{ name:		'SKU',				type: 'string' },
				{ name:		'UUIC',				type: 'string' },
				{ name:		'Serial',			type: 'string' },
				{ name:		'EOWD',				type: 'date'   },
				{ name:		'OPD',				type: 'date'   },
				{ name:		'Description',type: 'string' },
				{ name:		'Notes',			type: 'string' }
			],
			datatype: "json"
		},
		columns: [
			{ text: 'Hostname',
        datafield: 'Hostname',
        width: '10%',
        validation: function (cell, value) {
          return valHostname(value);
        }
      },
			{	text: 'Model',
				datafield: 'Model',
				width: '10%',
				columntype: 'dropdownlist',
				createeditor: function (row, column, editor) {
					doRequest('models', api.models.url, methods.all, false, function(obj){
						editor.jqxDropDownList({
							autoDropDownHeight: true,
							source: model_obj2arr(obj)
						});
					});
				},
        validation: function(cell, value) {
          return valModel(value);
        }
			},
			{ text: 'SKU',
        datafield: 'SKU',
        width: '10%',
        validation: function(cell, value) {
          return valSKU(value);
        }
      },
			{ text: 'UUIC',
        datafield: 'UUIC',
        width: '10%',
        validation: function(cell, value) {
          return valUUIC(value);
        }
      },
			{ text: 'Serial',
        datafield: 'Serial',
        width: '10%',
        validation: function(cell, value) {
          return valSerial(value);
        }
      },
			{ text: 'EOWD',
				datafield: 'EOWD',
				width: '10%',
				columntype: 'datetimeinput',
        filtertype: 'date',
				initeditor: function(row, column, editor) {
					var d = new Date()
					_d = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/');
					editor.jqxDateTimeInput('setDate', _d, {
						formatString: 'MM/dd/yyyy',
						animationType: 'fade',
						width: '150px',
						height: '25px',
						dropDownHorizontalAlignment: 'right'
					})
				},
        validation: function(cell, value) {
          return valDate(value);
        }
			},
			{ text: 'OPD',
				datafield: 'OPD',
				width: '10%',
				columntype: 'datetimeinput',
        filtertype: 'date',
				initeditor: function(row, column, editor) {
					var d = new Date()
					_d = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/');
					editor.jqxDateTimeInput('setDate', _d, {
						formatString: 'MM/dd/yyyy',
						animationType: 'fade',
						width: '150px',
						height: '25px',
						dropDownHorizontalAlignment: 'right'
					})
				},
        validation: function(cell, value) {
          return valDate(value);
        }
			},
			{ text: 'Description',
        datafield: 'Description',
        width: '10%',
        validation: function(cell, value) {
          return valDescription(value);
        }
      },
			{ text: 'Notes',
        datafield: 'Notes',
        width: '20%',
        validation: function(cell, value) {
          return valNotes(value);
        }
      }
		]
	};

  /* Initialize computer record sets */
	doRequest('computers', api.computers.url, methods.all, false, function(obj){
		computers.source.localdata = obj;
		doGrid('jqxgrid-computers', computers);
	});
});