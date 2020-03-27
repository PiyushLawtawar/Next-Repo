import React from 'react';
import Router from 'next/router';
import Footer from '../headerFooter/headerFooter';
import Header from '../../organisms/Header/Header';
import { parentContext } from '../../../contexts/parentContext';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../organisms/Aside/AsideMyAccount';
import OrganismPersonalData from '../../organisms/PersonalData/organismPersonalData';
import TitleMenuMyAccount from '../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';
import AsideMyAccount from '../../organisms/Aside/AsideMyAccount';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alert from "../../molecules/Alert/Alert";
class PersonalData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            alert_status: '',
            alert_message: '',
        };
    }

    componentDidMount() {
        this.staticLabels();
        if (Router && Router.router && Router.router.query && Router.router.query.change) {
            this.show_alert("Tu contraseña ha sido cambiada exitosamente");
        }
    }
    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message) => {
        this.setState({ alert_status: true, alert_message });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 9000)
    }

    staticLabels = async () => {
        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-myAccountPage");
        const pageName = "?pageName=pwa-myAccountPage";
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
    render() {
        const { alert_status, alert_message } = this.state;
        const data = this.state;
        const staticLabels = data && data.data;

        let breadcrumbInfo = {
            label: staticLabels && staticLabels["pwa.myAccountPage.breadCrumbAccount.text"],
            breadcrumbData: {}
        };

        return (

            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData ,setDepartmentData,departmentData,setFooterData, snbfooterData}) => (
                    <React.Fragment>
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            headerData={headerData}
                            pageName="AccountLandingPage"
                            setDepartmentData={setDepartmentData}
                            departmentData={departmentData}
                        />
                        <Alert {...this.props} alertTopClass="m-alert__container mdc-snackbar -success" iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} />
                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                <TitleMenuMyAccount title={staticLabels && staticLabels["pwa.myAccountPage.breadCrumbAccount.text"]} />
                                <div className="row mt-lg-3 m-row-bootstrap">
                                    <aside className="col-lg-3 pr-4 m-aside__content">
                                        <Aside handleleftNavData={handleleftNavData} leftNavData={leftNavData} display={true} headingText={staticLabels && staticLabels["pwa.myAccountPage.heading.text"]} />
                                    </aside>
                                    <OrganismPersonalData staticLabels={staticLabels} loginDetails={loginDetails} />
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
export default PersonalData;
