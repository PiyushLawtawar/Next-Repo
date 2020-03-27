
//import './ErrorContainer.styl';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import { getAssetsPath } from '../../../helpers/utilities/utility';

export default (props) => {
  let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
    const path = getAssetsPath(window,undefined); 
    AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	}
return(
  <div className="o-errorPageContainer--noJavascript">
                <div className="a-errorPage-logoContainer d-none d-lg-block">
                    <Image className="a-errorPage-imageContainer_brandLogo" src={AssetsPath + "/static/images/atomo-icono-liverpool-regular-rosa-desktop.svg"} alt="Liverpool" />
                </div>
                 <H1 headLineClass="a-errorPage-title--noJavascript" headLineText="Tu navegador no es compatible" />
                 <Paragraph className="a-errorPage-paragraph--noJavascript">Parece que Javascript se encuentra inhabilitado en tu navegador, debes habilitarlo y reiniciar tu navegador para poder disfrutar de  todas las funcionalidades del sitio
                </Paragraph>
</div>
);
}