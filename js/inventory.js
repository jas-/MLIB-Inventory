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
function localData(key, data, cb) {
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
/*
		renderstatusbar: function (statusbar) {
			statusbar.append(getBtns(element, statusbar));
		},
*/
		selectionmode: 'singlecell',
		showfilterrow: true,
		showstatusbar: true,
		showtoolbar: true,
		source: adapter,
		sortable: true,
		updaterow: function (rowid, rowdata, commit) {
			/* update record */
			commit(true);
		},
		width: '100%'
	});
}

$(function()
{
 $(".content").find("div:first").show();
});

function ShowHide(e)
{
  $(".content").hide();
  var id =$(e).attr("href");
  $(id).show();
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

function doIt(key, grid, url, method, source) {
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

function getBtns(element, obj)
{
	var AddBtn = genAddBtn();
	var EditBtn = genEditBtn();
	var DeleteBtn = genDeleteBtn();

	var container = genBtnContainer();

	container.append(AddBtn);
	container.append(EditBtn);
	container.append(DeleteBtn);

	btnEvents(element, AddBtn, EditBtn, DeleteBtn);

	return container;
}

function btnEvents(element, AddBtn, EditBtn, DeleteBtn)
{
	AddBtn.jqxButton({
		width: 70,
		height: 20
	}).click(function(event) {
		launchModel($('#config').data('config'));
	});

	EditBtn.jqxButton({
		width: 70,
		height: 20
	}).click(function(event) {
		launchModel($('#config').data('config'));
	});

	DeleteBtn.jqxButton({
		width: 70,
		height: 20
	}).click(function(event) {
		launchModel($('#config').data('config'));
	});
}

function launchModel(config)
{
	$('#'+config.page).simpledialog2({
		headerText: 'wtf',
		dialogAllow: true,
		dialogForce: true,
		safeNuke: true,
		blankContentAdopt: true,
		callbackOpen: function(){
			alert(2);
		}
	});
}

function genBtnContainer()
{
	return $("<div style='overflow: visible; position: relative; margin: 5px;'></div>");
}

/* Add button */
function genAddBtn()
{
	return $("<div id='add-btn' style='float: left; margin-left: 5px'>"+
							"<img id='add' style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
							"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
								"Add"+
							"</span>"+
						"</div>");
}

/* Edit button */
function genEditBtn()
{
	return $("<div style='float: left; margin-left: 5px; data-rel='popup' data-position-to='window' data-role='button' data-inline='true'>"+
							"<a data-role='button' data-rel='popup'>"+
								"<img style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
								"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
									"Edit"+
								"</span>"+
							"</a>"+
						"</div>");
}

/* Delete button */
function genDeleteBtn()
{
	return $("<div style='float: left; margin-left: 5px; data-rel='popup' data-position-to='window' data-role='button' data-inline='true'>"+
							"<a data-role='button' data-rel='popup'>"+
								"<img style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
								"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
									"Delete"+
								"</span>"+
							"</a>"+
						"</div>");
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
