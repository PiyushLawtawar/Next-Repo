import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { CardPlp } from '../../molecules/Card/Card';
import Masonry from 'react-masonry-component';
// import './ListingProducts.styl';

const masonryOptions = {
    transitionDuration: 0,
    gutter: 8,
    horizontalOrder: true
  };
const imagesLoadedOptions = { background: '.my-bg-image-el' }

export default (props) => {
    
    const productListDetails = props.productListDetails || {};
    const productList = productListDetails.productList || {};
    const cardEvents = productListDetails.cardEvents;
    const limitedPiecesSkus = productListDetails.limitedPiecesSkus && productListDetails.limitedPiecesSkus || {};

    let childElements = () => {
        return (
            !isEmpty(productList) && map(productList, (item, i) => {
                return <CardPlp
                            key={i}
                            index={i}
                            cardDetails={item}
                            cardEvents={cardEvents}
                            staticLabels={productListDetails.staticLabels}
                            limitedPiecesSkus = {limitedPiecesSkus[item.productId[0]] || '' }
                            agentDetails={props.agentDetails}
                            flags={props.flags}
                            {...props}
                        />
            })
        )
    }

    return (
        <div className={"o-listing__products" + ( props.plpListView ? 'card-columns-plp card-columns-plp-masonry':'' )}>
            <Masonry
                className={'m-product__listingPlp'} // default ''
                elementType={'ul'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                imagesLoadedOptions={imagesLoadedOptions} 
            >
                {childElements()}
            </Masonry>
        </div>
    );
    
}