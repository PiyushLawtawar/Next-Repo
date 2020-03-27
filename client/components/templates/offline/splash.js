//import './splash.styl'
import Span from "../../atoms/Span/Span";
import Image from "../../atoms/Tagimage/Image";
export default (props) =>{
return(
<div className="splash__container">
      <div className="splash__logo">
          <Image src="https://assets.liverpool.com.mx/assets/images/logos/liverpool-logo.svg" alt="Liverpool Logo" />
     </div>
      <div className="splash__content">
        <div className="splash__content__title">
            <Span>Algo salió mal</Span>
        </div>
        <div className="splash__content__subtitle">
            <Span>Por favor comprueba tu conexión a internet</Span>
        </div>
      </div>
    </div>
);
}

