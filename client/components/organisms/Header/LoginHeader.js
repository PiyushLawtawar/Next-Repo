
// import './Header.styl'
// import './Header.styl';
import React from 'react';
import Link from '../../atoms/Link/Link';
import get from 'lodash/get';
import { Anchorimage } from "../../molecules/MixinMolecules/MixinMolecules";
import { parentContext } from '../../../contexts/parentContext';
import SeoText from '../../organisms/SeoText/SeoText';
import Loader from '../../atoms/Loader/atom-loader'


class LoginHeader extends React.Component {
  constructor(props) {
    super(props);

  }
  render() {
    const { headerData } = this.props;
    const headerLogo = get(headerData, 'headerLogo', '');

    return (
      <parentContext.Consumer>
        {({ loginDetails, configurationData, setConfigurationData , labelData }) => (

          <header>
          <Loader className={'loader'} domainNameURL={this.props.domainName}></Loader>
            <SeoText pageName="home" mainPageName='login' labelData={labelData.staticLabelValues ? labelData : this.props.labelData } configurationData={configurationData} setConfigurationData={setConfigurationData} > </SeoText>
            {/* <div className="a-overlay overlay d-lg-none"></div>   removed as its loding by default in WAP*/}
            <div className="o-header reduced d-flex align-items-center">
              <div className="o-container__fluid container-fluid">
                <div className="o-container container p-0">
                  <div className="o-row row pb-0 pb-lg-2 align-items-center">
                    <div className="o-col col-lg-2 col text-center pb-lg-0">
                      <Link href="#">
                         <Anchorimage href="/tienda/home" headerlogo="a-header__logo" src={headerLogo && headerLogo[0] && headerLogo[0].imgUrl ? headerLogo[0].imgUrl : ""} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )
        }

      </parentContext.Consumer>
    )
  }
}
export default LoginHeader;







