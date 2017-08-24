import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from 'lodash';

import gps from './gps';

const WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={4}
    defaultCenter={{ lat: -25.2744, lng: 133.7751 }}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (
      <Marker key={index}
        {...marker}
        onRightClick={() => props.onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));

let mapInstance = null;

class App extends Component {

  state = {
    rawCoords: '',
    markers: [{
      position: {
        lat: -25.2744,
        lng: 133.7751,
      }
    }],
    gaps: [],
  };

  _handleMapLoad(map) {
    mapInstance = map;
    if (map) {
      console.log('map instance', mapInstance.getZoom());
    }
  }

  _onChange = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      rawCoords: e.target.value || '',
    })
  }

  _onSubmit = (e) => {
    e.preventDefault();
    const coords = gps.extractCoords(this.state.rawCoords);
    const markers = gps.convertToMarkers(coords);
    const gaps = gps.calculateGaps(coords);
   
    this.setState({
      ...this.state,
      markers,
      gaps,
    });
    gps.fitBounds(mapInstance, coords);
    
  };

  render() {
    return (
      <div className="App">
        <ReactGridLayout className="layout react-grid-layout" cols={20} rowHeight={60} autoSize={true}>
          <div key={'header'} className="show-border" data-grid={{x: 0, y: 0, w: 20, h: 1, static: true}}>
            <h2>GPS Data Analyzer</h2>
          </div>
          <div key={'footer'}  data-grid={{x: 0, y: 7, w: 20, h: 0.5, static: true}}>
              @2017
          </div>
          <div key={'input'} className="show-border" data-grid={{x: 0, y: 1, w: 5, h: 5, static: true}}>
            <div style={{padding: '0.5em'}}>
              Coordinates (Format: lat,long in decimal form):
            </div>
            <div style={{padding: '0.5em'}}>
              <textarea style={{width: '95%', height: '220px'}} onChange={this._onChange}>
              </textarea>
            </div>
            <div>
              <button onClick={this._onSubmit}>Submit</button>
            </div>
          </div>

          <div key={'result'} style={{['overflow-y']: 'auto'}} className="show-border" data-grid={{x: 0, y: 6, w: 5, h: 5, static: true}}>
            <div>Total: {this.state.markers.length}</div>
            <div> Gaps </div>
            <div> --------------------</div>
            {this.state.gaps.map((gap, index) => (
              <div key={index}>{gap}</div>
            ))}
          </div>
          <div key={'map'} className="show-border" data-grid={{x: 5, y: 1, w: 15, h: 10, static: true}}>
            <GettingStartedGoogleMap
              containerElement={
                <div style={{ height: '100%' }} />
              }
              mapElement={
                <div style={{ height: '100%'}} />
              }
              onMapLoad={this._handleMapLoad}
              onMapClick={_.noop}
              markers={this.state.markers}
              onMarkerRightClick={_.noop}
            />
          </div>
        </ReactGridLayout>

      </div>
    );
  }
  
}

export default App;
