/**
 * Description: jQuery plugin implementing offline functionality
 *
 * Fork me @ https://www.github.com/jas-/jquery.offline
 *
 * Methods (public):
 *  - init: Default method
 *
 * Author: Jason Gerfen <jason.gerfen@gmail.com>
 * License: GPL (see LICENSE)
 */

(function($){

	/**
	 * @function offline
	 * @abstract
	 * @param method string
	 * @param options object
	 */
	$.fn.offline = function(method) {

		/**
		 * @object defaults
		 * @abstract Default set of options for plug-in (Public elements)
		 *
		 * @param {String}    appID     - Unique identifier for referencing storage object
		 * @param {String}    url       - FQDN URL end point for saves
		 * @param {Object}    element   - Element to which this plug-in is bound
		 * @param {String}    storage   - Storage mechanism to use for keys
		 * @param {Boolean}   save      - Force save of returned _comm requests
		 * @param {Boolean}   debug     - Enable or disable debugging options
		 * @param {Function}  callback  - Function to call on success of any operation
		 */
		var defaults = {
			appID:			'jquery.offline',
			url:			'',
			element:		$(this),
			storage:		'',
			async:			false,
			debug:			false,
			data:           '',
			logID:			'',
			callback:       function(){},
			preCallback:    function(){}
		};

		/**
		 * @method methods
		 * @scope public
		 * @abstract Public methods
		 *  - init
		 */
		var methods = methods || {

			/**
			 * @function init
			 * @scope public
			 * @abstract
			 */
			init: function(o){

				/* Merge user supplied options with defaults */
				var opts = _setup.merge(o, defaults);

				/* Initialize setup */
				if (!_setup.init(opts)) {
					return false;
				}

				return true;
			}
		};

		/**
		 * @method _setup
		 * @scope private
		 * @abstract Initial setup routines
		 */
		var _setup = _setup || {

			/**
			 * @function merge
			 * @scope private
			 * @abstract Perform preliminary option/default object merge
			 *
			 * @param {Object} o Plug-in option object
			 * @param {Object} d Default plug-in option object
			 * @returns {Object}
			 */
			merge: function(o, d){
				d.logID = d.appID;
				d.key = _libs.uid();
				return $.extend({}, d, o);
			},

			/**
			 * @function init
			 * @scope private
			 * @abstract Primary initialization
			 *
			 * @param {Object} o Plug-in option object
			 * @returns {Boolean} true/false
			 */
			init: function(o){

				/* use or create log function(s) */
				_log.init();

				/* use supplied data & execute or bind and wait */
				console.log(o.data);
				o.data = (_libs.size(o.data) > 0) ? _setup.go(o, o.data) : _setup.bind(o, o.element);

				return true;
			},

			/**
			 * @function go
			 * @scope private
			 * @abstract Initializes request if data present
			 *
			 * @param {Object} o Plug-in option object
			 * @returns {Object}
			 */
			go: function(o){
				if (_comm.online()){
					_comm.decide(o, false, o.url);
				} else {
					return '{error:"Network connectivity not present"}';
				}
				return o.data;
			},

			/**
			 * @function bind
			 * @scope private
			 * @abstract Apply supplied 'data' DOM element processing or
			 *           object return
			 *
			 * @param {Object} o Plug-in option object
			 * @param {Object} d User supplied key/value pair object or DOM element
			 * @returns {Object}
			 */
			bind: function(o, d){
				var _d = false;
				if ((d).is('form')){
					(o.debug) ? _log.debug(o.logID, '_setup.get: Currently bound to form') : false;
					$(d).on('submit', function(e){
						e.preventDefault();
						_d = _libs.form(o, d);
						o.data = _d;
						o.url = o.element[0]['action'];
						_storage.save(o, _libs.guid(), _d);
						_setup.go(o);
					});
				} else {
					_d = (/object|array/.test(o.data)) ? _storage.save(o, _libs.guid(), o.data) : false;
					((o.debug) && (_d)) ? _log.debug(o.logID, '_setup.get: User supplied data specified') : false;
				}
				return _d;
			}
		};

		/**
		 * @method _storage
		 * @scope private
		 * @abstract Interface to handle storage options
		 */
		var _storage = _storage || {

			/**
			 * @function quota
			 * @scope private
			 * @abstract Tests specified storage option for current amount of space available.
			 *  - Cookies: 4K
			 *  - localStorage (default): 5MB
			 *  - sessionStorage: 5MB
			 *
			 * @param {String} i Current value of appID
			 * @param {String} t Type of storage specified
			 * @param {Boolean} d Debug enabled
			 *
			 * @returns {Boolean}
			 */
			quota: function(i, t, d) {
				if (t != 'remote') {
					var l = /local|session/.test(t) ? 1024 * 1025 * 5 : 1024 * 4;
					var _t = l - unescape(encodeURIComponent(JSON.stringify(t))).length;
					if (_t <= 0) {
						_log.error(i, 'Maximum quota ('+l+'k) for '+t+' has been met, cannot continue');
						return false;
					}
					(d) ? _log.debug(i, '_storage.quota: Maximum quota ('+l+'k) for '+t+' has not been met. Current total: '+_t+'k') : false;
				}
				return true;
			},

			/**
			 * @function save
			 * @scope private
			 * @abstract Interface for saving to available storage mechanisms
			 *
			 * @param {String} o Default options
			 * @param {String} k Storage key to use for indexing of newly saved string/object
			 * @param {String|Object} v Value of data to be saved (string or object)
			 *
			 * @returns {Boolean}
			 */
			save: function(o, k, v){
				var x = false;

				/* Ensure space is available */
				if (_storage.quota(o.appID, o.storage, o.debug)){

					/* Save to specified storage mechanism */
					switch(o.storage) {
						case 'cookie':
							x = this._cookie.save(o, k, _storage.toJSON(v));
							break;
						case 'session':
							x = this._session.save(o, k, _storage.toJSON(v));
							break;
						default:
							x = this._local.save(o, k, _storage.toJSON(v));
							break;
					}
				}
				return x;
			},

			/**
			 * @function retrieve
			 * @scope private
			 * @abstract Interface for retrieving from available storage mechanisms
			 *
			 * @param {Object} o Default options
			 * @param {String} k Storage key to use for indexing of newly saved string/object
			 *
			 * @returns {String|Object}
			 */
			retrieve: function(o, k){
				var x;

				/* Retrieve from specified storage mechanism */
				switch(o.storage) {
					case 'cookie':
						x = _storage.fromJSON(this._cookie.retrieve(o, k));
						break;
					case 'session':
						x = _storage.fromJSON(this._session.retrieve(o, k));
						break;
					default:
						x = _storage.fromJSON(this._local.retrieve(o, k));
						break;
				}

				return x;
			},

			/**
			 * @function toJSON
			 * @scope private
			 * @abstract Convert to JSON object
			 *
			 * @param {Object|Array|String} obj Object, Array or String to convert to JSON object
			 *
			 * @returns {Object}
			 */
			toJSON: function(obj){
				return (/object/.test(typeof(obj))) ? JSON.stringify(obj) : obj;
			},

			/**
			 * @function fromJSON
			 * @scope private
			 * @abstract Object to stringify from JSON object
			 *
			 * @param {Object} obj Object to convert from a JSON object
			 *
			 * @returns {String}
			 */
			fromJSON: function(obj){
				return (/string/.test(typeof(obj))) ? JSON.parse(obj) : obj;
			},

			/**
			 * @method _remote
			 * @scope private
			 * @abstract Method for handling setting & retrieving of remote objects
			 */
			_remote: {

				/**
				 * @function save
				 * @scope private
				 * @abstract Handle setting of remote objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k Key to use for remote
				 * @param {String|Object} v String or object to place in remote
				 *
				 * @returns {Boolean}
				 */
				save: function(o, k, v){
					(o.debug) ? _log.debug(o.logID, '_remote.save: '+k+' => '+v) : false;
					var _k = {}; _k[k] = v;
					return _comm.decide(o, _storage.toJSON(_k), 'save');
				},

				/**
				 * @function retrieve
				 * @scope private
				 * @abstract Handle retrieval of remote objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k remote key
				 */
				retrieve: function(o, k){
					(o.debug) ? _log.debug(o.logID, '_remote.retrieve: '+k) : false;
					return _comm.decide(o, _storage.toJSON({'id':k}), 'retrieve');
				}
			},

			/**
			 * @method _cookie
			 * @scope private
			 * @abstract Method for handling setting & retrieving of cookie objects
			 */
			_cookie: {

				/**
				 * @function save
				 * @scope private
				 * @abstract Handle setting of cookie objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k Key to use for cookies
				 * @param {String|Object} v String or object to place in cookie
				 *
				 * @returns {Boolean}
				 */
				save: function(o, k, v){
					var d = new Date();
					d.setTime(d.getTime()+(30*24*60*60*1000));
					document.cookie = k+'='+v+';expires='+d.toGMTString()+';path=/;domain='+this.domain();
					(o.debug) ? _log.debug(o.logID, '_cookies.save: '+k+' => '+v) : false;
					return true;
				},

				/**
				 * @function retrieve
				 * @scope private
				 * @abstract Handle retrieval of cookie objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k cookie key
				 *
				 * @returns {String|False}
				 */
				retrieve: function(o, k){
					var i,x,y,z=document.cookie.split(";");
					for (i = 0; i < z.length; i++){
						x = z[i].substr(0, z[i].indexOf('='));
						y = z[i].substr(z[i].indexOf('=') + 1);
						x = x.replace(/^\s+|\s+$/g, '');
						if (x == k){
							(o.debug) ? _log.debug(o.logID, '_cookies.retrieve: '+k+' => '+y) : false;
							return unescape(y);
						}
					}
					return false;
				},

				/**
				 * @function domain
				 * @scope private
				 * @abstract Provides current domain of client for cookie realm
				 *
				 * @returns {String}
				 */
				domain:	function(){
					return location.hostname;
				}
			},

			/**
			 * @method local
			 * @scope private
			 * @abstract Method for handling setting & retrieving of localStorage objects
			 */
			_local: {

				/**
				 * @function save
				 * @scope private
				 * @abstract Handle setting & retrieving of localStorage objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k Key to use for localStorage
				 * @param {String|Object} v String or object to place in localStorage
				 *
				 * @returns {Boolean}
				 */
				save: function(o, k, v){
					(o.debug) ? _log.debug(o.logID, '_local.save: '+k+' => '+v) : false;
					return (localStorage.setItem(k, v)) ? true : false;
				},

				/**
				 * @function retrieve
				 * @scope private
				 * @abstract Handle retrieval of localStorage objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k localStorage key
				 *
				 * @returns {Object|String|Boolean}
				 */
				retrieve: function(o, k){
					(o.debug) ? _log.debug(o.logID, '_local.retrieve: '+k) : false;
					return (localStorage.getItem(k)) ? true : false;
				}
			},

			/**
			 * @method session
			 * @scope private
			 * @abstract Method for handling setting & retrieving of sessionStorage objects
			 */
			_session: {

				/**
				 * @function save
				 * @scope private
				 * @abstract Save session storage objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k Key to use for sessionStorage
				 * @param {String|Object} v String or object to place in sessionStorage
				 *
				 * @returns {Boolean}
				 */
				save: function(o, k, v){
					(o.debug) ? _log.debug(o.logID, '_session.save: '+k+' => '+v) : false;
					return (localStorage.setItem(k, v)) ? true : false;
				},

				/**
				 * @function retrieve
				 * @scope private
				 * @abstract Retrieves sessionStorage objects
				 *
				 * @param {Object} o Application defaults
				 * @param {String} k sessionStorage key
				 *
				 * @returns {Object|String|Boolean}
				 */
				retrieve: function(o, k){
					(o.debug) ? _log.debug(o.logID, '_session.retrieve: '+k) : false;
					return (sessionStorage.getItem(k)) ? true : false;
				}
			}
		};

		/**
		 * @method _comm
		 * @scope private
		 * @abstract Communication methods
		 */
		var _comm = _comm || {

			/**
			 * @function online
			 * @scope private
			 * @abstract Detect current connection status
			 *
			 * @returns {Boolean}
			 */
			online: function(){
				return navigator.onLine;
			},

			/**
			 * @function retry
			 * @scope private
			 * @abstract Attempts to send any non-sent requests when online status is true
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 * @param {String} e The remote protocol to execute
			 *
			 * @returns {Boolean}
			 */
			retry: function(o, d){
				var _c = 10, _i = 0;
				var id = setInterval(function(o, d){
					if (_i >= _c) {
						var _ut = new Date();
						_storage._local.save(o,  parseInt(_ut.getTime() / 1000), d);
					}
					return (this.online) ? this.decide(o, d) : false;
				}, 3600);
				clearInterval(id);
				return true;
			},

			/**
			 * @function decide
			 * @scope private
			 * @abstract Determine mode of communication based on browser type and options
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 *
			 * @returns {Function}
			 */
			decide: function(o, d){
				d = (o.data) ? o.data : d;

				if ((/msie/i.test(navigator.userAgent)) && (/^(http|https):\/\//i.test(o.url))) {
					return (this.online) ? this.xdr(o, d) : this.retry(o, d);
				}

				if (/^(ws|wss):\/\//i.test(o.url)) {
					return (this.online) ? this.websocket(o, d) : this.retry(o, d);
				}

				if (/^(http|https):\/\//i.test(o.url)) {
					o.async = true;
				}

				return (this.online) ? this.ajax(o, d) : this.retry(o, d);
			},

			/**
			 * @function websocket
			 * @scope private
			 * @abstract Perform get/send of remote objects using websockets
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 *
			 * @returns {String|Object}
			 */
			websocket: function(o, d){
				var _r = false;
				try {
					var socket;
					var host = o.url;
					var socket = new WebSocket(host);

					(o.debug) ? _log.debug(o.logID, '_libs.websocket: Status: '+socket.readyState) : false;

					socket.onopen = function() {
						try {
							socket.send(d);
							(o.debug) ? _log.debug(o.logID, '_libs.websocket: Sent: '+d) : false;
						} catch(exception) {
							_log.error(o.logID, '_libs.websocket: Error => '+exception);
						}
					}

					socket.onmessage = function(msg) {
						(o.debug) ? _log.debug(o.logID, '_libs.websocket: Receieved: '+msg.data) : false;
						_r = msg.data;
					}

					socket.onclose = function() {
						(o.debug) ? _log.debug(o.logID, '_libs.websocket: Status: '+socket.readyState) : false;
					}
				} catch(exception) {
					_log.error(o.logID, '_libs.websocket: Error => '+exception);
				}
				socket.close();
				return _r;
			},

			/**
			 * @function xdr
			 * @scope private
			 * @abstract Perform get/send of remote objects using MS XDR
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 *
			 * @returns {String|Object}
			 */
			xdr: function(o, d){
				var _r = false;

				if (!window.XDomainRequest) {
					_log.error(o.logID, '_comm.xdr: Error => The XDR functionality for your browser was not found.');
					return false;
				}

				var xdr = new XDomainRequest();
				xdr.timeout = 100;
				xdr.open('post', o.url);

				xdr.onsuccess = function(response){
					(o.debug) ? _log.debug(o.logID, '_libs.xdr: '+xdr.responseText) : false;
					_r = xdr.responseText;
				};

				xdr.onerror = function(exception){
					_log.error(o.logID, '_libs.xdr: Error => '+exception);
				};
				xdr.send(d);
				return _r;
			},

			/**
			 * @function ajax
			 * @scope private
			 * @abstract Perform get/send of remote objects
			 *
			 * @param {Object} o Application defaults
			 * @param {Object} d JSON object of key/values to send to server
			 *
			 * @returns {String|Object}
			 */
			ajax: function(o, d){
				var _r = false, _h = false;

				jQuery.support.cors = true;
				$.ajax({
					global: false,
					url: o.url,
					type: 'post',
					data: d,
					dataType: 'json',
					contentType: 'application/json; charset=utf8',
					async: o.async,
					context: $(this),
					xhrFields: {
						withCredentials: true
					},

					beforeSend: function(xhr){
						_h = (_libs.serialize(d)) ? _libs.base64(o, _libs.md5(o, _libs.serialize(d))) : _libs.base64(o, _libs.md5(o, o.appID));

						(o.async) ? xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest') : false;
						(_libs.mobile) ? xhr.setRequestHeader('Cache-Control', 'no-cache') : false;

						xhr.setRequestHeader('X-Alt-Referer', o.appID);
						xhr.setRequestHeader('Content-MD5', _h);
						xhr.withCredentials = true;

						((o.preCallback)&&($.isFunction(o.preCallback))) ? o.preCallback($(this)) : false;

						(o.debug) ? _log.debug(o.logID, '_comm.ajax: Set request headers => {"X-Alt-Referer":"'+o.appID+'","Content-MD5":"'+_h+'"}') : false;
					},

					success: function(x, status, xhr){

						o.appID = (/^[a-f0-9]{8}\-([a-f0-9]{4}\-){3}[a-f0-9]{12}$/i.test(xhr.getResponseHeader('X-Alt-Referer'))) ? xhr.getResponseHeader('X-Alt-Referer') : o.appID;

						if (o.async && xhr.getResponseHeader('X-Cookie')){
							var _c = xhr.getResponseHeader('X-Cookie').split('=');
							_storage._cookie.save(o, _c[0], _c[1]);
						}

						(o.debug) ? _log.debug(o.logID, '_comm.ajax: '+status+' => '+xhr.statusText) : false;

						((o.callback)&&($.isFunction(o.callback))) ? o.callback.call(x) : false;

						_r = x;
					},

					complete: function(x, status){
						_storage.save(o, o.appID, x.responseText);
					},

					error: function(xhr, status, error){
						_log.error(o.appID, '_comm.ajax: '+status+' => '+error.message);
					}
				});
				return _r;
			}
		}

		/**
		 * @method _libs
		 * @scope private
		 * @abstract Miscellaneous helper libraries
		 */
		var _libs = _libs || {

			/**
			 * @function inspect
			 * @scope private
			 * @abstract Inspects objects & arrays recursively
			 *
			 * @param {Object} o Default options
			 * @param {Array|Object} obj An object or array to be inspected
			 */
			inspect: function(o, obj){
				$.each(obj, function(x, y){
					if ((/object|array/.test(typeof(y))) && (_libs.size(y) > 0)){
						(o.debug) ? _log.debug(o.logID, '_libs.inspect: Examining '+x+' ('+typeof(y)+')') : false;
						_libs.inspect(o, y);
					} else {
						(o.debug) ? _log.debug(o.logID, '_libs.inspect: '+x+' => '+y) : false;
					}
				});
			},

			/**
			 * @function size
			 * @scope private
			 * @abstract Perform calculation on objects
			 *
			 * @param {Object|Array} obj The object/array to calculate
			 *
			 * @returns {Integer}
			 */
			size: function(obj){
				var n = 0;
				if (/object/.test(typeof(obj))) {
					$.each(obj, function(k, v){
						if (obj.hasOwnProperty(k)) n++;
					});
				} else if (/array/.test(typeof(obj))) {
					n = obj.length;
				}
				return n;
			},

			/**
			 * @function form
			 * @scope private
			 * @abstract Creates key/value pair object from form element
			 *
			 * @param {Object} obj The form object to convert
			 *
			 * @returns {Object}
			 */
			form: function(o, obj){
				(o.debug) ? _log.debug(o.logID, '_libs.form: Retrieving form data') : false;
				var _obj = {};
				$.each(obj, function(k, v){
					$.each(v, function(kk, vv){
						if ((vv.name) && (vv.value)){
							/* symmetric or asymmetric encryption? */
							_obj[vv.name] = (/checkbox|radio/.test(vv.type)) ? _libs.selected(o, vv) : vv.value;
						}
					});
				});
				(o.debug) ? _libs.inspect(o, _obj) : false;
				return _storage.toJSON(_obj);
			},

			/**
			 * @function exists
			 * @scope private
			 * @abstract Search array for value
			 *
			 * @param {Object} obj The haystack
			 * @param {String} str The string
			 *
			 * @returns {Object}
			 */
			exists: function(o, s){
				(!Array.prototype.indexOf) ? function (o){
					var l = s.length + 1;
					while (l -= 1){
						if (s[l - 1] === o){
							return true;
						}
					}
					return false;
				} : function (o){
					return (s.indexOf(o) !== -1);
				}
			},

			/**
			 * @function mobile
			 * @scope private
			 * @abstract Tests browser agent for mobile devices
			 *
			 * @return {Boolean}
			 */
			mobile: function(){
				return /android|blackberry|symbian|iemobile|ipad|iphone/gi.test(navigator.userAgent);
			},

			/**
			 * @function selected
			 * @scope private
			 * @abstract Return array of checked checkboxes or selected radio elements
			 *
			 * @param {Object} obj The checkbox or radio button
			 *
			 * @return {Array}
			 */
			selected: function(o, obj){
				return $('#'+obj.name+':checked').map(function(){
					return this.value;
				}).get();
			},

			/**
			 * @function serialize
			 * @scope private
			 * @abstract Converts an object to a serialized string
			 *
			 * @param {Object} obj The object to convert
			 *
			 * @returns {String}
			 */
			serialize: function(obj){
				if (_libs.size(obj) > 0){
					var x='';
					$.each(obj, function(a, b){
						if (/object/.test(typeof(b))){
							_libs.serialize(b);
						} else {
							x+=a+'='+b+'&';
						}
					});
					x = x.substring(0, x.length - 1);
				} else {
					x = obj;
				}
				return x;
			},

			/**
			 * @function guid
			 * @scope private
			 * @abstract Creates a random GUID (RFC-4122) identifier
			 *
			 * @param {Object} o Global options
			 *
			 * @returns {String} GUID string
			 */
			guid: function(o){
				var chars = '0123456789abcdef'.split('');
				var uuid = [], rnd = Math.random, r;
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				for (var i = 0; i < 36; i++){
					if (!uuid[i]){
						r = 0 | rnd()*16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
					}
				}
				return uuid.join('');
			},

			/**
			 * @function utf8
			 * @scope private
			 * @abstract Perform UTF-8 conversions
			 * @author http://www.webtoolkit.info/javascript-base64.html
			 *
			 * @param {Object} o Default options
			 * @param {String} s String to convert to UTF-8
			 *
			 * @returns {String}
			 */
			utf8: function(o, s){
				s=s.replace(/\r\n/g,"\n");
				var r='';
				for (var n=0; n<s.length; n++){
					var c=s.charCodeAt(n);
					if (c<128){
						r += String.fromCharCode(c);
					}else if((c>127)&&(c<2048)){
						r += String.fromCharCode((c>>6)|192);
						r += String.fromCharCode((c&63)|128);
					}else {
						r += String.fromCharCode((c>>12)|224);
						r += String.fromCharCode(((c>>6)&63)|128);
						r += String.fromCharCode((c&63)|128);
					}
				}
				return r;
			},

			/**
			 * @function base64
			 * @scope private
			 * @abstract Performs base64 encoding
			 * @author http://www.webtoolkit.info/javascript-base64.html
			 *
			 * @param {String} s String to perform base64 encoding upon
			 *
			 * @returns {String}
			 */
			base64: function(o, s){
				var k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var c1, c2, c3, e1, e2, e3, e4;
				var i = 0; var r = '';
				v = _libs.utf8(o, s);
				while (i<v.length){
					c1 = v.charCodeAt(i++);
					c2 = v.charCodeAt(i++);
					c3 = v.charCodeAt(i++);
					e1 = c1>>2;
					e2 = ((c1&3)<<4)|(c2>>4);
					e3 = ((c2&15)<<2)|(c3>>6);
					e4 = c3&63;
					if (isNaN(c2)){
						e3 = e4 = 64;
					}else if (isNaN(c3)){
						e4 = 64;
					}
					r = r + k.charAt(e1) + k.charAt(e2) + k.charAt(e3) + k.charAt(e4);
				}
				return r;
			},

			/**
			 * @function md5
			 * @scope private
			 * @abstract Performs MD5 sum of supplied string
			 * @author http://www.webtoolkit.info/javascript-md5.html
			 *
			 * @param {String} s String to perform MD5 sum upon
			 *
			 * @returns {String}
			 */
			md5: function(o, s){

				/* Shift bits to left */
				function RotateLeft(lValue, iShiftBits){
					var r = (lValue<<iShiftBits)|(lValue>>>(32-iShiftBits))
					return r;
				}

				/* Add unsigned bits to lX & lY */
				function AddUnsigned(lX,lY){
					var lX4,lY4,lX8,lY8,lResult,r;
					lX8 = (lX&0x80000000);
					lY8 = (lY&0x80000000);
					lX4 = (lX&0x40000000);
					lY4 = (lY&0x40000000);
					lResult = (lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);
					if (lX4&lY4){
						r = (lResult ^ 0x80000000 ^ lX8 ^ lY8);
					}
					if (lX4|lY4){
						if (lResult&0x40000000){
							r = (lResult^0xC0000000^lX8^lY8);
						}else{
							r = (lResult^0x40000000^lX8^lY8);
						}
					}else{
						r = (lResult^lX8^lY8);
					}
					return r;
				}

				/* XOR helpers */
				function F(x,y,z){return (x&y)|((~x)&z);}
				function G(x,y,z){return (x&z)|(y&(~z));}
				function H(x,y,z){return (x^y^z);}
				function I(x,y,z){return (y^(x|(~z)));}

				/* byte shifting helpers */
				function FF(a,b,c,d,x,s,ac) {
					a=AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
					return AddUnsigned(RotateLeft(a, s), b);
				}

				function GG(a,b,c,d,x,s,ac) {
					a=AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
					return AddUnsigned(RotateLeft(a, s), b);
				}

				function HH(a,b,c,d,x,s,ac) {
					a=AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
					return AddUnsigned(RotateLeft(a, s), b);
				}

				function II(a,b,c,d,x,s,ac) {
					a=AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
					return AddUnsigned(RotateLeft(a, s), b);
				}

				/* create an array of bytes from array */
				function ConvertToWordArray(string) {
					var lWordCount;
					var lMessageLength = string.length;
					var lNumberOfWords_temp1=lMessageLength + 8;
					var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
					var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
					var lWordArray=Array(lNumberOfWords-1);
					var lBytePosition = 0;
					var lByteCount = 0;
					while ( lByteCount < lMessageLength ) {
						lWordCount = (lByteCount-(lByteCount % 4))/4;
						lBytePosition = (lByteCount % 4)*8;
						lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
						lByteCount++;
					}
					lWordCount = (lByteCount-(lByteCount % 4))/4;
					lBytePosition = (lByteCount % 4)*8;
					lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
					lWordArray[lNumberOfWords-2] = lMessageLength<<3;
					lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
					return lWordArray;
				}

				/* Convert to HEX */
				function WordToHex(lValue) {
					var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
					for (lCount = 0;lCount<=3;lCount++) {
						lByte = (lValue>>>(lCount*8)) & 255;
						WordToHexValue_temp = "0" + lByte.toString(16);
						WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
					}
					return WordToHexValue;
				}

				/* perform operations */
				var x=Array();
				var k,AA,BB,CC,DD,a,b,c,d;
				var S11=7, S12=12, S13=17, S14=22;
				var S21=5, S22=9 , S23=14, S24=20;
				var S31=4, S32=11, S33=16, S34=23;
				var S41=6, S42=10, S43=15, S44=21;
				string = _libs.utf8(o, s);
				x = ConvertToWordArray(string);
				a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
				for (k=0;k<x.length;k+=16){
					AA=a; BB=b; CC=c; DD=d;
					a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
					d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
					c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
					b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
					a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
					d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
					c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
					b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
					a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
					d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
					c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
					b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
					a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
					d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
					c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
					b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
					a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
					d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
					c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
					b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
					a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
					d=GG(d,a,b,c,x[k+10],S22,0x2441453);
					c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
					b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
					a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
					d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
					c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
					b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
					a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
					d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
					c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
					b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
					a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
					d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
					c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
					b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
					a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
					d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
					c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
					b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
					a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
					d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
					c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
					b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
					a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
					d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
					c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
					b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
					a=II(a,b,c,d,x[k+0], S41,0xF4292244);
					d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
					c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
					b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
					a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
					d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
					c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
					b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
					a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
					d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
					c=II(c,d,a,b,x[k+6], S43,0xA3014314);
					b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
					a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
					d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
					c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
					b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
					a=AddUnsigned(a,AA);
					b=AddUnsigned(b,BB);
					c=AddUnsigned(c,CC);
					d=AddUnsigned(d,DD);
				}
				var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
				return temp.toLowerCase();
			},

			uid: function(o){
				/* hmac + sha256 + pbkdf2 */
				return window.navigator.appName+
						window.navigator.appCodeName+
						window.navigator.product+
						window.navigator.productSub+
						window.navigator.appVersion+
						window.navigator.buildID+
						window.navigator.userAgent+
						window.navigator.language+
						window.navigator.platform+
						window.navigator.oscpu;
			}
		};

		/**
		 * @method _log
		 * @scope private
		 * @abstract Logging methods for
		 *  - debug
		 *  - info
		 *  - warn
		 *  - error
		 */
		var _log = _log || {

			/**
			 * @function init
			 * @scope private
			 * @abstract Create console object for those without dev tools
			 *
			 * @returns {Boolean} true
			 */
			init: function(){
				if (typeof(console) === 'undefined') {
					var console = {};
					console.log = console.error = console.info = console.debug = console.warn = function() {};
					return console;
				}
				return false;
			},

			/**
			 * @function debug
			 * @scope private
			 * @abstract Debugging _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 *
			 * @returns {Boolean} true
			 */
			debug: function(i, t){
				(typeof(console.debug) === 'function') ? console.debug('['+i+'] (DEBUG) '+t) : _log.spoof(i, 'DEBUG', t);
				return true;
			},

			/**
			 * @function info
			 * @scope private
			 * @abstract Information _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 *
			 * @returns {Boolean} true
			 */
			info: function(i, t){
				(typeof(console.info) === 'function') ? console.info('['+i+'] (INFO) '+t) : _log.spoof(i, 'INFO', t);
				return true;
			},

			/**
			 * @function warn
			 * @scope private
			 * @abstract Warning _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 *
			 * @returns {Boolean} true
			 */
			warn: function(i, t){
				(typeof(console.warn) === 'function') ? console.warn('['+i+'] (WARN) '+t) : _log.spoof(i, 'WARN', t);
				return true;
			},

			/**
			 * @function error
			 * @scope private
			 * @abstract Error _log function
			 *
			 * @param {String} i The application ID associated with implementation
			 * @param {String} t The message string to be rendered
			 *
			 * @returns {Boolean} true
			 */
			error: function(i, t){
				console = this.init();
				(typeof(console.error) === 'function') ? console.error('['+i+'] (ERROR) '+t) : _log.spoof(i, 'ERROR', t);
				return true;
			},

			/**
			 * @function spoof
			 * @scope private
			 * @abstract Spoof console.log in the event it does not exist
			 *
			 * @param {String} t The message string to be rendered
			 *
			 * @returns {Boolean} true
			 */
			spoof: function(i, l, t){
				window.log = function(i, l, t) {
					return this.log('['+i+'] ('+l+') '+t);
				}
			}
		};

		/* Robot, do work */
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ((typeof method==='object')||(!method)){
			return methods.init.apply(this, arguments);
		} else {
			_log.error('Method '+method+' does not exist');
		}
		return true;
	};
})(jQuery);