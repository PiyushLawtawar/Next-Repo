import Button from '../../atoms/Button/Button';
import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons'
//import './FilterTrigger.styl';

export default ({ handleArrowIcon, ...props }) => (
    <div className="a-plp__btnFilter">
        <Button className="a-title__filter" {...props}>
            <h3 className="m-0">
                <div className="row">
                    <div className="col">
                        <Label>{props.text}</Label>
                    </div>
                    <div className="col-auto">
                        <div className={handleArrowIcon ? 'a-icon__filter' : 'a-icon__filter down'}><Icons className="icon-arrow_up" />
                        </div>
                    </div>
                </div>
            </h3>
        </Button>
    </div>
)