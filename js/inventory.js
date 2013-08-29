/* Inventory RestFul API FQDN */
var url = 'http://inventory.dev:8080';

/* API end points */
var api = {
	computers: {
		url:	url+'/computer',
	},
	monitors: {
		url:	url+'/monitor',
	},
	rmas: {
		url:	url+'/rma',
	},
	models: {
		url:	url+'/model',
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

/* Execute secStore.js */
function localData(key, data, cb)
{
	$(window).secStore({
		appID: key,
		aes: true,
		data: data,
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
		pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
		ready: function () {
			$('#'+element).jqxGrid('loadstate', $('#'+element).jqxGrid('getstate'));
		},
		selectionmode: 'singlecell',
		showfilterrow: true,
		source: adapter,
		sortable: true,
		updaterow: function (rowid, rowdata, commit) {
			/* update record */
			commit(true);
		},
		width: '100%'
	});
}

/* Extract model for drop down list */
function model_obj2arr(obj)
{
	var a = [];
	$.each(obj, function(k, v){
		a.push(v.model);
	});
	return a;
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
}

/* Validate hostname (RFC 1123) */
function valHostname(obj)
{
	return (/([a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?)*)([^a-z0-9-]|$)/i.test(obj)) ?
		true : { result: false, message: 'Hostname must conform to RFC-1123' };
}

/* Validate model */
function valModel(obj)
{
	return (/^[a-z0-9-]{0,128}$/i.test(obj)) ?
		true : { result: false, message: 'Model is invalid [a-z0-9-]{1,128}' }
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
	return (/^[a-z0-9-]{1,128}$/i.test(obj)) ?
		true : {result: false, message: 'UUIC is invalid [a-z0-9-]{1,128}' }
}

/* Validate Serial */
function valSerial(obj)
{
	return (/^[a-z0-9-]{1,128}$/i.test(obj)) ?
		true : {result: false, message: 'Serial is invalid [a-z0-9-]{1,128}' }
}

/* Validate Date */
function valDate(obj)
{
	/* attempt to correct date format */
	if (!/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/.test(obj)){
		var d = new Date()
		obj = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/');
	}

	return (/^[\d+]{1,2}\/[\d+]{1,2}\/[\d+]{4}$/.test(obj)) ?
		true : {result: false, message: 'Date is invalid [mm/dd/yyyy]' }
}

/* Validate General (paragraph) */
function valGeneral(obj)
{
	return (!/^[a-z0-9- .\n\r\t,;:]{1,128}$/i.test(obj)) ?
		true : {result: false, message: 'Field is invalid [a-z0-9- .\n\r,;:]{1,128}' }
}
