import Input from '../../atoms/Input/Input';
import Label from '../../atoms/Label/Label';
import { MAX_STAR_COUNT } from '../../../../client/config/constants';

export default (props) => {
    const maxStarCount = MAX_STAR_COUNT;
    const { ratingAvg, ratingCount } = props.ratingInfo || props;
    const valuesss = props.value;

    let starList = [];

    for (let i = 1; i <= maxStarCount; i++) {

        let starClass = "", checked = false, value = '', htmlFor = '';
        if (i < ratingAvg && ((i + 1) > ratingAvg)) {
            htmlFor = "star" + valuesss + "half0" + i
            starClass = "half";
            value = i + " and a half";
        } else if (i <= ratingAvg) {
            starClass = "full";
            htmlFor = "star" + valuesss + i;
            value = i;
            checked = true;
        }

        starList.push(
            <React.Fragment>
                <Input type="radio" id={htmlFor + value} name="rating" value={value} checked={checked} />
                <label className={starClass} htmlFor={htmlFor} />
            </React.Fragment>);
    }
    return (

        <fieldset className={`rating ${props.classname}`}>

            {props.orderTracking ?
                <React.Fragment>
                    <Input type="radio" id="star50" name="rating" value="5" />
                    <Label className="full" htmlFor="star50" onClick={() => props.handleClick('5')}>
                    </Label>
                    <Input type="radio" id="star40" name="rating" value="4" />
                    <Label className="full" htmlFor="star40" onClick={() => props.handleClick('4')}>
                    </Label>
                    <Input type="radio" id="star30" name="rating" value="3" />
                    <Label className="full" htmlFor="star30" onClick={() => props.handleClick('3')}>
                    </Label>
                    <Input type="radio" id="star20" name="rating" value="2" />
                    <Label className="full" htmlFor="star20" onClick={() => props.handleClick('2')}>
                    </Label>
                    <Input type="radio" id="star10" name="rating" value="1" />
                    <Label className="full" htmlFor="star10" onClick={() => props.handleClick('1')}>
                    </Label>
                </React.Fragment> : starList}
        </fieldset>

    )
}
