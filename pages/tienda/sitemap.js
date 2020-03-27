import React from 'react';
import { withRouter } from 'next/router';
// import SiteMap from '../../client/components/organisms/SiteMap/siteMap';
import SiteMap from '../../client/components/templates/SiteMap/siteMap';
import { Path } from '../../client/helpers/config/config';
import { Utility } from '../../client/helpers/utilities/utility';

class siteMap extends React.Component {
  static async getInitialProps({ req }) {
    let myData = {};
    if (!req) {
      myData = await Utility(Path.siteMap + '?isAjax=true', 'GET');
    }
    return { initialPropsData: myData.data }
  }

  render() {
    const siteMapData = this.props.initialPropsData || this.props.router.query.data || {};
    return (
      <SiteMap siteMapData={siteMapData} />      
    )
  }

}
export default withRouter(siteMap);