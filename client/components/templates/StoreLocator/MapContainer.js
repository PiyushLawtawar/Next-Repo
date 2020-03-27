import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

const mapStyles = {
  width: '60%',
  height: '90%'
};


const locations = [];
export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    myMarker: [],
    invoiceUsoCFDIList:[]
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    var search = document.querySelector('#input').value;
    var checkLocation = locations[0]
    for (var i = 0; i < checkLocation.length; i++) {
      if (checkLocation[i].city.toString().toLowerCase() === search.toString().toLowerCase()) {
        var changeMarkerState = [];
        changeMarkerState.push(checkLocation[i]);
        this.setState({
          myMarker: changeMarkerState
        });
      }
    }
  }
  render() {
    locations.push(this.props.storeData);
    return (
      <div>
        <form>
          <label>
            Name:
    <input type="text" id="input" name="name" />
          </label>
          <input type="button" value="Submit" onClick={this.handleSubmit} />
        </form>

        <Map google={this.props.google}
          style={{ width: '80%', height: '80%', position: 'relative' }}
          className={'map'}
          zoom={3}>
          {this.state.myMarker.map((marker, index) => (
            <Marker
              // onClick={this.onMarkerClick}
              key={marker.postalCode}
              name={marker.city}
              position={{ lat: marker.lpLatitude, lng: marker.lpLongitude }}
            />
          ))}
        </Map>

      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyBI6H6uOOcIJ4TxG9fGhAGqdTqWOSj1Ejo')
})(MapContainer)