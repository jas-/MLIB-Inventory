/* Inventory RestFul API FQDN */
var url = 'http://inventory-server.dev:8081';

/* API end points */
var api = {
	computer: {
		url:	url+'/computer',
	},
	monitor: {
		url:	url+'/monitor',
	},
	rmas: {
		url:	url+'/rma',
	},
	model: {
		url:	url+'/model',
	},
	warranty: {
		url:	url+'/warranty',
	},
	cors: {
		url:		url+'/cors',
	}
}

/* API methods */
var	methods = {
	all:		'get',
	search:	'get',
	add:		'post',
	update:	'put',
	remove:	'delete'
};

/* Change default behavior of select lists for mobile devices */
$(document).on('mobileinit', function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;
});

/* Default date format for datepicker */
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	'overrideDateFormat': '%Y-%m-%d',
});

/* Execute secStore.js */
function localData(key, data, cb)
{
	/* Add some expiration for object */
	$(window).secStore({
		appID: key,
    aes: true,
		data: data,
    storage: 'session',
		callback: function(obj){
			(/function/.test(typeof(cb))) ? cb(obj) : false;
		}
	});
}

/* Execute comm.js */
function doRequest(id, url, method, data, cb)
{
	$(window).comm({
		appID:			(id)			? id			: 'MLIB-Inventory',
		url:				(url)			? url			: false,
		method:			(method)	? method	: false,
		data:				(data)		? data		: false,
		callback:		function(){
			(/function/.test(typeof(cb))) ? cb($(this)) : false;
		}
	});
}


function _pager(ele)
{
	if (_detect()){

		var element = $("<div style='margin-top: 5px; width: 100%; height: 100%;'></div>");
		var datainfo = $("#"+ele).jqxGrid('getdatainformation');
		var paginginfo = datainfo.paginginformation;

		var leftButton = $("<div style='padding: 1px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
		leftButton.find('div').addClass('icon-arrow-left');
		leftButton.width(36);
		leftButton.jqxButton();

		var rightButton = $("<div style='padding: 1px; margin: 0px 3px; float: left;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
		rightButton.find('div').addClass('icon-arrow-right');
		rightButton.width(36);
		rightButton.jqxButton();

		leftButton.appendTo(element);
		rightButton.appendTo(element);

		var label = $("<div style='font-size: 11px; margin: 2px 3px; font-weight: bold; float: left;'></div>");
		label.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
		label.appendTo(element);

		rightButton.click(function () {
		$("#"+element).jqxGrid('gotonextpage');
			var datainfo = $("#"+ele).jqxGrid('getdatainformation');
			var paginginfo = datainfo.paginginformation;
			label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
		});

		leftButton.click(function () {
			$("#"+element).jqxGrid('gotoprevpage');
			var datainfo = $("#"+ele).jqxGrid('getdatainformation');
			var paginginfo = datainfo.paginginformation;
			label.text(1 + paginginfo.pagenum * paginginfo.pagesize + "-" + Math.min(datainfo.rowscount, (paginginfo.pagenum + 1) * paginginfo.pagesize) + ' of ' + datainfo.rowscount);
		});

		return element;
	}
	return false;
}

/* create jqxGrid for specified data */
function doGrid(element, obj)
{
	var adapter = new $.jqx.dataAdapter(obj.source);

	$("#"+element).jqxGrid({
		altrows: true,
		autoheight: true,
		autosavestate: true,
		autoshowloadelement: true,
		autoloadstate: true,
		columns: obj.columns,
		editable: true,
		filterable: true,
		groupable: true,
		pageable: true,
		pagerrenderer: _pager(element),
		pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
		ready: function () {
			$('#'+element).jqxGrid('loadstate', $('#'+element).jqxGrid('getstate'));
		},
		selectionmode: 'singlecell',
		showfilterrow: true,
		source: adapter,
		sortable: true,
		width: '100%'
	});
}

/* Extract model for drop down list */
function model_obj2arr(obj)
{
	var a = [];
	$.each(obj, function(k, v){
		a.push(v.Model);
	});
	return a;
}

/* Extract hostname for autocomplete */
function hostname_obj2arr(obj)
{
	var a = [];
	$.each(obj, function(k, v){
		a.push(v.Hostname);
	});
	return a;
}

/* Object formatting prior to sync */
function format_obj(obj, field, value)
{
	var d = obj;
	d[field] = value;
	d.EOWD = (/object/.test(typeof(obj.EOWD))) ? obj.EOWD.iso() : '';
	d.OPD = (/object/.test(typeof(obj.OPD))) ? obj.OPD.iso() : '';
	return d;
}

/* Format object to serialized string */
function serialize(obj)
{
	if (size(obj) > 0){
		var x='';
		$.each(obj, function(a, b){
			if (typeof b === 'object'){
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

/* calculate size of object */
function size(obj)
{
	var n = 0;
	$.each(obj, function(k, v){
		if (obj.hasOwnProperty(k)) n++;
	});
	return n;
}

/* work horse */
function doIt(key, grid, url, method, source)
{
	localData(key, false, function(obj){
		if (!obj) {
			doRequest(grid, url, method, false, function(d){
				source.source.localdata = d;
				localData(key, d);
				doGrid(grid, source);
			});
		} else {
			source.source.localdata = obj;
			doGrid(grid, source);
		}
	});
}

/* Display first tab */
$(function(){
 $(".content").find("div:first").show();
});

/* On click hide & show */
function ShowHide(e)
{
  $(".content").hide();
  var id =$(e).attr("href");
  $(id).show();

	/* handle grid init on page load */
	var _m = id.match(/edit\-(.*)\-records/);

	if (_m){
		if (_m[1]){
			$('#jqxgrid-'+_m[1]).jqxGrid('render');
			$('#jqxgrid-'+_m[1]).jqxGrid('updatebounddata', 'cells');
		}
	}

	/* handle binding to form on page load */
	var _m = id.match(/add\-(.*)\-record|search\-(.*)\-records/);

	if (_m){

    /* AJAXify add record */
		if (_m[1]){
			$('form#'+_m[1]).attr('action', api[_m[1]].url);

      $('form#'+_m[1]).comm({
				appID: _m[1],
				callback: function(){
					message($(this), 'message-add-'+_m[1]);
				}
			});
		}

    /* AJAXify search record */
		if (_m[2]){
      $('form#'+_m[2]).attr('action', api[_m[2]].url);

			$('form#'+_m[2]).comm({
				appID: _m[2],
				callback: function(){
					message($(this), 'message-search-'+_m[2]);
				}
			});
		}
	}

	modelList();
}

/* Create select list */
function createList(obj)
{
	var options = '<option data-placeholder="true">Select model</option>';
	$.each(obj, function(k, v){
		options += '<option value="'+v.Model+'" data-eowd="'+v.EOWD+'" data-opd="'+v.OPD+'">'+v.Model+'</option>';
	});

	$('#model').selectmenu().empty().append(options).selectmenu('refresh');
	$('#model').on('change', function(){
		$('#eowd').val($("select option:selected").data('eowd'));
		$('#opd').val($("select option:selected").data('opd'));
	});

	return options;
}

/* Handle model list & create select list */
function modelList() {
	localData('models', false, function(obj){
		if (!obj) {
			doRequest('models', api.model.url, methods.all, false, function(result){
				localData('models', result);
				return createList(result);
			});
		}
		return createList(obj);
	});
}

/* Locate needle in haystack and update values */
function _update(needle, haystack) {
	var obj = {};
	for (var i = 0; i < haystack.length; i++) (function(val){
		if (val.Id === needle.Id) {
	    obj[i] = needle;
		} else {
			obj[i] = val;
		}
	})(haystack[i]);

	return obj;
}

/* Test for mobile device */
function _detect(){
	return /android|blackberry|symbian|iemobile|ipad|iphone/gi.test(navigator.userAgent);
}

/* Validate integer */
function valNumber(obj)
{
	return (/^(0-9){1,}$/i.test(obj)) ?
		true : { result: false, message: 'Field requires an integer [0-9]' };
}

/* Validate hostname (RFC 1123) */
function valHostname(obj)
{
  if (obj) {
  	return (/([a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?)*)([^a-z0-9-]|$)/i.test(obj)) ?
  		true : { result: false, message: 'Hostname must conform to RFC-1123' };
  }
  return true;
}

/* Validate model */
function valModel(obj)
{
  if (obj) {
  	return (/^[a-z0-9-]{0,128}$/i.test(obj)) ?
  		true : { result: false, message: 'Model is invalid [a-z0-9-]{1,128}' }
  }
  return true;
}

/* Validate SKU */
function valSKU(obj)
{
	return (/^[a-z0-9-]{1,128}$/i.test(obj)) ?
		true : {result: false, message: 'SKU is invalid [a-z0-9-]{1,128}' }
}

/* Validate UUIC */
function valUUIC(obj)
{
  if (obj) {
  	return (/^[a-z0-9-]{1,128}$/i.test(obj)) ?
  		true : {result: false, message: 'UUIC is invalid [a-z0-9-]{1,128}' }
  }
  return true;
}

/* Validate Serial */
function valSerial(obj)
{
	return (/^[a-z0-9-]{1,128}$/i.test(obj)) ?
		true : {result: false, message: 'Serial is invalid [a-z0-9-]{1,128}' }
}

/* Validate Boolean */
function valBoolean(obj)
{
	return (/^[0|1|true|false]$/i.test(obj)) ?
		true : {result: false, message: 'Boolean (true/false) value required' }
}

/* Validate Date */
function valDate(obj)
{
	/* attempt to correct date format */
	if (!/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/.test(obj)){
		var d = new Date()
		obj = [d.getFullYear(), d.getMonth(), d.getDate()].join('-');
	}

  if (obj) {
  	return (/^[\d+]{4}\-[\d+]{1,2}\-[\d+]{1,2}$/.test(obj)) ?
  		true : {result: false, message: 'Date is invalid [yyyy-mm-dd]' }
  }
  return true;
}

/* Validate General (paragraph) */
function valGeneral(obj)
{
  if (obj) {
  	return (!/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi.test(obj)) ?
  		true : {result: false, message: 'Field is invalid [a-z0-9- .\n\r,;:]{1,128}' }
  }
  return true;
}


/* handle server responses */
function message(obj, ele){
	if (obj!='') {
		var _d = '';

		if (obj[0]['details']){
			_d = _details(obj[0].details);
		}

		$.each(obj, function(key, value){
			$.each(value, function(k, v){
				if(k=='error'){
					$('#'+ele).html('<div class="error">'+v+_d+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
				}
				if(k=='warning'){
					$('#'+ele).html('<div class="warning">'+v+_d+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
				}
				if(k=='info'){
					$('#'+ele).html('<div class="info">'+v+_d+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
				}
				if(k=='success'){
					$('#'+ele).html('<div class="success">'+v+_d+'</div>').fadeIn(2000).delay(3500).fadeOut('slow');
				}
			});
		});
	} else {
		$('#'+ele).html('<div class="warning">Empty response for request</div>').fadeIn(2000).delay(3500).fadeOut('slow');
	}
}

/* Handle details of error */
function _details(obj){
  var resp = '<ul>';
  $.each(obj, function(k, v){
    resp += '<li>'+v+'</li>';
  });
  return resp+'</ul>';
}

/* Object inspection tool */
function inspect(obj){
	$.each(obj, function(x, y){
		if ((/object|array/.test(typeof(y))) && (size(y) > 0)){
			console.log('Inspecting '+y+' ('+typeof(y)+')');
			inspect(y);
		} else {
			console.log(x+' => '+y);
		}
	});
}
