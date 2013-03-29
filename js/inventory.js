$(document).ready(function(){

	/* Force binding on page focus */
	($('.ui-page-active').attr('id')=='main') ? _load('current', 'http://new-inventory.scl.utah.edu/?do=current', {'do':true}, true, 'inventory-current') : false;
	($('.ui-page-active').attr('id')=='search') ? _load('search', false, false, true, 'search-computer') : false;
	($('.ui-page-active').attr('id')=='add') ? _load('add-computer', false, false, false, 'add-computer') : false;

	/* Set event handlers for pagecreate & pageshow events */
	$("#main").live('pagecreate pageshow', function(event, ui) {
		_destroy('current');
		_load('current', 'http://new-inventory.scl.utah.edu/?do=current', {'do':true}, true, 'inventory-current');
	});

	$("#search").live('pagecreate pageshow',function(event){
		_destroy('search');
		_load('search', false, false, true, 'search-computer');
	});

	$("#add").live('pagecreate pageshow',function(event){
		_load('add-computer', false, false, false, 'add-computer');
	});

	/* Destroy current grid element */
	function _destroy(ele){
		$("#jqxgrid-"+ele).jqxGrid('destroy');
		$("#jqxWidget-"+ele).html('<div id="jqxgrid-'+ele+'"></div>');
	}

	/* Call $.comm() with specified params */
	function _load(ele, url, data, grid, name){
		$('#'+name).comm({
			appID:'MLIB-Inventory',
			url: (url) ? url : false,
			data: (data) ? data : false,
			callback: function(){
				_message($(this), ele);
				_destroy(ele);
				(grid) ? _display($(this), ele) : false;
				_message($(this), ele);
			}
		});
	}

	/* Workhorse grid function */
	function _display(obj, ele){

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
			$("#jqxgrid-"+ele).jqxGrid('databind', source, 'sort');
			$("#jqxgrid").jqxGrid('savestate');
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
				{ name: 'MSerial', map: 'Monitor>0>Serial', type: 'string' },
				{ name: 'MSKU', map: 'Monitor>0>SKU', type: 'string' }
			],
			datatype: "json"
		};
		var dataAdapter = new $.jqx.dataAdapter(source);

		if (_detect()){
			/* handle the pager (since the default can't be adjusted) */
			var pagerrenderer = function () {
				var element = $("<div style='margin-top: 5px; width: 100%; height: 100%;'></div>");
				var datainfo = $("#jqxgrid-"+ele).jqxGrid('getdatainformation');
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
					$("#jqxgrid").jqxGrid('gotonextpage');
					var datainfo = $("#jqxgrid-"+ele).jqxGrid('getdatainformation');
					var paginginfo = datainfo.paginginformation;
					label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
				});

				// navigate to the previous page when the right navigation button is clicked.
				leftButton.click(function () {
					$("#jqxgrid-"+ele).jqxGrid('gotoprevpage');
					var datainfo = $("#jqxgrid").jqxGrid('getdatainformation');
					var paginginfo = datainfo.paginginformation;
					label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
				});
				return element;
			}
		} else {
			var pagerrenderer = false;
		}

		/* Initialize grid with options while binding events etc */
		$("#jqxgrid-"+ele).jqxGrid({
			autoshowloadelement: true,
			width: '100%',
			altrows: true,
			pagerrenderer: pagerrenderer,
			pagesize: (_detect()) ? 5 : 20,
			pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
			source: dataAdapter,
			theme: theme,
			sortable: true,
			pageable: true,
			autoheight: true,
			autosave: true,
			autorestore: true,
			selectionmode: 'singlerow',
			ready: function () {
				$("#jqxgrid").jqxGrid('loadstate', $("#jqxgrid").jqxGrid('getstate'));
				$("#jqxgrid-"+ele).jqxGrid('sortby', 'Hostname', 'asc');
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

		/* Handle editing of record elements */
		$("#jqxgrid-"+ele).on({
			rowclick: function(event){

				$('#record-details').simpledialog2({
					headerText: 'Edit inventory record',
					dialogAllow: true,
					dialogForce: true,
					safeNuke: true,
					blankContentAdopt: true,
					callbackOpen: function(){
						$('#message-edit-computer').html('');
						$('#message-edit-monitor').html('');
					}
				});
				_populate(obj[$('#jqxgrid-'+ele).jqxGrid('getrowid', args.rowindex)]);
			}
		});

		$('#add-computer').comm({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this), 'add-computer');
			}
		});

		$('#add-monitor').comm({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this), 'add-monitor');
			}
		});

		$('#edit-computer').comm({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this), 'edit-computer');
			}
		});

		$('#edit-monitor').comm({
			appID:'MLIB-Inventory',
			callback: function(){
				_message($(this), 'edit-monitor');
			}
		});

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

		/* Create some filter options */

		/* When row count changes save state */
		$("#jqxgrid-"+ele).on("pagesizechanged", function (event) {
			//$("#jqxgrid").jqxGrid('savestate');
		});

	}

	function _message(obj, ele){
		if (obj!='') {
			$.each(obj, function(key,value){
				$.each(value, function(k,v){
					if(k=='error'){
						$('#message-'+ele).html('<div class="error">'+v+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
					}
					if(k=='warning'){
						$('#message-'+ele).html('<div class="warning">'+v+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
					}
					if(k=='info'){
						$('#message-'+ele).html('<div class="info">'+v+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
					}
					if(k=='success'){
						$('#message-'+ele).html('<div class="success">'+v+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
					}
				});
			});
		} else {
			$('#message-'+ele).html('<div class="warning">Empty response for request</div>').fadeIn(2000).delay(3500).fadeOut('slow');
		}
	}

	/* populate form helper */
	function _populate(obj){

		if (_size(obj) > 0){

			/* disable editing of SKU, UUIC & Serial if data exists for monitor record */
			_disable(obj);

			/* computer values */
			$('#chostname').val(obj.Computer);
			$('#csku').val(obj.SKU);
			$('#cuuic').val(obj.UUIC);
			$('#cserial').val(obj.Serial);
			$('#cmodel').val(obj.Model);
			$('#clocation').val(obj.Location);
			$('#ceowd').val(obj.EOWD);
			$('#copd').val(obj.OPD);
			$('#cnotes').val(obj.Notes);

			/* monitor values */
			if (_size(obj.Monitor) > 0){

				$('#monitor').val(obj.Monitor[0].Monitor);
				$('#mmodel').val(obj.Monitor[0].Model);
				$('#msku').val(obj.Monitor[0].SKU);
				$('#mserial').val(obj.Monitor[0].Serial);
				$('#meowd').val(obj.Monitor[0].EOWD);
				$('#mlocation').val(obj.Monitor[0].Location);
			} else {

				if (!obj.Monitor) {
					$('#monitor').val('');
					$('#mmodel').val('');
					$('#msku').val('');
					$('#mserial').val('');
					$('#meowd').val('');
					$('#mlocation').val('');
				} else {
					((!obj.MSKU)&&(!obj.MSerial)) ? _disable('m', false) : _disable('m', true);
					$('#monitor').val(obj.Monitor);
					$('#mmodel').val(obj.MModel);
					$('#msku').val(obj.MSKU);
					$('#mserial').val(obj.MSerial);
					$('#meowd').val(obj.MEOWD);
					$('#mlocation').val(obj.MLocation);
				}
			}
		}
	}

	function _disable(obj){
		(obj.SKU) ? $('#csku').textinput('disable') : $('#csku').textinput('enable');
		(obj.UUIC) ? $('#cuuic').textinput('disable') : $('#cuuic').textinput('enable');
		(obj.Serial) ? $('#cserial').textinput('disable') : $('#cserial').textinput('enable');
		(obj.EOWD) ? $('#ceowd').textinput('disable') : $('#ceowd').textinput('enable');
		(obj.OPD) ? $('#copd').textinput('disable') : $('#copd').textinput('enable');

		if (_size(obj.Monitor) > 0) {
			(obj.Monitor[0].SKU) ? $('#msku').textinput('disable') : $('#msku').textinput('enable');
			(obj.Monitor[0].Serial) ? $('#mserial').textinput('disable') : $('#mserial').textinput('enable');
			(obj.Monitor[0].EOWD) ? $('#meowd').textinput('disable') : $('#meowd').textinput('enable');
		}
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
