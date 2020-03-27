import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { H1 } from '../../atoms/HeadLines/Headlines';
import TriggerFilterBtn from '../../molecules/TriggerFilterBtn/TriggerFilterBtn';
import StorelocatorFilter from '../../molecules/Modals/StorelocatorFilter';
import StorelocatorFilterCategories from '../../molecules/Modals/StorelocatorFilterCategories';
import AsideStoreLocator from '../../organisms/Aside/AsideStoreLocator';
import MapContainer from '../../organisms/MapContainer/MapContainer';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import StorelocatorStoreInformation from '../../molecules/Modals/StorelocatorStoreInformation';
import isEmpty from 'lodash/isEmpty';
import { UserAgentDetails } from '../../../helpers/utilities/utility';
import StorelocatorStateList from '../../molecules/Modals/StorelocatorStateList';
import get from 'lodash/get';
import StoreLocatorDetails from '../StoreLocator/StoreLocatorDetails';

class StoreLocator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeType: [],
            storeData: props.storeData,
            storeDetails: {},
            scrollableData: props.storeData,
            showAllStoreFilterWap: false,
            searchTerm: '',
            showStoreTypeFilterWap: false,
            showDetailsPopup: false,
            showMap: '',
            isMobile: false,
            showStateListWap: false,
            currentLat: '',
            currentLong: '',
            configurationData: props.configurationData || {},
            showStoreFullDetail: false,
            stateList: props.stateList,
            stateShown: false,
            mapStores:[],
            radiusConsider:5 //5 kms
        };
       
    }
    componentDidMount() {
        const { storeData } = this.state; 
        const { isMobile } = UserAgentDetails(window);
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                const lat = coords.latitude;
                const long = coords.longitude;
                //const lat = 19.434773; //test data
                //const long = -99.182645; //test data
                 if (isEmpty(storeData)) {
                     Utility(Path.getAllStoreLocator + '?isAjax=true', 'GET').then(response => {
                            if (response && response.data) {
                                const result = response.data;
                                const stores = result && result.StoreDataContent && result.StoreDataContent.stores;
                                const stateList = result && result.stateList;
                                let mapStores = [];
                                if (!isEmpty(stores) && stores.length > 0) {
                                    let currentDist = -1;                                    
                                    for(var index in stores){                                        
                                        currentDist = this.distance(lat,long,stores[index]["lpLatitude"],stores[index]["lpLongitude"],"k");
                                        if(currentDist <= this.state.radiusConsider){
                                        mapStores.push(stores[index])
                                        console.log("distances---SPA--",currentDist,stores[index]["lpLatitude"],stores[index]["lpLongitude"]);
                                        }
                                        

                                    }
                                }
                                this.setState({ storeData: stores, scrollableData: stores, stateList,currentLat: lat.toString(), currentLong: long.toString(), showMap: 'allow', showStateListWap: false,isMobile: (isMobile ? 'Yes' : 'No') , mapStores });
                            }
                        });
                }else{
                    let mapStores = [];
                    if (!isEmpty(storeData) && storeData.length > 0) {
                        let currentDist = -1;
                        
                        for(var index in storeData){
                            currentDist = this.distance(lat,long,storeData[index]["lpLatitude"],storeData[index]["lpLongitude"],"k");
                        
                            if(currentDist <= this.state.radiusConsider){
                            mapStores.push(storeData[index])
                            console.log("distances---",currentDist,storeData[index]["lpLatitude"],storeData[index]["lpLongitude"]);
                            }
                            

                        }
                    }
                     this.setState({ currentLat: lat.toString(), currentLong: long.toString(), showMap: 'allow', showStateListWap: false,isMobile: (isMobile ? 'Yes' : 'No') , mapStores });
                }
                    
            }, (error) => {
                switch(error.code){
                    case 3:
                        console.error("GeoLocation navigator got time out and hence map is not showing....")
                      break;
                    case 2:
                        console.error("GeoLocation navigator cannot get device position and hence map is not showing....")
                      break;
                    case 1:
                       console.error("GeoLocation navigator didn't got permission from the user and hence map is not showing....")
                }
                this.setState({ showMap: 'denied', showStateListWap: true, stateShown: true, isMobile: (isMobile ? 'Yes' : 'No') })
            });
        }else{
                if (isEmpty(storeData)) {
                   this.getStoreLocatorData();
                } else {
                    const { isMobile } = UserAgentDetails(window);
                    if (!isEmpty(storeData) && storeData.length > 0) {
                        const storeId = storeData[0] && storeData[0]['storeId'] || '';
                        const data = { 'storeId': storeId };
                        this.getStoreDetails(data);
                    }
                    this.setState({ isMobile: (isMobile ? 'Yes' : 'No') });
                }

        }        
        
    }

    distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

    componentWillReceiveProps(nextProps) {
        if (nextProps.configurationData !== this.props.configurationData) {
            this.setState({ configurationData: nextProps.configurationData });
        }
    }

    getStoreLocatorData = () => {
        Utility(Path.getAllStoreLocator + '?isAjax=true', 'GET').then(response => {
            if (response && response.data) {
                const result = response.data;
                const stores = result && result.StoreDataContent && result.StoreDataContent.stores;
                const stateList = result && result.stateList;
                this.setState({ storeData: stores, scrollableData: stores, stateList });
                const { isMobile } = UserAgentDetails(window);
                this.setState({ isMobile: isMobile ? 'Yes' : 'No' });
                if (!isEmpty(stores) && stores.length > 0) {
                    const storeId = stores[0] && stores[0]['storeId'] || '';
                    const data = { 'storeId': storeId };
                    this.getStoreDetails(data);
                }
            }
        });
    }

    getAllStores = (data, searchBy = null) => {
        Utility(Path.getallstores, 'POST', data).then(response => {
            if (response && response.data) {
                const result = response.data.StoreDetails && response.data.StoreDetails.stores || [];
                this.setState({ storeData: result });
                if (searchBy === null) {
                    this.setState({ scrollableData: result });
                }
                if (!isEmpty(result) && result.length > 0) {
                    const storeId = result[0] && result[0]['storeId'] || '';
                    const data = { 'storeId': storeId };
                    this.getStoreDetails(data);
                } else {
                    this.setState({ storeDetails: {} });
                }
            }
        });
    }

    getStoreDetails = (data) => {
        Utility(Path.getstoredetails, 'POST', data).then(response => {
            if (response && response.data) {
                this.setState({ storeDetails: response.data });
            }
        });
    }

    getStoresByType = (data) => {
        Utility(Path.getstoresbytype, 'POST', data).then(response => {
            if (response && response.data) {
            }
        });
    }

    openModal = (dataType) => {
        const { changeBackIcon } = this.props;
        if (dataType === 'storeFullDetail') {
            changeBackIcon();
            this.setState({ showAllStoreFilterWap: false, showStoreTypeFilterWap: false, showStoreFullDetail: true, showMap: '', showDetailsPopup: false });
        } else if (dataType === 'storeDetails') {
            this.setState({ showAllStoreFilterWap: true, showStoreTypeFilterWap: false });
        } else if (dataType === 'showDetailsPopup') {
            this.setState({ showDetailsPopup: true });
        } else {
            this.setState({ showAllStoreFilterWap: false, showStoreTypeFilterWap: true });
        }
    }

    closeModal = (dataType) => {
        if(dataType === 'showStateList') {
            this.setState({ showAllStoreFilterWap: false, showStoreTypeFilterWap: false, showStoreFullDetail: false, showStateListWap: true });
        } else if (dataType === 'storeDetails') {
            this.setState({ showAllStoreFilterWap: false, showStoreTypeFilterWap: false, showStoreFullDetail: false });
        } else if (dataType === 'showDetailsPopup') {
            this.setState({ showDetailsPopup: false, showStoreFullDetail: false });
        } else if (dataType === 'stateList') {
            this.setState({ showStateListWap: false, showMap: 'allow', showAllStoreFilterWap: true, showStoreFullDetail: false });
        } else if (dataType === 'closeStateListWithoutMapData') {
            this.setState({ showStateListWap: false, showMap: 'allow', showStoreFullDetail: false });
        } else {
            this.setState({ showAllStoreFilterWap: true, showStoreTypeFilterWap: false, showStoreFullDetail: false });
        }
    }

    onChangeSearchbar = (e) => {
        const { value } = e.target;
        this.setState({ searchTerm: value });
    }

    getMap = () => {
        const { isMobile, storeData, storeDetails, showMap, showStateListWap, currentLat, currentLong,mapStores } = this.state;
        if (isMobile === 'Yes') {
            if (showMap === 'allow') {
                return <MapContainer currentLat={currentLat} currentLong={currentLong} getStoreDetails={this.getStoreDetails} storeData={storeData} storeDetails={storeDetails} openModal={this.openModal} mapStores={mapStores}/>
            }
        } else if (isMobile === 'No') {
            return <MapContainer currentLat={currentLat} currentLong={currentLong} getStoreDetails={this.getStoreDetails} storeData={storeData} storeDetails={storeDetails} openModal={this.openModal} mapStores={mapStores} />
        }
    }

    render() {
        const { configurationData, showStoreFullDetail, stateList } = this.state;
        const storeType = get(configurationData, 'configuration.liverpoolconfiguration.storetypes', []);
        const { storeData, storeDetails, scrollableData, showAllStoreFilterWap, searchTerm, showStoreTypeFilterWap, showDetailsPopup, showMap, isMobile, showStateListWap, stateShown } = this.state;
        let breadcrumbInfo = {
            label: 'Tiendas',
            breadcrumbData: {}
        };
        return (
            <div className="container-fluid">
                <div className="container p-0">
                    <div className="row d-none d-lg-block">
                        <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                    </div>
                    <div className="row mt-lg-3 mb-lg-5 mb-0">
                        <aside className="col-lg-4">
                            <AsideStoreLocator scrollableData={scrollableData} getAllStores={this.getAllStores} storeData={storeData} onChangeSearchbar={this.onChangeSearchbar} getStoresByType={this.getStoresByType} getStoreDetails={this.getStoreDetails} stateList={stateList} storeType={storeType} />
                        </aside>
                        <div className="col-lg-8 m-storeLocator-map px-0 px-lg-3">
                            {
                                showMap === 'allow' &&
                                <H1 haveChildren={true} headLineClass="m-storeLocator-title__mobile d-flex justify-content-between d-lg-none align-items-center" headLineText="Busca una tienda">
                                    <TriggerFilterBtn openModal={this.openModal} dataType="storeDetails" />
                                </H1>
                            }
                            {
                                this.getMap()
                            }
                            {
                                showAllStoreFilterWap &&
                                <StorelocatorFilter
                                    searchTerm={searchTerm}
                                    closeModal={this.closeModal}
                                    scrollableData={scrollableData}
                                    getAllStores={this.getAllStores}
                                    onChangeSearchbar={this.onChangeSearchbar}
                                    getStoreDetails={this.getStoreDetails}
                                    stateList={stateList}
                                    openModal={this.openModal}
                                    stateShown={stateShown}
                                />
                            }
                            {
                                showStoreTypeFilterWap &&
                                <StorelocatorFilterCategories
                                    storeType={storeType}
                                    openModal={this.openModal}
                                    closeModal={this.closeModal}
                                    getAllStores={this.getAllStores}
                                    storeDetails={storeDetails}
                                />
                            }
                            {
                                showDetailsPopup &&
                                <StorelocatorStoreInformation
                                    storeDetails={storeDetails}
                                    closeModal={this.closeModal}
                                    openModal={this.openModal}
                                    isMobile={isMobile}
                                />
                            }
                            {
                                showStateListWap && isMobile === 'Yes' &&
                                <StorelocatorStateList
                                    openModal={this.openModal}
                                    closeModal={this.closeModal}
                                    stateList={stateList}
                                    getAllStores={this.getAllStores}
                                />
                            }
                            {
                                showStoreFullDetail &&
                                <StoreLocatorDetails
                                    storeDetails={storeDetails}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default StoreLocator;
