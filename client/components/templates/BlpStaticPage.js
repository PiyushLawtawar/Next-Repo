/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Static Brand Landing Page(BLP) details, such as, 
 *                <Breadcrumb> - will render Breadcrumb content,
 *                <BlpMainContent> - will render Middle content of Static BLP page,
 * 
 * @exports  : Static Brnad Landing Page HTML Content. (Apart from Header & Footer)
 * @requires : module:React
 * @requires : module:lodash/map
 * @requires : module:organisms/OrganismBlpMainContent/OrganismBlpMainContent#BlpMainContent
 * @requires : module:molecules/Breadcrumb/Breadcrumb#Breadcrumb
 * Team : B&S Team
 * 
 */
import React from 'react';
import map from 'lodash/map';
import Breadcrumb from '../molecules/Breadcrumb/Breadcrumb';
import BlpMainContent from '../organisms/OrganismBlpMainContent/OrganismBlpMainContent';

/**
 * @class BlpStaticPage
 * @classdesc Main function which will get exported and will get imported in other JS
 */
export default class BlpStaticPage extends React.Component {
     constructor(props) {
        super(props);

        const blpBody = (props.blpStaticContent) || {};

        this.state = {
            blpBody: blpBody
        };

    }
    
    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {
        const blpMainData = this.state.blpBody.contentItem || {};

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

        return (
            <React.Fragment>
                <div>
                    <div className="container-fluid">
                    <div className="container p-0">

                        <div className="row d-none d-lg-block">
                            <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                        </div>
                        {this.props.chanelBrandHTML!=='NA'? <div dangerouslySetInnerHTML={{ __html: this.props.chanelBrandHTML }} />:''}
                        <div className="row mt-lg-4">
                        {/*{ "Aside section "}*/}
                        <BlpMainContent blpMainData={blpMainData} chanelBrandJSON={this.props.chanelBrandJSON}/>
                        </div>

                    </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}
