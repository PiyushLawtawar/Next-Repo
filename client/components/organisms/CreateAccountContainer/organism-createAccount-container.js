import CreateAccountContainerTitle from '../../molecules/ContainerTitle/molecule-container-title';
import MoleculeListPage from '../../molecules/List/molecule-list';
import CreateAccountForm from '../../molecules/FormCreateAccount/molecule-formCreateAccount';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Alert from '../../molecules/Alert/Alert';
//import './organism-createAccount-container.styl';

class CreateAccountContainer extends React.Component {

    showRegistrationButton = () => {
        this.showvisble.visibiliyShow();
    }
    render() {

        const staticLabels = this.props.staticLabels

        // const { alert_status, alert_message } = this.state;
        var MoleculeList = {
            text: staticLabels && staticLabels["pwa.registerPage.heading"],
            type: 'h1',
            className: 'a-container-title-text'
        }
        var listOptions = {
            listType: 'ul',
            listClass: 'm-benefitsList__list',
            listElements: staticLabels && staticLabels["pwa.registerPage.benifits.leftText"],
        }
        var options = {
            type: '-alert',
            text: 'Esta dirección de correo electrónico ya ha sido registrada previamente. Por favor anota una diferente.',
            iconType: "a-alert__icon icon-error"//- icon-warning or icon-done
        }
        return (
            <div className="o-createAccount-container">
                <CreateAccountContainerTitle MoleculeList={MoleculeList} />
                <div className="row m-0">
                    <div className="col col-lg-6 d-none d-lg-flex justify-content-center">
                        <div className="m-createAccount-list">
                            <Paragraph className='a-createAccount-listTitle'>{staticLabels && staticLabels["pwa.registerPage.heading.text"]}</Paragraph>
                            <div dangerouslySetInnerHTML={{ __html: listOptions.listElements }} ></div>
                            {/*<MoleculeListPage listOptions={listOptions.listElements} />*/}
                        </div>
                    </div>
                    <div className="col col-lg-6 d-flex justify-content-center m-formCreateAccount__container">
                        {/* change for getConfigration service Calls : Start */}
                        <CreateAccountForm staticLabels={staticLabels} show_alert={this.props.show_alert} createAccount={this.props.createAccount} ref={sh => this.showvisble = sh} {...this.props} />
                        {/* change for getConfigration service Calls : End */}

                    </div>
                </div>
            </div>
        )
    }
}
export default CreateAccountContainer;