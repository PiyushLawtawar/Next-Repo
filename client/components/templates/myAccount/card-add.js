import React from 'react';
import Router from 'next/router';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import AddCard from '../../organisms/CardsAccount/organism-card-add';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";

class CardAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: {},
            data: '',
            alert_status: '',
            alert_message: ''
        };
        this.editPage = '';

    }
    componentDidMount() {
        if (Router && Router.router && Router.router.query && Router.router.query.creditCardId) {
            this.editPage = true;
        } else {
            this.editPage = false;
        }
        this.cardRecord();
        this.staticLabels();
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message) => {
        this.setState({ alert_status: true, alert_message });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }

    cardRecord = () => {
        Utility(Path.getCreditCards, 'POST').then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                if (response && response.data && response.data.records) {
                    let cardData = {};
                    response.data.records.map((item) => {
                        if (item.repositoryId === this.props.creditCardId) {
                            cardData = item;
                        }
                    })
                    this.setState({ cardData: cardData })
                }
            }
        }, (error) => {
            console.error("Error ==== :: ", error);
        });
    }

    staticLabels = () => {
        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-creditCardsPage");
        const pageName = "?pageName=pwa-creditCardsPage";
        if (typeof labels === 'undefined' || labels.length === 0) {
            Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
                labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
                this.setState({ data: labels })
            }, (error) => {

        });
        }else {
            let _tdata = labels && labels[0].keyValues;
            this.setState({
                data: _tdata
            });
        }
    }

    addCard = (payload) => {
        Utility(Path.createNewCreditCard, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                if (Router && Router.router && Router.router.query && Router.router.query.id) {
                    Router.push("/tienda/checkout/airtimeTicket");
                } else {
                    Router.push("/tienda/users/creditCards");
                }

            } else if (response.data && response.data.err) {
                window.scrollTo(0, 0);
                this.show_alert(response.data.err);
            }

        }, (error) => {
            console.error("Error ==== :: ", error);
        });
    }

    editCard = (payload) => {
        Utility(Path.proceedtopromotionaftereditcard, 'POST', payload).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                Router.push("/tienda/users/creditCards");
            } else if (response.data && response.data.err) {
                window.scrollTo(0, 0);
                this.show_alert(response.data.err);
            }

        }, (error) => {
            console.error("Error ==== :: ", error);
        });
    }
    render() {
        const { alert_status, alert_message } = this.state;
        const data = this.state;
        const staticLabels = data && data.data;
        let breadcrumbInfo = {};

        if (this.editPage) {
            breadcrumbInfo = {
                label: staticLabels && staticLabels["pwa.creditCardsPage.Editartarjeta.label"],
                breadcrumbData: [
                    {
                        "navigationState": "/users/myAccount",
                        "label": staticLabels && staticLabels["pwa.newCreditCardPage.breadCrumbAccount.text"],
                    },
                    {
                        "navigationState": "/users/creditCards",
                        "label": staticLabels && staticLabels["pwa.creditCardsPage.Tarjetas.label"],
                    }
                ],
                isMyAccount: true

            };
        } else {
            breadcrumbInfo = {
                label: staticLabels && staticLabels["pwa.creditCardsPage.agregartarjeta.label"],
                breadcrumbData: [
                    {
                        "navigationState": "/users/myAccount",
                        "label": staticLabels && staticLabels["pwa.newCreditCardPage.breadCrumbAccount.text"],
                    },
                    {
                        "navigationState": "/users/creditCards",
                        "label": staticLabels && staticLabels["pwa.creditCardsPage.Tarjetas.label"],
                    }
                ],
                isMyAccount: true

            };;
        }


        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData,setDepartmentData,departmentData,setFooterData, snbfooterData }) => (
                    <React.Fragment>
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="myAccount"
                            setDepartmentData={setDepartmentData}
                            departmentData={departmentData}
                        />
                        <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -alert" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <div className="row d-lg-none m-myAccount-aside-title--mobile">
                                    <div className="col-12">
                                        <h1>{this.editPage ? staticLabels && staticLabels["pwa.creditCardsPage.Editartarjeta.label"] : staticLabels && staticLabels["pwa.creditCardsPage.agregartarjeta.label"]}</h1>
                                    </div>
                                </div>
                                <div className="row mt-lg-3 m-row-bootstrap">
                                    <aside className="col-lg-3 pr-4 m-aside__content">
                                        <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={this.editPage ? staticLabels && staticLabels["pwa.creditCardsPage.Editartarjeta.label"] : staticLabels && staticLabels["pwa.creditCardsPage.agregartarjeta.label"]} />
                                    </aside>
                                    <div className="col-lg-9 m-column_mainContent">
                                        <AddCard dismiss_alert={this.dismiss_alert} show_alert={this.show_alert} staticLabels={staticLabels} cardData={this.state.cardData} addCard={this.addCard} editCard={this.editCard} data={this.props.data}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData}/>
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        )
    }
}
export default CardAdd;

