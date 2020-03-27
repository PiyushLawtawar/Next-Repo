/*include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Icons/atom-icon.pug
include ../MixinMolecules/mixin-molecules.pug*/


//import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';

//import './Flag.styl'


export default (props) => {

    return (
            <div className="m-flag">
                <div className={props.flagitemclass}><Span>{props.spanText}</Span>
                </div>
                <div className={props.flagitemclass}><Span>{props.flagtext}</Span>
                </div>
            </div>


    );
}