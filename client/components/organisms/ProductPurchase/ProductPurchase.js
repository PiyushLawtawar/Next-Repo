import Button from '../../atoms/Button/Button';
import { Container } from '../../organisms/Container/Container';
import {AnchorIconSpan, AnchorIconSpanNew } from '../../molecules/MixinMolecules/MixinMolecules';
import { parentContext } from '../../../contexts/parentContext';
import get from 'lodash/get'
//import './ProductPurchase.styl';

export default (props) => {
    const {info = {}} = props.collectionInfo
    let pdpShare = {
        aHref: '#',
        aClass: 'm-product__anchorShareSocial',
        anchorAttributes: {
            "data-toggle": "modal",
            "data-target": "#social-modal"
        },
        iconClass: 'icon-shared a-product__iconProductShareWeb',
        spanText: 'Compartir',
        spanClass: 'ml-1 a-product__labelProductShareWeb'
    };
    const pageUrl = get(props.windowObject, 'document.location.href', '');
    const productDescription = info && info.title || '';
    const productSocialEmailData = {
        productDescription,
        productId: info && info.productCode,
        skuLargeImage: (props.collectionInfo && props.collectionInfo.gallery) || '',
        pageUrl
    };

    return (
        <div className="o-product-purchase d-lg-none">
            <div>
                <Button className="a-btn a-btn--primary ripple" handleClick={() => props.addMultipleItemToCart(undefined, undefined, "buyNow")}>Pagar Ahora</Button>
            </div>
            <div>
                <Button className="a-btn a-btn--tertiary ripple" handleClick={() => props.addMultipleItemToCart()}>Agregar a mi bolsa</Button>
            </div>
            <div>
                <Container containerClass="white-container p-0  m-product__purchase__share">
                    {/* <AnchorIconSpanNew options={pdpShare} /> */}
                    <parentContext.Consumer>
                        {({ OpenModal, updateSelectedState }) => (
                            <AnchorIconSpan Linkclass="m-product__anchorShareSocial" href="#" onClick={() => { OpenModal('showModal10'); updateSelectedState(productSocialEmailData) }} iconClass="icon-shared a-product__iconProductShareWeb" spanText={pdpShare.spanText} spanClassname="ml-1 a-product__labelProductShareWeb" />
                        )}
                    </parentContext.Consumer>
                </Container>
            </div>
        </div>
    );
}
