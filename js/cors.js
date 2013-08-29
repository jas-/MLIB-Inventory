$(document).ready(function(){

	/* DOM element storing dqxGrid */
	var grid = 'jqxgrid-cors';

	/* Name of client storage key */
	var key = 'cors';

  /* Mappings for computer data source */
	var cors = {
		source: {
			datafields:[
				{ name:		'Application',	type: 'string' },
				{ name:		'URL',					type: 'string' },
				{ name:		'IP',						type: 'string' }
			],
			datatype: 'json'
		},
		columns: [
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
        width: '32%',
        validation: function(cell, value) {
          return valIP(value);
        }
      },
		]
	};

  /* Initialize computer record set */
	doIt(key, grid, api.cors.url, methods.all, cors)

});
