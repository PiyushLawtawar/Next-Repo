import React from 'react';
import { withRouter } from 'next/router'
import { locale, localRegistrationUrl, MObile_SITE } from '../../client/config/constants';
import { Path } from '../../client/helpers/config/config';

import { Utility,UserAgentDetails,getAssetsPath } from '../../client/helpers/utilities/utility';


class Turntomobile extends React.Component {


constructor(props) {
        super(props)
        this.state = {
               Hostname: '',
            window: '',
            breadcrumbData: {},
            turntokey:props.router.query.data.turntokeys || ''

        }
    }


     getPdpDynamicContent = async () => {

        await Utility(Path.getPdpDynamicContent, 'POST', {
            "productId": this.props.router.query.turntosku,
        }).then(response => {
            this.setState({
                breadcrumbData: response.data
            }, () => {
               const breadCrumbData = this.state.breadcrumbData
               const auth = this.state.breadcrumbData && this.state.breadcrumbData.authToken;
                window.authToken = auth;
                //console.log("authToken===",authToken)

            })
        });
    }

    loadScript = (src) => {
      return new Promise(function(resolve, reject) {
        let script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
      });
    }

    componentDidMount() {
        this.getPdpDynamicContent();
        const Truntokey = this.state.turntokey;
        window.TRUNTO_KEY = Truntokey;
        window.locale = locale;
        window.localRegistrationUrl = localRegistrationUrl;

        // setTimeout(function() {this.loadScript(MObile_SITE)}.bind(this), 2000);
        this.setState({ Hostname: window.location.hostname});
    setTimeout(function() {
        let localassetPath = getAssetsPath(( typeof window !=='undefined' ?window :undefined), undefined);
        let promise = this.loadScript(localassetPath+MObile_SITE);
        promise.then(
          script => console.log(`%c${script.src} is loaded!`,'color:blue; background:white;'),
          error => console.log(`%cError: ${error.message}`,'color:red; background:white;')
        );
        promise.then(script => {
          try {
            let link  = document.createElement('link');
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            let  AssetsPath = '';
            if (typeof window !== 'undefined') {
              AssetsPath = getAssetsPath(window,undefined); 
            }
            switch (window.location.hostname.split('.')[1]) { 
              case 'liverpool':
                  link.href = AssetsPath+ "/static/css/turnTo-liverpool.css";
                  break;
              case 'williams-sonoma':
                  link.href = AssetsPath+ "/static/css/turnTo-williamssonoma.css";
                  break;
              case 'westelm':
                  link.href = AssetsPath+ "/static/css/turnTo-westelm.css";
                  break;
              case 'potterybarn':
                  link.href = AssetsPath+ "/static/css/turnTo-potterybarn.css";
                  break;
              case 'potterybarnkids':
                  link.href = AssetsPath+ "/static/css/turnTo-potterybarnkids.css";
                  break;
              case 'pbteen':
                  link.href = AssetsPath+ "/static/css/turnTo-potterybarnteens.css";
                  break;
            }
            document.body.appendChild(link);
            console.log(`%c${link.href} is loaded!`,'color:blue; background:white;')
          } catch(e) {
            console.log(`%c${e}`,'color:red; background:white;');
          }
        });

        }.bind(this), 2000);


    }
    shouldComponentUpdate(nextProps, nextState) {
      if ( nextState.Hostname == this.state.Hostname  ) {
        return false
      }
      else {
        return true
      }
    }

    // loadScript = (PDPLoadScript) => {
    //     let Sctipt = document.createElement('script');
    //     Sctipt.type = "text/javascript";
    //     Sctipt.src = PDPLoadScript
    //     document.body.appendChild(Sctipt);
    // }
    
    render() {
        //    const ratingcss ="/static/css/turnTo.css";
        return( <div>
        {/* {<link href={ratingcss} rel='stylesheet' type='text/css' />} */}
       <div id="mobileTT-content"></div>
        </div>)
    }


}


export default withRouter(Turntomobile);
