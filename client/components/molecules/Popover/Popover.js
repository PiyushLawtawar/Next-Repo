//import './Popover.styl';
import Link from '../../atoms/Link/Link';
import Ul from '../../atoms/Ul/Ul';
import map from 'lodash/map';
import List from '../../atoms/List/List';
import Router from 'next/router';
import { Utility,getBrandName } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';


class Popover extends React.Component {

  constructor(props) {
    super(props);

  }

  handlelogout = () => {
    let brandName = 'LP'
    if (window) {
      brandName = getBrandName(window).brand;
    }
    let payload = {
      "channel": "WEB",
      "brandName": brandName
    };
    Utility(Path.logout, 'POST', payload).then(response => {
      if (response.data && response.data.status && response.data.status.status === "failure") {
        this.show_alert(response.data.status.errorMessage);
      } else if (response.status === 200) {
        window.sessionStorage.removeItem("gtm");
         window.sessionStorage.removeItem("orderHistory");
        if (window) {
          window.location.href = '/';
        }
      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
  }

  personalData = (url) => {
    var EnglishNameMyAccount = url.split('/')[3];
    Utility(Path.validateUpdateProfile, 'POST', {}).then(response => {
        if (response && response.data && response.data.errorCode === '1002') {
            Router.push('/tienda/login' + "?pageName=" + EnglishNameMyAccount)
        } else if (response && response.data && response.data.s === '0') {
          Router.push(url);
        }
    }, (error) => {
    });
}
  onClick = (item) => {
    if (item.name == "Cerrar sesión") {
      this.handlelogout();
    } else {
      this.personalData(item.url);
    }
  }

  render() {
    const { loginDropdown, arrowAling = '' } = this.props;
    return (
      <div className={`${loginDropdown ? `popover bs-popover-bottom ${arrowAling}` : "m-popover m-arrow_box arrow-pos"} ${this.props.showPopoverList ? " show-menu" : "hide-menu"}`}>
        {loginDropdown && <div className="arrow"></div>}
        <div className={loginDropdown ? "popover-body" : "m-popover__popoverbody"}>
          <div className="m-session__popover">
            <Ul>
              {
                map(this.props.items.links, (item, index) => {
                  if(item.name === 'Mi Cuenta' || item.name === 'Mis Pedidos' || item.name === 'Mi tiempo aire' || item.name === 'Mis Tarjetas'){
                    return <List key={index} className="m-popoverlist" id={index} onClick={() => this.onClick(item)} style={{'white-space': 'nowrap'}}>
                         <Link className="a-header__sessionLink" href='#'>{item.name}</Link>
                         </List>
                  }
                  if(item.name === 'Cerrar sesión') {
                      return <List key={index} className="m-popoverlist" id={index} onClick={() => this.onClick(item)} style={{'white-space': 'nowrap'}}>
                         <Link className="a-header__sessionLink" href='#'>{item.name}</Link>
                         </List>
                  }
                  return <List key={index} className="m-popoverlist" id={index} style={{'white-space': 'nowrap'}}>
                    <Link className="a-header__sessionLink" rel="noreferrer" href={item.url} prefetch={false}>{item.name}</Link>
                    </List>
                })
              }
            </Ul>
          </div>
        </div>
      </div>
    );

  }
}

export default Popover;
