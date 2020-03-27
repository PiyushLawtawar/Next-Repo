import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from "../../atoms/Link/Link";
import map from 'lodash/map';
import Router from 'next/router';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';

class CardBody extends React.Component {

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

  render() {

  let leftNavContent = this.props && this.props.leftNavContent && this.props.leftNavContent.links;

  return (
    <div className="m-card-body--aside">
      <Ul className="m-cardBody__margin">
        {map(leftNavContent, (item, index) => {
          if(item.name == 'Mi crédito' || item.name == 'Facturación Electrónica') {
            return (
            <List key={index} className="a-category__title ">
              <Link  asInfo={item.url} href={item.url}>{item.name}</Link> {/*href={item.url}*/}
            </List>
            )
          }
          return (
            <List key={index} className="a-category__title " onClick={() => this.personalData(item.url)}>
              <Link  href="#">{item.name}</Link> {/*href={item.url}*/}
            </List>
          )
        })
        }
      </Ul>
    </div>
  );
}
}

export default CardBody;


