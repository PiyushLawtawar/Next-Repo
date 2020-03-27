import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import ProductImage from '../../molecules/ProductImage/ProductImage';
import { CheckboxRadioList } from '../CheckboxList/CheckboxList';
import { parentContext } from '../../../contexts/parentContext';

export default (props) => {

	const staticLabels = props.staticLabels || {};

	const modalHeader = {
		title: staticLabels['gwp.regalo.text'] || '',
		titleType: 'h4',
		headlineAttributes: {
			"id": "gift-registry-modal"
		},
		close: true,
		buttonClass: 'close',
		buttonAttributes: {
			"type": "button",
			"data-dismiss": "modal",
			"aria-label": "Close"
		}
	};

	const gwpInfo = props.gwpInfo || {};
	const gwpData = gwpInfo.gwpData || {};

	//const activeGiftItemIndexTmp = gwpInfo.activeGiftItemIndex || 0;
	const gwpActiveItem = gwpData.giftItems && gwpData.giftItems[gwpInfo.activeGiftItemIndex || 0] || {};
	let liElements = [];
	
	!isEmpty(gwpData.giftItems) && map(gwpData.giftItems, (item, index) => {
		
		let gwpItem = {
			inputId: 'radioGift' + index,
			nameInput: 'radioGift',
			labelText: (item.giftDescription || item.promoName || ''),
			gwpProductId: (item.productId || ''),
			associatedSkuId: (item.associatedSkuId || ''),
			productType: (item.productType || ''),
			imgSrc: (item.promoSmallImageURL || ''),
			imgAlt: (item.giftDescription || '')
		};

		/* isChecked, isDisabled these two properties name's need to cross verify in response. Right now not coming in response */
		if (gwpInfo.activeGiftItemIndex === index) { /*modified for production observation no 99 */
			gwpItem.checked = true;
			gwpItem.active = true;  //defect id 23621
		}
		/*modified for production observation no 99 -- start */
		else {
			gwpItem.checked = false;
			gwpItem.active = false;
		}
		/*modified for production observation no 99 -- end */
		if (item.isDisabled) {
			gwpItem.liClass = '-disabled';
			gwpItem.disabled = true;
		}


		liElements.push(gwpItem);
	})

	const options = {
		mainDivClass: 'm-giftPurchase-radio',
		titleText: 'Selecciona tu regalo de la lista',
		titleClass: 'm-giftPurchase-modal__bodyTitle',
		ulCustomClass: 'm-0 p-0',
		listContainerClass: 'm-giftPurchase_modalList',
		liType: 'radio',
		customListColCLass: 'col-12',
		liElements: liElements,
		onSelectGiftItem: gwpInfo.onSelectGiftItem,
		captionTitle: 'Promoción exclusiva online, el regalo podría no estar exhibido en tienda.',
		captionClass: 'm-giftPurchase-modal__caption'
	};
	const productImageInfo = {
		imgAlt: 'PDP Demo',
		imgTitle: (gwpActiveItem.giftDescription || ''),
		imgSrc: (gwpActiveItem.promoXLImageURL || ''),
		imgClass: 'm-giftPurchase_productImage'
	};
	return (
		<React.Fragment>
			<ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
			<div className="modal-body">
				<div className="row">
					<div className="col-12">
						<Paragraph className="m-giftPurchase-modal__title">{gwpActiveItem.giftDescription}</Paragraph>
						<ProductImage options={productImageInfo} />
					</div>
					<div className="col-12">
						<CheckboxRadioList options={options} />
					</div>
					<div className="col-12 my-4">
						<parentContext.Consumer>
							{({ closeModal }) => (
								<Button className="a-btn a-btn--primary" id="a-giftPurchase-modal-close" type="button" handleClick={() => closeModal('showModal14')} data-dismiss="modal" aria-label="Close">Aceptar</Button>
							)}
						</parentContext.Consumer>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}