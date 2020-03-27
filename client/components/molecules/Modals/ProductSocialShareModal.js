import React from 'react';
import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import { AnchorIconSpanNew } from '../../molecules/MixinMolecules/MixinMolecules';
import { parentContext } from '../../../contexts/parentContext';
import Alert from '../../molecules/Alert/Alert';
import { getAssetsPath } from '../../../helpers/utilities/utility';

import {
	FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon, TwitterShareButton,
	TwitterIcon, WhatsappShareButton, WhatsappIcon
} from 'react-share'

export default class productSocialShareModel extends React.Component {
	constructor(props) {
		super(props)
		this.copyLink = this.copyLink.bind(this)
	}

	copyLink = () => {

		var el = document.createElement('textarea');
		el.value = window.location.href;
		el.setAttribute('readonly', '');
		el.style = { position: 'absolute', left: '-9999px' };
		document.body.appendChild(el);
		const userAgent = window && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase() || "";
		//userAgent.match(/ipad|iphone/i)
		//const { isDesktop, isMobile, isIpad } = UserAgentDetails(this.state.window);
		// if (userAgent.match(/ipad|iphone/i)) {
		// 	
		// 	console.log("valllllll", el.value)
			el.focus();
			el.setSelectionRange(0, 999999);
		// }
		// else {
		// 	el.select();
		// }

		document.execCommand('copy');
		document.body.removeChild(el);
		const staticLabels = this.props.staticLabels || {};
		const copiedMessage = staticLabels && staticLabels['pdpPage.link.of.article.copied'] || 'pdpPage.link.of.article.copied';
		this.props.show_alert(copiedMessage, "success")
		this.props.closeModal("showModal10")
		const X = window.scrollX;
		const Y = window.scrollY;
		window.scrollTo(X, Y + 1)
	}
	render() {
		let  AssetsPath = '';
        if (typeof window !== 'undefined') {
            AssetsPath = getAssetsPath(window,undefined);  
        }

		const endecaProductRecord = this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {};
		const headLineText = endecaProductRecord.productDisplayName ? endecaProductRecord.productDisplayName[0] : (endecaProductRecord.attributes && endecaProductRecord.attributes['product.displayName'][0])
		const skuImageMap = (this.props.mainContent && this.props.mainContent.akamaiSkuImagesInfo && this.props.mainContent.akamaiSkuImagesInfo.skuImageMap) || {};
		var largeImage = []
		if (this.props.imageBreakFlag === false) {
			Object.keys(skuImageMap).forEach(key => {
				if (key.match(this.props.productSizeId + '_th')) {
					let value = skuImageMap[key];
					largeImage.push(value)
				}
			});
		} else {
			largeImage.push(AssetsPath + '/static/images/filler_REC.gif')
		}

		let socialSize = {
			fontSize: 14,
		}

		const { txtFacebook, txtTwitter, txtEmail, txtCopy, txtWhatsapp, pageUrl, productDescription } = this.props.productSocialShare || {};

		const modalHeader = {
			title: 'Compartir',
			titleType: 'h4',
			headlineAttributes: {
				"id": "social-modal"
			},
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			},
			requireArrow: false
		};
		const facebook = {
			aHref: pageUrl,
			aClass: 'a-modalShare__icon -facebook',
			anchorAttributes: {
				"data-dismiss": "modal",
			},
			iconClass: 'icon-facebook',
			spanText: productDescription,

		};
		const twitter = {
			aHref: pageUrl,
			aClass: 'a-modalShare__icon -twitter',
			anchorAttributes: {
				"data-dismiss": "modal",
			},
			iconClass: 'icon-twitter',
			spanText: productDescription
		};
		const email = {
			aHref: largeImage,
			aClass: 'a-modalShare__icon -email',
			anchorAttributes: {
				"data-toggle": "modal",
				"data-target": "#share-email-modal"
			},
			iconClass: 'icon-mail',
			spanText: headLineText
		};
		const copy = {
			aHref: '#',
			aClass: 'a-modalShare__icon -copy',
			anchorAttributes: {
				"data-dismiss": "modal",
			},
			iconClass: 'icon-copy',
			spanText: txtCopy
		};
		const whatsapp = {
			aHref: pageUrl,
			aClass: 'a-modalShare__icon -whatsapp',
			anchorAttributes: {
				"data-dismiss": "modal",
			},
			iconClass: 'icon-whatsapp',
			spanText: headLineText
		};

		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body">
					<div className="row">

						<div className="col-12">

							{/*<AnchorIconSpanNew options={facebook} />*/}

							{/* <Link className={facebook.aClass} href="#"> */}
							<FacebookShareButton
								url={facebook.aHref}
								quote={facebook.spanText}
								className="a-modalShare__icon custom-facebook-icon">

								<FacebookIcon
									size={45}
									logoFillColor={'grey'}
									iconBgStyle={{ fill: 'white' }}
									round
								/>
								<Span>{txtFacebook}</Span>
							</FacebookShareButton>
							{/* </Link> */}
						</div>
						{/* <div className="col-10 pt-3" style={socialSize}><Span className={facebook.aClass}>{txtFacebook}</Span></div> */}
					</div>
					<div className="row">
						<div className="col-12">
							{/*<AnchorIconSpanNew options={twitter} />*/}
							{/**/}

							<Link className={twitter.aClass} href="#">
								<TwitterShareButton
									url={twitter.aHref}
									via='liverpoolmexico'
									title={twitter.spanText}
									className="custom-twitter-icon">
									<TwitterIcon
										size={45}
										logoFillColor={'grey'}
										iconBgStyle={{ fill: 'white' }}
										round />
									<Span>{txtTwitter}</Span>
								</TwitterShareButton>
							</Link>
						</div>
						{/* <div className="col-10 pt-3" style={socialSize}><Span className={twitter.aClass}>{txtTwitter}</Span>
						</div> */}
					</div>
					<div className="row">
						<div className="col-12">
							{/*<AnchorIconSpanNew options={email} />*/}

							<Link className={email.aClass} href="#">
								<EmailShareButton
									//url={email.aHref}
									subject={email.spanText}
									body={email.aHref}
									className="custom-email-icon"
									onClick={() => this.props.OpenModal("showModal12", 'showModal10')}>
									<EmailIcon
										size={45}
										logoFillColor={'grey'}
										iconBgStyle={{ fill: 'white' }}
										round />
									<Span>{txtEmail}</Span>
								</EmailShareButton>
							</Link>
						</div>
						{/* <div className="col-10 pt-3" style={socialSize}><Span className={email.aClass} onClick={() => this.props.OpenModal("showModal12")}>{txtEmail}</Span></div> */}
					</div>
					<div className="row">
						<div className="col-12" >
							<AnchorIconSpanNew options={copy} onClick={this.copyLink.bind(this)} />

						</div>
						{/* <div className="col-10 pt-3" style={socialSize}><Span className={email.aClass}>{txtCopy}</Span></div> */}

					</div>
					<div className="row d-lg-none">
						<div className="col-12">
							{/*<AnchorIconSpanNew options={whatsapp} />*/}
							<Link className={whatsapp.aClass} href="#">
								<WhatsappShareButton
									url={whatsapp.aHref}
									title={whatsapp.spanText}
									className="custom-twitter-icon">
									<WhatsappIcon
										size={45}
										logoFillColor={'grey'}
										iconBgStyle={{ fill: 'white' }}
										round />
									<Span>Whatsapp</Span>
								</WhatsappShareButton>
							</Link>

						</div>
					</div>

				</div>
			</React.Fragment>
		);
	}
}
