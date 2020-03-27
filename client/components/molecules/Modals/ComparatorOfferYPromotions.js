import ModalHeader from './ModalHeader';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Label from '../../atoms/Label/Label';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import Tab from '../../atoms/Tab/Tab';


export default (props) => {

    let { otherPromotions_pwa, lpPromotions_pwa, tabs } = props;

    let modalHeader = {
		title: 'Ofertas especiales y Promociones',
		titleType: 'h4',
		headlineAttributes: {
			"id":"a-comparator-title__modal"
		},
		close: true,
		buttonClass: 'close a-eddBox__closeButton',
		buttonAttributes: {
			"type":"button",
			"data-dismiss":"modal",
			"aria-label":"Close"
		}
	}

    let lpPromotions_pwa_template = lpPromotions_pwa.map((item, index)=>{
        return `<p key=${index}>${item}</p>`
    });
    let otherPromotions_pwa_template = otherPromotions_pwa.map((item,index)=>{
        return `<p key=${index}>${item}</p>`
    });

    lpPromotions_pwa_template = lpPromotions_pwa_template.toString().split('>,<').join('><');
    otherPromotions_pwa_template = otherPromotions_pwa_template.toString().split('>,<').join('><');

  return(
    <React.Fragment>
        <ModalHeader modalHeader={modalHeader} ModalpopUp={props.ModalpopUp} />
        <div className="modal-body">
          <div className="">
              <div className="col">
                  <div className="mdc-tab-bar" role="tablist">
                      <div className="mdc-tab-scroller">
                          <div className="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll" style={{marginBottom: " 0px"}}>
                              <div className="mdc-tab-scroller__scroll-content">

                                  <Button className={"mdc-tab "+(tabs.tab1 && "mdc-tab--active")} onClick={()=>props.switchTab('tab1')}>
                                      <span className="mdc-tab__content">
                                          <span className="mdc-tab__text-label">Tarjetas Liverpool</span>
                                      </span>
                                      <span className="mdc-tab-indicator mdc-tab-indicator--active">
                                        <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                      </span>
                                      <span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
                                  </Button>

                                  <Button className={"mdc-tab "+(tabs.tab2 && "mdc-tab--active")} onClick={()=>props.switchTab('tab2')}>
                                    <span className="mdc-tab__content">
                                      <span className="mdc-tab__text-label">Otras Tarjetas</span>
                                    </span>
                                    <span className="mdc-tab-indicator">
                                      <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                    </span>
                                    <span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
                                  </Button>

                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mt-3">
              <div className="col">
                    {
                        tabs.tab1 &&
                        <div className="tabs-content m-tab-liverpool_card-promotions" data-tab="liverpool_cards" dangerouslySetInnerHTML={{__html: lpPromotions_pwa_template}}>
                        </div>
                    }
                    {
                        tabs.tab2 &&
                        <div className="tabs-content m-tab-liverpool_card-promotions" data-tab="liverpool_cards" dangerouslySetInnerHTML={{__html: otherPromotions_pwa_template}}>
                        </div>
                    }
                  <div className="tabs-content" data-tab="other_cards">
                      <Paragraph>otras tarjetas</Paragraph>
                  </div>
              </div>
          </div>
        </div>
    </React.Fragment>
  );
}