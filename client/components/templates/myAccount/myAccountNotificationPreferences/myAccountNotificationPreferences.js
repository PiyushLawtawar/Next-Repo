import React from 'react';
import MoleculeTitleMenuMyAccount from '../../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';
import Footer from '../../headerFooter/headerFooter';
import Header from '../../../organisms/Header/Header';
import { parentContext } from '../../../../contexts/parentContext';
import Breadcrumb from '../../../molecules/Breadcrumb/Breadcrumb';
import Aside from '../../../organisms/Aside/AsideMyAccount';
import OrganismNotificationPreference from '../../../organisms/NotificationPreferences/organism-notification-preferences';
import { Utility , GTMallPages, GetCookie } from '../../../../helpers/utilities/utility';
import { Path } from    '../../../../helpers/config/config';

class myAccountNotificationPreferences extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };
    }

    componentDidMount() {
        this.staticLabels();
    }

    staticLabels = () => {
        let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-subscriptionPage");
        const pageName ="?pageName=pwa-subscriptionPage";
        if (typeof labels === 'undefined' || labels.length === 0) {
            Utility(Path.staticLabelsFetch+pageName, 'GET').then(response => {
                labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues;
                this.setState({ data: labels })
            }, (error) => {
            });
        } else {
            let _tdataAdd = labels && labels[0].keyValues;
            this.setState({
            data: _tdataAdd
            });
      }
    }
    render() {

        const data = this.state;
        const staticLabels = data && data.data;


        let breadcrumbInfo = {
            label: staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"],
            breadcrumbData:  [
                                {
                                        "navigationState":  "/users/myAccount",
                                        "label": staticLabels && staticLabels["pwa.SubscriptionPage.breadCrumbAccount.text"],
                                }
                        ],
            isMyAccount: true
        };

        return (
            <parentContext.Consumer>
                {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, handleleftNavData, leftNavData, setDepartmentData, departmentData, setFooterData, snbfooterData }) => (
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

                        <div className="container-fluid o-main-container p-0">
                            <div className="container o-container__secondary">
                                <div className="row d-none d-lg-block m-row-bootstrap">
                                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                                </div>
                                <div className="row m-row-bootstrap">
                                </div>
                                  {/*<MoleculeTitleMenuMyAccount title={staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"]} />*/}
                                <div className="row mt-lg-3 m-row-bootstrap">
                                    <aside className="col-lg-3 pr-4 m-aside__content">
                                        <Aside className="aside_navbar_notification_preference_mobile" handleleftNavData={handleleftNavData} leftNavData={leftNavData} headingText={staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"]} />
                                    </aside>
                                    <OrganismNotificationPreference staticLabels={staticLabels} loginDetails={loginDetails} />
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
export default myAccountNotificationPreferences;