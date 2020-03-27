import React from 'react';
import { withRouter } from 'next/router'
import StaticPages from '../../client/components/templates/staticPage/staticPages';

class staticPage extends React.Component {
  render() {
    const results = this.props.router.query.data || {};
    return (
      <React.Fragment>
        <StaticPages mainContent={results}/>
      </React.Fragment>
    );
  }
}
export default withRouter(staticPage);
