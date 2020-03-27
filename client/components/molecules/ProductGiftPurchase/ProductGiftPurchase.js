import { ButtonImgAndIcon } from '../MixinMolecules/MixinMolecules';
import { parentContext } from '../../../contexts/parentContext';
import Paragraph from '../../atoms/Paragraph/Paragraph';
export default (props) => {
    return (
        <div className="m-product__giftPurchase mt-lg-3">
            <div className="row">
                <div className="col-12 mb-3">
                    <Paragraph className="a-giftPurchase-text">{props.staticLabels && props.staticLabels['pdpPage.gwp.label.text'] || 'pdpPage.gwp.label.text'}</Paragraph>
                    <parentContext.Consumer>
                        {({ OpenModal }) => (
                            props.options.btnModalAttributes.onClick = () => { 
                                OpenModal('showModal14');
                                //if(props.options.giftItemsCount === 1) {
                                    //document.getElementById("radioGift0").click();  //defect id 23621
                                //}
                            },
                            <ButtonImgAndIcon {...props} />
                        )}
                    </parentContext.Consumer>
                </div>
            </div>
        </div>
    );
}