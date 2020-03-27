import React from 'react';
import Router from 'next/router';
import Label from "../../atoms/Label/Label";
import { H1, H2 } from "../../atoms/HeadLines/Headlines";
import Icons from "../../atoms/Icons/Icons";
import Button from "../../atoms/Button/Button";
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';
import CardList from '../../molecules/CardList/CardList';
import { Utility,logError ,logDebug } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';

//import './Aside.styl'

class AsideMyAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leftNavContent: []
        }
    }

    componentDidMount() {
        const { handleleftNavData, leftNavData } = this.props;
        if (isEmpty(leftNavData)) {
            this.getSideNavUrl();
        } else {
            this.setState({
                leftNavContent: leftNavData
            })
        }
    }
    getSideNavUrl = () => {
        const { handleleftNavData } = this.props;
        let userHeaders = {};
        if (Router && Router.router && Router.router.query && Router.router.query.isredirect) {
            userHeaders = { 'request_from': 'changePassword' }
        }
        let page = "myAccount";
        Utility(Path.getMyAccountLeftNav + page, "GET",undefined,userHeaders).then(response => {
            if (response.status === 200 && response.data && response.data.leftNavContent && response.data.leftNavContent[0].leftNavLinks) {
                let data = response.data && response.data.leftNavContent && response.data.leftNavContent[0].leftNavLinks;
                this.props.handleleftNavData(data);
                this.setState({ leftNavContent: data })
            }
        }, (error) => {
            logError("Error ==== :: ", error);
        });
    }

    orderpage = () => {
        const url = "/tienda/users/orderHistory";
        var EnglishNameMyAccount = url.split('/')[3];
        Utility(Path.validateUpdateProfile, 'POST', {}).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
              Router.push('/tienda/login' + "?pageName=" + EnglishNameMyAccount)
            } else if (response && response.data && response.data.s === '0') {
              Router.push(url);
            }
        }, (error) => {
        });
        // Router.push("/tienda/users/orderHistory");
    }
    render() {
        var eddOpenModal = {
            hText: 'Mis Pedidos',
            hType: 'h2',
            btnModalAttributes: {
                "data-toggle": "modal",
                "data-target": "#edd-modal",
                "id": "a-edd-modal__btn"
            },
            iconClass: 'icon-arrow_right',
            divClass: 'm-product__giftPurchase-container -small',
            btnText: '',
            btnClass: 'a-btn a-btn--action'
        }

        return (
            <div className={`o-myAccount-aside o-myAccount-aside  ${this.props.display ? "" : "d-none d-lg-block"} `}>
                <H1 headLineClass="a-myAccount-aside--title d-none d-lg-block" headLineText={this.props.headingText}></H1>
                <div className={eddOpenModal.divClass}>
                    <Button className={eddOpenModal.btnClass} onClick={this.orderpage} data-toggle={eddOpenModal.btnModalAttributes} data-target={eddOpenModal.btnModalAttributes} id={eddOpenModal.btnModalAttributes}>{eddOpenModal.hText}
                        <Icons className={eddOpenModal.iconClass} />
                    </Button>
                </div>
                <CardList leftNavContent={this.state.leftNavContent[1]} />
                <CardList leftNavContent={this.state.leftNavContent[2]} />
            </div>
        )
    }
}
export default AsideMyAccount;




