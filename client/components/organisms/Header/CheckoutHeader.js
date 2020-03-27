
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Label from '../../atoms/Label/Label';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import {ParagraphAnchor,Anchorimage} from '../../molecules/MixinMolecules/MixinMolecules';
import { getAssetsPath } from '../../../helpers/utilities/utility';

//import './Header.styl'
export default (props) => {
    let  AssetsPath = '';
	if (typeof window !== 'undefined') {
		AssetsPath = getAssetsPath(window,undefined);  
	}
    return(
        <React.Fragment>
            <div className="a-overlay overlay d-lg-none"></div>
            <div className="o-header">
                <div className="o-container__fluid container-fluid">
                    <div className="o-row row pt-2 pb-0 pb-lg-3 align-items-center">
                        <div className="o-col col-lg-2 col text-center pb-2 pb-lg-0">
                            <Link className="m-menuBack d-lg-none d-block" href="">
                              <Icons className="icon-back a-menuBack__icon" />
                            </Link>
                            <Link href="#">
                             <Anchorimage href="/tienda/home" headerlogo="a-header__logo" src = {AssetsPath + "/static/images/atomo-icono-liverpool-regular-desktop.svg"} />
                            </Link>
                        </div>
                        <div className="o-col col-lg-8 col-12 text-center p-0 -bgWhite">
                            <div className="o-row row align-items-center justify-content-center no-gutters">
                                <div className="o-col col-lg-3 col-4">
                                    <Link className="o-checkoutSteps" href="#">
                                      <Label className="a-checkoutSteps__text">Entrega</Label>
                                      <div className="progress m-checkoutSteps">
                                          <div className="a-checkoutSteps__bar progress-bar -progressColor" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                          </div>
                                      </div>
                                    </Link>
                                </div>
                                <div className="o-col col-lg-3 col-4">
                                    <Link className="o-checkoutSteps" href="#">
                                      <Label className="a-checkoutSteps__text -disabled d-inline-block d-md-none">Pago</Label>
                                      <Label className="a-checkoutSteps__text -disabled d-none d-md-inline-block">Forma de pago</Label>
                                      <div className="progress m-checkoutSteps -disabled">
                                          <div className="a-checkoutSteps__bar progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                      </div>
                                    </Link>
                                </div>
                                <div className="o-col col-lg-3 col-4">
                                    <Link className="o-checkoutSteps" href="#">
                                      <Label className="a-checkoutSteps__text -disabled">Promociones</Label>
                                      <div className="progress m-checkoutSteps -disabled">
                                          <div className="a-checkoutSteps__bar progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                      </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="o-col col-lg-2 d-lg-block d-none">
                            <Link className="m-checkoutHelp" href="">
                              <Label className="a-checkoutHelp__text">Ayuda</Label>
                              <Icons className="icon-help a-checkoutHelp__icon" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
  
        </React.Fragment>
    );
}