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
(function ($g) {
    var g = $g.Providers.Google = function (elem, opts) {
        return new g.fn.init($(elem), opts);
    };
    g.Default = {};
    g.fn = g.prototype = {
        version: '0.2.0',
        init: function (elem, opts) {
            var that = this, map = null, i = null,
                center = geomap.parseLocation(elem, "center"),
                mapOptions = {
                    center: new google.maps.LatLng((center !== null ? center.latitude : 0), (center !== null ? center.longitude : 0)),
                    zoom: (elem.attr("zoom") !== undefined) ? parseFloat(elem.attr("zoom")) : 1,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                },
                shapes = [];

            /* Crate Pushpins, Polylines and Polygons */
            elem.find('pushpin').each(function () {
                var loc = geomap.parseLocation(this),
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(loc.latitude, loc.longitude),
                        icon: $(this).attr('icon')
                    });
                shapes.push(marker);
                if ($(this).find('info').length > 0) {
                    // <pushpin location="40 -96"><info title="Some Title">Some information for this <strong>Pushpin</strong>.</info></pushpin>
                    // TODO: Make this into an Extender or Adorner to the Google plugin
                    var info = geomap.parseInfo($(this).find('info')),
                        infoTitle = (info.title) ? "<h1>" + info.title + "</h1>" : "",
                        infoHtml = "<span class='geomap-info'>" + infoTitle + info.content + "</span>",
                        infoWindow = new google.maps.InfoWindow({
                            position: marker.getPosition(),
                            content: infoHtml
                        });
                    marker.setTitle(info.title);
                    var hideListenerHooked = false;
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open(marker.getMap(), marker);
                        if (!hideListenerHooked) {
                            google.maps.event.addListener(marker.getMap(), 'drag', function () {
                                infoWindow.close();
                            });
                            hideListenerHooked = true;
                        }
                    });
                }
            });
            elem.find('polyline').each(function () {
                var locs = [];
                $(this).find("location").each(function () {
                    var loc = geomap.parseLocation(this);
                    locs.push(
                        new google.maps.LatLng(loc.latitude, loc.longitude)
                    );
                });
                shapes.push(new google.maps.Polyline({ path: locs }));
            });
            elem.find('polygon').each(function () {
                var locs = [];
                $(this).find("location").each(function () {
                    var loc = geomap.parseLocation(this);
                    locs.push(
                        new google.maps.LatLng(loc.latitude, loc.longitude)
                    );
                });
                shapes.push(new google.maps.Polygon({ path: locs }));
            });

            /* Create Map */
            map = new google.maps.Map(elem[0], mapOptions);
            this.providerMap(map);

            /* Add Pushpins, Polylines and Polygons to Map */
            for (var i in shapes) {
                shapes[i].setMap(map);
            }
        },
        providerMap: function (v) {
            if (v) {
                this._providerMap = v;
                return this;
            }
            return this._providerMap;
        }
    };
    g.fn.init.prototype = g.fn;

    /* make this default provider, if default not yet set */
    if (!$g.Providers.Default.provider) {
        $g.Providers.Default.provider = 'google';
    }
})(window.geomap);