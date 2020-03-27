
// import './Header.styl'
// import './Header.styl';
import Link from '../../atoms/Link/Link';
import Image from '../../atoms/Tagimage/Image';

export default (props) => {
    //console.log("props.headerData", props);
let headerLogo= props.headerData.headerContent[0].headerLogo[0] || {};
//console.log('..headerDetails..',headerDetails);
return(
<header>
       <div className="o-header reduced d-flex align-items-center">
        <div className="o-container__fluid container-fluid">
          <div className="o-container container p-0">
            <div className="o-row row pb-0 pb-lg-2 align-items-center">
              <div className="o-col col-lg-2 col text-center pb-lg-0">                   
                    <Link href={headerLogo.url}>
                      <Image className="a-header__logo" src={headerLogo.imgUrl} alt={headerLogo.Logo} />
                    </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
);
}
