
/**
* Module Name : ProductQty
* Functionality : Product quantity template
* @exports : ProductQty as functional component
* @requires : module:React
* @requires : module:/molecules/MixinMolecules/MixinMolecules
* @requires : module:/atoms/Paragraph/Paragraph
* @requires : module:/atoms/Input/Input
* @requires : module:/atoms/Link/Link
* @requires : module:/atoms/Button/Button
* @requires : module:/contexts/parentContext
* Team : Checkout Team
* Other information : Showing Product quantity template
* 
*/

import { DropdownQty } from '../../molecules/MixinMolecules/MixinMolecules';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Input from '../../atoms/Input/Input';
import Link from '../../atoms/Link/Link';
import Button from '../../atoms/Button/Button';
import { parentContext } from '../../../contexts/parentContext';

export default (props) => {
    const { showQtyDropdown, onSelectDropdownQty, pdpQty, onChangeQty, pdpCollection, onBlurQty, onClickQtyReset, resetQty } = props.qtyDropdownInfo || {};
    let PDP_Button_css_class = (props.chanelBrandCss && typeof props.chanelBrandCss !== 'undefined' && props.chanelBrandCss !== 'NA') ? props.chanelBrandCss['PDP_Button_css_class'] : 'a-btn a-btn--tertiary a-product__buttonAddToCart mb-3';
    if (!PDP_Button_css_class || typeof PDP_Button_css_class === 'undefined' || PDP_Button_css_class.trim().length === 0) {
        PDP_Button_css_class = 'a-btn a-btn--tertiary a-product__buttonAddToCart mb-3';
    }
    let qtyList = [1, 2, 3, 4, 5, 6].map(qty => { return <Link className={props.dropDItem} href="#" data-value={qty == 6 ? "plus" : qty} onClick={() => onSelectDropdownQty(qty == 6 ? "6+" : qty.toString())}>{qty == 6 ? "6 +" : qty.toString()}</Link> })
    
    return (
        <div className="row o-product__productQty pto">
            <div className="col-12 col-lg-4">
                <div className="m-product__qty d-none d-lg-block p-0 mb-0 ">
                    <div className="row">
                        <div className="col pb-1">
                            <Paragraph className={props.QtyLabel}>{props.QtyText}</Paragraph>
                        </div>
                    </div>
                    <div className="row">
                        <div className={"col" + (showQtyDropdown ? ' show' : '')}>
                            <DropdownQty qtyDropdownInfo={props.qtyDropdownInfo} />
                            <div className={"dropdown-menu dropdown-menu--small" + (showQtyDropdown ? ' show' : '')} aria-labelledby="qtyDropdownDesktop" style={{ transform: "translate3d(15px, -0px, 0px)" }}>
                                {qtyList}
                            </div>
                        </div>
                    </div>
                </div>
                <button className="m-product__qty d-lg-none" >
                    <div className="row no-gutters">
                        <div className="col p-0">
                            <Input id="a-ProductQty__inputMobile" className="a-ProductQty__input -mobile pdpQtyMobile" type="tel" name="product-quantity" value={resetQty == "" ? resetQty : pdpQty} onBlur={(e) => onBlurQty(e)} onChange={(e) => onChangeQty(e.target.value)} onClick={() => onClickQtyReset("")} /> {/*fixes for 22120 */}
                        </div>
                    </div>
                </button>
            </div>
            <div className="col-12 col-lg-8">
                <div className="m-product__buttons mt-2 mt-lg-0 container pr-0 pl-0">
                    {props.isModal == undefined && !props.ismodal ? <div className="row">
                        <div className="col-12 d-lg-none">
                            <Button className="a-btn a-btn--primary a-btn__button__buy mb-3" handleClick={() => props.handleAddToMyBag("buyNow")} ripple="">{props.QtyBtn}</Button>
                        </div>
                        {props.pdpCollection ?
                            <div className="col-12 pt-lg-3">
                                <Button id={props.collectionProductId} className="a-btn a-btn--tertiary a-product__select" ripple="" handleClick={() => props.validate_sku_selection().then(() => onChangeQty(Number(pdpQty) + 1, "addProduct"))}>Seleccionar</Button>
                            </div>
                            :
                            <div className="col-12 pt-lg-3">
                                {
                                    <Button className={PDP_Button_css_class} ripple="" handleClick={props.handleAddToMyBag}>{props.addCart}</Button>
                                }
                            </div>}

                    </div> :
                        <div className="col-12 col-lg-8">
                            <div className="m-product__buttons mt-2 mt-lg-0 container pr-0 pl-0">
                                <div className="row">
                                    <div className="col-12 d-lg-none">
                                        <parentContext.Consumer>
                                            {({ closeModal }) => (
                                                <Button className="a-btn a-btn--primary a-btn__accept mb-4" handleClick={() => props.validate_sku_selection().then(() => { onChangeQty(Number(pdpQty) == 0 ? Number(pdpQty) + 1 : Number(pdpQty), "addProduct"); closeModal("selectProductModal") })} ripple="">Aceptar</Button>
                                            )}
                                        </parentContext.Consumer>
                                    </div>
                                    <div className="col-12 pt-lg-3">
                                        <parentContext.Consumer>
                                            {({ closeModal }) => (
                                                <Button className="a-btn a-btn--secondary a-btn__cancel" handleClick={() => { closeModal("selectProductModal") }} ripple="">Cancelar</Button>
                                            )}
                                        </parentContext.Consumer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }


                </div>
            </div>
        </div>
    );
}
