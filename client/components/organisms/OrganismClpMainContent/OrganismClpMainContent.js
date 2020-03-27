import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';

import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from       '../../../helpers/config/config';


//import './OrganismClpMainContent.styl';

import CardsTitle from '../../molecules/CardsTitle/CardsTitle';
import ClpHeading from '../ClpHeading'
import CardRow from '../CardRow/CardRow';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span'

export default class OrganismClpMainContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /* mainContent: props.clpMainData,
            categoryInfo: props.categoryInfo */
        };

        this.onImgError = this.onImgError.bind(this);
    }
      redirect=(url)=>{
        var win = window.open(url, '_blank');
      win.focus();
    }
   
   onImgError (e) {
       const errImgElement = e.target;
       OnImgError(errImgElement, Path.onImgError);
   }

    render() {
        const { domainName } = this.props;        
        /* const isHaveSubChild = (this.state.mainContent.children && this.state.mainContent.children[0].children)? true : false;
        const mainContentItems = this.state.mainContent.children; */
        let isHaveSubChild =false;
        if(this.props.clpMainData && this.props.clpMainData.children && typeof this.props.clpMainData.children !=='undefined' &&
        this.props.clpMainData.children[0] && typeof this.props.clpMainData.children[0] !=='undefined' && 
        this.props.clpMainData.children[0].children && typeof this.props.clpMainData.children[0].children !=='undefined'){
            isHaveSubChild=true;
        }
        //const isHaveSubChild = isEmpty(get(this.props, 'clpMainData.children[0].children', '')) ? true : false;
        const mainContentItems = this.props.clpMainData.children;

        const _onImgError = this.onImgError;

        return (
            <div className="col-lg-9 m-column_mainContent">
                 
                 {(this.props.suggestionGRPDFLink && typeof this.props.suggestionGRPDFLink ==='string' && this.props.suggestionGRPDFLink.toString().trim().length > 0) &&
                <div className="col-12 text-right d-none d-lg-block">
                    <Link  className="a-checkout__btnOptions icon-download pr-3" onClick={() => {this.redirect(this.props.suggestionGRPDFLink)}}>
                        <Span className="a-checkout__labelOptions"> Descargar lista de sugerencias </Span>
                    </Link>
                 </div> }

                {
                    isHaveSubChild && !isEmpty(mainContentItems) && map(mainContentItems, (items, index) => {
                        
                        let catInfo = {
                            categoryName: items.categoryName,
                            viewUrl: items.viewAllUrl
                        };

                        return  <React.Fragment key={index}>
                        <div className="o-clp-mainContent">
                                    <div key="0-d-lg-block" className="d-none d-lg-block">
                                        <CardsTitle data={catInfo} />
                                    </div>
                                    <ClpHeading  data={catInfo}/>
                                    <section>
                                        <CardRow parentIndex={index} domainName={domainName} mainContentItems={items.children} onImgError={_onImgError}/>
                                    </section>
                                    </div>
                                </React.Fragment>
                    })
                }

                {   (!isHaveSubChild) ?

                        <React.Fragment>
                         <div className="o-clp-mainContent">
                            <div key="0-d-lg-block" className="d-none d-lg-block o-clp-mainContent">
                                <CardsTitle data={this.props.categoryInfo}/>
                            </div>
                             <ClpHeading  data={this.props.categoryInfo}/>
                            <section>
                                <CardRow parentIndex="0" domainName={domainName} mainContentItems={mainContentItems} onImgError={_onImgError}/>
                            </section>
                            </div>
                        </React.Fragment>

                    : null
                }

            </div>
        )
    }
}