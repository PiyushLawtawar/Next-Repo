//import './TermsAndConditions.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import {ParagraphWithBlockNew} from '../../molecules/MixinMolecules/MixinMolecules';

export default (props) => {
   const terms = {
            bType: 'anchor',
            pText: props.termsAndConditionsAgreeText || 'pwa.checkout.termsandconditions.agreeText',
            pClass: 'a-checkout__termsAndConditions mb-4',
            bText: props.termsAndConditionsTCText || 'pwa.checkout.termsandconditions.tcText',
            bClass: 'a-checkout__termsLink',
            bUrl: props.termsAndConditionsLinkUrl || 'pwa.checkout.termsandconditions.linkUrl',
            targetType:'_blank'
        };
    return(
        <div className="d-none d-lg-block common_terms_and_conditions">
            <div className="row align-items-center justify-content-end">
                <div className="col-lg-auto col-12 pt-3 pb-3">
                    <ParagraphWithBlockNew options={terms} />
                </div>
            </div>
            <div className="row align-items-center justify-content-end checkout_shipping_buttons">
                <div className="col-lg-3 col-12">
                    <Button className="a-btn a-btn--primary termsAndConditions__btn--back"  id="backButton" handleClick={props.onReturn}>{props.Regresar}</Button>
                </div>
                <div className="col-lg-3 col-12 mt-3 mt-lg-0">
                    <Button disabled={props.disabled} className="a-btn a-btn--primary" handleClick={props.onContinue}>{props.Continuar}</Button>
                </div>
            </div>
        </div>
    );
}

