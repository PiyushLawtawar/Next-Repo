import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { H5 } from '../../atoms/HeadLines/Headlines';
import Container from '../../organisms/Container/organism-container';
import Header from '../../organisms/Header/wishlistHeader';
import Footer from '../../organisms/Footer/wishlistFooter';
import { Path } from '../../../helpers/config/config';
import { Utility } from '../../../helpers/utilities/utility';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Router from 'next/router';
import Description from '../../molecules/Modals/molecule-product-description-modal';
import Modal from '../../../helpers/modal/modal';

import './whishlist.styl';

export default class WishList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptMenuData: {},
            wishlistData: props.Wishlist || {},
            addtocartObj:[],
            wishListId: props.Wishlist.wishListId,
            errorState:{},
            staticLables: props.Wishlist.staticLabels || [],
            productDetailsDescription:null,
            getheader: props.Wishlist.headerDataWishList || {},
            getFooter: props.Wishlist.footerDataWishList || {},
        };
    }


    removeItemFromWishList = (skuId, wishListId) => {
        Utility(Path.removeitemfromwishlist_santa, 'POST', {
            "skuId": skuId,
            "wishListId": wishListId,
        }).then(response =>
            {
                if (response.status === 200) {
                    if(response.data.status){
                        let errState = response.data.status || {};
                        this.setState({ errorState: errState});
                        if(response.data && response.data.wishListItems && response.data.wishListItems.skuCount==0){
                            let wish = {};
                            this.setState({ wishlistData: wish});
                        }
                    } else{
                        let wish = response.data || {};
                        this.setState({ wishlistData: wish});
                    }
                }
                }, (error) => {
            });
        }

    addmultiplewishlistitems = (addtocartObj, wishListId) => {
        const payload = this.createAddToCartPayload(addtocartObj);
        if(!payload.isEmpty){
            payload.wishListId=wishListId;
        Utility(Path.addmultiplewishlistitems_santa, 'POST', payload).then(response => {
            if (response.status === 200) {
                if(response.data.s == 0 && response.data.addedItemCount > 0){
                    Router.push({pathname: `/tienda/cart`});
                }
            }
            }, (error) => { console.error(error);
        });
       }
    }

    updateDescription = (productDetails,index) => {
      this.setState({ productDetailsDescription: productDetails});
    }

    createAddToCartPayload = (addtocartObj) => {
        let wishListItemsPayload={};
        let params = [];
        if (!addtocartObj.isEmpty) {
            addtocartObj.map((items) => {
                let payload = {
                    "quantity": items.quantity,
                    "productId": items.productId,
                    "catalogRefId": items.skuId,
                    "productType": items.productType,
                    "nonATGSkus": items.atgProduct,
                    "inventoryChecks": items.inventoryCheck
                }
                if(items.atgProduct == 'false'){
                    payload.salePrice=items.skufinalPrice;
                    payload.ListPrice=items.skusalePrice;
                }
                let payloadObj = JSON.parse(JSON.stringify(payload));
                params.push(payloadObj)
            })

            wishListItemsPayload = { products: { productList: params } }
        }
        return wishListItemsPayload;

    }


    render() {
        const wishlistData = this.state.wishlistData;
        const wishlistId= this.state.wishListId;
        const StaticKeys= this.state.staticLables.staticLabelValues[0].keyValues;
        const bodyContent = {};
        let breadcrumbInfo = {
            label: StaticKeys['pwa.wishlistDetails.Regalos.label'],
            isWishList: 'true'
        };
        const modalDescriptionTable = {
            modalId: "description-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "description-modal",
            modalDialogClass: "modal-dialog",
            modalContentClass: "modal-content"
        };

        if(!wishlistId.isEmpty && wishlistData && wishlistData.wishListItems && wishlistData.wishListItems.skuCount > 0){
        return (
            <React.Fragment>
            <Header headerData={this.state.getheader}/>
            <Modal  modalDetails={modalDescriptionTable} showModalpopUp={"wishListSanta"}>
              <Description productLongDescription={this.state.productDetailsDescription}  ModalpopUp={"wishListSanta"}/>
            </Modal>

            <div className="o-breadcrumbs d-none d-lg-block">
                <Breadcrumb  breadcrumbInfo={breadcrumbInfo}/>
             </div>
            <div className="m-wishlist__head container-fluid">
            <div className="container">
            <div className="row p-0">
             <H5 className="a-box__resume.-totalLabel mt-3" headLineText={StaticKeys['pwa.wishlistDetails.Regalos.label']}></H5>
             </div>
            </div>
            </div>

            <div className="container-wishlist">
            <Container wishlistData={wishlistData}
              removeItemFromWishList={this.removeItemFromWishList}
              addmultiplewishlistitems={this.addmultiplewishlistitems}
              addtocartObj={this.state.addtocartObj}
              StaticKeys={StaticKeys}
              wishlistId={wishlistId}
              updateDescription={this.updateDescription}
             />
             </div>
             <Footer footerData={this.state.getFooter}/>
            </React.Fragment>
           )
         }else{
            return (
            <React.Fragment>

            <Header headerData={this.state.getheader}/>
            <div className="o-breadcrumbs d-none d-lg-block">
               <Breadcrumb  breadcrumbInfo={breadcrumbInfo}/>
            </div>
           <div className="m-wishlist__head container-fluid">
           <div className="container">
           <div className="row p-0">
            <H5 className="a-box__resume.-totalLabel mt-3" headLineText={StaticKeys['pwa.wishlistDetails.Regalos.label']}></H5>
            </div>
           </div>
           </div>

           <div className="container-wishlist">
           <div className="o-content .o-whishlist__main">
           <Paragraph className="a-inlineElement a-inlineElement--emptyMessage" >EMPTY WishList !.....</Paragraph>

           </div>
           </div>
           <Footer footerData={this.state.getFooter}/>
           </React.Fragment>
           )
         }
       }
}
