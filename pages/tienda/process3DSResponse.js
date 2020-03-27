import React from 'react';
import { withRouter } from 'next/router'

class ThreeDS extends React.Component  {
    constructor(props){
        const errMessage = props.router && props.router.query && props.router.query.data && props.router.query.data.DSErrorMessage && props.router.query.data.DSErrorMessage['3DSErrorMessage'] || '';
        super(props);
        this.state = {
            DSErrorMessage: errMessage || '',
            errorMessage: errMessage || 'Por favor espere, no actualice la página ..........................'
        }
  }
    componentDidMount(){
        if(!this.state.DSErrorMessage){
           setTimeout(function(){ window.location.reload(); }, 3000);
        }
    }
  render() {
      return(
            <div> {this.state.errorMessage} </div>
     )

  }
}

export default withRouter(ThreeDS);
