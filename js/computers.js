$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-computer';

	/* Name of client storage key */
	var key = 'computers';

  /* Mappings for computer data source */
	var computers = {
		source: {
			datafields:[
				{ name:		'Id',					type: 'number' },
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
				editable: false,
        validation: function(cell, value) {
          return valSKU(value);
        }
      },
			{ text: 'UUIC',
        datafield: 'UUIC',
        width: '10%',
				editable: false,
        validation: function(cell, value) {
          return valUUIC(value);
        }
      },
			{ text: 'Serial',
        datafield: 'Serial',
        width: '10%',
				editable: false,
        validation: function(cell, value) {
          return valSerial(value);
        }
      },
			{ text: 'EOWD',
				datafield: 'EOWD',
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
			{ text: 'OPD',
				datafield: 'OPD',
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
			{ text: 'Description',
        datafield: 'Description',
        width: '10%',
				editable: false,
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
	doIt(key, grid, api.computer.url, methods.all, computers);

	/* Listen for cell edit events */
	$('#'+grid).on('cellendedit', function(event){
		var args = event.args;

		$('#'+grid).jqxGrid('setcellvalue', args.rowindex, args.datafield, args.value);

    /* Get current record object */
    var d = $('#'+grid).jqxGrid('getrowdata', args.rowindex);
    d.Id = String(d.Id);

    /* Serialize object for remote update */
		var o = format_obj(d, args.datafield, args.value);

    /* Perform AJAX PUT to update remote record set */
		doRequest(grid, api.computer.url+'/'+d.Id, methods.update, o, function(result){

      /* Update local record set */
      localData(key, false, function(obj){
				localData(key, _update(d, obj));
      });

      /* Display message from remote update */
			message(result, 'message-edit-computer');
    });
	});

});
