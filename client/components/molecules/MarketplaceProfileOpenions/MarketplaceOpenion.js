//import './ProfileOpenions.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import {H3} from '../../atoms/HeadLines/Headlines';
import Ratings from '../../molecules/Ratings/Ratings';

export default (props) => {
    const ratingInfo = {
        ratingAvg: (props.ratting ) ||"0",
        ratingCount: (props.ratting ) || "0"
    };
return(
<React.Fragment>
    <article className="m-marketplace__opinionBlock">
            <Ratings ratingInfo={ratingInfo}/>
          {/*<div className="m-ratings">
             <ul>
                <li><i className="icon-star_large"></i></li>
                <li><i className="icon-star_large"></i></li>
                <li><i className="icon-star_large"></i></li>
                <li><i className="icon-star_large"></i></li>
                <li><i className="icon-star_border"></i></li>
            </ul>
         </div>*/}
        {/*<H3 className="a-marketplace__opinionTitle" headLineText="ME ENCANTÓ" />*/}
        <Paragraph className="a-marketplace__opinionBy">{props.openionby}</Paragraph>
        <Paragraph className="a-marketplace__userOpinion">{props.openion}</Paragraph>
    </article>
    </React.Fragment>
      );
  }