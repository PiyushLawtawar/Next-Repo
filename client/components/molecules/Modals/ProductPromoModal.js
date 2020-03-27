import React from 'react';
import ModalHeader from './ModalHeader';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from  "../../atoms/Paragraph/Paragraph";
//import { ParagraphGroup } from  "../../molecules/MixinMolecules/MixinMolecules";
import ProductPromoContent from  "../../molecules/ProductPromo/ProductPromoContent";




export default class ProductPromoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardTab: true };
    }

	tabToogle = (tab) => {
		if(tab === 'card') {
			this.setState({ cardTab: true });
		}
		if(tab === 'other') {
			this.setState({ cardTab: false });
		}
	}

	render() {
		const modalHeader = {
			title: 'Ofertas y promociones',
			titleType: 'h4',
			headlineAttributes: {
				"id":"promo-modal"
			},
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type":"button",
				"data-dismiss":"modal",
				"aria-label":"Close"
			}
		};
		const overflowStyle = {
			overflowX: 'hidden',
			overflowY: 'auto',
			padding: this.props.forcePadding === true ? "1rem": 0
		}
		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp}/>
				<div className="modal-body" style={this.props.isMobile ? overflowStyle : { padding: this.props.forcePadding === true ? "1rem": 0}}>

					<div className="m-promo-modal-select-tab">
						<div className="row availabilityTabs">
							<div className="col">
								<div className="mdc-tab-bar" role="tablist">
									<div className="mdc-tab-scroller">
										<div className="mdc-tab-scroller__scroll-area">
											<div className="mdc-tab-scroller__scroll-content">
												<Button className={"mdc-tab" + (this.state.cardTab?' mdc-tab--active':'')} role="tab" aria-selected="true" tabIndex="0" data-open="cards" handleClick={() => this.tabToogle('card')}>
													<Span className="mdc-tab__content">
														<Span className="mdc-tab__text-label">Tarjetas Liverpool</Span>
													</Span>
													<Span className="mdc-tab-indicator mdc-tab-indicator--active">
														<Span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></Span>
													</Span>
													<Span className="mdc-tab__ripple"></Span>
												</Button>
												<Button className={"mdc-tab" + (!this.state.cardTab?' mdc-tab--active':'')} role="tab" aria-selected="true" tabIndex="0" data-open="other" handleClick={() => this.tabToogle('other')}>
													<Span className="mdc-tab__content">
														<Span className="mdc-tab__text-label">Otras tarjetas</Span>
													</Span>
													<Span className="mdc-tab-indicator">
														<Span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></Span>
													</Span>
													<Span className="mdc-tab__ripple"></Span>
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col">
								<ProductPromoContent productPromotion={this.props.productPromotion} cardTab={this.state.cardTab} />
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}