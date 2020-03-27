


import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { H2 } from "../../atoms/HeadLines/Headlines";
import MoleculeEmailSendBody from './moleculeEmailSendBody';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from    './../../../helpers/config/config';

import './moleculeemailSend.styl'

class MoleculeEmailSend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staticMetaTags: ''
        }
    }

    componentDidMount() {
        this.getStaticMetaTags();
    }
    getStaticMetaTags = async () => {
        let { staticMetaTags } = this.state;
        const pageName ="?pageName=pwa-forgotPasswordPage";
        /*{
            "pageName": [
                "pwa-forgotPasswordPage"
            ]
        }*/
        Utility(Path.staticLabelsFetch+pageName, 'GET').then(response => {
            staticMetaTags = response.data;
            this.setState({
                staticMetaTags
            });
        });
    }

    render() {
        const { staticMetaTags } = this.state;
        const staticLabels = staticMetaTags && staticMetaTags.staticLabelValues[0] && staticMetaTags.staticLabelValues[0].keyValues;
        return (

            <main className="o-main">
                <div className="o-content__columnCenter--fluid container-fluid p-0">
                    <div className="o-content__columnCenter container p-0 d-lg-flex justify-content-center align-items-center">
                        <div className="o-main-content col-12 col-lg-4 p-0 p-lg-3 d-lg-flex justify-content-center align-items-center mt-lg-4">
                            <div className="m-emailSend mt-0 mt-lg-5">
                                <div className="m-box-title d-none d-lg-block">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <H2 className="m-0 a-box-title--login" headLineText={staticLabels && staticLabels['pwa.forgotPassword.enviado.label']}>
                                        </H2>
                                    </div>
                                </div>
                                <MoleculeEmailSendBody staticLabels={staticLabels} emailId={this.props.emailId} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        )

    }
}

export default MoleculeEmailSend;






