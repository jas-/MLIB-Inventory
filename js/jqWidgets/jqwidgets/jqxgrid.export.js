/*
jQWidgets v2.7.0 (2013-Feb-08)
Copyright (c) 2011-2013 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.extend(a.jqx._jqxGrid.prototype,{exportdata:function(i,p,o,h,j,l){if(!a.jqx.dataAdapter.ArrayExporter){throw"jqxdata.export.js is not loaded."}if(o==undefined){o=true}var v=this;if(h==undefined){var h=this.getrows();if(h.length==0){throw"No data to export."}}var t=j!=undefined?j:false;var s={};var g={};var m=[];var f=this.host.find(".jqx-grid-cell:first");var n=this.host.find(".jqx-grid-cell-alt:first");f.removeClass(this.toThemeProperty("jqx-grid-cell-selected"));f.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));n.removeClass(this.toThemeProperty("jqx-grid-cell-selected"));n.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));f.removeClass(this.toThemeProperty("jqx-grid-cell-hover"));f.removeClass(this.toThemeProperty("jqx-fill-state-hover"));n.removeClass(this.toThemeProperty("jqx-grid-cell-hover"));n.removeClass(this.toThemeProperty("jqx-fill-state-hover"));var d="cell";var c=1;var u="column";var b=1;var e=[];a.each(this.columns.records,function(y){var C=a(v.table[0].rows[0].cells[y]);if(v.table[0].rows.length>1){var z=a(v.table[0].rows[1].cells[y])}var B=function(D){D.removeClass(v.toThemeProperty("jqx-grid-cell-selected"));D.removeClass(v.toThemeProperty("jqx-fill-state-pressed"));D.removeClass(v.toThemeProperty("jqx-grid-cell-hover"));D.removeClass(v.toThemeProperty("jqx-fill-state-hover"))};B(C);if(z){B(z)}if(this.datafield==null){return true}if(v.showaggregates){if(v.getcolumnaggregateddata){e.push(v.getcolumnaggregateddata(this.datafield,this.aggregates,true,h))}}var A=v._getexportcolumntype(this);if(this.exportable&&(!this.hidden||t)){s[this.datafield]={};s[this.datafield].text=this.text;s[this.datafield].width=parseInt(this.width);if(isNaN(s[this.datafield].width)){s[this.datafield].width=60}s[this.datafield].formatString=this.cellsformat;s[this.datafield].localization=v.gridlocalization;s[this.datafield].type=A;s[this.datafield].cellsAlign=this.cellsalign;s[this.datafield].hidden=!o}d="cell"+c;var w=a(this.element);if(this.element==undefined){w=a(this.uielement)}u="column"+b;if(i=="html"||i=="xls"||i=="pdf"){var x=function(H,E,F,D,J,I,G){g[H]={};g[H]["font-size"]=E.css("font-size");g[H]["font-weight"]=E.css("font-weight");g[H]["font-style"]=E.css("font-style");g[H]["background-color"]=I._getexportcolor(E.css("background-color"));g[H]["color"]=I._getexportcolor(E.css("color"));g[H]["border-color"]=I._getexportcolor(E.css("border-top-color"));if(F){g[H]["text-align"]=J.align}else{g[H]["text-align"]=J.cellsalign;g[H]["formatString"]=J.cellsformat;g[H]["dataType"]=A}if(i=="html"||i=="pdf"){g[H]["border-top-width"]=E.css("border-top-width");g[H]["border-left-width"]=E.css("border-left-width");g[H]["border-right-width"]=E.css("border-right-width");g[H]["border-bottom-width"]=E.css("border-bottom-width");g[H]["border-top-style"]=E.css("border-top-style");g[H]["border-left-style"]=E.css("border-left-style");g[H]["border-right-style"]=E.css("border-right-style");g[H]["border-bottom-style"]=E.css("border-bottom-style");if(F){if(G==0){g[H]["border-left-width"]=E.css("border-right-width")}g[H]["border-top-width"]=E.css("border-right-width");g[H]["border-bottom-width"]=E.css("border-bottom-width")}else{if(G==0){g[H]["border-left-width"]=E.css("border-right-width")}}g[H]["height"]=E.css("height")}if(J.exportable&&(!J.hidden||t)){if(F){s[J.datafield].style=H}else{if(!D){s[J.datafield].cellStyle=H}else{s[J.datafield].cellAltStyle=H}}}};x(u,w,true,false,this,v,y);b++;x(d,C,false,false,this,v,y);if(v.altrows){d="cellalt"+c;x(d,z,false,true,this,v,y)}c++}});if(this.showaggregates){var r=[];var q=i=="xls"?"AG":"";if(e.length>0){a.each(this.columns.records,function(w){if(this.aggregates){for(var y=0;y<this.aggregates.length;y++){if(!r[y]){r[y]={}}if(r[y]){var z=v._getaggregatename(this.aggregates[y]);var A=v._getaggregatetype(this.aggregates[y]);var x=e[w];r[y][this.datafield]=q+z+": "+x[A]}}}});a.each(this.columns.records,function(w){for(var x=0;x<r.length;x++){if(r[x][this.datafield]==undefined){r[x][this.datafield]=q}}})}a.each(r,function(){h.push(this)})}var k=a.jqx.dataAdapter.ArrayExporter(h,s,g);if(p==undefined){this._renderrows(this.virtualsizeinfo);return k.exportTo(i)}else{k.exportToFile(i,p,l)}if(this.showaggregates){a.each(r,function(){h.pop(this)})}this._renderrows(this.virtualsizeinfo)},_getexportcolor:function(k){var f=k;if(k=="transparent"){f="#FFFFFF"}if(!f||!f.toString()){f="#FFFFFF"}if(f.toString().indexOf("rgb")!=-1){var i=f.split(",");var d=parseInt(i[0].substring(4));var h=parseInt(i[1]);var j=parseInt(i[2].substring(1,4));var l={r:d,g:h,b:j};var e=this._rgbToHex(l);return"#"+e}else{if(f.toString().indexOf("#")!=-1){if(f.toString().length==4){var c=f.toString().substring(1,4);f+=c}}}return f},_rgbToHex:function(b){return this._intToHex(b.r)+this._intToHex(b.g)+this._intToHex(b.b)},_intToHex:function(c){var b=(parseInt(c).toString(16));if(b.length==1){b=("0"+b)}return b.toUpperCase()},_getexportcolumntype:function(e){var f=this;var d="string";var c=f.source.datafields||((f.source._source)?f.source._source.datafields:null);if(c){var h="";a.each(c,function(){if(this.name==e.datafield){if(this.type){h=this.type}return false}});if(h){return h}}if(e!=null){if(this.dataview.cachedrecords==undefined){return d}var b=null;if(!this.virtualmode){if(this.dataview.cachedrecords.length==0){return d}b=this.dataview.cachedrecords[0][e.datafield];if(b!=null&&b.toString()==""){return"string"}}else{a.each(this.dataview.cachedrecords,function(){b=this[e.datafield];return false})}if(b!=null){if(e.cellsformat.indexOf("c")!=-1){return"number"}if(e.cellsformat.indexOf("n")!=-1){return"number"}if(e.cellsformat.indexOf("p")!=-1){return"number"}if(e.cellsformat.indexOf("d")!=-1){return"date"}if(e.cellsformat.indexOf("y")!=-1){return"date"}if(e.cellsformat.indexOf("M")!=-1){return"date"}if(e.cellsformat.indexOf("m")!=-1){return"date"}if(e.cellsformat.indexOf("t")!=-1){return"date"}if(typeof b=="boolean"){d="boolean"}else{if(a.jqx.dataFormat.isNumber(b)){d="number"}else{var g=new Date(b);if(g.toString()=="NaN"||g.toString()=="Invalid Date"){if(a.jqx.dataFormat){g=a.jqx.dataFormat.tryparsedate(b);if(g!=null){return"date"}else{d="string"}}else{d="string"}}else{d="date"}}}}}return d}})})(jQuery);