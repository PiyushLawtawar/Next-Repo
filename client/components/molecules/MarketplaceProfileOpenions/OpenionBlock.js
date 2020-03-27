//import './ProfileOpenions.styl'
import Span from '../../atoms/Span/Span'
import { MAX_STAR_COUNT } from '../../../../client/config/constants';

import map from 'lodash/map';

export default (props) => {


    // let starList = [];
    // const maxStarCount = MAX_STAR_COUNT;
    // let active = '';
    // for (let i = 1; i <= maxStarCount; i++) {

    //     // let active = 'a-marketplace__ratingsLevel';
    //     if (i == props.text) {
    //         for (let j = 0; j <= props.text; i++) {
    //             active = 'a-marketplace__ratingsLevel active'
    //         }

    //     }
    //     starList.push(active);
    // }
    let starList = [];
    var maxStarCount = MAX_STAR_COUNT;
    var value = 5

    var i;
    if (props.text == 0) {
        starList = ['a-marketplace__ratingsLevel', 'a-marketplace__ratingsLevel', 'a-marketplace__ratingsLevel', 'a-marketplace__ratingsLevel', 'a-marketplace__ratingsLevel']
    } else {
        for (i = 1; i <= maxStarCount; i++) {
            if (i == props.text) {
                let text = "";
                for (var j = 1; j <= props.text; j++) {
                    starList.push('a-marketplace__ratingsLevel active')
                }
                for (var k = props.text; k < maxStarCount; k++) {
                    starList.push('a-marketplace__ratingsLevel ')
                }
                break;
            }
        }
    }
    return (
        <React.Fragment>
            <div className="row align-items-center">
                <div className="col-4 pr-0">
                    <Span spanClassname="a-marketplace__ratingsTitle">{props.spanText}</Span>
                </div>
                <div className="col-6 p-0 pt-1">
                    <div className="row">
                        {
                            map(starList, (item, key) => {
                                return (
                                    <div className="col pl-0 pr-1"><Span spanClassname={item}></Span></div>
                                )
                            })
                        }
                    </div>

                </div>
                <div className="col-2 text-right">
                    <Span spanClassname="a-marketplace__ratingsNumber">{props.text}</Span>
                </div>
            </div>
        </React.Fragment>
    );
}

