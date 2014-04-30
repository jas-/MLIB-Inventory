$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-model';

	/* Name of client storage key */
	var key = 'models';

  /* Mappings for computer data source */
	var models = {
		source: {
			datafields:[
				{ name:		'Id',					type: 'number' },
				{ name:		'Model',			type: 'string' },
				{ name:		'Description',type: 'string' }
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
			{	text: 'Model',
				datafield: 'Model',
				width: '20%',
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
			{ text: 'Description',
        datafield: 'Description',
        validation: function(cell, value) {
          return valGeneral(value);
        }
      }
		]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.model.url, methods.all, models);

	/* Listen for cell edit events */
	$('#'+grid).on('cellendedit', function(event){
		var args = event.args;

		$('#'+grid).jqxGrid('setcellvalue', args.rowindex, args.datafield, args.value);

		var d = format_obj($('#'+grid).jqxGrid('getrowdata', args.rowindex), args.datafield, args.value);

		doRequest(grid, api.model.url+'/'+d.Id, methods.update, d, function(result){
			message(result, 'message-edit-models');
		});
	});

});
