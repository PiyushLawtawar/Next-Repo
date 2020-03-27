/**
 * Module Name : Collection Module.
 * Functionality : This Component will help to render OneColumnPage Component for Collection Page.
 * @exports  : Collection Page
 * @requires : module:next/router#withRouter
 * @requires : module:client/components/templates/OneColumnPage#OneColumnPage
 * Team : B&S Team.
 * 
 */
import { withRouter } from 'next/router';
import OneColumnPage from '../../client/components/templates/OneColumnPage';

export default withRouter((props) => {
  return (
    <OneColumnPage oneColumnData={props.router.query.data} isCollection="true" />
  );
});