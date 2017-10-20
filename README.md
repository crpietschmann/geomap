# &lt;geomap/> - Mapping UI Extensions to HTML5 / HTML

An extension to HTML that adds support for declaratively adding maps to web applications. Initially there will only be support for Bing Maps, but a plugin API could be added to support additional providers.

**FYI, this project was migrated here from Codeplex before it shutdown.**

This project is currently in a prototype state. You can download the code and use it, but the API's may change quite a bit before any actual release would be put out.

## Scripts and Styles

    <script src="http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.4.4.min.js"></script>

    <!-- geomap core scripts-->
    <script src="scripts/geomap.core.js"></script>
                
    <!-- geomap Bing Maps Ajax v7 Support -->
    <script src="scripts/geomap.provider.bing.js"></script>
    <script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
                
    <!-- geomap Google Maps v3 Support -->
    <script src="scripts/geomap.provider.google.js"></script>
    <script src="http://maps.google.com/maps/api/js?sensor=false"></script>

    <!-- geomap default styles -->
    <link href="styles/geomap.css" rel="stylesheet" type="text/css" />

## Map with Pushpin, Polyline and Polygon

    <geomap>
        <pushpin location="40 -96"></pushpin>
        <polyline>
            <location latitude="40" longitude="-96"></location>
            <location latitude="-40" longitude="-96"></location>
        </polyline>
        <polygon>
            <location latitude="40" longitude="-76"></location>
            <location latitude="-40" longitude="-76"></location>
            <location latitude="0" longitude="0"></location>
            <location latitude="40" longitude="-76"></location>
        </polygon>
        Map not loaded. You may need to enable JavaScript within this browser.
    </geomap>
    <script>
        $('geomap').geomap();
    </script>

## Default Map

    <geomap></geomap>
    <script>
        $('geomap').geomap();
    </script>

## Bing Maps Ajax v7

    <geomap provider="bing"></geomap>
    <script>
        $('geomap').geomap();
    </script>

## Google Maps v3

    <geomap provider="google"></geomap>
    <script>
        $('geomap').geomap();
    </script>

## Bing Maps with Credentials

    <geomap provider="bing"
        bing:credentials="You Bing Maps Key">
    </geomap>
    <script>
        $('geomap').geomap();
    </script>

