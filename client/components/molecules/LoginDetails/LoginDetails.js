import MaterialInputCheckBox from "../MaterialInputCheckBox/MaterialInputCheckBox";
import LoginHelperText from "../LoginHelperText/LoginHelperText";
import { H3 } from '../../atoms/HeadLines/Headlines';
import Span from '../../atoms/Span/Span';
//import PopoverHelpingText from "../../molecules/Popover/PopoverHelpingText";
import ReactTooltip from 'react-tooltip';
import Icons from '../../atoms/Icons/Icons';
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';

export default class LoginDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // display :'none'
        }
        // this.show = React.createRef();
        // this.display = 'none'
    }

    handleLoginCheckBox = (e) => {
        const checkedValue = e.target && e.target.checked;
        this.props.onHandleChecked(checkedValue);
    }

    // showPopover = (e, id) => {
    //     if (id === 'show') {
    //         this.show.current.classList.add('show');
    //         this.setState({display: 'block'})
    //     } else {
    //         this.show.current.classList.remove('show');
    //         this.setState({display: 'none'})
    //     }
    //     e.stopPropagation();
    // }

    render() {
        const staticLabels = this.props.staticLabels
        const staticMetaTags = this.props.staticMetaTags;

        // const LoginStyle = { //pwa.loginPage.checkboxOnAutoLogin.text
        //     position: 'absolute',
        //     transform: this.props.login ? 'translate3d(137px, 298px, 0px)' :'translate3d(183px, 556px, 0px)',
        //     top: '0px',
        //     left: '0px',
        //     display: this.state.display
        // }
        return (

            <div className="d-flex justify-content-start align-items-center ml-n2 mt-3 m-login-details" id="loginDetails" > 
                <MaterialInputCheckBox checked={staticMetaTags && staticMetaTags["pwa.loginPage.checkboxOnAutoLogin.text"]} text={staticMetaTags ? staticMetaTags && staticMetaTags["pwa.sessionActive.checkboxOnAutoLogin.text"] : staticLabels && staticLabels["pwa.sessionActive.checkboxOnAutoLogin.text"]} onChange={this.handleLoginCheckBox} />
                {/* <Span className="a-login-anchor--helperText d-flex align-items-center justify-content-start">Detalles
                    <Icons data-tip data-for='Detalles' className="a-login--iconHelper ml-1" />
                </Span>*/}
                <Span className="a-login-anchor--helperText d-flex align-items-center justify-content-start">Detalles
                        <Icons id="Detalles" className="a-login--iconHelper ml-1" />
                    </Span>
                {/* <ReactTooltip id="Detalles" className="popover-body" type="light" effect="solid">
                    <span>{"Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales."}</span>
                </ReactTooltip>*/}
                <CustomTooltip
                    tooltipFor="Detalles"
                    trigger="click"
                    content={staticMetaTags["pwa.keepMeSignIn.detailsOnAutoLogin.text"]}
                    position="top"
                    arrowSize="8px"
                    borderSize="1px"
                    contentPadding="10px 22px 10px 10px"
                    boxClass="customBoxSizing">
                </CustomTooltip>

            </div>

        );
    }
}