import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import ModalHeader from './ModalHeader';
import Link from '../../atoms/Link/Link';
import { parentContext } from '../../../contexts/parentContext';
import { Utility,logError,logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';


export default class extends React.Component {
	constructor() {
		super()
		this.state = { stateList: [], ErrMessage: "",isMobile: false }
	}
	getStates = () => {
		let States = [];
		Utility(Path.getListOfStates+"EDD", 'GET'/*, {} */).then(response => {

			if (response.data && response.data != null) {
				if (response.data.s == "0") {
					this.setState({ stateList: response.data && response.data.estados && Object.values(response.data.estados) })
				}
				else {
					this.setState({ ErrMessage: response.data.err })
				}
			}
			else {
				logError("no response in getListOfStates")
			}
		});
		//return States
	}

	componentDidMount() {
		
		this.getStates();
        const { isMobile } = UserAgentDetails(window);
        this.setState({isMobile})
	}
	// componentWillReceiveProps(nextprops) {
	// 	//this.getStates();
	// }

	render() {
		const { isMobile } = this.state;
		const arrayStates = this.state.stateList && this.state.stateList.length > 0 && this.state.stateList || [];
		const staticLabels = this.props.staticLabels || {};
		const modalHeader = {
			title:staticLabels && staticLabels['pdpPage.ITR.seleccionar.text'] || 'pdpPage.ITR.seleccionar.text',
			titleType: 'h4',
			headlineAttributes: {
				"id": "select-state-modal"
			},
			close: true,
			buttonClass: 'close',
			buttonAttributes: {
				"type": "button",
				"data-dismiss": "modal",
				"aria-label": "Close"
			}
		}
        const overflowStyle = {
            overflowX: 'hidden',
            overflowY: 'auto'
        }

		return (
			<React.Fragment>
				<ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
				<div className="modal-body p-0" style={isMobile ? overflowStyle : {}}>
					{!isEmpty(arrayStates) && map(arrayStates, (state, index) => {
						let stateName = state.stateName;
						if(state.stateName === 'DISTRITO FEDERAL'){
							stateName = 'CDMX / Zona Metropolitana';
						}
						return <parentContext.Consumer>
							{({ OpenModal,updateSelectedState, updateCollProductId }) => (<Link key={index} className="a-product__anchorSelectState" href="#" data-toggle="modal" data-target="#availability-modal" onClick={() => { OpenModal('showModal4', 'showModal3'); updateSelectedState(stateName); updateCollProductId(this.props.modalProductDetails) }}>{stateName}</Link>
							)}
						</parentContext.Consumer>
					})}
					{this.state.ErrMessage != "" && this.state.ErrMessage}
				</div>
			</React.Fragment>
		);
	}
}