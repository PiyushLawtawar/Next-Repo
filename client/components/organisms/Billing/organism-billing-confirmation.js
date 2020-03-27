import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import Image from '../../atoms/Tagimage/Image';
import Button from '../../atoms/Button/Button';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import './organism-billing-confirmation.styl';

class BillingConfirmation extends React.Component {
	constructor(props) {
		super(props);
	}
	invoiceSubmit = (payload) => {
		Utility(Path.invoiceRequest, 'POST', payload).then(response => {
			if (response.data && response.data.s !== undefined && response.data.s === "0") {
				this.show_alert(response.data.success);
				//  console.log("sfddsfsdffffa", response.data);
			} else if (response.data && response.data.err) {
				window.scrollTo(0, 0);
				this.show_alert(response.data.err);
			}
		}, (error) => {

		});
	}
	componentDidMount() {
		const e = document.getElementById("nds-chat-launcher-container");
		if (e) {
			e.style.display = 'none';
		}
	}
	reDirectAnotherInvoice = () => {
		Router.push('/tienda/users/invoiceRequest')
	}
	reDirectGoToLiverPool = () => {
		Router.push('/tienda/home')
	}
	render() {
		const staticLabels = this.props.staticLabels;
		// console.log("sdfsdsdfsdf", this.props.staticLabels)
		const rfcResponse = this.props.invoiceResponse;
		const invoiceTrackingNumber = this.props.invoiceTrackingNumberData
		const options = this.props.options;
		const confirmationData = this.props.invoiceSubmitData;
		// console.log('confirmationDataconfirmationData', this.props)
		const typePage = "billing"
		// const buttonsPerson = [
		//     { text: "Generar otra factura", handleClick: () => Router.push('/tienda/users/invoiceRequest'), btnClass: "a-btn a-btn__billing--secondary a-btn__confirmedInvoice--another", size: "col-lg-3" },
		//     { text: "Ir a Liverpool", handleClick: () => Router.push('/tienda/home'), btnClass: "a-btn a-btn__billing a-btn__confirmedInvoice", typeButton: "submit", Idform: "", size: "col-lg-3" }
		// ]

		return (
			<div className="o-main-content col-12 col-lg-11 col-xl-9 d-lg-flex justify-content-center t-billing__main">
				<div className="o-invoice__box mt-3">
					<div id="invoiceConfirmationTitle" className=".row.o-confirmationInvoice__rowTitle.m-lg-2.mb-lg-4.mb-3">
						<Span className="a-confirmationInvoice__centerTitle">Confirmación de solicitud de factura</Span>
					</div>
					<hr className="p-lg-0" />
					<div className="o-confirmationInvoice__rowsFields ml-lg-5 ml-2 mt-4 pb-4">

						{this.props.showPhysicalOrMoralPersonFields ?
							<React.Fragment>
								<div className="row">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.pedido.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{invoiceTrackingNumber}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.rfc.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.rfcuser}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.cfdi.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.usocfdi}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.correo.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.email}</Span>
								</div>
							</React.Fragment> : null}

						{this.props.showForeignFields ?
							<React.Fragment>
								<div className="row">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.pedido.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{invoiceTrackingNumber}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.rfc.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{rfcResponse && rfcResponse.erfc1 + rfcResponse.erfc2 + rfcResponse.erfc3}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.cfdi.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.usocfdi}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.correo.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.email}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.pais.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.country}</Span>
								</div>
							</React.Fragment>
							: null
						}
						{this.props.showCreditPropertyFields ?
							<React.Fragment>
								<div className="row">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.pedido.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{invoiceTrackingNumber}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.rfc.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{rfcResponse && rfcResponse.arfc1 + rfcResponse.arfc2 + rfcResponse.arfc3}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.cfdi.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.usocfdi}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.correo.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.email}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.tippo.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.personType}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.nombre.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.name}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">{staticLabels && staticLabels["pwa.createInvoiceForm.paterno.label"]}:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.paternalName}</Span>
								</div>
								<div className="row mt-2">
									<Span className="a-confirmationInvoice__fieldName">Apellido materno:</Span>
									<Span className="a-confirmationInvoice__fieldValue ml-2">{confirmationData && confirmationData.maternalName}</Span>
								</div>
							</React.Fragment>
							: null
						}
					</div>
				</div>
				<div className="row o-billing__rowButtons mt-4">
					<div className="col-12">
						<div className="m-form-buttons">
							<div className="row o-billing__rowBtnsForm">
								<div className="col-12 order-2 order-lg-0 col-lg-3">
									<Button onClick={this.reDirectAnotherInvoice} className="a-btn a-btn__billing--secondary a-btn__confirmedInvoice--another">Generar otra factura </Button>
								</div>
								<div className="col-12 order-1 order-lg-1 col-lg-3">
									<Button onClick={this.reDirectGoToLiverPool} className="a-btn a-btn__billing a-btn__confirmedInvoice" type="submit" form="">Ir a Liverpool</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default BillingConfirmation;