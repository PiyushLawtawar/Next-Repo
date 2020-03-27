
import React from 'react';

import { withRouter } from 'next/router';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import Button from "../../atoms/Button/Button";
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import DeleteModal from '../../molecules/Modals/moleculeModalDelete';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Modal from '../../../helpers/modal/modal';
import { parentContext } from '../../../contexts/parentContext';
import AddressBlock from './addressBlock.js';

class AddressPageBody extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usernickName: null,
            editAddressFlag: ''
        };
    }

    componentDidMount() {
        this.getConfiguration();
      }

    deleteCreditCard = (id) => {
        let payload = {
            "nickname": this.state.usernickName
        };

        Utility(Path.removeaddress, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                Router.push('/tienda/users/addressBook');
            }
            // call getcreditcards again
        }, (error) => {
        });
    }

    setAddressToDelete = usernickName => {
        this.setState({ usernickName })
    }
    getConfiguration = () => {
        //  change for getConfigration service Calls : Start
        let { configurationData, setConfigurationData } = this.props;
        let editAddressFlag = configurationData &&  configurationData.configuration && configurationData.configuration.flagConfiguration && configurationData.configuration.flagConfiguration || this.props && this.props.flag || undefined;
        // editAddressFlag = this.props && this.props.flag;
        if (typeof editAddressFlag === 'undefined' || editAddressFlag.length === 0) {
          Utility(Path.fetchConfiguration, 'GET').then(response => {
            if (response && response.data) {
                editAddressFlag = response.data && response.data.configuration && response.data.configuration.flagConfiguration;
                this.setState({ editAddressFlag})
            }
          });
        }else {
            this.setState({
                editAddressFlag
            });
        }
       //  change for getConfigration service Calls : End 
    }

    render() {

        const staticLabels = this.props.staticLabels;
        const deleteModalData = this.props.deleteModalData;
        let userAddress = this.props.userAddress;

        userAddress = userAddress.records.map(p => {
            if (p.repositoryId === userAddress.defaultShippingAddressId) {
                p.isDefault = true;
            } else {
                p.isDefault = false;
            }

            return p;
        }
        ).sort(function (a, b) {
            return b.isDefault - a.isDefault
        })


        const modalDelete = {
            modalId: "delete-modal",
            modalClass: "o-product__modal modal fade account-show",
            modalTabIndex: "1",
            modalAriaLabelledBy: "delete-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };

        return (
            <parentContext.Consumer>
                {({ OpenModal }) => (
                    <div className="o-myAccount__cards pb-5">
                        <div className="row d-none d-lg-block">
                            <div className="col-lg-3 mt-n3 mb-4">
                                <Button handleClick={() => { Router.push(`/tienda/users/addAddress`) }} className="a-btn a-btn--primary">{staticLabels && staticLabels["pwa.addressPage.direccion1.label"]}</Button>
                            </div>
                        </div>
                        <div className="row">
                            {userAddress && userAddress.length ? userAddress.map((data, index) => <AddressBlock flag ={this.state && this.state.editAddressFlag && this.state.editAddressFlag.enableEditAddress} key={index} staticLabels={staticLabels} deleteModalData={deleteModalData} getAddresses={this.props.getAddresses} defaultShippingAddressId={userAddress.defaultShippingAddressId} userAddress={data} setAddressToDelete={this.setAddressToDelete} openDeleteModal={OpenModal} predeterminadaAddress={this.predeterminadaAddress} />) : null}
                        </div>

                        <div className="row d-block d-lg-none">
                            <div className="col-lg-3 mt-n3 mb-4">
                                <Button handleClick={() => { Router.push(`/tienda/users/addAddress`) }} className="a-btn a-btn--primary" ripple="ripple">{staticLabels && staticLabels["pwa.addressPage.direccion1.label"]}</Button>
                            </div>
                        </div>
                        <Modal modalDetails={modalDelete} showModalpopUp={'deleteModal'}>
                            <DeleteModal deleteModalData={staticLabels} deleteCreditCard={this.deleteCreditCard} ModalpopUp={"deleteModal"} />
                        </Modal>
                    </div>
                )}
            </parentContext.Consumer>
        )
    }
}

export default AddressPageBody;


