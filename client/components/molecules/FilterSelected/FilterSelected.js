import Icons from '../../atoms/Icons/Icons';
//import './FilterSelected.styl';

export default (props) => (
    <div className="mdc-chip-set" tabIndex="0" onClick={props.handleButton.bind(this, props.item)}> 
        <div className="mdc-chip a-plp__filterSelection">
            <div className="mdc-chip__text">{props.item.label} <Icons className="icon-close"/>
            </div>
        </div>
    </div>
)