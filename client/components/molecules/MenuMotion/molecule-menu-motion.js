import React from 'react';
import Icons from '../../atoms/Icons/Icons';
import Link from '../../atoms/Link/Link';
import { parentContext } from '../../../contexts/parentContext';
import Button from '../../atoms/Button/Button';
export const Menumotion = (props) => {
    let staticLables = props.staticLables ? props.staticLables : {};
    let cartItem = props.cartItem
    return (

        <div className="menuMotion dropleft">
            <Link className="a-box__actionAddress dropdown-toggle" href="#" onTouchEnd={(e) => { e.preventDefault(); props.openOptions(props.index) }} onClick={(e) => { props.openOptions(props.index) }} role="button" id="address0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <Icons className="icon-more_vert"></Icons>
            </Link>
            <div className={"dropdown-menu " + (props.options_visibility && 'show')} aria-labelledby="address0">

                {
                    (props.activeTab !== 'mdc-tab-2') ? (cartItem && cartItem.isGRConversionEligible === false) ?
                        (cartItem.commerceItemClassType === 'giftRegistryCommerceItem') ?
                            <parentContext.Consumer>
                                {({ OpenModal }) => (
                                <React.Fragment>                                    
                                  { cartItem.shippingGroupId && cartItem.allItemsAddedInCart==='true' && cartItem.onlyGwpChildItem==false? 
                                    <Link className="a-menuMotion__link dropdown-item ripple-motion -gift buyGiftTable" onTouchEnd={(e) => { e.preventDefault(); props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModalEToNonGR') }} onClick={() => { props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModalEToNonGR') }}>Ya no quiero regalar</Link>
                                  :null
                                  }
                                   { cartItem.shippingGroupId && cartItem.allItemsAddedInCart==='true' && cartItem.onlyGwpChildItem==false?
                                    <Link className="a-menuMotion__link dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); props.cartItemIdToGiftWrapItem(cartItem.id, cartItem.catalogRefId, cartItem.giftMessage, cartItem), OpenModal('MyBagGRModalEditMsg') }} onClick={() => { props.cartItemIdToGiftWrapItem(cartItem.id, cartItem.catalogRefId, cartItem.giftMessage, cartItem), OpenModal('MyBagGRModalEditMsg') }}>Editar mensaje</Link>
                                    :null
                                   }
                                    { cartItem.shippingGroupId &&  cartItem.allItemsAddedInCart==='true' && cartItem.onlyGwpChildItem==false?
                                        <Link className="a-menuMotion__link dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModal') }} onClick={() => { props.cartItemIdToGRModalOne(cartItem.shippingGroupId), OpenModal('MyBagGRModal') }}>Nueva búsqueda</Link>
                                    :null
                                    }
                                </React.Fragment>
                                )}
                            </parentContext.Consumer>
                            /*<span className="a-menuMotion__link dropdown-item ripple-motion -gift buyGiftTable">{staticLables &&  staticLables['pwa.cart.addToGiftEvent.text'] ? staticLables['pwa.cart.addToGiftEvent.text'] : ''}</span>*/
                            :cartItem && cartItem.promotionalGiftItemMessage?
                             null :
                            <Link className="a-menuMotion__link dropdown-item ripple-motion -gift" data-toggle="modal" data-target="#dontGift-modal">{'No se puede asociar a mesa de regalo'}</Link>
                        :
                        <parentContext.Consumer>
                            {({ OpenModal }) => (
                                <Link className="a-menuMotion__link dropdown-item ripple-motion -gift buyGiftTable" onTouchEnd={(e) => { e.preventDefault(); props.cartItemIdToGRModalOneNew(cartItem.id), OpenModal('MyBagGRModal') }} onClick={() => { props.cartItemIdToGRModalOneNew(cartItem.id), OpenModal('MyBagGRModal') }}>{staticLables['pwa.cart.addToGiftEvent.text']}</Link>
                            )}

                        </parentContext.Consumer>: null
                        


                }
                { 
                    <React.Fragment>
                    <parentContext.Consumer>
                         {({ loginDetails }) => (
                              loginDetails.LoggedInSession ?
                         (props.activeTab !== 'mdc-tab-2') ? (cartItem.isItemAvilableInWishlist === 'false' && cartItem.commerceItemClassType !== 'giftRegistryCommerceItem') ?
                        
                            <Link className="a-menuMotion__link dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); props.addItemToWishListNew(cartItem.id, cartItem.catalogRefId) }} onClick={() => { props.addItemToWishListNew(cartItem.id, cartItem.catalogRefId) }}>{staticLables['pwa.sfl.movetowishlist.text']}</Link> 
                        
                        :
                        (cartItem.commerceItemClassType !== 'giftRegistryCommerceItem' && cartItem.commerceItemClassType !== 'electronicCommerceItem') ?
                            <span className="a-menuMotion__link dropdown-item ripple-motion">{staticLables['pwa.sfl.articulo.guardados.text']}</span>
                            : null :
                            cartItem.inventoryAvailable && !cartItem.isGwpItem?
                             <Link className="a-menuMotion__link dropdown-item ripple-motion " onTouchEnd={(e) => { e.preventDefault(); props.addItemToCart(props.fDataMoveToBag) }} onClick={() => { props.addItemToCart(props.fDataMoveToBag) }}>{staticLables['pwa.sfl.addToCart.text']}</Link>
                             /*: !cartItem.isGwpItem ? <label className="a-menuMotion__link dropdown-item ripple-motion ">{staticLables['pwa.sfl.unavailable.text']}</label>:null*/
                             : null
                            : null
                             
                            )}
                            
                    </parentContext.Consumer>
                       {
                          cartItem.inventoryAvailable && cartItem.isGwpItem?<Link className="a-menuMotion__link dropdown-item ripple-motion" onTouchEnd={(e)=>{ e.preventDefault(); props.pdpProductLanding(cartItem, cartItem.productId); }} onClick={()=> {props.pdpProductLanding(cartItem, cartItem.productId)}}>{staticLables['pwa.sfl.gotopdp.text']}</Link> // changes for 23430 defect 
                          :null
                        }
                    </React.Fragment>

                }
              
                { cartItem&&cartItem.onlyGwpChildItem==true?null
                : <Link className="a-menuMotion__link dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); props.removeItemFromCartNew(props.removeItem), props.gtmRemoveFromCart(cartItem) }}  onClick={() => { props.removeItemFromCartNew(props.removeItem), props.gtmRemoveFromCart(cartItem) }} >{staticLables['pwa.cart.Borrar.text']}</Link>
                }


            </div>
        </div>

    )
}



export class WishListMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.node = React.createRef();
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    handleOutsideClick = (e) => {
        if (this.node && this.node.current && !this.node.current.contains(e.target)) {
            this.setState({ show: false })
        }
    }
    toggleShow = () => {
        this.setState({ show: !this.state.show })
    }
    render() {
        const {options, transform} = this.props;
        return (
            <div ref={this.node} className="menuMotion dropleft">
                <Link className="a-box__actionAddress dropdown-toggle" role="button" id={this.props.skuId} data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false" onTouchEnd={(e)=>{ e.preventDefault(); this.toggleShow(e); }} onClick={this.toggleShow} >
                    <Icons className="icon-more_vert" />
                </Link>
                   <div  className={(this.state.show) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby={this.props.skuId}  >
                <Link className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); this.props.remove(this.props.skuId, this.props.wishlistId)}} onClick={() => this.props.remove(this.props.skuId, this.props.wishlistId)}>{this.props.Removelabel}</Link></div>
              </div>

    );
   }
}

export class AddressOptions extends React.Component {
// export const AddressOptions = (props) => {
    render(){
        const props = this.props;
        return (
            <div className="menuMotion dropleft">
                {
                    !(props.hideEditBtn && props.hideDefaultBtn && props.hideRemoveBtn) &&
                    <Link className="a-box__actionAddress dropdown-toggle" href="#" style={{'margin-right':'-34px'}} onTouchEnd={(e) => { e.preventDefault(); props.openOptions(e); }}  onClick={(e) => props.openOptions(e)} role="button" id="address0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Icons className="icon-more_vert"></Icons>
                    </Link>
                }
                <div className={"step1AddressOptions dropdown-menu " + (props.options_visibility && 'show')}>
                    {props.enableEditAddress && props.hideEditBtn===false &&
                        <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#" onTouchEnd={(e)=>{ e.preventDefault(); props.edit(e); }} onClick={props.edit}>{props.labels["pwa.checkoutShippingPage.editButton.text"]}</Link>
                    }
                    {props.hideDefaultBtn===false &&
                        <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#" onTouchEnd={(e)=>{ e.preventDefault(); props.markAsdefault(e); }} onClick={props.markAsdefault}>{"Marcar como predeterminada"}</Link>
                    }
                    {/*props.labels["pwa.checkoutShippingPage.default.text"]*/}
                    {props.hideRemoveBtn===false &&
                        <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#" onTouchEnd={(e)=>{ e.preventDefault(); props.remove(e); }} onClick={props.remove}>{props.labels["pwa.addressFormPage.eliminarButton.label"]}</Link>
                    }
                </div>
            </div>
        )
    }
}

// position absolute
// will-change transform
// top 0px
// left 0px
// transform translate3d(-162px, 2px, 0px)

export class ShowMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.node = React.createRef();
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
        document.addEventListener('touchend',this.handleOutsideClick,false);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('touchend',this.handleOutsideClick,false);
    }
    handleOutsideClick = (e) => {
        if (this.node && this.node.current && !this.node.current.contains(e.target)) {
            this.setState({ show: false })
        }
    }
    toggleShow = () => {
        this.setState(prevState => {
            return {
                show: !prevState.show
            }
        })
    }
    render() {
        const {options, transform} = this.props;
        return (
            <div ref={this.node} className="menuMotion dropleft">
                <Link className="a-box__actionAddress dropdown-toggle" role="button" id="address1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleShow}>
                    <Icons className="icon-more_vert" />
                </Link>
                <div className={this.state.show ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="address1">
                    {options && options.length ? options.map((option,index) => 
                    <Link key={index} onTouchEnd={(e) => { e.preventDefault(); this.toggleShow(); option.onClick(); }} onClick={() => { this.toggleShow(); option.onClick(); }} className="a-menuMotion__link dropdown-item ripple-motion" data-toggle="modal" data-target="#AirTime-removeCellphone">{option.text}</Link>) : null}
                </div>

            </div>
        );
    }
}

export const RemoveMotion = (props) => {
    return (
        <div className="menuMotion dropleft">
            <Link className="a-box__actionAddress dropdown-toggle" href="#" role="button" id={props.skuId} data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false" onTouchEnd={(e)=>{ e.preventDefault(); props.isShowMotionFun(e) }} onClick={props.isShowMotionFun} ><i className="icon-more_vert"></i></Link>
            <div className={(props.isShowMotion) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby={props.skuId} x-placement="left-start" >
                <Link className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault(); props.remove(props.skuId, props.wishlistId)}} onClick={() => props.remove(props.skuId, props.wishlistId)}>Eliminar</Link>
            </div>
        </div>

    );
}
export const RemovePromotion = (props) => {
    return (
        <div className="menuMotion dropleft">
            <Link className="a-box__actionAddress dropdown-toggle" onTouchEnd={(e) => { e.preventDefault(); props.isShowMotionFun(props.itemInfoKey,props.index) }}  onClick={() => { props.isShowMotionFun(props.itemInfoKey,props.index) }} ><i className="icon-more_vert"></i></Link>
            <div className={(props.isShowMotion) ? "dropdown-menu show" : "dropdown-menu"} >
                <Link className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion" onTouchEnd={(e) => { e.preventDefault();  props.removeProduct(props.item) }} onClick={(e) => { props.removeProduct(props.item) }}>Eliminar</Link>

            </div>
        </div>
    );
}

/*
export class RemovePromotion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowMotion: false,
            index: props.index,
        }
        this.isShowMotionFun = this.isShowMotionFun.bind(this)

    }
  
    isShowMotionFun = () => {
        this.setState(prevState => {
            return {
                isShowMotion: !prevState.isShowMotion
            }
        })
    }


    render() {
        return (
            <div className="menuMotion dropleft">
                <Link className="a-box__actionAddress dropdown-toggle" href="#" role="button" id={this.props.sku.sku} data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded={this.state.index} onClick={() => { this.isShowMotionFun() }} ><i className="icon-more_vert"></i></Link>
                <div className={(this.props.isShowMotion) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby={this.props.sku.sku} x-placement="left-start" >
                    <Link className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion" onClick={(e) => { this.props.removeProduct(this.props.sku),this.isShowMotionFun() }}>Eliminar</Link>
                    
                </div>
            </div>

        );
    }
}*/