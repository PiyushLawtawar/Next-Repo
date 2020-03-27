import React from 'react';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import { ShowMotion } from '../../molecules/MenuMotion/molecule-menu-motion';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';


class AddressBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userAddress: {},
            editid: {}
        };
    }

    setDefaultAddress = (repositoryId) => {
        const payload = {
            "addressId": repositoryId
        };
        Utility(Path.setDefaultAddress, 'POST', payload).then(response => {
            if (response.data && response.data.s !== undefined && response.data.s === "0") {
                Router.push('/tienda/users/addressBook');
            }
        }, (error) => {
        });
    }

    componentDidMount() {
        if (this.props.userAddress) {
            this.setState({ userAddress: this.props.userAddress })
        }
    }



    editAddress = (e) => {
        this.setState({ editid: e })
        Router.push('/tienda/users/editAddress?addressId=' + e);
    }
    nullCheck = (data) => {
        return data || ''
    }

    render() {
        const staticLabels = this.props.staticLabels;
        const deleteModalData=this.props.deleteModalData;
        const userAddress = this.props.userAddress;
        let flags = this.props.flag || 'true';
        
        const options1 = [{
            text: 'Entre las calles:',
            class: 'a-cards__titleCardBox pt-3'
        }, {
            text: 'Primero de Mayo y Av. Toluca',
            class: 'a-cards__descriptionCardBox'
        }, {
            text: 'Teléfonos:',
            class: 'a-cards__titleCardBox'
        }, {
            text: '55-56789618',
            class: 'a-cards__descriptionCardBox m-0'
        }, {
            text: '55-56789618',
            class: 'a-cards__descriptionCardBox m-0'
        }, {
            text: '5556789618',
            class: 'a-cards__descriptionCardBox'
        }]

        const optionsForDefault = [
            this.props.flag == 'true' ? 
            { text: staticLabels && staticLabels["pwa.addressPage.Editar.text"], onClick: () => this.editAddress(userAddress.repositoryId) } : ''
        ];


        const GRmenuOptions = [
              { text: staticLabels && staticLabels["pwa.addressPage.predeterminada.label"], onClick: () => this.setDefaultAddress(userAddress.repositoryId) },
        ]

        let menuOptions = [];
        if(flags == 'true'){
            menuOptions = [
                { text: staticLabels && staticLabels["pwa.addressPage.predeterminada.label"], onClick: () => this.setDefaultAddress(userAddress.repositoryId) },
                { text: staticLabels && staticLabels["pwa.addressPage.Editar.text"], onClick: () => this.editAddress(userAddress.repositoryId) },
                { text: staticLabels && staticLabels["pwa.addressPage.Eliminar.text"], onClick: () => { this.props.setAddressToDelete(userAddress.nickName); this.props.openDeleteModal('deleteModal') } }
            ]
        }else {
            menuOptions = [
                { text: staticLabels && staticLabels["pwa.addressPage.predeterminada.label"], onClick: () => this.setDefaultAddress(userAddress.repositoryId) },
                { text: staticLabels && staticLabels["pwa.addressPage.Eliminar.text"], onClick: () => { this.props.setAddressToDelete(userAddress.nickName); this.props.openDeleteModal('deleteModal') } }
            ]
        }


        
        return (

            <div className="col-lg-4">
                <div className="m-box m-cardBox mb-4">
                    <div className="row">
                        <div className="col-11">
                            <H1 headLineClass="a-cards__titleCard" headLineText={userAddress.nickName}></H1>
                            <Span className="a-cards__defaultTitle">{userAddress.isDefault && staticLabels && staticLabels["pwa.addressPage.default.text"]}</Span>
                            {userAddress.isEventAssociated ? <div className="m-flag m-0">
                                <div className="m-flag-item -primaryFlag -mesa"><Span>Mesa de Regalos</Span><i className="icon-gift"></i>
                                </div>
                            </div> : ''}
                            <Paragraph className="a-cards__descriptionCardBox m-0">{userAddress.firstName + ', ' + (userAddress.middleName ? userAddress.middleName + ', ' : '') + userAddress.lastName}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox m-0">{(userAddress.maternalName ? userAddress.maternalName + ', ' : '') + userAddress.address1 + ', ' + userAddress.exteriorNumber}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox m-0">{(userAddress.interiorNumber ? userAddress.interiorNumber + ', ' : '') + (userAddress.building ? userAddress.building + ', ' : '') + userAddress.city + ', ' + userAddress.neighbourhood}</Paragraph>
                            <Paragraph className="a-cards__descriptionCardBox m-0">{userAddress.delegationMunicipality + ', ' + userAddress.postalCode + ', ' + userAddress.country + ', ' + userAddress.state}</Paragraph>
                            <Paragraph className='a-cards__titleCardBox pt-3'>{deleteModalData && deleteModalData["pwa.displayAddressInfoPage.Streets.Text"]}</Paragraph>
                            <Paragraph className='a-cards__descriptionCardBox'>{this.nullCheck(userAddress.address2) + (this.nullCheck(userAddress.address2).trim("").length && this.nullCheck(userAddress.address3).trim("").length ? ' y ' : '') + this.nullCheck(userAddress.address3)}</Paragraph>
                            <Paragraph className='a-cards__titleCardBox'>{deleteModalData && deleteModalData["pwa.displayAddressInfoPage.Phone.Text"]}</Paragraph>
                            <Paragraph className='a-cards__descriptionCardBox m-0'>{userAddress.phoneNumber}</Paragraph>
                            <Paragraph className='a-cards__descriptionCardBox m-0'>{userAddress.businessPhoneNumber}</Paragraph>
                            <Paragraph className='a-cards__descriptionCardBox'>{userAddress.cellular}</Paragraph>
                        </div>
                        <div className="col-1 p-0">
                        {userAddress.isDefault === true && this.props.flag == 'true' ? <ShowMotion transform={userAddress.isDefault === true ? null : -263} options={userAddress.isDefault === true ? userAddress.isEventAssociated ? '' : optionsForDefault : userAddress.isEventAssociated ? GRmenuOptions : menuOptions} /> :
                        !userAddress.isDefault && <ShowMotion transform={userAddress.isDefault === true ? null : -263} options={userAddress.isDefault === true ? optionsForDefault : userAddress.isEventAssociated ? GRmenuOptions : menuOptions} />}
                           
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default AddressBlock;