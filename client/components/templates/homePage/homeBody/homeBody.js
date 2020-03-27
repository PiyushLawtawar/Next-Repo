/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Home page body content.
 *                <HomeCarousel> - will render Home page Carousel content,
 *                <RecentlyViewedProductsCarousel> - will render Recently Viewed Products Carousel Content,
 * 
 * @exports  : Home Page Body.
 * @requires : module:React
 * @requires : module:next/router
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/map
 * 
 * @requires : module:contexts/parentContext#parentContext
 * @requires : module:homeCarousel#HomeCarousel
 * @requires : module:recentlyViewedProductsCarousel#RecentlyViewedProductsCarousel
 * Team : B&S Team
 * 
 */
import React from 'react';
import { parentContext } from '../../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import HomeCarousel from './homeCarousel';
import RecentlyViewedProductsCarousel from './recentlyViewedProductsCarousel'; 
import Router from 'next/router';

/**
 * @class HomeBody
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class HomeBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carouselAPI: [],
            carouselData: {},
            recentlyViewed:{}
        }
    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps 
     * @param {*} state 
     * 
     */
    componentWillReceiveProps(newProps, state) {
        if (this.props.getCarouselsData !== newProps.getCarouselsData) {
            this.setState({ carouselData: newProps.getCarouselsData })
        }
        if (this.props.recentlyViewed !== newProps.recentlyViewed) {
            this.setState({ recentlyViewed: newProps.recentlyViewed })
        }
    }

    /**
     * @function homePageContents
     * @desc this function is use to render Home page Carousel html.
     * @param {Object} homePageContent 
     * @returns HTML content.
     * 
     */
    homePageContents = (homePageContent) => {
        //Fix for 24435 Start
        let carouselKey = 0;
        //Fix for 24435 End
        return !isEmpty(homePageContent) && map(homePageContent, (items, index) => {
            if (items['@type'] === "ContentSlotMain") {
                return items.contents.map((item, key) => {
                    if (item['@type'] === "LPStaticPage") {
                        if(item.content && item.content.indexOf('Not found') !== 0 ){
                            return <div key={key} dangerouslySetInnerHTML={{ __html: item.content }} />;
                        }
                    }
                })
            }
            else if (items['@type'] === "LPContentSlotMain") {
                //Fix for 24435 Start
                carouselKey++;
                let clr = items.contentPaths && items.contentPaths[0];
                let cData='';
                //  if(index==2 || index==1){
                //     cData= this.state.carouselData.carouselContent && this.state.carouselData.carouselContent[0]
                //  }
                //  if(index==4 || index==3){
                //     cData= this.state.carouselData.carouselContent && this.state.carouselData.carouselContent[1]
                //  }
                //  if(index==6 || index==5){
                //     cData= this.state.carouselData.carouselContent && this.state.carouselData.carouselContent[2]
                //  }
                cData= this.state.carouselData.carouselContent && this.state.carouselData.carouselContent[carouselKey-1]
                //Fix for 24435 End
                 if(cData){
                     return (<HomeCarousel key={index} getCarouselsData={cData} />
                    );
                 }

            }
        });
    }

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {
        
        return (
            <parentContext.Consumer>
                {({ handleTypeheadHide,loginDetails }) => (
                        <main onClick={handleTypeheadHide}>
                            {
                                this.homePageContents(this.props.homePageContent)
                            }
                            <div style={{width:"0px"}}></div>
                            {
                                loginDetails.LoggedInSession && <RecentlyViewedProductsCarousel recentItems={true} getCarouselsData={this.state.recentlyViewed} />
                            }
                            {
                             loginDetails && !loginDetails.LoggedInSession && 
                                <div className="container mb-5">
                                    <div className="m-recentItems">
                                        <div className="row justify-content-center no-gutters p-3">
                                            <div className="col-12 text-center">
                                            <h5 className="a-recentItems__title">PRODUCTOS VISTOS RECIENTEMENTE</h5>
                                            <p className="m-0 a-recentItems__text pb-3 pt-3">Inicia sesión para ver recomendaciones personalizadas</p>
                                            </div>
                                            <div className="col-lg-3 col-10 text-center">
                                            <button className="a-btn a-btn--primary a-recentItems__session mb-3" ripple="ripple" onClick={() => { Router.push('/tienda/login') }}>Iniciar sesión</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                      
                </main>
                )
                }
            </parentContext.Consumer>
        )
    }
}

export default HomeBody;
