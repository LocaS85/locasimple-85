
import React, { useEffect } from 'react';
import { FeatureProperties, MapFeature, LayerSource, LayerStyle } from '@/types/search';
import mapboxgl from 'mapbox-gl';

interface MapLayer {
  id: string;
  type: 'geojson' | 'vector' | 'raster';
  source: LayerSource;
  styling: LayerStyle;
  interactionConfig: {
    hoverable: boolean;
    clickable: boolean;
    tooltip?: (props: FeatureProperties) => React.ReactNode;
  };
}

interface LayerManagerProps {
  layers: MapLayer[];
  onFeatureSelect: (feature: MapFeature) => void;
  map: mapboxgl.Map | null;
}

const addLayerToMap = (map: mapboxgl.Map, layer: MapLayer) => {
  if (!map) return;
  
  // Add source if it doesn't exist
  if (!map.getSource(layer.id)) {
    if (layer.type === 'geojson' && layer.source.data) {
      map.addSource(layer.id, {
        type: 'geojson',
        data: layer.source.data as any,
        cluster: layer.source.cluster,
        clusterMaxZoom: 14,
        clusterRadius: layer.source.clusterRadius || 50
      });
    } else if (layer.type === 'vector' && layer.source.url) {
      map.addSource(layer.id, {
        type: 'vector',
        url: layer.source.url,
      });
    } else if (layer.type === 'raster' && layer.source.url) {
      map.addSource(layer.id, {
        type: 'raster',
        url: layer.source.url,
        tileSize: 256
      });
    }
  }

  // Add layers based on styling
  if (layer.styling.circles && !map.getLayer(`${layer.id}-circles`)) {
    map.addLayer({
      id: `${layer.id}-circles`,
      type: 'circle',
      source: layer.id,
      paint: layer.styling.circles,
    });
  }

  if (layer.styling.lines && !map.getLayer(`${layer.id}-lines`)) {
    map.addLayer({
      id: `${layer.id}-lines`,
      type: 'line',
      source: layer.id,
      paint: layer.styling.lines,
    });
  }

  if (layer.styling.fills && !map.getLayer(`${layer.id}-fills`)) {
    map.addLayer({
      id: `${layer.id}-fills`,
      type: 'fill',
      source: layer.id,
      paint: layer.styling.fills,
    });
  }
};

const setupLayerInteractions = (
  map: mapboxgl.Map, 
  layer: MapLayer, 
  onFeatureSelect: (feature: MapFeature) => void
) => {
  if (!map) return;
  
  const layerIds = [
    `${layer.id}-circles`,
    `${layer.id}-lines`,
    `${layer.id}-fills`,
  ].filter(id => map.getLayer(id));

  if (layer.interactionConfig.hoverable) {
    // Mouse enter - change cursor and highlight feature
    map.on('mouseenter', layerIds, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Mouse leave - restore cursor
    map.on('mouseleave', layerIds, () => {
      map.getCanvas().style.cursor = '';
    });
  }

  if (layer.interactionConfig.clickable) {
    // Click - handle feature selection
    layerIds.forEach(layerId => {
      map.on('click', layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0] as unknown as MapFeature;
          onFeatureSelect(feature);
        }
      });
    });
  }
};

export const LayerManager: React.FC<LayerManagerProps> = ({ 
  layers,
  onFeatureSelect,
  map
}) => {
  useEffect(() => {
    if (!map) return;

    // Add all layers
    layers.forEach(layer => {
      addLayerToMap(map, layer);
      setupLayerInteractions(map, layer, onFeatureSelect);
    });
    
    // Cleanup function
    return () => {
      if (map) {
        layers.forEach(layer => {
          const layerIds = [
            `${layer.id}-circles`,
            `${layer.id}-lines`,
            `${layer.id}-fills`,
          ];
          
          layerIds.forEach(id => {
            if (map.getLayer(id)) {
              map.removeLayer(id);
            }
          });
          
          if (map.getSource(layer.id)) {
            map.removeSource(layer.id);
          }
        });
      }
    };
  }, [layers, map, onFeatureSelect]);

  return null;
};

// Example layer configuration
export const COMMERCE_LAYER: MapLayer = {
  id: 'poi-commerces',
  type: 'geojson',
  source: {
    data: {
      type: 'FeatureCollection',
      features: []
    },
    cluster: true,
    clusterRadius: 50
  },
  styling: {
    circles: {
      'circle-color': ['get', 'color'],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 4, 22, 8],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff'
    }
  },
  interactionConfig: {
    hoverable: true,
    clickable: true,
    tooltip: (props) => (
      <div className="poi-tooltip">
        <h3>{props.name}</h3>
        <p>{props.category}</p>
        <p>Distance: {props.distance}m</p>
      </div>
    )
  }
};
