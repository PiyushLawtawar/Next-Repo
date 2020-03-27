/*include ../../atoms/Paragraph/atom-paragraph
include ../../atoms/Icons/atom-icon

.m-marketplace__sendMessage
  +atom-icon('icon-freeshiping')
  +atom-paragraph('ENVÍO GRATIS','a-marketplace__deliverTitle')*/

import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';

export default (props) => {
  const freeShipping = props.marketPlaceData && props.marketPlaceData.freeShipping ?  props.marketPlaceData.freeShipping:false
  const staticArray = props.staticArray && props.staticArray? props.staticArray:{};
  const freeshippinglabel =  staticArray['mirakl.freeshipping'] || 'mirakl.freeshipping';
  if (freeShipping == true) {
    return (
      <div className="m-marketplace__sendMessage">
        <Icons className="icon-freeshiping" />
        <Paragraph className="a-marketplace__deliverTitle">{freeshippinglabel}</Paragraph>
      </div>
    );
  } else {
    return null;
  }
}

