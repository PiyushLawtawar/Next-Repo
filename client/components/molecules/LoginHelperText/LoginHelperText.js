import Span from "../../atoms/Span/Span";
import Icons from "../../atoms/Icons/Icons";

export default (props) => {
  
return (
<Span className="a-login-anchor--helperText d-flex align-items-center justify-content-start" id="helperTextPopover" data-toggle="popover" data-trigger="click hover focus" data-placement="top" data-delay="150" data-content="Para mantener tu cuenta segura, usa esta opción sólo en tus dispositivos personales." data-container="#loginDetails" title=" ">Detalles
    <Icons className="a-login--iconHelper ml-1" />
</Span>

);
}