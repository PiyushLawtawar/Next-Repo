import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import { CheckboxRadioList as CheckboxList } from '../../molecules/CheckboxList/CheckboxList';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import { H2 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import MoleculeTitleMenuMyAccount from '../../molecules/TitleMenuMyAccount/moleculeTitleMenuMyAccount';
import map from 'lodash/map';
import Router from 'next/router';

//import './organism-notification-preferences.styl';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

class OrganismNotificationPreference extends React.Component {
    constructor(props) {
        super(props);
        this.temporaryPreferencesArr = [];
        this.abandonedEmailPreference;
        this.preferenceIds = [];
        this.state = {
            preferencesArr: '',
            abandonedEmailPreferenceState:''
        }
    }
    componentDidMount() {
        this.getPreferences();

    }
    getPreferences = () => {
        try {
            Utility(Path.getPreferences, 'GET').then(response => {
                if (response && response.data && response.data.errorCode === '1002') {
                    Router.push('/tienda/login')
                } else if (response && response.data && response.data.s === '0') {
                    let preferences = (response && response.data && response.data.preferences) ? response.data.preferences : '';
                  //  this.abandonedEmailPreference = (response && response.data && response.data.abandonedEmailPreference) ? response.data.abandonedEmailPreference : undefined;
                    this.setState({
                        abandonedEmailPreferenceState: (response && response.data && response.data.abandonedEmailPreference) ? response.data.abandonedEmailPreference : undefined
                    })
                    map(preferences, (item, index) => {
                        let temp = {
                            inputId: item.id,
                            nameInput: item.name,
                            labelText: item.name,
                            labelPosition: 'right',
                            helperText: 'helper text',
                            required: false,
                            disabled: false,
                            checked: item.opted,
                            customClass: 'a-form-li',
                        }
                        this.temporaryPreferencesArr.push(temp);
                    })

                    //getting the pre selected values ID.
                    map(preferences, (item, index) => {
                        if (item.opted === true) {
                            this.preferenceIds.push(parseInt(item.id));
                        }
                    })

                    this.setState({
                        preferencesArr: this.temporaryPreferencesArr,
                    })
                }
            });

        } catch (e) {
            console.error(e, "error");
        }


    }
    temporaryPreferencesArrSet = (checkboxID) => {
        map(this.temporaryPreferencesArr, (item, index) => {
            if (item.inputId == checkboxID) {
                this.temporaryPreferencesArr[index].checked = !item.checked;
            }
        })
        this.setState({
            preferencesArr: this.temporaryPreferencesArr,
        })
    }
    setNotificationPreference = () => {
        try {
            Utility(Path.updatePreferences, 'POST', {
                "preferenceIds": this.preferenceIds,
                "subscribeforabandonedemail": this.state.abandonedEmailPreferenceState
            }).then(response => {
                if (response && response.data && response.data.errorCode === '1002') {
                    Router.push('/tienda/login')
                } else if (response && response.data && response.data.s === "0") {
                    // this.getPreferences();
                    Utility(Path.getPreferences, 'GET').then(response => {
                        Router.push('/tienda/users/myAccount');
                    })
                } else {
                    //console.log('failure');
                }

            });
        } catch (e) {
            console.error(e, "error");
        }

    }
    cancelNotificationPreference = () => {
        Router.push('/tienda/users/myAccount');
    }

    changeEmailPreference = () => {
         this.setState({
            abandonedEmailPreferenceState: !this.state.abandonedEmailPreferenceState
        })
      //  this.abandonedEmailPreference = !this.abandonedEmailPreference
    }
    handleCheckboxChange = (e) => {
        let checkboxID = parseInt(e.target.id);
        if (e.target.checked === true) {
            this.preferenceIds.push(checkboxID);
            this.temporaryPreferencesArrSet(checkboxID)
        }
        if (e.target.checked === false) {
            let index = this.preferenceIds.indexOf(checkboxID)
            if (index > -1) {
                this.preferenceIds.splice(index, 1);
                this.temporaryPreferencesArrSet(checkboxID)
            }
        }

    }
    render() {
        const staticLabels = this.props.staticLabels;
        const preferencesHeading = staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"]
        const options = {
            liType: 'checkbox',
            titleText: 'Selecciona las áreas de tu interés para recibir nuestras promociones',
            titleClass: 'm-form-listTitle',
            customListColCLass: 'col-12 col-6',
            // ulCustomClass: 'm-form-ul',
            ulCustomClass: 'm-0 p-0 m-form-ul',
            liElements: this.state.preferencesArr,
            handleCheckboxChange: this.handleCheckboxChange
        }
        return (
            <div className="col-lg-9 m-column_mainContent">
                <div className="o-box o-preferencesContainer">
                    <MoleculeTitleMenuMyAccount preferencesHeading={preferencesHeading} id="asideHome" title={staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"]} />
                    {/*<div className="m-0 a-box-title--preferences">
                        <BoxTitle texto={staticLabels && staticLabels["pwa.leftNavigationPage.preferences.text"]} icon={false} className="m-0 a-box-title--preferences" />
                    </div>*/}
                    <div className="m-preferences-titleSection">
                        <H2 className="a-preferences-title" headLineText={staticLabels && staticLabels["pwa.SubscriptionPage.notificacionesDeBolsa.text"]} />
                        <MaterialInputCheckBox extraClass=" a-preferences-giftPurchase " text="Recibir recordatorios de Bolsa de compras" checked={this.state.abandonedEmailPreferenceState} onClick={this.changeEmailPreference} showClass={false} />
                    </div>
                    <div className="col m-preferences_form">
                        <CheckboxList options={options} />
                        <div className="m-preferences_form-buttons">
                            <Button className="a-btn a-btn--secondary" handleClick={this.cancelNotificationPreference}>{staticLabels && staticLabels["pwa.SubscriptionPage.cancel.text"]} </Button>
                            <Button className="a-btn a-btn--primary" handleClick={this.setNotificationPreference}>Actualizar</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default OrganismNotificationPreference;