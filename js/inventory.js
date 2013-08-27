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

/* Execute comm.js */
function doRequest(id, url, method, data, cb)
{
	$(window).comm({
		appID:			(id)			? id			: 'MLIB-Inventory',
		url:				(url)			? url			: false,
		method:			(method)	? method	: false,
		data:				(data)		? data		: false,
		callback:		function(){
			cb($(this));
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
		columns: obj.columns,
		editable: true,
		filterable: true,
		groupable: true,
		pageable: true,
		pagesizeoptions: ['5', '10', '20', '30', '40', '50'],
		renderstatusbar: function (statusbar) {
			statusbar.append(getBtns(element, statusbar));
		},
		selectionmode: 'singlecell',
		showfilterrow: true,
		showstatusbar: true,
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
		width: 65,
		height: 20
	});
	AddBtn.click(function(event) {
		/* launch model add record window */
	});

	EditBtn.jqxButton({
		width: 70,
		height: 20
	});
	EditBtn.click(function(event) {
		/* launch model edit record window */
	});

	DeleteBtn.jqxButton({
		width: 85,
		height: 20
	});
	DeleteBtn.click(function(event) {
		/* launch model delete record window */
	});

}

function genBtnContainer()
{
	return $("<div style='overflow: visible; position: relative; margin: 5px;'></div>");
}

/* Add button */
function genAddBtn()
{
	return $("<div style='float: left; margin-left: 5px;'>"+
						"<img style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
							"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
								"Add"+
							"</span>"+
						"</div>");
}

/* Edit button */
function genEditBtn()
{
	return $("<div style='float: left; margin-left: 5px;'>"+
						"<img style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
							"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
								"Edit"+
							"</span>"+
						"</div>");
}

/* Delete button */
function genDeleteBtn()
{
	return $("<div style='float: left; margin-left: 5px;'>"+
						"<img style='position: relative; margin-top: 2px;' src='../images/add.png'/>"+
							"<span style='margin-left: 4px; position: relative; top: -3px;'>"+
								"Delete"+
							"</span>"+
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
	return (/^[\d+]{1,2}\/[\d+]{1,2}\/[\d+]{4}$/.test(obj)) ?
		true : {result: false, message: 'Date is invalid [mm/dd/yyyy]' }
}
