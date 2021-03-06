﻿// Copyright (c) 2011 Chris Pietschmann <http://pietschsoft.com>
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
(function ($g) {
    var bing = $g.Providers.Bing = function (elem, opts) {
        return new bing.fn.init($(elem), opts);
    };
    bing.Default = {
        credentials: '',
        enableSearchLogo: null,
        enableClickableLogo: null,
        showMapTypeSelector: null
    };
    bing.fn = bing.prototype = {
        version: '0.2.0',
        init: function (elem, opts) {
            var that = this, mapOptions = {
                credentials: getCredentials(elem, opts),
                enableSearchLogo: getBoolAttrOption(elem, "enableSearchLogo"),
                enableClickableLogo: getBoolAttrOption(elem, "enableClickableLogo"),
                showMapTypeSelector: getBoolAttrOption(elem, "showMapTypeSelector")
            };
            if (elem.attr("zoom") !== undefined) {
                mapOptions.zoom = parseFloat(elem.attr("zoom"))
            }
            if (elem.attr("center") !== undefined) {
                var center = geomap.parseLocation(elem, "center");
                mapOptions.center = new Microsoft.Maps.Location(center.latitude, center.longitude);
            }

            this.providerMap(new Microsoft.Maps.Map(elem[0], mapOptions));

            elem.find('pushpin').each(function () {
                var loc = geomap.parseLocation(this),
                    pinLoc = new Microsoft.Maps.Location(loc.latitude, loc.longitude),
                    pinOpts = { icon: $(this).attr('icon') },
                    pin = new Microsoft.Maps.Pushpin(pinLoc, pinOpts);

                if ($(this).find('info').length > 0) {
                    // <pushpin location="40 -96"><info title="Some Title">Some information for this <strong>Pushpin</strong>.</info></pushpin>
                    // TODO: Make this into an Extender or Adorner to the Bing plugin
                    var info = geomap.parseInfo($(this).find('info')),
                        infobox = new Microsoft.Maps.Infobox(pinLoc, { title: info.title, description: info.content, visible: false });
                    Microsoft.Maps.Events.addHandler(pin, 'click', function () { infobox.setOptions({ visible: true }); });
                    Microsoft.Maps.Events.addHandler(that.providerMap(), 'viewchange', function () { infobox.setOptions({ visible: false }); });
                    that.providerMap().entities.push(infobox);
                }
                that.providerMap().entities.push(pin);
            });

            elem.find('polyline').each(function () {
                var locs = [];
                $(this).find("location").each(function () {
                    var loc = geomap.parseLocation(this);
                    locs.push(
                        new Microsoft.Maps.Location(loc.latitude, loc.longitude)
                    );
                });
                that.providerMap().entities.push(new Microsoft.Maps.Polyline(locs));
            });
            elem.find('polygon').each(function () {
                var locs = [];
                $(this).find("location").each(function () {
                    var loc = geomap.parseLocation(this);
                    locs.push(
                        new Microsoft.Maps.Location(loc.latitude, loc.longitude)
                    );
                });
                that.providerMap().entities.push(new Microsoft.Maps.Polygon(locs));
            });
        },
        providerMap: function (v) {
            if (v) {
                this._providerMap = v;
                return this;
            }
            return this._providerMap;
        }
    };
    bing.fn.init.prototype = bing.fn;

    /* make this default provider, if default not yet set */
    if (!$g.Providers.Default.provider) {
        $g.Providers.Default.provider = 'bing';
    }

    function getCredentials(elem, opts) {
        var cred = elem.attr("bing:credentials");
        if (cred !== null && cred !== undefined) {
            if (cred.length > 0) {
                return cred;
            }
        }
        return bing.Default.credentials;
    }

    function getBoolAttrOption(elem, attr) {
        var v = elem.attr("bing:" + attr);
        if (v !== null) {
            var vstr = (v || '').toString().toLowerCase();
            if (vstr === 'true') {
                return true;
            }
            else if (vstr === 'false') {
                return false;
            }
        }
        return bing.Default[attr];
    }
})(window.geomap);