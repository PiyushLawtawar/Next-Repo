import Paragraph from "../../atoms/Paragraph/Paragraph";

import Label from "../../atoms/Label/Label";
import Button from "../../atoms/Button/Button";
import Img from "../../atoms/Tagimage/Image";
import Link from "../../atoms/Link/Link";
import { parentContext } from '../../../contexts/parentContext';
import { WishListMotion } from '../../molecules/MenuMotion/molecule-menu-motion';

import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import './organism-container.styl';
export default class Container extends React.Component{
    constructor(props) {
        super(props);
          
      }

   render(){
    const skuLists = this.props.wishlistData.wishListItems.skuList;
    const skuCount = this.props.wishlistData.wishListItems.skuCount;
    const childname= this.props.wishlistData.wishListItems.childName;
    let wishListTotal=this.props.wishlistData.wishListItems.wishListTotal;
    const StaticKeys =this.props.StaticKeys;
    let addtocartItems= [];
    let productDetails=[];
    //console.log('.........container addtocart..........');   
    //console.log('total container...',this.props.wishlistData.wishListItems.wishListTotal)
    return (
          <div className="o-content .o-whishlist__main">
                
                <div className="o-whishlist__head --wishlist-divider">
                 <div className="m-whishlist__head__title"> 
                     <Paragraph className="a-whishlist__head__title" >{StaticKeys['pwa.wishlistDetails.cartaDel.text']}{childname}</Paragraph> 
                </div>
                <div className="m-whishlist__head__description">
                <Label className="a-whishlist__head__description">{this.props.wishlistData.wishListItems.skuCount} {StaticKeys['pwa.wishlistDetails.regalosElegidos.text']}</Label>
                 </div>
                <div className="m-whishlist__head__price">
                <Paragraph className="a-whishlist__head__total" >{StaticKeys['pwa.wishlistDetails.total.label']}</Paragraph>
               <Label className="a-wishlist-body__aling__price" >${Number(this.props.wishlistData.wishListItems.wishListTotal).toFixed(2)}</Label>
                </div>
                </div>
               
                <div className="o-whishlist__body">
                <React.Fragment>
                {
                  this.props.wishlistData.wishListItems.skuList.map((skudetail,index) =>  {

                    if(skudetail.atgProduct =='true'){
                    
                      if((skudetail.skuinventory == 'Disponible') && ((skudetail.productType != 'E Book') && (skudetail.productType != 'Big Ticket'))){
                          let addtoCartItem= {};
                          addtoCartItem.skuId = skudetail.skuid;
                          addtoCartItem.inventoryCheck = 'false';
                          addtoCartItem.productId=skudetail.parentProductId;
                          addtoCartItem.atgProduct='true';
                          addtoCartItem.productType=skudetail.productType;
                          addtoCartItem.skufinalPrice=skudetail.skufinalPrice;
                          addtoCartItem.skusalePrice=skudetail.skusalePrice;
                          addtoCartItem.quantity="1";
                          addtocartItems.push(addtoCartItem);
                          productDetails.push(skudetail.skulongDescription)                     
                      }
                      if((skudetail.productType == 'E Book') && (skudetail.productType == 'Big Ticket')){
                        let addtoCartItem= {};
                        addtoCartItem.skuId = skudetail.skuid;
                        addtoCartItem.productId=skudetail.parentProductId;
                        addtoCartItem.inventoryCheck = 'true';
                        addtoCartItem.estimatdDeliveryDate = '';                        
                        addtoCartItem.atgProduct='true';
                        addtoCartItem.productType=skudetail.productType;
                        addtoCartItem.skufinalPrice=skudetail.skufinalPrice;
                        addtoCartItem.skusalePrice=skudetail.skusalePrice;
                        addtoCartItem.quantity="1";
                        addtocartItems.push(addtoCartItem);
                        productDetails.push(skudetail.skulongDescription)                     
                    }
                  }else{
                    if(skudetail.skuinventory == 'Disponible')  { 
                      let addtoCartItem= {};
                      addtoCartItem.skuId = skudetail.skuid;                      
                      addtoCartItem.productId=skudetail.parentProductId;
                      addtoCartItem.inventoryCheck = 'true';
                      addtoCartItem.estimatdDeliveryDate = '';
                      addtoCartItem.atgProduct='false';
                      addtoCartItem.productType=skudetail.productType;
                      addtoCartItem.skufinalPrice=skudetail.skufinalPrice;
                      addtoCartItem.skusalePrice=skudetail.skusalePrice;
                      addtoCartItem.quantity="1";
                      addtocartItems.push(addtoCartItem);
                      productDetails.push(skudetail.skulongDescription)
                   }
                  }

                        return <div className="o-wishlist__product --wishlist-divider" key={index}>                      
                        
                         {/*  {skudetail.SKUImage ="https://ss376.liverpool.com.mx/xl/1059543837.jpg"} */}
                         <div className="m-wishlist__image wishlist-img">                        
                          <Img className="a-checklist__imageProduct" src={(skudetail.skuimage)? skudetail.skuimage : skudetail.noImageUrl} alt="productImage"></Img>  
                        </div>

                        <div className="m-wishlist__content">
                          <div className="m-wishlist__head"></div>
                            
                                <WishListMotion remove={this.props.removeItemFromWishList} wishlistId={this.props.wishlistId} skuId={skudetail.skuid} Removelabel={StaticKeys['pwa.wishlistDetails.RemoveItem.label']}/>

                              <Paragraph className="wishlist__body__title" > {skudetail.skudisplayName}</Paragraph>
                              <Paragraph className="a-wishlist__body__middle_content">{StaticKeys['pwa.wishlistDetails.product.label']} {skudetail.skuid}</Paragraph>
                              <Paragraph className="a-wishlist__body__middle_content">{StaticKeys['pwa.wishlistDetails.Cantidad.label']} 1</Paragraph>
                              <Paragraph className="a-wishlist__body__middle_content">{skudetail.skuinventory == 'Disponible'?  StaticKeys['pwa.wishlistDetails.Disponible.label'] : StaticKeys['pwa.wishlistDetails.NonDisponible.label'] } </Paragraph>
                              
                            {/*  <Paragraph className="a-wishlist__body__content d-none d-lg-block"></Paragraph> */}
                             <div className="a-wishlist__body__content d-none d-lg-block"  dangerouslySetInnerHTML={{__html:skudetail.skulongDescription}}>                 
                            </div> 
                             
                            <Link className="a-checkout__deleteBtn d-none d-lg-block" href="" onClick={()=>{this.props.removeItemFromWishList(skudetail.skuid,this.props.wishlistId)}}>{StaticKeys['pwa.wishlistDetails.RemoveItem.label']}</Link>

                        </div>
                        <div className="m-wishlist__price">
                              <Label className="a-wishlist-body__aling__price">${Number(skudetail.skusalePrice).toFixed(2)}</Label>
                        </div>
                        <div className="m-wishlist-product">             
                        <Link className="a-wishlist__description" href="" children="Description"></Link>
                        <parentContext.Consumer>
                            {({ OpenModal }) => (
                              <Link className="a-wishlis--icon" href="#"  data-toggle="modal" data-target="#description-modal" onClick={ () => {this.props.updateDescription(skudetail.skulongDescription,index),OpenModal('wishListSanta')} }></Link>
                            )}
                        </parentContext.Consumer>
                        </div>
                      </div>
                }

               )}
                   
                
                
             </React.Fragment>
            </div>            
                   <div className="o-whishlist__footer">
                    <div></div>
                    <div></div>
                    <div className="m-wishlist__buy">
                          <Button className="a-btn a-btn--primary ripple a-wishlist__button__buy" handleClick={()=>{this.props.addmultiplewishlistitems(addtocartItems , this.props.wishlistId)}}>{StaticKeys['pwa.wishlistDetails.Comprar.label']}</Button>
                    </div>
                    </div>
          </div>
    )
  }
}