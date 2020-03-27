/*include ../../atoms/Icons/atom-icon.pug
include ../../atoms/Anchor/atom-anchor.pug

.m-back__button
  +atom-anchor('Volver','#','a-back__button','right')
    +atom-icon('icon-arrow_left')*/


import Icons from '../../atoms/Icons/Icons';
import Link from '../../atoms/Link/Link';
import Router from 'next/router';

export default (props) =>{
  const staticArray = props.pageSpecificStaticLabels && props.pageSpecificStaticLabels.staticLabelValues? props.pageSpecificStaticLabels.staticLabelValues[0].keyValues:props.pageSpecificStaticLabels;
    return(
      <div className="m-back__button" onClick={() => Router.back()}>
          <Link className="a-back__button" href="#">
              <Icons className="icon-arrow_left">
              </Icons>
                {staticArray['mirakl.redirect.seller.label']}
         </Link>
      </div>
    );
}