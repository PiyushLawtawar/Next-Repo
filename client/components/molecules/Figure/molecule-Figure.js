//import './Figure.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Figcaption from'../../atoms/Figcaption/Figcaption'
import Image from '../../atoms/Tagimage/Image';
import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';


export default (props) => {
const onImgError =(e) =>{
        const errImgElement= e.target;
        OnImgError(errImgElement, Path.onImgError);
  }

const { src,imageAlt, imageClassName, txt = '', figCaptionClass, figureClass, imageTitle = ''} = props.options || props;

return (
<figure className={figureClass}>
     <Image alt={imageAlt} className={imageClassName} title={imageTitle} src={src} onError={onImgError}/>
  {txt &&
    <Figcaption figcaptionClass={figCaptionClass} txt={txt}/>
  }
</figure>
);
}