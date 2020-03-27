//import './loader.styl'
import { getAssetsPath } from '../../../helpers/utilities/utility';

export default ({ className, ...props }) => {

  let URL = props.domainNameURL || '';
  if(URL ==='' && typeof window !=='undefined' ){
    URL = window && window.location && window.location.hostname && window.location.hostname.toLowerCase() || "";
  }
  //console.log("atommmmmmmmmmmmmmm",URL)
  let  AssetsPath = getAssetsPath(undefined, URL,process)  
  let loaderimag = AssetsPath + '/static/images/loading/liverpool/main-loader80.svg';
  // console.log("URL===",URL)
  switch (true && URL != '') {
    case URL.indexOf('williams-sonoma.com.mx') >= 0:
      loaderimag =  AssetsPath + '/static/images/loading/wsonoma/main-loader80.svg';
      break;
    case URL.indexOf('potterybarn.com.mx') >= 0:
      loaderimag =  AssetsPath + '/static/images/loading/pb/main-loader80.svg';
      break;
    case URL.indexOf('potterybarnkids.com.mx') >= 0:
      loaderimag =  AssetsPath + '/static/images/loading/pbkids/main-loader80.svg';
      break;
    case URL.indexOf('pbteen.com.mx') >= 0:
      loaderimag =  AssetsPath + '/static/images/loading/pbteen/main-loader80.svg';
      break;
    case URL.indexOf('westelm.com.mx') >= 0:
      loaderimag =  AssetsPath + '/static/images/loading/westelm/main-loader80.svg';
      break;
    default:
      loaderimag =  AssetsPath + '/static/images/loading/liverpool/main-loader80.svg';
  }
  //console.log("loaderimag===",loaderimag)
  return (
    <div className="loading" style={{ 'display': 'none' }} >
      <div className="loader">
        <img src={loaderimag} alt="Loader" className="mainLoader" />
      </div>
    </div>
  );
}
//// class name should be passed as loader

