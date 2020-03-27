
//import './Tab.styl'
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';



export default (props) => {
    return (
      
           
            <div className="mdc-tab-bar" role="tablist">
                        <div className="mdc-tab-scroller">
                            <div className="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll">
                                <div className="mdc-tab-scroller__scroll-content">
                                    <button className={`mdc-tab  ${props.activeTab == "description" ? "mdc-tab--active mdc-ripple-upgraded--background-focused":""}`} ripple="" role="tab" aria-selected="true" tabIndex="0" data-open="description" onClick={(e) => props.onTabChange(e)} id="mdc-tab-5">
                                        <span className="mdc-tab__content">
                                            <span className="mdc-tab__text-label">Descripción</span>
                                            </span>
                                            <span className="mdc-tab-indicator mdc-tab-indicator--active">
                                                <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                            </span>
                                            <span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
                                    </button>
                                    <button className={`mdc-tab  ${props.activeTab == "specs" ? "mdc-tab--active mdc-ripple-upgraded--background-focused":""}`} ripple="" role="tab" aria-selected="true" tabIndex="0" data-open="specs" onClick={(e) => props.onTabChange(e)} id="mdc-tab-6"><span className="mdc-tab__content"><span className="mdc-tab__text-label">Características</span></span><span className="mdc-tab-indicator"><span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
                                    </button>
                                    <button className={`mdc-tab  ${props.activeTab == "politics" ? "mdc-tab--active mdc-ripple-upgraded--background-focused":""}`} ripple="" role="tab" aria-selected="true" tabIndex="0" data-open="politics" onClick={(e) => props.onTabChange(e)} id="mdc-tab-7"><span className="mdc-tab__content"><span className="mdc-tab__text-label">Políticas</span></span><span className="mdc-tab-indicator"><span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span></span><span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
             
            </div>
          

        
    );
}