import React, { Component } from 'react';
import { stores } from './myLocations.js';
import config from './config.js';

// Load Google API in script tag
// and append
function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function() {
      resolve();
    });
    script.addEventListener('error', function(e) {
      reject(e);
    });
    document.body.appendChild(script);
  });
}

const script = 'https://maps.googleapis.com/maps/api/js?key=' + config.gKey;

class MyGoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeSelected: '',
      defaultZoom: 10,
      detailZoom: 15
    };
  }

  infoWindow() {
    return (
      <div className="gm-infowindow">
        <div className="gm-infowindow__content">
          <h3 className="gm-infowindow__location-name">{this.state.storeSelected.displayName}</h3>
          <div className="gm-infowindow__address">
            {this.state.storeSelected.address.line1},&nbsp;
            {this.state.storeSelected.address.line2 !== null ? `${this.state.storeSelected.address.line2}, ` : ''}
            {this.state.storeSelected.address.town !== null ? `${this.state.storeSelected.address.town}, ` : ''}
            {this.state.storeSelected.address.postalCode} <br />
            {this.state.storeSelected.address.country.name}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // Scope for further
    let that = this;

    // first load the script into html
    loadScript(script).then(() => {
      // Init the map
      var map = new window.google.maps.Map(this.refs.map, {
        zoom: that.state.defaultZoom,
        center: new window.google.maps.LatLng(-33.92, 151.25),
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      });

      // Define the the section of the map to show according
      // to all the pins on the map
      let storesBounds = [];
      stores.map((store, i) => {
        return storesBounds.push({ lat: store.geoPoint.latitude, lng: store.geoPoint.longitude });
      });
      let bounds = new window.google.maps.LatLngBounds();
      for (var j = 0; j < storesBounds.length; j++) {
        bounds.extend(storesBounds[j]);
      }
      map.fitBounds(bounds);

      // For each stores
      for (let i = 0; i < stores.length; i++) {
        // Position each markers from their lat/lng
        let marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(stores[i].geoPoint.latitude, stores[i].geoPoint.longitude),
          map: map
        });

        // On click of marker
        // - set the selected store (for store info box)
        // - tell the map the center pointer
        // - zoom to pointer
        window.google.maps.event.addListener(
          marker,
          'click',
          ((marker, i) => {
            return function() {
              that.setState({ storeSelected: stores[i] });
              map.panTo(this.getPosition());
              map.setZoom(that.state.detailZoom);
            };
          })(marker, i)
        );

        // On change of zoom, if the store details are showing, hide it
        map.addListener('zoom_changed', function() {
          let currentZoom = map.getZoom();
          if (that.state.storeSelected && currentZoom !== that.state.detailZoom) {
            that.setState({ storeSelected: '' });
          }
        });
      }
    });
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.state.storeSelected && this.infoWindow()}
        <div className="google-map" style={{ width: '100%', height: '100%' }} ref="map" />
      </div>
    );
  }
}

export default MyGoogleMap;
