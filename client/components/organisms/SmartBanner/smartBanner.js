import Link from '../../atoms/Link/Link';
// import './smartBanner.styl';
import { SetCookie } from '../../../helpers/utilities/utility';
import isEmpty from 'lodash/isEmpty';

class SmartBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBannerClosed: false
        }
    }
    // componentDidMount() {
    //     const { staticLabels } = this.props;
    //     const downloadAppContent = !isEmpty(staticLabels['homepage.downloadAppContent.label']) ? staticLabels['homepage.downloadAppContent.label'] : '';
    //     document.getElementById("smartBanner").innerHTML = downloadAppContent;
    // }
    closeBanner = () => {
        // const { staticLabels } = this.props;
        const staticLabels = this.props.smartBannerText && this.props.smartBannerText[0] && this.props.smartBannerText[0].keyValues;
        let expiryTime = !isEmpty(staticLabels['homePage.downloadAppExpiry.label']) ? staticLabels['homePage.downloadAppExpiry.label'] : 0;
        expiryTime = expiryTime * 60 // conver to sec 
        this.setState({ isBannerClosed: true });
        SetCookie('showBanner', 'No', expiryTime, '/');
    }

    render() {
        const { isBannerClosed } = this.state;
        // const { staticLabels } = this.props;
        const staticLabels = this.props.smartBannerText && this.props.smartBannerText[0] && this.props.smartBannerText[0].keyValues;
        const { smartBannerText } = this.props;
        const downloadAppContent = staticLabels && !isEmpty(staticLabels['homepage.downloadAppContent.label']) ? staticLabels['homepage.downloadAppContent.label'] : '' || '';
        // const downloadAppContent = smartBannerText && !isEmpty(smartBannerText['WAPalertMessagePage.alertMessageDivTag.bigText']) ? smartBannerText['WAPalertMessagePage.alertMessageDivTag.bigText'] : '' || '';


        if (!isBannerClosed) {
            return (
                // style={{ 'height': 'auto' }}
                <div className="smartBanner-container row">  
                    <div className="col-1 p-0" onClick={this.closeBanner} style={{ 'margin': 'auto auto auto 5px' }}>
                        <i className="icon-close close"></i>
                    </div>
                    {/* <p id="smartBanner" ></p> */}
                    <div class="row" style={{ 'margin': '0px 0px 0px 10px', 'width': '85%' }} dangerouslySetInnerHTML={{ __html: downloadAppContent }} />
                    {/* <p dangerouslySetInnerHTML={{ __html: downloadAppContent }}></p> */}

                    {/* <div className="col-2 p-0">
                        <img className="a-smartBanner-logo" src="/static/images/Icon launcher.svg" alt="liverpool logo" />
                    </div>
                    <div className="col-7 p-0">
                        <p className="a-smartBanner-title">Descarga <span className="a-smartBanner-span">Liverpool Pocket</span></p>
                        <p className="a-smartBanner-paragraph">la app de Liverpool</p>
                    </div>
                    <div className="col-2 p-0">
                        <Link className="a-smartBanner-downloadLink" href="https://play.google.com/store/apps/details?id=mx.com.liverpool.shoppingapp&amp;amp;hl=es">Ver</Link>
                    </div> */}
                </div>
            )
        }
        return null;
    }
}
export default SmartBanner;