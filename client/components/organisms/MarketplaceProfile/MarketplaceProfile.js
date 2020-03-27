import React from "react";
//import './MarketplaceProfile.styl'
import BackButton from "../../molecules/BackButton/BackButton";
import MarketplaceProfileHeader from "../../molecules/MarketplaceProfileHeader/MarketplaceProfileHeader";
import ProfileOpenions from "../../molecules/MarketplaceProfileOpenions/ProfileOpenions";
import { Utility } from "../../../helpers/utilities/utility";
import { Path } from "../../../helpers/config/config";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import Carousel from "../../organisms/Carousel/CarouselSeller";
import TechnicalSeo from '../technicalseo/TechnicalSeo';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const staticArray = props.mainContent && props.mainContent.staticLabels && props.mainContent.staticLabels.staticLabelValues? props.mainContent.staticLabels.staticLabelValues : [];
    let keys = {};
    staticArray.map((item)=>{
      if(item.pageName ==='sellerDetailPage'){
        keys = item.keyValues;
      }
    })
     
    this.state = {
      marketPlaceData: props.mainContent,
      evaluationsInfoList:
        props.mainContent.evaluationsInfoList &&
        props.mainContent.evaluationsInfoList.length > 0
          ? props.mainContent.evaluationsInfoList
          : null,
      alert_status: false,
      alert_message: "",
      pageSpecificStaticLabels:keys
    };
    this.showMoreOpinions = this.showMoreOpinions.bind(this);

    
  }

  getPageSpecificStaticLabels = async () => {
    /* const pageName ="?pageName=sellerDetailPage";
    Utility(Path.staticLabelsFetch+pageName, 'GET' ).then(response => {
       let pageSpecificStaticLabels = response.data;
        this.setState({
          pageSpecificStaticLabels
        });
    });*/
}
componentDidMount(){
  this.getPageSpecificStaticLabels();
}

componentDidUpdate(){
  if(isEmpty(this.state.pageSpecificStaticLabels)){
     this.getPageSpecificStaticLabels();
  }
}

  // componentDidMount() {
  //   Utility('/tienda/vendedor?isajax=true&sellerid=', + this.props.mainContent.sellerid, 'GET').then(response => {
  //     this.setState({
  //       marketPlaceData: response && response.data,
  //       evaluationsInfoList: response.data && response.data.evaluationsInfoList && response.data.evaluationsInfoList.length > 0 ? response.data.evaluationsInfoList : ''
  //     })
  //   });
  // }
  showMoreOpinions() {
    let { evaluationsInfoList } = this.state;
    !isEmpty(evaluationsInfoList)
      ? map(evaluationsInfoList, (items, index) => {
          return evaluationsInfoList.push(items);
        })
      : null;

    this.setState({
      evaluationsInfoList: evaluationsInfoList
    });
  }
  render() {
    const sellerId =
      (this.props.mainContent && this.props.mainContent.sellerid) || "";
    return (
      
      <main>
        <TechnicalSeo pageName="vendedor" contentItem={this.props.mainContent}  staticLabelValues ={this.props.mainContent.staticLabels} hostName ={this.props.hostName} relativePath={this.props.url}/>
        <div className="container-fluid d-none d-lg-block">
          <div className="container p-0">
            <div className="col-12 p-0 mt-3 mb-2">
              <BackButton pageSpecificStaticLabels={this.state.pageSpecificStaticLabels}/>
            </div>
          </div>
        </div>
        <section className="o-marketplace__profile pt-lg-3 pb-lg-3">
          <div className="container-fluid m-marketplace__profileHeader">
            <div className="row">
              <MarketplaceProfileHeader
                marketPlaceData={this.state.marketPlaceData}
                sellerId={sellerId}
                pageSpecificStaticLabels={this.state.pageSpecificStaticLabels}
              />
            </div>
          </div>
        </section>
        <section className="o-marketplace__profileOpinions pt-1 pb-4">
          <div className="container m-marketplace__opinions">
            <div className="row">
              <ProfileOpenions
                marketPlaceData={this.state.marketPlaceData}
                evaluationsInfoList={this.state.evaluationsInfoList}
                showMoreOpinions={this.showMoreOpinions}
                pageSpecificStaticLabels={this.state.pageSpecificStaticLabels}
              />
            </div>
          </div>
        </section>
        <section className="o-carousel-section">
          <div className="container-fluid o-carousel-container">
            <div className="container p-0">
              <div className="row">
                <div className="col-12">
                  <Carousel
                    carouselsData={this.props.mainContent.recommendation}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
