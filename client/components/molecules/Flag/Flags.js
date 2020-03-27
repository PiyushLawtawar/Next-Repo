import Span from '../../atoms/Span/Span';

//import './Flag.styl'


export default (props) => {

    return (
            <div className="m-flag">
                <div className={props.flagitemclass}><Span>{props.flagtext}</Span>
                </div>
            </div>


    );
}