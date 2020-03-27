//import './StorelocatorFilter.styl'

import Searchbar from '../../molecules/Searchbar/Searchbar'
import StoreModalHeader from './StoreModalHeader';
import Button from '../../atoms/Button/Button'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import './StorelocatorFilter.styl'
import get from 'lodash/get'


export default (props) => {
  const { storeDetails, isMobile } = props;
  const storeName = get(storeDetails, 'storeDetails.StoreDetails[1].name', '');

  const modalHeader = {
    title: storeName,
    titleType: 'h4',
    back: true,
    headlineAttributes: {
      "id": "a-storeLocator-title__modal"
    },
    close: true,
    buttonClass: 'close a-eddBox__closeButton',
    buttonAttributes: {
      "type": "button",
      "data-dismiss": "modal",
      "aria-label": "Close"
    }
  }

  const closeModal = () => {
    const { closeModal } = props;
    closeModal('showDetailsPopup');
  }

  const openModal = () => {
    const { openModal } = props;
    openModal('storeFullDetail');
  }

  const storeValue = get(storeDetails, 'storeDetails.StoreDetails[1]', {});
  const additionalServices = get(storeValue, 'additionalServices', '');
  const generalDetails = get(storeValue, 'generalDetails', '');

  return (
    <React.Fragment>
      <div className="modal-backdrop show"></div>
      <div className="o-product__modal modal modal-filters__storeLocator show fade" id="filters-storeLocator-storeInformation" tabIndex="1" role="dialog" aria-labelledby="storeLocator-modal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <StoreModalHeader notRequireArrow={true} closeModal={closeModal} modalHeader={modalHeader} />
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <Label for="">Dirección:</Label>
                  {/* <Paragraph>Tuxtla Oriente, Carretera Chiapa de Corzo, Col. El Retiro, Tuxtla Gutiérrez, Chiapas, México, C.P. 29040</Paragraph> */}
                  {/* <Label for="">Horario:</Label> */}
                  {/* <Paragraph>Lunes a domingo de 11:00 a 21:00 hrs.</Paragraph> */}
                  <div dangerouslySetInnerHTML={{ __html: generalDetails }} />
                  {
                    isMobile === 'No' &&
                    <React.Fragment>
                      <Label for="">Servicios:</Label>
                      <Ul>
                        <div dangerouslySetInnerHTML={{ __html: additionalServices }} />
                      </Ul>
                    </React.Fragment>
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-lg-none">
                  <Link className="a-btn a-btn--primary mt-5" href="#" onClick={openModal}>Ver detalles</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}