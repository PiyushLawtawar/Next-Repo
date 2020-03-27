import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import FormChangePassword from '../../molecules/FormChangePassword/molecule-formChangePassword';

class changePassword extends React.Component {

    render() {

        const staticLabels = this.props.staticLabels;
        return (
            <div className="col-lg-9 m-column_mainContent">
                <div className="o-box -forms">
                    <BoxTitle texto="Cambiar mi contraseña" classe="m-0 a-box-title--forms d-block d-lg-none" />
                    <FormChangePassword staticLabels={staticLabels} show_alert={this.props.show_alert} loginDetails={this.props.loginDetails} changePassword={this.props.changePassword}/>
                </div>
            </div>
        );

    }


}
export default changePassword;