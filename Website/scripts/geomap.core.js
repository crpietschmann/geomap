// Copyright (c) 2011 Chris Pietschmann <http://pietschsoft.com>
//
// This file is part of Geomap <http://geomap.codeplex.com>
//
// Geomap is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation; either version 2.1 of the License, or
// (at your option) any later version.
//
// Geomap is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

/* Fix Older IE versions to style and expose
   the geomap elements to the HTML DOM
-------------------------------------------------------------- */
document.createElement('geomap');
document.createElement('pushpin');
document.createElement('polyline');
document.createElement('polygon');
document.createElement('location');
document.createElement('info');

/* jQuery Plugin for geomap
-------------------------------------------------------------- */
(function ($) {
    $.fn.geomap = function (opts) {
        if (opts && typeof (opts) === 'string') {
            var i = 1, args = [], map = geomap.Map(this[0]);
            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            if (map[opts]) {
                return map[opts].apply(map, args);
            }
        }
        return this.each(function () { geomap.initMap(this, opts); });
    };
})(jQuery);

(function(){
    function getProvider(elem, opts) {
        var provider = $(elem).attr("provider")
        if (provider === undefined) {
            provider = geomap.Providers.Default.provider;
        }
        provider = provider.toLowerCase();
        for(var n in geomap.Providers) {
            if (n.toLowerCase() === provider) {
                $(elem).attr('provider', provider);
                return geomap.Providers[n];
            }
        }
        $(elem).html("<strong>Error: geomap Provider (" + provider + ") Not Found</strong>");
        return null;
    }
    function parseLocationAttr(elem, attrName){
        if (elem.attr(attrName)){
            var locAttr = elem.attr(attrName).split(" ");
            return { latitude: locAttr[0], longitude: locAttr[1]};
        }
        return null;
    }
    function parseLocationElem(elem){
        if (elem.attr("latitude") && elem.attr("longitude")){
            return { latitude: elem.attr("latitude"), longitude: elem.attr("longitude")};
        }else{
            var locAttr = elem.html().split(" ");
            return { latitude: locAttr[0], longitude: locAttr[1]};
        }
    }

    if (!window.geomap) {
        window.geomap = {
            version: "0.2.0",
            parseLocation: function(e, attrName){
                var elem = $(e),
                    nodeName = (elem[0].nodeName || '').toLowerCase();
                if (!attrName){
                    if (nodeName === "location"){
                        return parseLocationElem(elem);
                    } else if (nodeName === "pushpin"){
                        return parseLocationAttr(elem, "location");
                    } else {
                        throw "geomap.parseLocation Error - Node (" + nodeName + ") not supported without 'attrName' parameter specified.";
                    }
                } else if (attrName){
                    return parseLocationAttr(elem, attrName);                    
                }
            },
            parseInfo: function(e){
                var elem = $(e);
                return { title: elem.attr('title'), content: elem.html() };
            }
        };
    }
    if (!window.geomap.initMap) {
        var initMap = window.geomap.initMap = function(elem, opts) {
            if (elem.jquery) {
                return initMap(elem[0], opts);
            }

            if (!elem.geomapProvider) {
                var prov = getProvider(elem, opts);
                if (prov != null) {
                    elem.geomapProvider = prov(elem, opts);
                }
            }
            return elem.geomapProvider;
        };
    }
    if (!window.geomap.Providers) {
        window.geomap.Providers = {
            Default: {
                provider: null
            }
        };
    }
})();