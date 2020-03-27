import React from 'react';
import { withRouter } from 'next/router';
import { Utility, GTMallPages, GetCookie } from '../../../client/helpers/utilities/utility';
import { parentContext } from '../../../client/contexts/parentContext';
import Router from 'next/router'
import { Path } from '../../../client/helpers/config/config';
import MyOrdersConsolidated from '../../../client/components/templates/MyOrders/myOrdersConsolidated';
// import  myOrder  from  '../myOrder.json'


class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: '',
      currentPage: 1,
      SearchOrder: false,
    };
  }

  getCookie = (name) => {
    var cookieArr = document.cookie.split(";");

    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  componentDidMount = () => {
    //start of 23705
    window.sessionStorage.setItem('orderHistory','/tienda/users/orderHistory')
    //end of 23705
    let logged = this.getCookie('LoggedInSession')
    if (logged === 'TRUE' && this.props && this.props.orderDetails && this.props.orderDetails.errorCode === '1002') {
      Router.push('/tienda/login')
    }
  }

  static async getInitialProps({ req, query }) {

    try {
      let myData = {};
      let SearchOrderDetails = query.SearchOrderDetails;
      let SearchOrder = query.SearchOrder;
      //  console.log('SearchOrderDetails', SearchOrderDetails)


      const currentPage = (query.page || 1).toString();

      let payload = {
        "currentPage": currentPage,
        "noOfItemsPerPage": "5"
      };
      if (!req && (!SearchOrderDetails && !SearchOrder)) {
        myData = await Utility(Path.orderHistory, 'POST', payload);
        window.scrollTo(0, 0);
      }
      //  console.log('query', currentPage)
      return { initialPropsData: myData.data }
    } catch (e) {
      console.error(e, "error");
    }
  }


  render() {

    const orderDetails = this.props.initialPropsData || '';
    // console.log('data kopal-------', labelData)
    const pageParameterTmp = this.props.router && this.props.router.query || {};
    // console.log('pageParameterTmp-------',  this.props.router)

    return (
      <parentContext.Consumer>
        {({ data }) => (
          <React.Fragment>
            <MyOrdersConsolidated pageParameterTmp={pageParameterTmp} orderDetails={orderDetails} data={data} />
          </React.Fragment>
        )
        }
      </parentContext.Consumer>
    )
  }
}
export default withRouter(OrderHistory);
