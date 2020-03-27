import Ul from '../../atoms/Ul/Ul'
import List from '../../atoms/List/List'
import RatingsElement from '../../molecules/RatingsElement/RatingsElement'
import { MAX_STAR_COUNT } from '../../../../client/config/constants';
import isEmpty from 'lodash/isEmpty';


//import './Ratings.styl';

export default (props) => {
    const maxStarCount = MAX_STAR_COUNT;
    let { ratingAvg, ratingCount } = props.ratingInfo;
    let classname = props.classname || ''
    let opiniones = props.opiniones || ''
    const parsedRating = Number(parseInt(ratingAvg));
    ratingAvg = Number(ratingAvg);
    let starList = [];
    const { showZeroRating } = props;

    for (let i = 1; i <= maxStarCount; i++) {

        let starClass = "";
        if (ratingAvg == 0) {
            starClass = "icon-star_border";
        } else if (i <= ratingAvg) {
            starClass = "icon-star_large";
        } else if (ratingAvg > i - 1 && ratingAvg < i) {            
            if(ratingAvg > (parsedRating + 0.2) && ratingAvg < (parsedRating + 0.8)) {
                starClass = "icon-star_half";
            } else if(ratingAvg <= (parsedRating + 0.2)) {
                starClass = "icon-star_border";
            } else {
                starClass = "icon-star_large";
            }           
        } else if (i > ratingAvg) {
            starClass = "icon-star_border";
        }

        starList.push(<RatingsElement key={i} classNameIcon={starClass} />);
    }

    if (showZeroRating) {
        if (ratingCount > 0) {
            return (
                <div className={`m-ratings ${classname} ${!isEmpty(props.swatchColors) ? '' : 'marginTop-8'}`}>
                    <Ul>
                        {starList}
                        {(!props.collectionRatings && !props.SellerRatings )  && 
                            <List key={MAX_STAR_COUNT + 1} className="ratings-number aaa"> ({ratingCount})</List>
                        }
                        {props.collectionRatings === true &&
                            <List key={MAX_STAR_COUNT + 1} className="rating__comments collections">
                                ({opiniones ? (ratingCount + ' ' + opiniones) : ratingCount})
                            </List>
                        }
                        {props.SellerRatings === true && 
                        <List key={MAX_STAR_COUNT + 1} className="rating__comments"> </List>
                        }
                    </Ul>
                </div>
            )
        } else {
            return null
        }
    } else {
        if (ratingCount >= 0) {
            return (
                <div className={`m-ratings ${classname}`}>
                    <Ul>
                        {starList}
                        {(!props.collectionRatings && !props.SellerRatings ) && 
                            <List key={MAX_STAR_COUNT + 1} className="ratings-number"> ({ratingCount})</List>
                        }
                        {props.collectionRatings === true &&
                            <List key={MAX_STAR_COUNT + 1} className="rating__comments collections">
                                ({opiniones ? (ratingCount + ' ' + opiniones) : ratingCount})
                        </List>
                        }
                        {props.SellerRatings === true && 
                        <List key={MAX_STAR_COUNT + 1} className="rating__comment"> </List>
                        }
                    </Ul>
                </div>
            )
        } else {
            return null
        }
    }
}