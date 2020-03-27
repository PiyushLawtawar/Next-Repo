//import './CheckoutEstablishment.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import ModalHeader from '../../molecules/Modals/ModalHeader'

export default (props) => {
let modalHeader = {
        title: 'Establecimientos más cercanos a tu ubicación',
        titleType: 'h4',
        headlineAttributes: {
            "id":"establishments"
        },
        close: true,
        back: true,
        buttonClass: 'close',
        buttonAttributes: {
            "type":"button",
            "data-dismiss":"modal",
            "aria-label":"Close",
            "id":"closeBothModals"
        }
    }

    let modalHeaderMobile = {
        title: 'Establecimientos cercanos',
        titleType: 'h4',
        headlineAttributes: {
            "id":"establishments"
        },
        close: true,
        back: true,
        buttonClass: 'close',
        buttonAttributes: {
            "type":"button",
            "data-dismiss":"modal",
            "aria-label":"Close",
            "id":"closeBothModals"
        }
    }

return(
 

<div className="o-product__modal modal fade show" id="establishments2" tabindex="2" role="dialog" aria-labelledby="description-modal">
      <div className="modal-dialog modal-dialog-centered establishmentsModal" role="document">
        <div className="modal-content">
          <div className="d-none d-md-block">
                <ModalHeader modalHeader={modalHeader} />
          </div>
          <div className="d-block d-md-none">
                <ModalHeader modalHeader={modalHeaderMobile} />
          </div>
          <div className="modal-body">
            <div className="col-12 m-iframeContainer">
              <iframe width="100%" height="100%" src="https://www.paynet.com.mx/mapa-tiendas/index.html?locationNotAllowed=true"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>


);
}

