import { H3 } from "../../atoms/HeadLines/Headlines";
import isEmpty from 'lodash/isEmpty';
//import { CardWithText, CardRow } from '../../molecules/MixinMolecules/MixinMolecules';
import HeadLineText from '../../atoms/HeadLines/Headlines';
import Router from 'next/router';
import map from 'lodash/map';
import Button from '../../atoms/Button/Button';
import { Utility,logError,logDebug  } from './../../../helpers/utilities/utility';
import { Path } from './../../../helpers/config/config';
import Modal from '../../../helpers/modal/modal';
import DeleteModal from '../../molecules/Modals/moleculeModalDelete';
import { parentContext } from '../../../contexts/parentContext';
import CardRow from './CardRow'

class MoleculeCellPhone extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			phoneData: [],
			phoneId: null,
		};
	}

	setPhoneNoToDelete = phoneId => {
		this.setState({ phoneId })
	}

	getPhoneNumber = () => {
		Utility(Path.getPhoneNumber, 'POST').then(response => {
			if (response && response.data && response.data.errorCode === '1002') {
				Router.push('/tienda/login')
			} else if (response && response.data && response.data.s === '0') {
				const phoneData = response && response.data && response.data.phones;
				this.setState({ phoneData: phoneData });
			}

		}, (error) => {
		});
	}

	deleteCreditCard = (phoneId) => {
		const payload = {
			"phoneId": this.state.phoneId
		};

		Utility(Path.removePhoneNumber, 'POST', payload).then(response => {
			if (response && response.data && response.data.errorCode === '1002') {
				Router.push('/tienda/login')
			} else if (response && response.data && response.data.s === '0') {
				this.getPhoneNumber();
			}
		}, (error) => {
			logError('deleteCreditCard',error);
		});
	}

	componentDidMount() {
		this.getPhoneNumber();
	}

	render() {

		const staticLabels = this.props.staticLabels;
		const staticPhoneData = staticLabels;
		const { phoneData } = this.state;

		const cellphone2 = [
			{ label: staticLabels && staticLabels["pwa.viewPhone.name.label"], labelClass: 'a-account__cardInfoLabel d-block d-lg-none', text: 'Edith trabajo', textClass: 'a-account__cardInfoText' },
			{ label: staticLabels && staticLabels["pwa.viewPhone.phoneNumber.label"], labelClass: 'a-account__cardInfoLabel d-block d-lg-none', text: '5657585950', textClass: 'a-account__cardInfoText' },
			{ label: staticLabels && staticLabels["pwa.viewPhone.service.label"], labelClass: 'a-account__cardInfoLabel d-block d-lg-none', text: 'Telcel', textClass: 'a-account__cardInfoText' },
			{ label: staticLabels && staticLabels["pwa.viewPhone.amount.label"], labelClass: 'a-account__cardInfoLabel d-block d-lg-none', text: '300 pesos', textClass: 'a-account__cardInfoText' }
		]
		const modalDelete = {
			modalId: "delete-modal",
			modalClass: "o-product__modal modal fade account-show",
			modalTabIndex: "1",
			modalAriaLabelledBy: "delete-modal",
			modalDialogClass: "modal-dialog modal-dialog-centered",
			modalContentClass: "modal-content"
		};
		return (
			<parentContext.Consumer>
				{({ OpenModal }) => (
					<div className="row m-0">
						<div className="col-12 mb-3 d-none d-lg-block m-account__cardInfo -titles">
							<div className="row">
								{!isEmpty(cellphone2) && map(cellphone2, (val, index) => {
									return (
										<div className="col-3">
											<H3 headLineClass='' headLineText={val.label} />
										</div>)
								})}
							</div>
						</div>
						{phoneData ? phoneData.map((data,dataIndex) => <CardRow key={dataIndex} data={data} deletePhoneNumber={this.deletePhoneNumber} staticLabels={staticLabels} openDeleteModal={OpenModal} setPhoneNoToDelete={this.setPhoneNoToDelete} />) : null}
						{/*<CardRow menuMotion={menuMotion} options={this.state.phoneData} />*/}
						<div className="col-12 col-lg-3 px-0 mb-3 mt-2 mt-lg-0 mb-lg-3 m-account__cardAdd">
							<Button handleClick={() => { Router.push(`/tienda/users/addPhone`) }} className="a-btn a-btn--primary" ripple="">{staticLabels && staticLabels["pwa.viewPhone.telefono.label"]}   </Button>
						</div>
						<Modal modalDetails={modalDelete} showModalpopUp={'deleteModal'}>
							<DeleteModal staticPhoneData={staticPhoneData} deleteCreditCard={this.deleteCreditCard} ModalpopUp={"deleteModal"} />
						</Modal>
					</div>
				)}
			</parentContext.Consumer>
		)
	}
}
export default MoleculeCellPhone;