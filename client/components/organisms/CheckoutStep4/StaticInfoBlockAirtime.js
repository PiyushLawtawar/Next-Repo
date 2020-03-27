
import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { withRouter } from 'next/router';
import Router from 'next/router';

export default class extends React.Component {

    pageRedirection = () => {
        window.location.href = this.redirectURL;
    }

    render() {
        let { digitalPurchasesDisclaimer } = this.props.orderData;
        let viewPort = this.props.viewPort;
        // console.log('viewPort',this.props);
        let email = this.props.orderData.email || '';
        let { staticLabels } = this.props;
        this.redirectURL = staticLabels && staticLabels['pwa.orderConfirmationPage.seguridadDelSitio'] ? staticLabels['pwa.orderConfirmationPage.seguridadDelSitio'] : '';
        let tiendaValue = '039';
        if (this.props.orderData.orderSuccess && this.props.orderData.orderSuccess.ItemDetails && this.props.orderData.orderSuccess.ItemDetails.success
            && this.props.orderData.orderSuccess.ItemDetails.success[0]) {
            tiendaValue = this.props.orderData.orderSuccess.ItemDetails.success[0]['tienda'];
        }
        return (
            <React.Fragment>
                    <div className="row d-lg-none d-block">
                        <div className="col-12 text-center">
                            <Paragraph className="m-0" onClick={this.pageRedirection}><i className="icon-lock pr-2"></i><span>{staticLabels && staticLabels['pwa.orderConfirmationPage.todastext.text'] ? staticLabels['pwa.orderConfirmationPage.todastext.text'] : ''}</span>
                            </Paragraph>
                        </div>
                        <div className="col-12 text-justify">
                        </div>
                    </div>
                    
            </React.Fragment >
        )
    }
}

