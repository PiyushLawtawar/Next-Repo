/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Category Landing Page details, such as, 
 *                <Breadcrumb> - will render Breadcrumb content,
 *                <Side> - will render Left Side Content,
 *                <MainContent> - will render Middle content of CLP page,
 *                <seoContent> will render SEO content of CLP page,
 *                <Carousel> - will render Carousel content.
 * 
 * @exports  : Category Landing Page HTML Content. (Apart from Header & Footer)
 * @requires : module:React
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/get
 * @requires : module:contexts/parentContext#parentContext
 * @requires : module:organisms/ClpAside#ClpAside
 * @requires : module:organisms/OrganismClpMainContent/OrganismClpMainContent#ClpMainContent
 * @requires : module:organisms/Carousel/Carousel#Carousel
 * @requires : module:molecules/Breadcrumb/Breadcrumb#Breadcrumb
 * @requires : module:atoms/HeadLines/Headlines#H2
 * @requires : module:atoms/Span/Span#Span
 * @requires : module:helpers/config/config#Path
 * @requires : module:helpers/utilities/utility#Utility
 * Team : B&S Team
 * 
 */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { parentContext } from '../../contexts/parentContext';
import ClpAside from '../organisms/ClpAside'
import ClpMainContent from '../organisms/OrganismClpMainContent/OrganismClpMainContent';
import Carousel from '../organisms/Carousel/Carousel';
import Breadcrumb from '../molecules/Breadcrumb/Breadcrumb';
import { H2 } from '../atoms/HeadLines/Headlines';
import Span from '../atoms/Span/Span';
import { Path } from '../../helpers/config/config';
import { Utility,GTMallPages } from '../../helpers/utilities/utility';

/**
 * @class ClpPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class ClpPage extends React.Component {
  constructor(props) {
    super(props);
    const clpBody = (props.clpContent) || {};
    this.state = {
      clpBody: clpBody,
      carouselsData: props.carouselsData
    };
  }
  
  /**
   * REACT life cycle Event. This will get fire when ever component Will Receive Props
   * @event componentWillReceiveProps
   * @param {*} nextProps 
   * 
   */

  componentWillReceiveProps(nextProps) {
    if(nextProps.carouselsData !== this.props.carouselsData) {
      this.setState({ carouselsData: nextProps.carouselsData });
      const enableGtmFlag =(this.props.clpContent && this.props.clpContent.flags )?  this.props.clpContent.flags['gtmflag']:true;
    // if(enableGtmFlag){
    //   Utility(Path.gtmServiceCall, 'POST',
    //   {
    //     "event": "impresionCampaign",
    //     "ecommerce": {
    //       "promoView": {
    //         "promotions": [{
    //           "id": this.state.clpBody && this.state.clpBody.contentItem && this.state.clpBody.contentItem.categoryId,
    //           "name": this.state.clpBody && this.state.clpBody.contentItem && this.state.clpBody.contentItem.categoryName,
    //           "creative": "blp_banner_prim",
    //           "position": "01"
    //         }]
    //       }
    //     }
    //   }
    //   ).then(response =>{            
    //       let payload = response.data;
    //       dataLayer.push(payload);
    //   })
    //   //this.seoMapClp();
    // }

    }
  }

  /*seoMapClp = () => {
    dataLayer.push({
      "event": "impresionCampaign",
      "ecommerce": {
        "promoView": {
          "promotions": [{
            "id": this.state.clpBody && this.state.clpBody.contentItem && this.state.clpBody.contentItem.categoryId,
            "name": this.state.clpBody && this.state.clpBody.contentItem && this.state.clpBody.contentItem.categoryName,
            "creative": "blp_banner_prim",
            "position": "01"
          }]
        }
      },
      "gtm.uniqueEventId": 5
    });
  }*/


  /**
   * default render method to render html in REACT
   * @returns REACT HTML
   */

  render() {
    const clpMainData = this.props.clpContent && this.props.clpContent.contentItem || {};
    const suggestionGRPDFLink= this.props.clpContent && this.props.clpContent.contentItem && this.props.clpContent.contentItem.suggestionLink || '';
    let accordionDatas = clpMainData && clpMainData.childCategories || [];
    const staticLabels = this.props.staticLabels || {};
    const categoryName = clpMainData && clpMainData.categoryName || '';
    const asideCategoryName = get(clpMainData, 'ancestors[0].categoryName', categoryName);
    const viewUrl = clpMainData && clpMainData.viewAllUrl || '';
    const categoryInfo = {
      categoryName: categoryName,
      viewUrl: viewUrl
    };

    const seoContent = clpMainData && clpMainData.acercaDesillasData || '';
     let breadcrumbInfo = {
      label: categoryName,
      breadcrumbData: {},
      isClp: true
    };

    breadcrumbInfo.breadcrumbData = get(clpMainData, 'ancestors', []);
    let l2CategoryName = get(breadcrumbInfo, 'breadcrumbData[1].viewAllUrl', '');
    let Datasurl = '';
    for (let key in accordionDatas) {
      Datasurl = accordionDatas[key] && accordionDatas[key].viewAllUrl;
      if(l2CategoryName !='')
      {
           if(l2CategoryName == Datasurl)
      {
          accordionDatas[key].isOpen = true
      } else accordionDatas[key].isOpen = false
    }else accordionDatas[key].isOpen = false
     
      
    }

   

    return (
      <React.Fragment>
        <parentContext.Consumer>
          {({ handleTypeheadHide, domainName }) => (
            <main>
              <div className="container-fluid o-main-container p-0" onClick={handleTypeheadHide}>
                <div className = "container o-container__secondary o-clp-secondaryContainer" >

                  <div className="row d-none d-lg-block m-row-bootstrap">
                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                  </div>

                  <div className="row mt-lg-3 m-row-bootstrap">
                    <aside className="col-lg-3 pr-4 m-aside__content">
                      <ClpAside accordionData={accordionDatas} parentCategoryName={asideCategoryName} categoryName={categoryName} />
                    </aside>
                    <ClpMainContent domainName={domainName} clpMainData={clpMainData} categoryInfo={categoryInfo}  suggestionGRPDFLink={suggestionGRPDFLink}/>
                  </div>

                  {
                    (!isEmpty(seoContent)) &&
                    <div className="row">
                      <section>
                        <div className="col-12 m-seoText d-none d-lg-block">
                          <div className="m-seoTitle-text">
                            <H2 className="m-seoTitle-text-p text-justify" haveChildren={true}>
                              <Span>{categoryName} </Span>{staticLabels['clp.seo.title.en'] || 'clp.seo.title.en'}<Span> {staticLabels['clp.seo.title.liverpool'] || 'clp.seo.title.liverpool'}</Span>
                            </H2>
                            <hr />
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: seoContent }} />
                        </div>
                      </section>
                    </div>
                  }
                </div>
              </div>

              <div className="container-fluid CarouselSection">
                <div className="container p-0">
                  <div className="row">
                    <div className="col-12">
                      <Carousel carouselsData={this.state.carouselsData}  sendCurrentL1Name={breadcrumbInfo.label} />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}
        </parentContext.Consumer>
      </React.Fragment>
    )
  }
}
