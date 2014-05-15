$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-cors';

	/* Name of client storage key */
	var key = 'cors';

  /* Mappings for computer data source */
	var cors = {
		source: {
			datafields:[
				{ name:		'Id',						type: 'number' },
				{ name:		'Application',	type: 'string' },
				{ name:		'URL',					type: 'string' },
				{ name:		'IP',						type: 'string' }
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
			{ text: 'Application',
        datafield: 'Application',
        width: '36%',
        validation: function (cell, value) {
          return valGeneral(value);
        }
      },
			{ text: 'URL',
        datafield: 'URL',
        width: '32%',
        validation: function(cell, value) {
          return valURL(value);
        }
      },
			{ text: 'IP',
        datafield: 'IP',
        width: '27%',
        validation: function(cell, value) {
          return valIP(value);
        }
      },
		]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.cors.url, methods.all, cors);

	/* Listen for cell edit events */
	$('#'+grid).on('cellendedit', function(event){
		var args = event.args;

		$('#'+grid).jqxGrid('setcellvalue', args.rowindex, args.datafield, args.value);

    /* Get current record object */
    var d = $('#'+grid).jqxGrid('getrowdata', args.rowindex);

    /* Serialize object for remote update */
		var o = format_obj(d, args.datafield, args.value);

    /* Perform AJAX PUT to update remote record set */
		doRequest(grid, api.cors.url+'/'+d.Id, methods.update, o, function(result){

      /* Update local record set */
      localData(key, false, function(obj){

				$(window).secStore('empty', {
					appID: key,
					storage: 'session'
				});

				localData(key, _update(d, obj));
      });

      /* Display message from remote update */
			message(result, 'message-edit-cors');
    });
	});

});
