import get from 'lodash/get';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import {Anchorimage} from '../../molecules/MixinMolecules/MixinMolecules';
export default (props) => {

    const { headerData } = props;
    const headerLogo = get(headerData, 'headerLogo', '');
   
    return(
        <React.Fragment>
            <div className="o-header">
                <div className="o-container__fluid container-fluid">
                    <div className="o-row row pt-2 pb-0 pb-lg-3 align-items-center">
                        <div className="o-col col-lg-2 col text-center pb-2 pb-lg-0">
                            <Link className="m-menuBack d-lg-none d-block" href="/tienda/login" >
                              <Icons className="icon-back a-menuBack__icon" />
                            </Link>
                            <Link href="#">
                             <Anchorimage href="/tienda/home" headerlogo="a-header__logo" src={headerLogo && headerLogo[0] && headerLogo[0].imgUrl ? headerLogo[0].imgUrl : ""} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
  
        </React.Fragment>
    );
}