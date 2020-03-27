import { H3 } from '../../atoms/HeadLines/Headlines';
import Sup from "../../atoms/Sup/Sup";
import Span from "../../atoms/Span/Span";
import Ul from "../../atoms/Ul/Ul";
import List from "../../atoms/List/List";
import Link from "../../atoms/Link/Link";
import Button from "../../atoms/Button/Button";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ButtonHeadlineIcon } from "../../molecules/MixinMolecules/MixinMolecules";
import { parentContext } from '../../../contexts/parentContext';


export default class extends React.Component {

    // componentDidMount() {

    // }
    render() {
        const selectStateOpenModal = {
            btnModalAttributes: {
                "data-toggl2e": "modal",
                "data-target": "#select-state-modal",
                "id": "a-select-state-modal__btn"
            },
            iconClass: 'icon-arrow_right',
            divClass: 'm-product__giftPurchase-container -small',
            btnText: 'Selecciona tu estado',
            btnClass: 'a-btn a-btn--action'
        };


        return (
            <div className="m-product__eddClickAndCollect">
                <div className="row">
                    <div className="col-12 mb-2 mt-2">
                        <Paragraph className="a-product__paragraphClickAndCollect m-0">Click & Collect</Paragraph>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                    <div className="m-characteristics-container -small">
                        <parentContext.Consumer>
                            {({ OpenModal, updateSelectedState }) => (
                                <ButtonHeadlineIcon options={selectStateOpenModal} onClick={() => OpenModal('showModal3', 'showModal1')} />
                            )}
                        </parentContext.Consumer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
