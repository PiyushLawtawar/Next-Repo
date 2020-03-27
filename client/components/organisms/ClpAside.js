import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
// import { Utility } from '../../../helpers/utilities/utility';
// import { Path } from '../../../helpers/config/config';

import Accordion from '../molecules/Accordion/Accordion';

import { H1 } from '../atoms/HeadLines/Headlines';

export default class ClpPage extends React.Component {
    constructor(props) {
        super(props);

        const accordionData = (props.accordionData) || {};
        // const categoryName = (props.parentCategoryName) || "";

        this.state = {
            accordionData: accordionData
            // categoryName: categoryName
        };

    }

    render() {

        const { parentCategoryName, accordionData, categoryName } = this.props;
        return (
            <React.Fragment>
                <div className="d-none d-lg-block o-nav-sideBar">
                    <div className="my-0 my-lg-4">
                        <H1 className="a-clp-categoryName" headLineText={parentCategoryName} />
                    </div>
                    <Accordion accordionData={accordionData} categoryName={categoryName} />
                </div>
            </React.Fragment>
        )
    }
}