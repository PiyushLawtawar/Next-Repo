import Figure from '../Figure/Figure';
import Stars from '../Stars/molecule-stars';
import Quantity from '../ProductQty/molecule-product-qty';
import Ul from '../../atoms/Ul/Ul';	
import Button from '../../atoms/Button/Button';
import {Menumotion} from '../MenuMotion/molecule-menu-motion';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';



 export default (props) => {
     let data = props.data;
    return( 
  <React.Fragment>
          {
               !isEmpty(data.cartsList) && map(data.cartsList, (cartItem, index) => {
                   if(cartItem && cartItem.commerceItemClassType === "giftRegistryCommerceItem"){
                     return(
                        <div className="o-myBag o-myBag--giftTable">
                            <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                <div className="o-myBag__image">
                                    {
                                        (cartItem && cartItem.productImageURL)?
                                            <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                        :
                                            <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                    }
                                </div>
                                <div className="o-myBag__description">
                                    <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>
                                    <Stars classFieldset='rating' value={cartItem.averageRating}/>
                                    <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>
                                    {
                                        (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                            <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                        : null
                                    }
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Número de evento: {cartItem.giftRegistryEventNumber}</p>
                                    <div className="m-latestinlineElement m-latestinlineElement--triple">
                                        {
                                            (cartItem.isGRConversionEligible === false)?
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct -gift" data-toggle="modal" data-target="#dontGift-modal">{cartItem.isGRConversionMessage}</Button>
                                            : null

                                        }
                                        <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                        </Button>
                                    </div>
                                </div>
                        </div>
                        <div className="o-myBag__column" name="columnPrice">
                                    {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                            <div className="o-myBag__column--priceContainer">
                                    <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                            </div>
                        </div>
                        <div className="o-myBag__column" name="columnQuantity">
                            <div className="m-product">
                                    <Quantity quantity={cartItem.quantity}/>
                            </div>
                        </div>
                        <div className="o-myBag__column" name="columnTotal">
                            <div className="o-myBag__column--priceContainer">
                                    <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.ProductTotalPrice}<sup className="-decimal">00</sup></p>
                            </div>
                        </div>

                        <div className="o-myBag__giftTableDetails">
                            <div className="m-giftTableDetails">
                                    <p className="a-inlineElement a-inlineElement--giftTableType">{cartItem.eventType}</p>
                                    <p className="a-inlineElement a-inlineElement--giftTableName">Victoria Margarita Carolina Lopez</p>
                                    <p className="a-inlineElement a-inlineElement--giftTableMessage">¡Muchas felicidades! ipsum dolor sit amet, consectetur adipiscing elit. Praesent porta at lorem sed ullamcorper. Nulla facilisi. Disfruta tu regalo y pásala incréible.</p><a className="a-inlineElement a-inlineElement--giftTableActions " href="#">Editar mensaje</a><a className="a-inlineElement a-inlineElement--giftTableActions " href="#">Nueva búsqueda</a>
                            </div>
                        </div>

                        <div className="o-myBag__motionMenu">
                            <Menumotion/>
                        </div>
                   </div>
                     )

               }else if(cartItem && cartItem.isBundle === true){
                 return(
                    <div className="o-myBag o-myBag--bundle">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src="https://via.placeholder.com/336x292?text=Place+Image+Here"/>
                                    </div>
                                    <div className="o-myBag__description">
                                            <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>
                                            <Stars classFieldset='rating' id="star50" type="radio" value={cartItem.averageRating}/>
                                            <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                            <p className="a-inlineElement">Código de producto: {cartItem.productId}</p>
                                            <p className="a-inlineElement -marginSeparatorTop">Contenido: </p>

                                            <Ul className="m-listBundle">
                                                {
                                                    !isEmpty(cartItem.relatedProducts) && map(cartItem.relatedProducts, (bundleItem, index) => {
                                                       return( 
                                                         <li className="m-listBundle__item">
                                                            <p className="a-inlineElement a-inlineElement--enphasis">{bundleItem.childSkuDisplayName}</p>
                                                            <p className="a-inlineElement">Código de producto: {bundleItem.childSkuId}</p>
                                                        </li>
                                                        )
                                                    })
                                                }
                                            </Ul>

                                            <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                            <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                            <div className="m-latestinlineElement m-latestinlineElement--triple">
                                                {
                                                    (cartItem.isGRConversionEligible === false)?
                                                       <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">{cartItem.isGRConversionMessage}</Button>
                                                    : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>

                                                }
                                                {
                                                    (cartItem.isItemAvilableInWishlist === 'false')?
                                                        <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                        </Button>
                                                    : <span className="savedItem">Saved Article</span>
                                                }
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                </Button>
                                            </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                    {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>
                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total -enphasisDecimal">$ {cartItem.ProductTotalPrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                        <Menumotion/>
                                </div>
                    </div>  ) 
             

               }else if(cartItem && (cartItem.productType === "Soft Line" || cartItem.productType === "Digital")){
                    return (
                        <div className="o-myBag o-myBag--mkp">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        {
                                            (cartItem && cartItem.productImageURL)?
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                            :
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                        }
                                                
                                    </div>
                                    <div className="o-myBag__description">
                                        <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>

                                        <Stars classFieldset='rating' id="star50" type="radio" value={cartItem.averageRating}/>

                                        <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                    <p className="a-blockElement">
                                        <label className="a-inlineElement a-inlineElement--default">Preventa</label>
                                    </p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>
                                        {
                                            (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                              <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                            : null
                                        }
                                    
                                        <p className="a-inlineElement a-inlineElement--seller">Vendido por Seller 1</p>
                                        <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                        <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                        
                                        <div className="m-latestinlineElement m-latestinlineElement--triple">
                                            {
                                                (cartItem.isGRConversionEligible === false)?
                                                   <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">{cartItem.isGRConversionMessage}</Button>
                                                : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>
                                            }
                                            {
                                                (cartItem.isItemAvilableInWishlist === 'false')?
                                                    <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                    </Button>
                                                : <span className="savedItem">Saved Article</span>
                                            }
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                    {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                            <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                <Menumotion/>
                                </div>
                    </div>
                    )
               }else if(cartItem && cartItem.productType === "Big Ticket"){

                     return (
                         <div className="o-myBag o-myBag--bigTicket">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        {
                                            (cartItem && cartItem.productImageURL)?
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                            :
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                        }
    
                                    </div>
                                    <div className="o-myBag__description">
                                            <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>

                                            <Stars classFieldset='rating' id="star50" type="radio" value="5"/>

                                            <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                            <p className="a-blockElement">
                                                <label className="a-inlineElement a-inlineElement--default">Pedido especial</label>
                                        </p>
                                            <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                                <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                                <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>
                                                {
                                                    (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                                    : null
                                                }
                                                
                                                <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                                <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                            <div className="m-latestinlineElement m-latestinlineElement--triple">
                                                    {
                                                        (cartItem.isGRConversionEligible === false)?
                                                        <Button className="a-inlineElement a-inlineElement--eventsProduct -gift" data-toggle="modal" data-target="#buytoGiftTable-modal">{cartItem.isGRConversionMessage}</Button>
                                                        : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>

                                                    }
                                                    {
                                                        (cartItem.isItemAvilableInWishlist === 'false')?
                                                            <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                            </Button>
                                                        : <span className="savedItem">Saved Article</span>
                                                    }
                                                    <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                    </Button>
                                            </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                   {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    <div className="o-myBag__column--priceContainer">
                                            <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>

                                     

                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                    <Menumotion/>
                                </div>
                    </div>
                     )
               }
})
         }
</React.Fragment>
  )
}

















































































import Figure from '../Figure/Figure';
import Stars from '../Stars/molecule-stars';
import Quantity from '../ProductQty/molecule-product-qty';
import Ul from '../../atoms/Ul/Ul';	
import Button from '../../atoms/Button/Button';
import Menumotion from '../MenuMotion/molecule-menu-motion';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';



 export default (props) => {
     let data = props.data;
    return( 
       <React.Fragment>
          {
               !isEmpty(data.cartsList) && map(data.cartsList, (cartItem, index) => {
                     return(
                        <div className="o-myBag o-myBag--giftTable">
                            <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                <div className="o-myBag__image">
                                    {
                                        (cartItem && cartItem.productImageURL)?
                                            <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                        :
                                            <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                    }
                                </div>
                                <div className="o-myBag__description">
                                    <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>
                                    <Stars classFieldset='rating' value={cartItem.averageRating}/>
                                    <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>

                                    {
                                        (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                            <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                        : null
                                    }
                                    {
                                        (cartItem.commerceItemClassType === 'giftRegistryCommerceItem')?
                                            <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Número de evento: {cartItem.giftRegistryEventNumber}</p>
                                        :
                                        null
                                    }

                                    {
                                        (cartItem && cartItem.isBundle === true)?
                                        <React.Fragment>
                                            <p className="a-inlineElement -marginSeparatorTop">Contenido: </p>

                                                <Ul className="m-listBundle">
                                                    {
                                                        !isEmpty(cartItem.relatedProducts) && map(cartItem.relatedProducts, (bundleItem, index) => {
                                                          return( 
                                                            <li className="m-listBundle__item">
                                                                <p className="a-inlineElement a-inlineElement--enphasis">{bundleItem.childSkuDisplayName}</p>
                                                                <p className="a-inlineElement">Código de producto: {bundleItem.childSkuId}</p>
                                                            </li>
                                                            )
                                                        })
                                                    }
                                                </Ul>
                                            </React.Fragment>
                                        : null

                                    }

                                    {
                                        (cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'electronicCommerceItem')?
                                        <React.Fragment>
                                            <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                            <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                        </React.Fragment>
                                        :
                                        (cartItem.commerceItemClassType === 'electronicCommerceItem')?
                                         <React.Fragment>
                                            <p className="a-inlineElement a-inlineElement--fEstimadaTitle"></p>
                                            <p className="a-inlineElement -greenText">Digital download</p>
                                         </React.Fragment>
                                        :
                                        null
                                    }

                                    
                                    <div className="m-latestinlineElement m-latestinlineElement--triple">
                                        {
                                            (cartItem.isGRConversionEligible === false)?
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct -gift" data-toggle="modal" data-target="#dontGift-modal">{cartItem.isGRConversionMessage}</Button>
                                            : 
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>

                                        }
                                        <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                        </Button>
                                    </div>
                                </div>
                        </div>
                        <div className="o-myBag__column" name="columnPrice">
                            {
                                (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                : null

                            }
                            <div className="o-myBag__column--priceContainer">
                                    <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                            </div>
                        </div>
                        <div className="o-myBag__column" name="columnQuantity">
                            <div className="m-product">
                                    <Quantity quantity={cartItem.quantity}/>
                            </div>
                        </div>
                        <div className="o-myBag__column" name="columnTotal">
                            <div className="o-myBag__column--priceContainer">
                                    <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.ProductTotalPrice}<sup className="-decimal">00</sup></p>
                            </div>
                        </div>
                         {
                             (cartItem.commerceItemClassType === 'giftRegistryCommerceItem')?
                                <div className="o-myBag__giftTableDetails">
                                    <div className="m-giftTableDetails">
                                            <p className="a-inlineElement a-inlineElement--giftTableType">{cartItem.eventType}</p>
                                            <p className="a-inlineElement a-inlineElement--giftTableName">Victoria Margarita Carolina Lopez</p>
                                            <p className="a-inlineElement a-inlineElement--giftTableMessage">¡Muchas felicidades! ipsum dolor sit amet, consectetur adipiscing elit. Praesent porta at lorem sed ullamcorper. Nulla facilisi. Disfruta tu regalo y pásala incréible.</p><a className="a-inlineElement a-inlineElement--giftTableActions " href="#">Editar mensaje</a><a className="a-inlineElement a-inlineElement--giftTableActions " href="#">Nueva búsqueda</a>
                                    </div>
                                </div>
                             :
                             null
                         }
                        
                        <div className="o-myBag__motionMenu">
                            <Menumotion/>
                        </div>
                   </div>
                     )
{/*
             if(cartItem && cartItem.isBundle === true){
                 return(
                    <div className="o-myBag o-myBag--bundle">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src="https://via.placeholder.com/336x292?text=Place+Image+Here"/>
                                    </div>
                                    <div className="o-myBag__description">
                                            <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>
                                            <Stars classFieldset='rating' id="star50" type="radio" value={cartItem.averageRating}/>
                                            <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                            <p className="a-inlineElement">Código de producto: {cartItem.productId}</p>
                                            
                                            <p className="a-inlineElement -marginSeparatorTop">Contenido: </p>

                                            <Ul className="m-listBundle">
                                                {
                                                    !isEmpty(cartItem.relatedProducts) && map(cartItem.relatedProducts, (bundleItem, index) => {
                                                       return( 
                                                         <li className="m-listBundle__item">
                                                            <p className="a-inlineElement a-inlineElement--enphasis">{bundleItem.childSkuDisplayName}</p>
                                                            <p className="a-inlineElement">Código de producto: {bundleItem.childSkuId}</p>
                                                        </li>
                                                        )
                                                    })
                                                }
                                            </Ul>

                                            <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                            <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                            <div className="m-latestinlineElement m-latestinlineElement--triple">
                                                {
                                                    (cartItem.isGRConversionEligible === false)?
                                                       <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">{cartItem.isGRConversionMessage}</Button>
                                                    : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>

                                                }
                                                {
                                                    (cartItem.isItemAvilableInWishlist === 'false')?
                                                        <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                        </Button>
                                                    : <span className="savedItem">Saved Article</span>
                                                }
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                </Button>
                                            </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                    {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>
                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total -enphasisDecimal">$ {cartItem.ProductTotalPrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                        <Menumotion/>
                                </div>
                    </div>  ) 
             

               }else if(cartItem && (cartItem.productType === "Soft Line" || cartItem.productType === "Digital")){
                    return (
                        <div className="o-myBag o-myBag--mkp">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        {
                                            (cartItem && cartItem.productImageURL)?
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                            :
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                        }
                                                
                                    </div>
                                    <div className="o-myBag__description">
                                        <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>

                                        <Stars classFieldset='rating' id="star50" type="radio" value={cartItem.averageRating}/>

                                        <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                    <p className="a-blockElement">
                                        <label className="a-inlineElement a-inlineElement--default">Preventa</label>
                                    </p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                        <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>
                                        {
                                            (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                              <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                            : null
                                        }
                                    
                                        <p className="a-inlineElement a-inlineElement--seller">Vendido por Seller 1</p>
                                        <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                        <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                        
                                        <div className="m-latestinlineElement m-latestinlineElement--triple">
                                            {
                                                (cartItem.isGRConversionEligible === false)?
                                                   <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">{cartItem.isGRConversionMessage}</Button>
                                                : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>
                                            }
                                            {
                                                (cartItem.isItemAvilableInWishlist === 'false')?
                                                    <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                    </Button>
                                                : <span className="savedItem">Saved Article</span>
                                            }
                                                <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                    {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                            <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                <Menumotion/>
                                </div>
                    </div>
                    )
               }else if(cartItem && cartItem.productType === "Big Ticket"){

                     return (
                         <div className="o-myBag o-myBag--bigTicket">
                                <div className="o-myBag__column o-myBag__column--triple" name="columnProduct">
                                    <div className="o-myBag__image">
                                        {
                                            (cartItem && cartItem.productImageURL)?
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.productImageURL}/>
                                            :
                                               <Figure imageClassName="a-myBagImageProduct" imageAlt="alt-Description" src={cartItem.defaultImageURL.productImage}/>
                                        }
    
                                    </div>
                                    <div className="o-myBag__description">
                                            <p className="a-inlineElement a-inlineElement--enphasis">{cartItem.itemDisplayName}</p>

                                            <Stars classFieldset='rating' id="star50" type="radio" value="5"/>

                                            <label className="ratingNumber">( {cartItem.productRatingCount} )</label>
                                            <p className="a-blockElement">
                                                <label className="a-inlineElement a-inlineElement--default">Pedido especial</label>
                                        </p>
                                            <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Código de producto: {cartItem.productId}</p>
                                                <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Talla: {cartItem.clothingSize}</p>
                                                <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Color: {cartItem.clothingColor}</p>
                                                {
                                                    (cartItem.commerceItemClassType === 'miraklCommerceItem')? 
                                                    <p className="a-inlineElement a-inlineElement--simpleLineSpacing">Material: {cartItem.marketplaceMessage}</p>
                                                    : null
                                                }
                                                
                                                <p className="a-inlineElement a-inlineElement--fEstimadaTitle">Fecha estimada de entrega:</p>
                                                <p className="a-inlineElement -greenText">{cartItem.estimatedDeliveryDate}</p>
                                            <div className="m-latestinlineElement m-latestinlineElement--triple">
                                                    {
                                                        (cartItem.isGRConversionEligible === false)?
                                                        <Button className="a-inlineElement a-inlineElement--eventsProduct -gift" data-toggle="modal" data-target="#buytoGiftTable-modal">{cartItem.isGRConversionMessage}</Button>
                                                        : <Button className="a-inlineElement a-inlineElement--eventsProduct -gift">Buy for gift table</Button>

                                                    }
                                                    {
                                                        (cartItem.isItemAvilableInWishlist === 'false')?
                                                            <Button className="a-inlineElement a-inlineElement--eventsProduct ">Save for later
                                                            </Button>
                                                        : <span className="savedItem">Saved Article</span>
                                                    }
                                                    <Button className="a-inlineElement a-inlineElement--eventsProduct ">Remove
                                                    </Button>
                                            </div>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnPrice">
                                   {
                                        (cartItem.listPrice && cartItem.salePrice && data.DisplayStrikeOutPrice && (cartItem.listPrice !== cartItem.salePrice))?
                                            <div className="o-myBag__column--priceContainer">
                                                <p className="a-inlineElement a-inlineElement--strikethrough">$ {cartItem.listPrice}<sup className="-decimal">00</sup></p>
                                            </div>
                                        : null

                                    }
                                    <div className="o-myBag__column--priceContainer">
                                            <p className="a-inlineElement a-inlineElement--enphasis -enphasisDecimal">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>

                                     

                                <div className="o-myBag__column" name="columnQuantity">
                                    <div className="m-product">
                                        <Quantity quantity={cartItem.quantity}/>
                                    </div>
                                </div>

                                <div className="o-myBag__column" name="columnTotal">
                                    <div className="o-myBag__column--priceContainer">
                                        <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total">$ {cartItem.salePrice}<sup className="-decimal">00</sup></p>
                                    </div>
                                </div>
                                <div className="o-myBag__motionMenu">
                                    <Menumotion/>
                                </div>
                    </div>
                     )
               }*/}
})
         }
</React.Fragment>
  )
}
































