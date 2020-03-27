
import React from 'react';
import Button from "../../atoms/Button/Button";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Router from 'next/router';



// import './myAddressPage.styl';

class AddressEmptyPage extends React.Component {

    render() {
        const staticLabels = this.props.staticLabels;
        let breadcrumbInfo = {
            label: '',
            breadcrumbData: {}
        };

        return (
           <div className="o-myAccount__cards pb-5">
                < div className = "col-12 col-lg-3 mt-n3 mb-4 mt-2 p-0 order-2 order-lg-1" >
                    <Button handleClick={() => { Router.push(`/tienda/users/addAddress`) }} className="a-btn a-btn--primary">{staticLabels && staticLabels["pwa.addressPage.direccion1.label"]}
                    </Button>
                </div>
                <div className="col-12 mb-2 mb-lg-0 m-account__cardInfo mt-lg-2 --empty order-1 order-lg-2">
                    <Paragraph className="a-account__cardInfoEmpty">No hay direcciones registradas
                  </Paragraph>
                </div>
            </div>
        )
    }
}

export default AddressEmptyPage;
