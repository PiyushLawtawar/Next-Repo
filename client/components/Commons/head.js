/*import './Common.styl';

import Image from '../atoms/Image/Image';
import Link from '../atoms/Link/Link';
import Label from '../atoms/Label/Label';
import Icons from '../atoms/Icons/Icons';
import Button from '../atoms/Button/Button';
import Span from '../atoms/Span/Span';
import Strong from '../atoms/Strong/Strong';




export const Anchorimage = (props) => {
   
    return (
           <Link href="#">
            <Image className={props.headerlogo} src={props.src} />
           </Link>
    );
}


export const Buttonicon = (props) => {
   
    return (
        <Button className={props.classButton} {...props}>
                        <Icons className={props.classIcon} />
        </Button>
    );
}




export const Spanicon = (props) => {
   
    return (

<Span className={props.spanClassname}>{props.dropdowntext}
    <Icons className={props.downarrow} />
</Span>

    );
}



export const ButtonSpanIcon = (props) => {
   
    return (
          <Button className={props.btnclass}><Span>{props.spanText}</Span><Icons className={props.bagclass} /></Button>
    );
}





export const AnchorSpan = (props) => {
   
    return (
          <Link className={props.typeaheadclass} href="#">Buscar en <Span>{props.spanText}</Span></Link>
    );
}







export const AnchorStrongLabel = (props) => {
   
    return (
          <Link className={props.typeaheadclass} href="#"><Strong>{props.strongText} </Strong><Label>{props.text}</Label></Link>
    );
}



export const AnchorLabelStrong = (props) => {
   
    return (
          <Link className={props.typeaheadclass} href="#"><Label>{props.text} </Label><Strong> {props.strongText}</Strong></Link>
    );
}



export const AnchorStrongLabelSpan = (props) => {
   
    return (
          <Link className={props.typeaheadclass} href="#"><Strong>{props.strongText} </Strong><Label>{props.text} </Label><Span> {props.spanText}</Span></Link>
    );
}

*/