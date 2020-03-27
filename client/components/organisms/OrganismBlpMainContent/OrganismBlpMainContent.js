import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

//import './OrganismBlpMainContent.styl';
import CarouselBlp from '../Carousel/CarouselBlp';

export default class OrganismBlpMainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainContent: props.blpMainData
        };

        this.onImgError = this.onImgError.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.blpMainData !== this.props.blpMainData) {
            this.setState({ mainContent: nextProps.blpMainData });
        } 
    }

   onImgError (e) {
       const errImgElement = e.target;
       OnImgError(errImgElement, Path.onImgError);
   }

    render() {


        const mainContentItems = this.state.mainContent.contents[0].mainContent;
        const carouselsData = this.props.carouselsData && this.props.carouselsData.carouselContent && this.props.carouselsData.carouselContent[0]?this.props.carouselsData.carouselContent[0]:null;

        const _onImgError = this.onImgError;
      // console.log("OrganismBlpMainContent this.props.chanelBrandJSON= "+JSON.stringify(this.props.chanelBrandJSON))
      // console.log("OrganismBlpMainContent carouselsData= "+JSON.stringify(carouselsData))
        return (

           <main className={this.props.pageType==="LPStaticBrandLandingPage"?"": "col-lg-9 m-column_mainContent"}>
            {
                !isEmpty(mainContentItems) && map(mainContentItems, (items, index) => {
                    {    if(items && items['@type'] === "MostVisitedSpotLight") {
                            return <CarouselBlp key={index} carouselsData={items} chanelBrandJSON={this.props.chanelBrandJSON}/>}
                        else if(items && items['@type'] === "LPBrandStaticPage") {
                            return   (
                                         <div key={index} className="o-blp-mainContent order-1 order-lg-2 px-0 px-lg-0 d-none d-lg-block">
                                            <div className="mb-4" dangerouslySetInnerHTML={{__html:items.content}}></div>
                                         </div>
                                    )
                        }else if(items && items.contents && items.contents.length > 0 && items['@type'] === "ContentSlotMain" && items.contents[0] && items.contents[0].content){
                            return   (
                                         <div key={index} className="o-blp-mainContent order-1 order-lg-2 px-0 px-lg-0 d-none d-lg-block">
                                        <div className="mb-4"  dangerouslySetInnerHTML={{__html:items.contents[0].content}}></div>
                                        </div>
                                    )
                        }else if(items.mainContent && items.mainContent.length > 0 && items['@type'] === "ContentSlotMain" && items.contents[0]){
                            
                               return <CarouselBlp key={index} carouselsData={items.contents[0] } chanelBrandJSON={this.props.chanelBrandJSON} categoryNameForCarousal={this.props.categoryNameForCarousal}/>
                        }else if(items.mainContent && items.mainContent.length > 0 && items['@type'] !== "ContentSlotMain" ){
                               return <CarouselBlp key={index} carouselsData={items.mainContent } chanelBrandJSON={this.props.chanelBrandJSON} categoryNameForCarousal={this.props.categoryNameForCarousal}/>
                        }
                    }

                })
            }

            {/* <CarouselBlp carouselsData={carouselsData } chanelBrandJSON={this.props.chanelBrandJSON}/> */}
            </main>
       )
    }
}




