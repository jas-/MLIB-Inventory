  $(document).ready(function(){

	$('#current-inventory').offline({
	  appID:'MLIB-Inventory',
	  url: 'http://new-inventory.scl.utah.edu/?do=current',
	  debug: true,
	  callback: function(){
		_display($(this));
	  }
	});

	function _display(obj){
	  var theme = getDemoTheme();

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
		Object.prototype.toString = tmpToString;
	  };

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

	  $("#jqxgrid").jqxGrid({
		width: '90%',
		pagesize: 20,
		pagesizeoptions: ['10', '20', '30', '40', '50'],
		source: dataAdapter,
		theme: theme,
		sortable: true,
		pageable: true,
		autoheight: true,
		editable: true,
		selectionmode: 'multiplecellsadvanced',
		ready: function () {
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
  });
