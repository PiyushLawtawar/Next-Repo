//import './Figure.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Figcaption from'../../atoms/Figcaption/Figcaption'
import Image from '../../atoms/Tagimage/Image';
import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Lazy from '../../../helpers/lazyload/lazyload';

export default (props) => {
  const onImgError =(e) =>{
          const errImgElement= e.target;
          OnImgError(errImgElement, Path.onImgError);
    }
  const { src,imageAlt, imageClassName, txt = '', figCaptionClass, imageTitle = '', fromPDP = false  } = props.options || props;

  let nonClickable = 'false';
  if(imageClassName && JSON.stringify(imageClassName).indexOf("###nonClickable") >-1){
    nonClickable = 'true';
    const nameArray = imageClassName.slice("###");
    imageClassName = nameArray[0];
  // console.log("imageClassName = "+imageClassName)
  }
  let figureClass = '';
  if( imageClassName === "cursurDef m-imageProductMyBag m-imageProductMyBag--isntAvailable" ) {
    figureClass = "cursurDef m-imageProductMyBag m-imageProductMyBag--isntAvailable";
  } else {
    figureClass = "m-imageProductMyBag";
  }

  if(fromPDP) {
    figureClass = figureClass + ' m-figure ';
  }

  return (
  <figure className={figureClass} >
    {txt &&
      <Figcaption figcaptionClass={figCaptionClass} txt={txt}/>
    }
    <Lazy height={props.height}>
    <Image alt={imageAlt} className={imageClassName} title={imageTitle} src={src} onError={onImgError} nonclickable ={nonClickable}/>
    </Lazy>
  </figure>
  );
}