$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-rma';

	/* Name of client storage key */
	var key = 'rma';

  /* Mappings for computer data source */
	var rma = {
		source: {
			datafields:[
				{ name:		'Id',						type: 'number' },
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
			{ text: 'Record ID',
        datafield: 'Id',
        width: '5%',
				editable: false,
        validation: function (cell, value) {
          return valNumber(value);
        }
      },
			{ text: 'Problem?',
        datafield: 'Problem',
        width: '5%',
				type: 'bool',
				columntype: 'checkbox',
        validation: function (cell, value) {
          return valBoolean(value);
        }
      },
			{	text: 'Date',
				datafield: 'Date',
				width: '10%',
				cellsformat: 'yyyy-MM-dd',
				columntype: 'datetimeinput',
        filtertype: 'date',
				initeditor: function(row, column, editor) {
					var d = new Date()
					_d = [d.getFullYear(), d.getMonth(), d.getDate()].join('-');
					editor.jqxDateTimeInput('setDate', _d, {
						formatString: 'yyyy-MM-dd',
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
        width: '15%',
        validation: function(cell, value) {
          return valGeneral(value);
        }
      }
		]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.rma.url, methods.all, rma)

	/* Listen for cell edit events */
	$('#'+grid).on('cellendedit', function(event){
		var args = event.args;

		$('#'+grid).jqxGrid('setcellvalue', args.rowindex, args.datafield, args.value);

		var d = format_obj($('#'+grid).jqxGrid('getrowdata', args.rowindex), args.datafield, args.value);

		doRequest(grid, api.rma.url+'/'+d.Id, methods.update, d, function(result){
			message(result, 'message-edit-rma');
		});
	});

	/* Bind computer & monitor objects to autocomplete */
	localData('computers', false, function(local){
		$('#hostname').autocomplete({
			source: hostname_obj2arr(local),
			select: function(event, ui){
				var index = ui.item.value;
				$.grep(local, function(obj){
					if (obj.Hostname == index) {
						$('#model').val(obj.Model);
						$('#sku').val(obj.SKU);
						$('#uuic').val(obj.UUIC);
						$('#serial').val(obj.Serial);
					}
				});
			}
		});
	});

});
