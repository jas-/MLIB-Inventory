$(document).ready(function(){

	$("#main").live('pagebeforecreate',function(event){
		return false;
	});

	$("#main").live('pagecreate pageshow', function(event, ui) {
		$("#jqxgrid").jqxGrid('destroy');
		$("#jqxWidget").html('<div id="jqxgrid"></div>');
		_load();
	});

	($('.ui-page-active').attr('id')=='main') ? _load_main() : false;

	/* retrieve current inventory, setup handlers, options & render grid */
	function _load_main(){

		/* Query server for JSON formatted inventory data */
		$('#current-inventory').offline({
			appID:'MLIB-Inventory',
			url: 'http://new-inventory.scl.utah.edu/?do=current',
			data: {'do':true},
			callback: function(){
				_display($(this));
			}
		});
	}

	$("#search").live('pagebeforecreate',function(event){
		return false;
	});

	$("#search").live('pagecreate pageshow',function(event){
		_load();
	});

	($('.ui-page-active').attr('id')=='search') ? _load_search() : false;

	function _load_search(){
		_destroy('jqxgrid-search');
		$('#search-computer').offline({
			appID:'MLIB-Inventory',
			debug: true,
			callback: function(){
				_destroy('jqxgrid-search');
				_display($(this));
			}
		});
	}

	$("#add").live('pagebeforecreate',function(event){
		return false;
	});

	$("#add").live('pagecreate pageshow',function(event){
		$('#add-computer').offline({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this));
			}
		});
	});

	/* Destroy grid element */
	function _destroy(ele){
		$("#"+ele).jqxGrid('destroy');
		$("#"+ele).html('<div id="'+ele+'"></div>');
	}

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
		$("#jqxgrid-search").jqxGrid('databind', source, 'sort');
		//$("#jqxgrid-search").jqxGrid('savestate');
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

	/* Map our JSON object to fields */
	var source = {
		localdata: obj,
		sort: customsortfunc,
		datafields:[
			{ name: 'Computer', type: 'string' },
			{ name: 'SKU', type: 'string' },
			{ name: 'Serial', type: 'string' },
			{ name: 'UUIC', type: 'string' },
			{ name: 'MSerial', map: 'Monitor>0>MSerial', type: 'string' },
			{ name: 'MSKU', map: 'Monitor>0>MSKU', type: 'string' }
		],
		datatype: "json"
	};
	var dataAdapter = new $.jqx.dataAdapter(source);

	/* Handle editing of record elements */
	$("#jqxgrid-search").on({
		cellvaluechanged: function(event){
			var _d = $('#jqxgrid').jqxGrid('getrowdata', args.rowindex);

			var _c = '{"hostname":"'+_d.Computer+'","sku":"'+_d.SKU+'","uuic":"'+_d.UUIC+'","serial":"'+_d.Serial+'"}';
			var _m = '{"hostname":"'+_d.Computer+'","sku":"'+_d.MSKU+'","serial":"'+_d.MSerial+'"}';

			$('#current-inventory').offline({
				appID:'MLIB-Inventory',
				url: 'http://new-inventory.scl.utah.edu/?do=add',
				data: _c,
				callback: function(){
					_message($(this));
				}
			});

			$('#current-inventory').offline({
				appID:'MLIB-Inventory',
				url: 'http://new-inventory.scl.utah.edu/?do=add-monitor',
				data: _m,
				callback: function(){
					_message($(this));
				}
			});
		}
	});

	/* Create some export options */
	$('#export-csv').on('click', function(){
		$("#jqxgrid-search").jqxGrid('exportdata', 'csv', _date()+'-MLIB-Inventory');
	});
	$('#export-pdf').on('click', function(){
		$("#jqxgrid-search").jqxGrid('exportdata', 'pdf', _date()+'-MLIB-Inventory');
	});
	$('#export-xls').on('click', function(){
		$("#jqxgrid-search").jqxGrid('exportdata', 'xls', _date()+'-MLIB-Inventory');
	});

	/* When row count changes save state */
	$("#jqxgrid-search").on("pagesizechanged", function (event) {
		//$("#jqxgrid-search").jqxGrid('savestate');
	});

	if (_detect()){
		/* handle the pager (since the default can't be adjusted) */
		var pagerrenderer = function () {
			var element = $("<div style='margin-top: 5px; width: 100%; height: 100%;'></div>");
			var datainfo = $("#jqxgrid-search").jqxGrid('getdatainformation');
			var paginginfo = datainfo.paginginformation;

			// create navigation buttons.
			var leftButton = $("<div style='padding: 1px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
			leftButton.find('div').addClass('icon-arrow-left');
			leftButton.width(36);
			leftButton.jqxButton();

			var rightButton = $("<div style='padding: 1px; margin: 0px 3px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
			rightButton.find('div').addClass('icon-arrow-right');
			rightButton.width(36);
			rightButton.jqxButton();

			// append the navigation buttons to the container DIV tag.
			leftButton.appendTo(element);
			rightButton.appendTo(element);

			// create a page information label and append it to the container DIV tag.
			var label = $("<div style='font-size: 11px; margin: 2px 3px; font-weight: bold; float: left;'></div>");
			label.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
			label.appendTo(element);

			// navigate to the next page when the right navigation button is clicked.
			rightButton.click(function () {
				$("#jqxgrid-search").jqxGrid('gotonextpage');
				var datainfo = $("#jqxgrid-search").jqxGrid('getdatainformation');
				var paginginfo = datainfo.paginginformation;
				label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
			});

			// navigate to the previous page when the right navigation button is clicked.
			leftButton.click(function () {
				$("#jqxgrid-search").jqxGrid('gotoprevpage');
				var datainfo = $("#jqxgrid-search").jqxGrid('getdatainformation');
				var paginginfo = datainfo.paginginformation;
				label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
			});
			return element;
		}
	} else {
		var pagerrenderer = false;
	}

	/* Initialize grid with options while binding events etc */
	$("#jqxgrid-search").jqxGrid({
		autoshowloadelement: true,
		width: '100%',
		altrows: true,
		pagerrenderer: pagerrenderer,
		pagesize: (_detect())?5:20,
		pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
		source: dataAdapter,
		theme: theme,
		sortable: true,
		pageable: true,
		autoheight: true,
		editable: true,
		enabletooltips: true,
		selectionmode: 'multiplecellsadvanced',
		ready: function () {
			//$("#jqxgrid-search").jqxGrid('loadstate', $("#jqxgrid-search").jqxGrid('getstate'));
			$("#jqxgrid-search").jqxGrid('sortby', 'Hostname', 'asc');
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

	function _message(obj){
		if (obj!='') {
			$.each(obj, function(key,value){
				$.each(value, function(k,v){
					if(k=='error'){
						$('#message').html('<div class="error">'+v+'</div>').fadeIn(1000);
					}
					if(k=='warning'){
						$('#message').html('<div class="warning">'+v+'</div>').fadeIn(1000);
					}
					if(k=='info'){
						$('#message').html('<div class="info">'+v+'</div>').fadeIn(1000);
					}
					if(k=='success'){
						$('#message').html('<div class="success">'+v+'</div>').fadeIn(1000);
					}
				});
			});
		} else {
			$('#message').html('<div class="warning">Empty response for request</div>').fadeIn(1000);
		}
	}

	setTimeout(function() {	$('#message').fadeOut(); }, 2000);

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

	/* Perform serialization on object */
	function _serialize(args){
		if (_size(args) > 0) {
			var x='';
			$.each(args, function(a, b){
				if (typeof(b) === 'object'){
					$.each(b, function(c, d){
						x+=a+'['+c+']'+'='+d+'&';
					});
				} else {
					x+=a+'='+b+'&';
				}
			});
			x = x.substring(0, x.length-1);
		} else {
			return false;
		}
		return x;
	}

	/* Check browser */
	function _detect(){
		return /android|blackberry|symbian|iemobile|ipad|iphone/gi.test(navigator.userAgent);
	}

	/* Return an ISO formatted date */
	function _date(){
		var _d = new Date();
		return _d.toISOString();
	}
});
