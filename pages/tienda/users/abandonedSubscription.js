import React from 'react';
import { Utility } from '../../../client/helpers/utilities/utility';
import { Path } from '../../../client/helpers/config/config';
import Router from 'next/router';

class AbandonedSubscription extends React.Component {

    constructor(props) {
    super(props);
  }
  componentDidMount() {
    const router = Router && Router.router.query;
    const path = Router && Router.router.asPath;
    const profileId = path.split('?')[1].split('&')[0].split('Id=')[1];
    const siteId = path.split('?')[1].split('&')[1].split('Id=')[1];
    if(profileId,siteId){
        this.emailPreference(profileId,siteId);
    }
    
  }

  emailPreference = (profileId,siteId) => {
    Utility(Path.updateAbandonedEmailPreference, 'POST',{"profileId": profileId,"siteId": siteId}).then(response => {
     if(response && response.data && response.data.status && response.data.status.status === 'success'){
         Router.push(response.data.redirectEndecaPageName);
     }
    }, (error) => {
    });
  }

render(){
  return (
    <React.Fragment>
      
    </React.Fragment>
  );
}
};
export default AbandonedSubscription;