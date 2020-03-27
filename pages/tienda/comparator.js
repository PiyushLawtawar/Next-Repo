/**
 * Module Name : Comparator Module.
 * Functionality : This Component will get update Cart header details from parentContext and help for render ComparatorPage Component.
 * @exports  : Comparator Page
 * @requires : module:React
 * @requires : module:next/router#withRouter
 * @requires : module:client/components/templates/comparator/comparator#ComparatorPage
 * @requires : module:client/contexts/parentContext#parentContext
 * Team : B&S Team.
 * 
 */
import React from 'react';
import { withRouter } from 'next/router';
import ComparatorPage from '../../client/components/templates/comparator/comparator';
import { parentContext } from '../../client/contexts/parentContext';

const Page = (props) => {
    let data = {};
    if(props.initialPropsData && props.initialPropsData.data && Object.keys(props.initialPropsData.data).length>0){
        data = props.initialPropsData.data;
    }else if(props.router && props.router.query && props.router.query.data){
        data = props.router.query.data
    }
    return (
        <parentContext.Consumer>
            {
                ({ updateCartHeaderDetails }) => {
                    return <ComparatorPage headerContent={data.headerContent} {...props} updateCartHeaderDetails={updateCartHeaderDetails}/>
                }
            }
        </parentContext.Consumer>
    )
}

// Page.getInitialProps = async ({ req }) => {

//     const initialPropsData = {
//       data: {},
//     };

//     if(!req){
//         const headerFooter = await Utilities.getHeaderFooter(req);
//         const result = { hostname: req.info.hostname, footerContent: headerFooter.footer, headerContent: headerFooter.header };
//         initialPropsData.data = result;
//     }

//     return initialPropsData;

// }

export default withRouter(Page)