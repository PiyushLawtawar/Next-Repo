/*include ../MixinMolecules/mixin-molecules
include ../Accordion/molecule-accordion
*/

import React from 'react';
import { parentContext } from '../../../contexts/parentContext';
import Accordion from '../../molecules/Accordion/Accordion';
import { ButtonHeadIcon } from '../../molecules/MixinMolecules/MixinMolecules';
import PdpAccordion from '../../molecules/Accordion/PdpAccordion';

//import './ProductSpecList.styl';



export default (props) => {
	const { productLongDescription = "", orderedData = [], productPolicies = "", extraInformationWeb = "", extraInformationWap = "", isFromCollectionPage = false } = props;
	let isMobilehashId = '';
	props.isMobile ? isMobilehashId = 'ratings' : isMobilehashId = ''
	/* Defect 24193 fix - "isFromCollectionPage" based on this variable */
	return (
		<div className={"row" + (isFromCollectionPage?' isFromCollectionPage':'')}>
			<parentContext.Consumer>
				{({ OpenModal }) => (
					<React.Fragment>
						{productLongDescription != "" ? <div className="col-12">
							<div className="m-product__giftPurchase-container -specs btnsize">
								<ButtonHeadIcon handleClick={() => OpenModal('showModal7')} btnclass={props.btnclass} iconclass="icon-arrow_right" btntext="Descripción" data-toggle="modal" data-target="#description-modal" id="a-description-modal__btn" />
							</div>
						</div> : null}
						{orderedData && orderedData.length > 0 ? <div className="col-12">
							<div className="m-product__giftPurchase-container -specs btnsize">
								<ButtonHeadIcon handleClick={() => OpenModal('showModal8')} btnclass={props.btnclass} iconclass="icon-arrow_right" btntext="Características" data-toggle="modal" data-target="#description-modal" id="a-description-modal__btn" />
							</div>
						</div> : null}
						<div className="col-12">
							<div className="m-product__giftPurchase-container -specs btnsize">
								<ButtonHeadIcon handleClick={() => OpenModal('showModal11')} btnclass={props.btnclass} iconclass="icon-arrow_right" btntext="Ofertas especiales y promociones" data-toggle="modal" data-target="#description-modal" id="a-description-modal__btn" />
							</div>
						</div>
						{productPolicies != "" ? <div className="col-12">
							<div className="m-product__giftPurchase-container -specs btnsize">
								<ButtonHeadIcon handleClick={() => OpenModal('showModal9')} btnclass={props.btnclass} iconclass="icon-arrow_right" btntext="Políticas" data-toggle="modal" data-target="#description-modal" id="a-description-modal__btn" />
							</div>
						</div> : null}
						{(extraInformationWeb != "" || extraInformationWap != "")  ? <div className="col-12">
							<div className="m-product__giftPurchase-container -specs btnsize">
								<ButtonHeadIcon handleClick={() => OpenModal('wap_Extra')} btnclass={props.btnclass} iconclass="icon-arrow_right" btntext="Información Extra" data-toggle="modal" data-target="#description-modal" id="a-description-modal__btn" />
							</div>
						</div> : null}

					</React.Fragment>
				)}
			</parentContext.Consumer>

			{!isFromCollectionPage &&
				<div className="col-12" id={isMobilehashId}>
					<PdpAccordion headText={"Opiniones del artículo"} isopenStatus="show">
						{(props.isMobile) || (props.isIpad && props.padHeigth > props.padWidth) ?
							<div id="TurnToReviewsContent"></div> : null
						}
					</PdpAccordion>
				</div>
			}
		</div>



	);
}


/*

.row
	.col-12
		+molecule-button-headline-icon(descriptionHeader)
	.col-12
		+molecule-button-headline-icon(specsHeader)
	.col-12
		+molecule-button-headline-icon(promoHeader)
	.col-12
		+molecule-button-headline-icon(politicsHeader)
	.col-12
		+molecule-accordion("nav-item","Opiniones del artículo","labelClassname","m-accordion__turnto","object","","","","icon-arrow_down","nav-link","turnto")*/


