
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Buttons from '../../atoms/Buttons/atom-buttons';
import ModalHeader from '../../molecules/Modals/ModalHeader';
import Button from '../../atoms/Button/Button';
// import { Utility } from './../../../../helpers/utilities/utility';
// import { Path } from './../../../helpers/config/config';


class MoleculeModalDeleteNumber extends React.Component {
	constructor(props) {
		super(props);
	} render() {

		const staticLabels = this.props.staticLabels;
		const modalHeader = {
			title: staticLabels && staticLabels["pwa.viewPhone.eltelefono.label"],
			titleType: 'h2',
			headlineAttributes: {
				"id": "a-modal__Header"
			},
			close: true,
			buttonClass: 'close a-eddBox__closeButton go',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			}
		}

		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body">
					<div className="row">
						<div className="col">
							<Paragraph>{staticLabels && staticLabels["pwa.viewPhone.eliminar.label"]}</Paragraph>
						</div>
					</div>

					<div className="row">
						<div className="col">
							<Button className="a-btn a-btn--primary" ripple="">{staticLabels && staticLabels["pwa.addNewPhone.add.label"]}</Button>
						</div>
					</div>
				</div>
			</React.Fragment>

		);
	}
}
export default MoleculeModalDeleteNumber;





