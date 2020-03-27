import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Utility, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { GOOGLE_API_KEY } from '../../../../client/config/constants'

const mapStyles = {
  width: '60%',
  height: '90%'
};

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      myMarker: props.storeDetails || {},
      showCurrentLocation: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.storeDetails !== nextProps.storeDetails) {
      const storeDetails = !isEmpty(nextProps.storeDetails) ? nextProps.storeDetails : {};
      this.setState({ myMarker: storeDetails, showCurrentLocation: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.storeDetails !== this.props.storeDetails || nextProps.currentLat !== this.props.currentLat || nextProps.currentLong !== this.props.currentLong || nextState.showCurrentLocation !== this.state.showCurrentLocation) {
      return true;
    }
    return false
  }

  onMarkerClick = (props, marker, e) => {
    const { openModal } = this.props;
    const { showCurrentLocation } = this.state;
    if (!showCurrentLocation) {
      openModal('showDetailsPopup');
    }
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  handleButton = () => {
    this.setState({ showCurrentLocation: true });
  }

  displayMarkers = () => {
    let  AssetsPath = '';
	  if (typeof window !== 'undefined') {
		  AssetsPath = getAssetsPath(window,undefined);  
	  }
    console.log("assetpath path is ",AssetsPath,window)
    return this.props.mapStores.map((store, index) => {
      return <Marker key={index} id={index} position={{
       lat: store.lpLatitude,
       lng: store.lpLongitude
     }}
      icon={{url: AssetsPath + '/static/images/atomo-icono-location-tiendas.png'}}
       name={store.name}
     onClick={this.onMarkerClick} />
    })
  }

  render() {
    const { myMarker, showCurrentLocation } = this.state;
    const { currentLat, currentLong,mapStores } = this.props;
    const howmany = Object.keys(myMarker).length;    
    let lat = get(myMarker, 'storeDetails.GeoCoordinates[1].lpLatitude', '');
    let long = get(myMarker, 'storeDetails.GeoCoordinates[1].lpLongitude', '');
    let name = get(myMarker, 'storeDetails.StoreDetails[1].name', '');
    if (showCurrentLocation || howmany <=0) {
      lat = currentLat;
      long = currentLong;
      name = '';
    }
    console.log("mapStores - howmany --showCurrentLocation --store object --current latitude -- current longitude",mapStores,howmany,showCurrentLocation,myMarker,lat,long)
    let  AssetsPath = '';
	  if (typeof window !== 'undefined') {
		  AssetsPath = getAssetsPath(window,undefined);  
	  }
    return (
      <React.Fragment>
        {(howmany > 0 && !showCurrentLocation )   &&
        <Map google={this.props.google}
          style={{ width: '100%', height: '100%', position: 'relative' }}
          className={'map'}
          zoom={15}
          initialCenter={{
            lat: lat,
            lng: long
          }}
          center={{
            lat: lat,
            lng: long
          }}
        >
          {
            !isEmpty(lat) && !isEmpty(long) &&
            <Marker
              onClick={this.onMarkerClick}
              name={name}
              position={{ lat: lat, lng: long }}
              icon={{url: AssetsPath + '/static/images/atomo-icono-location-tiendas.png'}}
            />
          }
        </Map>
        }
        {(howmany <= 0  || showCurrentLocation) && 
            
            <Map google={this.props.google}
          style={{ width: '100%', height: '100%', position: 'relative' }}
          className={'map'}
          zoom={15}
          initialCenter={{
            lat: lat,
            lng: long
          }}
         
        >
          {
           this.displayMarkers()
          }
        </Map>
        }
        <div className="mapBtn-container" onClick={this.handleButton}>
          <div className="mapBtn" title="Click para buscar tiendas cercanas">Usar mi ubicación</div>
        </div>
      </React.Fragment>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(MapContainer)