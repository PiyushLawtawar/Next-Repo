
import {AtomChunkText} from '../../atoms/Tab/atom-chunk-text.js';
import Button from '../../atoms/Button/Button';
import Sup from  "../../atoms/Sup/Sup";
import {InputHelperAssistant} from '../../molecules/MaterialInputText/MaterialInputText';
import { GetWithDecimal } from '../../../helpers/utilities/utility';
export default (props) => {
    const MyBagBreakdown =(props.orderPriceInfo);
    const staticLables = MyBagBreakdown.staticLables;
    const ButtonTab = { className : "m-buttonTab", text : 'text', isActive : 'isActive', withIcon : 'withIcon', quantity : 'quantity' };
    return(    
           <React.Fragment>
            <div className={MyBagBreakdown.nameComponent}>
                <div className={MyBagBreakdown.nameComponent+"__detail"}>
                    <div className={MyBagBreakdown.nameComponent+"__description"}>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal">{staticLables['pwa.cart.subTotal.label'] && staticLables['pwa.cart.subTotal.label'].replace('${commerceItemCount}',props.tabCounts.myBagCount)}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal">{staticLables['pwa.cart.discount.text']}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal">{staticLables['pwa.cart.coupon.text']}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal">{staticLables['pwa.cart.shippingCost.text']}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement a-inlineElement--totalTitle -enphasisDecimal">{staticLables['pwa.cart.total.label']}</p>
                        </div>
                    </div>
                    <div className="m-breakdownExpenses__quantity">
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal -alignDecimal">${GetWithDecimal(MyBagBreakdown.rawSubTotalWithoutItemPromotions,2).val}.{GetWithDecimal(MyBagBreakdown.rawSubTotalWithoutItemPromotions,2).decimal}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal -alignDecimal">${GetWithDecimal(MyBagBreakdown.institutionalPromotionDiscount,2).val}.{GetWithDecimal(MyBagBreakdown.institutionalPromotionDiscount,2).decimal}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal -alignDecimal">${GetWithDecimal(MyBagBreakdown.couponDiscount,2).val}.{GetWithDecimal(MyBagBreakdown.couponDiscount,2).decimal}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement -enphasisDecimal -alignDecimal">${GetWithDecimal(MyBagBreakdown.shippingCost,2).val}.{GetWithDecimal(MyBagBreakdown.shippingCost,2).decimal}</p>
                        </div>
                        <div className={MyBagBreakdown.nameComponent+"__column--priceContainer"}>
                            <p className="a-inlineElement a-inlineElement--enphasis a-inlineElement--total -enphasisDecimal -alignDecimal">${GetWithDecimal(MyBagBreakdown.amountWithInstitutionalPromotion,2).val}.{GetWithDecimal(MyBagBreakdown.amountWithInstitutionalPromotion,2).decimal}</p>
                        </div>
                    </div>
                </div>
                <div className={MyBagBreakdown.nameComponent+"__actions"}>
                    <div className={MyBagBreakdown.nameComponent+"__promotion"}>
                        {/* <div className="m-inputText mdc-text-field mdc-text-field--outlined"> // Defect 23203 - Removing this div to fix this issue */}
                            {/*<input className="mdc-text-field__input a-material__input" value={props.promotionCode} onChange={props.handlePromotionCodeChange} id="inputID" aria-controls="helper-text-id" aria-describedby="helper-text-id" name="nameInput" />*/}
                        <InputHelperAssistant
                            name="promotionCode"
                            value={props.promotionCode}
                            onChange={props.handlePromotionCodeChange}
                            maxLength={12}
                            onFocus={props.handleOnFocus}
                            onBlur={props.handleBlur}
                            field_focus={props.focused.promotionCode}
                            field_valid={props.errors.promotionCode}
                            labelText={staticLables['pwa.cart.coupon.text']} />

                            {/*<div className="m-input-notched mdc-notched-outline mdc-notched-outline--upgraded">
                                <div className="m-input-leading mdc-notched-outline__leading"></div>
                                <div className="m-input-outline__notch mdc-notched-outline__notch">
                                    <label className="mdc-floating-label a-input-label" htmlFor="inputID" >{staticLables['pwa.cart.coupon.text']}
                                                                </label>
                                </div>
                                <div className="m-input-outline__trailing mdc-notched-outline__trailing"></div>
                            </div>*/}
                        {/* </div> // Defect 23203 - Removing this div to fix this issue */}
                        <div className="m-input-helper__text mdc-text-field-helper-line">
                            <p className="a-intput-paragraph mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg mdc-text-field-helper-text--persistent" aria-hidden="true" id="helper-text-id">
                           </p>
                        </div>
                    </div>
                    <div className="m-breakdownExpenses__apply">
                        <Button className="a-btn a-btn--tertiary a_myBag__btnApply" handleClick={()=>{props.applyCoupon()}}>Aplicar</Button>
                    </div>
                </div>
            </div>
            <div className="t-myBag__breakdownExpensesNotice">
                <p className="a-inlineElement a-inlineElement--noticePrice">*{staticLables['pwa.cart.pricemessage.text']}</p>
            </div>
        </React.Fragment>
    )
}