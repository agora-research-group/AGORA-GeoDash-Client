function getLayer(feature, map) {
	var this_ = feature, layer_, layersToLookFor = [];
	/**
	 * Populates array layersToLookFor with only layers that have features
	 */
	var check = function(layer) {
		var source = layer.getSource();
		if (source instanceof ol.source.Vector) {
			var features = source.getFeatures();
			if (features.length > 0) {
				layersToLookFor.push({
					layer : layer,
					features : features
				});
			}
		}
	};
	// loop through map layers
	map.getLayers().forEach(function(layer) {
		if (layer instanceof ol.layer.Group) {
			layer.getLayers().forEach(check);
		} else {
			check(layer);
		}
	});
	layersToLookFor.forEach(function(obj) {
		var found = obj.features.some(function(feature) {
			return this_ === feature;
		});
		if (found) {
			// this is the layer we want
			layer_ = obj.layer;
		}
	});
	return layer_.U.title;
};

function getFeatures(filter, featureType, source, geometryName, map) {
	var featureRequest = new ol.format.WFS().writeGetFeature({
		srsName : 'EPSG:3857',
		featureNS : 'http://www.agora.icmc.usp.br/agora',
		featurePrefix : 'agora',
		featureTypes : [ featureType ],
		outputFormat : 'application/json',
		geometryName : geometryName,
		filter : filter
	});

	fetch('http://www.agora.icmc.usp.br:8080/geoserver/agora/wfs', {
		method : 'POST',
		body : new XMLSerializer().serializeToString(featureRequest)
	}).then(function(response) {
		return response.json();
	}).then(function(json) {
		var features = new ol.format.GeoJSON().readFeatures(json);
		source.addFeatures(features);

		if (map != null) {
			var extent = ol.extent.createEmpty();
			ol.extent.extend(extent, source.getExtent());
			map.getView().fit(extent, map.getSize());
		}

	});
}
