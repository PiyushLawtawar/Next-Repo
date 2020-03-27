/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Dymanic Brand Landing Page(BLP) details, such as, 
 *                <Breadcrumb> - will render Breadcrumb content,
 *                <Accordion> - will render Left Side Accordion Content,
 *                <BlpMainContent> - will render Middle content of Dymanic BLP page,
 * 
 * @exports  : Dymanic Brnad Landing Page HTML Content. (Apart from Header & Footer)
 * @requires : module:React
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/get
 * @requires : module:lodash/map
 * @requires : module:contexts/parentContext#parentContext
 * @requires : module:organisms/OrganismBlpMainContent/OrganismBlpMainContent#BlpMainContent
 * @requires : module:molecules/Accordion/Accordion#Accordion
 * @requires : module:molecules/Breadcrumb/Breadcrumb#Breadcrumb
 * @requires : module:helpers/config/config#Path
 * @requires : module:helpers/utilities/utility#Utility
 * Team : B&S Team
 * 
 */
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import { Utility,GTMallPages } from '../../helpers/utilities/utility';
import { Path } from '../../helpers/config/config';
import Breadcrumb from '../molecules/Breadcrumb/Breadcrumb';
import Accordion from '../molecules/Accordion/Accordion';
import BlpMainContent from '../organisms/OrganismBlpMainContent/OrganismBlpMainContent';
import { parentContext } from '../../contexts/parentContext';

/**
 * @class BlpPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class BlpPage extends React.Component {
    constructor(props) {
        super(props);

        const blpBody = (props.blpContent) || {};

        this.state = {
            blpBody: blpBody,
            carouselsData: props.carouselsData
        };
        this.executeCount =0;
    }

    /**
     * REACT life cycle event. It will be called once the component is actually mounted to the DOM.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {

        if (!(this.state.blpBody)) {

            Utility(Path.categoryBody, 'POST', {
                "channel": "WEB",
                "brandName": "LP"
            }).then(response => {

                const blpData = Object.assign({}, response.data);

                this.setState({
                    blpBody: blpData
                });
            });
        }

    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps 
     * 
     */
    componentWillReceiveProps(nextProps) {
        this.executeCount = this.executeCount +1;
        let SPACase = this.props.body && this.props.body.categoryId?true:false;
        const enableGtmFlag =(this.state.blpBody && this.state.blpBody.flags )?  this.state.blpBody.flags['gtmflag']:true;
        if(nextProps.blpContent !== this.props.blpContent) {
            this.setState({ blpBody: nextProps.blpContent });
        }
        if(nextProps.carouselsData !== this.props.carouselsData) {
            this.setState({ carouselsData: nextProps.carouselsData });
        }
        if(enableGtmFlag && ((SPACase && this.executeCount ==2) || (!SPACase && this.executeCount ==3)) ){
            //this.blpGMT();
            let categoryname = '';
            let categoryId = '';
            var contentItem = this.state.blpBody.contentItem;
            if(contentItem && contentItem.contents && contentItem.contents[0] && contentItem.contents[0].secondaryContent )  {
                contentItem.contents[0].secondaryContent.map((classType)=>{
                   if(classType['@type'] ==='Breadcrumbs' && classType.refinementCrumbs && classType.refinementCrumbs[0]
                   && classType.refinementCrumbs[0]['properties']){
                    categoryname =classType.refinementCrumbs[0]['properties']['category.displayName'];
                    categoryId =classType.refinementCrumbs[0]['properties']['category.repositoryId'];

                   }
                });
            }
            Utility(Path.gtmServiceCall, 'POST',
            {
                category: categoryname,
                dimension8: categoryId
            }).then(response =>{
                let payload = response.data;
                dataLayer.push(payload);
            })
    }
}

    /*blpGMT = () => {
        var blpData = this.state.blpBody;
        var setDimension = location.pathname.split('/');
        var dimensionIndex = setDimension.length - 2
        dataLayer.push({
            category: blpData && blpData.contentItem && blpData.contentItem.categoryName || '',
            dimension8: setDimension[dimensionIndex]
        })
    }*/

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {
        const blpBody = this.state.blpBody;
        let accordionDatas = blpBody && blpBody.contentItem && blpBody.contentItem.childCategories || [];
        const categoryName = blpBody && blpBody.contentItem && blpBody.contentItem.categoryName || '';
        const blpMainData = blpBody && blpBody.contentItem || {};
        const seoContent = blpBody && blpBody.contentItem && blpBody.contentItem.acercaDesillasData || '';
        const secondaryData = blpMainData && blpMainData.contents && blpMainData.contents[0] && blpMainData.contents[0]['secondaryContent'] || [];
        let breadcrumbInfo = {
            label: '',
            breadcrumbData: {}
        };
        map(secondaryData, (item, index) => {
            if (item.name && item.name === 'Breadcrumbs') {
                breadcrumbInfo.label = (item.refinementCrumbs && item.refinementCrumbs[0] && item.refinementCrumbs[0].label) || '';
                breadcrumbInfo.breadcrumbData = (item.refinementCrumbs && item.refinementCrumbs[0] && item.refinementCrumbs[0].ancestors && item.refinementCrumbs[0].ancestors.length > 0 && item.refinementCrumbs[0].ancestors) || [];
            }
        });
        let categoryNameForCarousal = breadcrumbInfo.label;
        const mainContentItems = get(blpMainData, 'contents[0].mainContent', {});
        let l2CategoryName = get(breadcrumbInfo, 'breadcrumbData[1].properties.viewAllUrl', '');
        
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
                    {({ handleTypeheadHide }) => (
                        <div>
                            <div className="container-fluid o-main-container p-0" onClick={handleTypeheadHide}>
                                <div className="container o-container__secondary">
                                    <div className="o-blp-banner row d-lg-none">
                                    <section className="px-0 justify-content-center mobile-banner mb-3">
                                    <h1 className="d-flex a-title-section-mobile justify-content-center text-center p-2 m-0">{breadcrumbInfo.label}</h1>
                                        {
                                            !isEmpty(mainContentItems) && map(mainContentItems, (items, index) => {
                                                {   if(items && items['@type'] === "LPBrandStaticPage") {
                                                        /*
                                                         commented as it is duplicate rendering the same content. BlpMainContent page is doing this job 
                                                        return <div key={index} className="m-banner-brand d-flex justify-content-center align-items-center my-0 my-lg-4 p-0 p-lg-2" dangerouslySetInnerHTML={{__html:items.content}}></div>
                                                        */
                                                    }
                                                }
                                            })
                                        }
                                    </section>
                                    </div>
                                    <div className="row d-none d-lg-block m-row-bootstrap">
                                        <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                    </div>
                                    {this.props.chanelBrandHTML !== 'NA' ? <div dangerouslySetInnerHTML={{ __html: this.props.chanelBrandHTML }} /> : ''}
                                    <div className="row m-row-bootstrap"></div>
                                    <div className="row mt-lg-3 m-row-bootstrap">
                                        <aside className="col-lg-3 pr-lg-4 m-aside__content">
                                            <div className="col-12 mr-lg-4 order-2 order-lg-1 mb-3 px-0 o-column__aside">
                                                <h1 className="a-title-section my-0 my-lg-4 d-none d-lg-block">{breadcrumbInfo.label}</h1>
                                                <Accordion accordionData={accordionDatas} />
                                            </div>
                                        </aside>
                                        <BlpMainContent blpMainData={blpMainData} carouselsData={this.state.carouselsData} pageType={this.props.pageType} chanelBrandJSON={this.props.chanelBrandJSON} categoryNameForCarousal={categoryNameForCarousal}/>
                                    </div>

                                    <div className="row">
                                        {
                                            (!isEmpty(seoContent)) &&
                                            <section>
                                                <div className="col-12 m-seoText d-none d-lg-block">
                                                    <div className="a-seoTitle-text">
                                                        <h2 className="a-seoTitle-text-p text-justify"><span>{categoryName} </span>EN<span> LIVERPOOL</span>
                                                        </h2>
                                                        <hr />
                                                    </div>
                                                    <div dangerouslySetInnerHTML={{ __html: seoContent }} />
                                                </div>
                                            </section>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </parentContext.Consumer>
            </React.Fragment>
        )
    }

}
