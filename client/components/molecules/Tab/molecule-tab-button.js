import { parentContext } from '../../../contexts/parentContext';
//import './Tab.styl'
import {AtomChunkText, AtomChunkTextIcon} from '../../atoms/Tab/atom-chunk-text.js'
export default (props) => {
	const atom = { className : "a-text mdc-tab__text-label a-buttonTab", text : "Saved", type : "span", materialClass : "mdc-tab-indicator__content mdc-tab-indicator__content--underline" }
	const { myBagCount , wishListCount } = props.tabCounts;
	return(
<parentContext.Consumer>
            {({ showTabContent,activeTab }) => (
		<React.Fragment>
				<button className={activeTab==='mdc-tab-1' ? "mdc-tab m-buttonTab mdc-tab--active" : "mdc-tab m-buttonTab"} role="tab" aria-selected="true" tabIndex="0" onClick={()=>{showTabContent('mdc-tab-1'),props.dismiss_alert()}} id="mdc-tab-1">
					<span className="mdc-tab__content m-buttonTab__content">
						<span className="a-text mdc-tab__text-label a-buttonTab">{props.staticLables['pwa.cart.myBag.text']}</span>
					</span>
					<span className="mdc-tab-indicator m-buttonTab__indicator mdc-tab-indicator--active">
						<span className="a-text mdc-tab-indicator__content mdc-tab-indicator__content--underline a-buttonTab" ></span>
					</span>
					<span className="mdc-tab__ripple m-buttonTab__ripple mdc-ripple-upgraded"></span>
					<span className={"a-buttonTabIcon "+ (activeTab==='mdc-tab-1' ? "a-buttonTabIcon--selected" : "a-buttonTabIcon--unselected")}>{myBagCount}</span>
                 </button>
		       <button className={activeTab==='mdc-tab-2' ? "mdc-tab m-buttonTab mdc-tab--active" : "mdc-tab m-buttonTab"} role="tab" tabIndex="-1" onClick={()=>{showTabContent('mdc-tab-2'),(wishListCount&&wishListCount==30)?props.show_alert_warning('Haz alcanzado el límite de artículos Guardados'):props.dismiss_alert()}} id="mdc-tab-2" aria-selected="false">
				   <span className="mdc-tab__content m-buttonTab__content">
					   <span className="a-text mdc-tab__text-label a-buttonTab">{props.staticLables['pwa.sfl.guardados.text']}</span>
					</span>
					<span className="mdc-tab-indicator m-buttonTab__indicator">
						<span className="a-text mdc-tab-indicator__content mdc-tab-indicator__content--underline a-buttonTab" ></span>
					</span>
					<span className="mdc-tab__ripple m-buttonTab__ripple mdc-ripple-upgraded"></span>
					<span className={"a-buttonTabIcon "+ (props.activeTab==='mdc-tab-2' ? "a-buttonTabIcon--selected" : "a-buttonTabIcon--unselected")}>{ wishListCount }</span>
              </button>
	</React.Fragment>
	     )}
</parentContext.Consumer>
	)
}