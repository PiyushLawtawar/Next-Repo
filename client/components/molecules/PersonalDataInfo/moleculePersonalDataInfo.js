import { H1 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import HrTag from '../../atoms/HrTag/HrTag';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { MoleculeGroupInfo } from '../../molecules/MixinMolecules/MixinMolecules';
import { Utility } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Router from 'next/router';
import './moleculePersonalDataInfo.styl';
class PersonalData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            emailId: '',
            firstName: '',
            lastName: '',
            maternalName: '',
            date: '',
        };
    }
    componentDidMount() {
        this.personalData()

    }
    personalData = () => {
        Utility(Path.summary, 'POST', {}).then(response => {
            if (response && response.data && response.data.errorCode === '1002') {
                Router.push('/tienda/login')
            } else if (response && response.data && response.data.s === '0') {
                const profile = response && response.data && response.data.profile;
                let gender = ''; //not selected  Gender fix for old profile
                if (profile && profile.gender === 'female') {
                    gender = 'Mujer'
                } if (profile && profile.gender === 'male') { 
                    gender = "Hombre"
                }
                // this.setState({ emailId: profile.email, firstName: profile.firstName, lastName: profile.lastName, dateOfBirth: profile.dateOfBirth.time, gender: profile.gender })
                this.setState({
                    emailId: profile && profile.email || '',
                    firstName: profile && profile.firstName || '',
                    lastName: profile && profile.lastName || '',
                    dateOfBirth: profile && profile.dateOfBirth && profile.dateOfBirth.time || '',
                    gender: gender || '',
                    maternalName: profile && profile.maternalName || ''
                })

            }


        }, (error) => {
        });
    }
    date = () => {
        if (this.state.dateOfBirth) {
            var dob = new Date(this.state.dateOfBirth);
            var date = dob.getDate()
            var month = dob.getMonth() + 1;
            var year = dob.getFullYear();

            return date + '/' + month + '/' + year;
        }
    }
    render() {

        const staticLabels = this.props.staticLabels;
        return (
            <div className="m-box-form__content -personalData col-12 col-lg-5 px-4">
                <H1 headLineClass="a-personalData-content__title" headLineText={staticLabels && staticLabels["pwa.myAccountPage.info.text"]} />
                <HrTag />
                <MoleculeGroupInfo title={staticLabels && staticLabels["pwa.MyAccountPage.Email.Text"]} text={this.state.emailId} classTitle="a-personalData-label" classText="a-personalData-text" />
                <MoleculeGroupInfo title={staticLabels && staticLabels["pwa.myAccountPage.firstName.text"]} text={this.state.firstName + " " + this.state.lastName} classTitle="a-personalData-label" classText="a-personalData-text" />
                <MoleculeGroupInfo title={staticLabels && staticLabels["pwa.myAccountPage.dob.text"]} text={this.date()} classTitle="a-personalData-label" classText="a-personalData-text" />
                <MoleculeGroupInfo title={staticLabels && staticLabels["pwa.myAccountPage.Sexo.text"]} text={this.state.gender} classTitle="a-personalData-label" classText="a-personalData-text" />
            </div>
        )
    }
}
export default PersonalData;