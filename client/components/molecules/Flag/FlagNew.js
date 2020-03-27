import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Span from '../../atoms/Span/Span';
import Icons from '../../atoms/Icons/Icons';

//import './Flag.styl'

export default (props) => {
    const { options } = props;

    return (
        !isEmpty(options) && map(options, (item, index) => {
            return <div key={index} className={"m-flag " + item.wrapClass}>
                       {!isEmpty(item.flagType) && item.flagType === "default" &&
                            <div className={"m-flag-item -defaultFlag " + item.flagClass}>
                                <Span>{item.flagText}</Span>
                            </div>
                        }
                        {!isEmpty(item.flagType) && item.flagType === "notAvailable" &&
                            <div className={"m-flag-item -primaryFlag -notAvailable " + item.flagClass}>
                                <Span>{item.flagText}</Span>
                            </div>
                        }
                        {!isEmpty(item.flagType) && item.flagType === "mesaRegalos" &&
                            <div className={"m-flag-item -primaryFlag -mesa " + item.flagClass}>
                                <Span>{item.flagText}</Span>
                                <Icons className={item.iconClass}/>
                            </div>
                        }
                    </div>
        })
    );
}