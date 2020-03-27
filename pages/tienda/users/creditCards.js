import React from 'react';
import { withRouter } from 'next/router';
import Cards from '../../../client/components/templates/myAccount/cards';
import { Utility, GTMallPages, GetCookie } from '../../../client/helpers/utilities/utility';
import { Path } from '../../../client/helpers/config/config';
import Router from 'next/router';
import { parentContext } from '../../../client/contexts/parentContext';

class cardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {}
    };
  }
  componentDidMount() {
    this.cardRecord();

  }

  cardRecord = () => {
    Utility(Path.getCreditCards, 'POST').then(response => {
      if (response && response.data && response.data.errorCode === '1002') {
        Router.push('/tienda/login')
      } else if (response && response.data && response.data.s === '0') {
        this.setState({ cardData: response.data })
      }
    }, (error) => {
    });
  }

  render() {
    return (
      <parentContext.Consumer>
        {({ data}) => (
          <React.Fragment>
            <Cards cardData={this.state.cardData} cardRecord={this.cardRecord} data={data}/>
          </React.Fragment>
       )}
       </parentContext.Consumer>
    );
  }
}

export default cardPage;

