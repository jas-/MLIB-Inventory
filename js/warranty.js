$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-warranty';

	/* Name of client storage key */
	var key = 'warranty';

  /* Mappings for computer data source */
	var warrantys = {
		source: {
			datafields:[
				{ name:		'Id',					type: 'number' },
				{ name:		'EOWD',				type: 'date'   },
				{ name:		'OPD',				type: 'date'   }
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
			{ text: 'EOWD',
				datafield: 'EOWD',
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
			}
    ]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.warranty.url, methods.all, warrantys);

	/* Listen for cell edit events */
	$('#'+grid).on('cellendedit', function(event){
		var args = event.args;

		$('#'+grid).jqxGrid('setcellvalue', args.rowindex, args.datafield, args.value);

    /* Get current record object */
    var d = $('#'+grid).jqxGrid('getrowdata', args.rowindex);

    /* Serialize object for remote update */
		var o = format_obj(d, args.datafield, args.value);

    /* Perform AJAX PUT to update remote record set */
		doRequest(grid, api.warranty.url+'/'+d.Id, methods.update, o, function(result){

      /* Update local record set */
      localData(key, false, function(obj){

				$(window).secStore('empty', {
					appID: key,
					storage: 'session'
				});

				localData(key, _update(d, obj));
      });

      /* Display message from remote update */
			message(result, 'message-edit-warranty');
    });
	});

});
