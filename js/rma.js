$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-rma';

	/* Name of client storage key */
	var key = 'rma';

  /* Mappings for computer data source */
	var rma = {
		source: {
			datafields:[
				{ name:		'Problem',			type: 'boolean' },
				{ name:		'Date',					type: 'string' },
				{ name:		'Hostname',			type: 'string' },
				{ name:		'Model',				type: 'string' },
				{ name:		'SKU',					type: 'string' },
				{ name:		'UUIC',					type: 'string' },
				{ name:		'Serial',				type: 'string' },
				{ name:		'Part',					type: 'string' },
				{ name:		'Notes',				type: 'string' }
			],
			datatype: 'json'
		},
		columns: [
			{ text: 'Problem?',
        datafield: 'Problem',
        width: '5%',
        validation: function (cell, value) {
          /* checkbox */
        }
      },
			{	text: 'Date',
				datafield: 'Date',
				width: '10%',
				cellsformat: 'MM/dd/yyyy',
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
			{ text: 'Part',
        datafield: 'Part',
        width: '15%',
        validation: function(cell, value) {
          return valGeneral(value);
        }
      },
			{ text: 'Notes',
        datafield: 'Notes',
        width: '20%',
        validation: function(cell, value) {
          return valGeneral(value);
        }
      }
		]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.rma.url, methods.all, rma)

});
