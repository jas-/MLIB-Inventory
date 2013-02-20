$(document).ready(function(){

	/* Unload current grid on collapse */
	$("#current-inventory").bind('collapse', function(event, ui) {
		//$("#jqxgrid").html(false);
	});

	/* On expand load current inventory from server, generate grid & populate */
	$("#current-inventory").bind('expand', function(event, ui) {

		/* Query server for JSON formatted inventory data */
   	$('#current-inventory').offline({
   	  appID:'MLIB-Inventory',
   	  url: 'http://new-inventory.scl.utah.edu/?do=current',
   	  debug: true,
   	  callback: function(){
	   		_display($(this));
   	  }
   	});
  
		/* Handle grid init, options, sorting, paging & editing within grid */
		function _display(obj){
   	  var theme = getDemoTheme();
  
			/* Here we handle sorting of all columns */
   	  var customsortfunc = function (column, direction) {
				var sortdata = new Array();

	   		if (direction == 'ascending') direction = true;
				if (direction == 'descending') direction = false;
  
	  		if (direction != null) {
	  		  for (i = 0; i < obj.length; i++) {
	  			sortdata.push(obj[i]);
	  		  }
	  		} else {
	  		  sortdata = obj;
	  		}

				var tmpToString = Object.prototype.toString;
				Object.prototype.toString = (typeof column == "function") ? column : function () { return this[column] };
				if (direction != null) {
				  sortdata.sort(compare);
				  if (!direction) {
					  sortdata.reverse();
				  }
				}
				source.localdata = sortdata;
				$("#jqxgrid").jqxGrid('databind', source, 'sort');
				//$("#jqxgrid").jqxGrid('savestate');
				Object.prototype.toString = tmpToString;
		  };

			/* Here we perform comparision of strings */
		  var compare = function (value1, value2) {
				value1 = String(value1).toLowerCase();
				value2 = String(value2).toLowerCase();

				try {
				  var tmpvalue1 = parseFloat(value1);
				  if (isNaN(tmpvalue1)) {
						if (value1 < value2) { return -1; }
						if (value1 > value2) { return 1; }
				  } else {
						var tmpvalue2 = parseFloat(value2);
						if (tmpvalue1 < tmpvalue2) { return -1; }
						if (tmpvalue1 > tmpvalue2) { return 1; }
				  }
				} catch (error) {
				  var er = error;
				}
				return 0;
		  };

			/* Create some export options */
		  $('#export-csv').on('click', function(){
				$("#jqxgrid").jqxGrid('exportdata', 'csv', _date()+'-MLIB-Inventory');
		  });
		  $('#export-pdf').on('click', function(){
					$("#jqxgrid").jqxGrid('exportdata', 'pdf', _date()+'-MLIB-Inventory');
		  });
		  $('#export-xls').on('click', function(){
				$("#jqxgrid").jqxGrid('exportdata', 'xls', _date()+'-MLIB-Inventory');
		  });
		
			/* When row count changes save state */
		  $("#jqxgrid").on("pagesizechanged", function (event) {
				//$("#jqxgrid").jqxGrid('savestate');
		  });
	
			/* Map our JSON object to fields */
		  var source = {
				localdata: obj,
				sort: customsortfunc,
				datafields:[
				  { name: 'Computer', type: 'string' },
				  { name: 'SKU', type: 'string' },
				  { name: 'Serial', type: 'string' },
				  { name: 'UUIC', type: 'string' },
				  { name: 'MSerial', map: 'Monitor>0>Serial', type: 'string' },
				  { name: 'MSKU', map: 'Monitor>0>SKU', type: 'string' }
				],
				datatype: "json"
		  };
		  var dataAdapter = new $.jqx.dataAdapter(source);
	
			/* Handle editing of record elements */
		  $("#jqxgrid").on('cellendedit', function (event) {
				var args = event.args;
				//$("#cellendeditevent").text("Event Type: cellendedit, Column: " + args.datafield + ", Row: " + (1 + args.rowindex) + ", Value: " + args.value);
			    // call offline to send edited row contents
		  });

			/* Initialize grid with options while binding events etc */
		  $("#jqxgrid").jqxGrid({
				autoshowloadelement: true,
				width: '100%',
				columnsmenuwidth: '20%',
				altrows: true,
				pagesize: 5,
				pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
				source: dataAdapter,
				theme: theme,
				sortable: true,
				pageable: true,
				autoheight: true,
				editable: true,
				selectionmode: 'multiplecellsadvanced',
				ready: function () {
				  //$("#jqxgrid").jqxGrid('loadstate', $("#jqxgrid").jqxGrid('getstate'));
				  $("#jqxgrid").jqxGrid('sortby', 'Hostname', 'asc');
				},
				columns: [
				  { text: 'Hostname', datafield: 'Computer', width: '20%' },
				  { text: 'SKU', datafield: 'SKU', width: '20%' },
				  { text: 'Serial', datafield: 'Serial', width: '20%' },
				  { text: 'UUIC', datafield: 'UUIC', width: '10%' },
				  { text: 'Monitor Serial', datafield: 'MSerial', width: '20%' },
				  { text: 'Monitor SKU', datafield: 'MSKU', width: '10%' }
				]
		  });
		}

		/* Helper function to inspect objects recursively */
		function _inspect(obj){
		  $.each(obj, function(x, y){
			if ((/object|array/.test(typeof(y))) && (_size(y) > 0)){
			  console.log('inspect: Examining '+x+' ('+typeof(y)+')');
			  _inspect(y);
			} else {
			  console.log('inspect: '+x+' => '+y);
			}
		  });
		}

		/* Calculate size of an object */
		function _size(obj){
		  var n = 0;
		  if (/object/.test(typeof(obj))) {
				$.each(obj, function(k, v){
				  if (obj.hasOwnProperty(k)) n++;
				});
		  } else if (/array/.test(typeof(obj))) {
				n = obj.length;
		  }
		  return n;
		}

		/* Return an ISO formatted date */
		function _date(){
		  var _d = new Date();
		  return _d.toISOString();
		}
  });
});
