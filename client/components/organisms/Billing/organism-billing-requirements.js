import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
import { FormButtons } from '../../molecules/MixinMolecules/MixinMolecules';
import Image from '../../atoms/Tagimage/Image';
import OptionList from '../../molecules/OptionList/molecule-text-list';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import './organism-billing-requirements.styl';

class invoiceCreatePage extends React.Component {
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
  render() {
    const rfcResponse = this.props.invoiceResponse;
    const options = this.props.options;
    const confirmationData = this.props.invoiceSubmitData;
    var buttonsPerson = [
      { text: "Consultar factura", btnClass: "a-btn a-btn--secondary ", size: "col-lg-3", order: 'order-0' },
      { text: "Solicitar factura", btnClass: "a-btn a-btn--primary mt-3 mt-lg-0 mb-3", typeButton: "submit", Idform: "", size: "col-lg-3", order: 'order-1' }
    ]

    var optionsList = {
      listType: 'ul',
      listClass: 'm-billingRequirements__list',
      listElements: [
        {
          elementType: 'spanWithAnchor',
          text: 'Ticket de compra (',
          class: 'a-billingRequirements__items',
          anchorText: 'Código de facturación',
          anchorClass: 'a-billingRequirements__links',
          text2: ')',
          class2: 'a-billingRequirements__items'

        },
        {
          elementType: 'span',
          text: 'RFC (Registro Federal de Contribuyentes)',
          class: 'a-billingRequirements__items'
        },
        {
          elementType: 'span',
          text: 'Correo electrónico (Opcional)',
          class: 'a-billingRequirements__items'
        }
      ]
    }

    return (
      <div className="o-billingRequirements__box mt-3">
        <div id="invoiceCreateTitle" className="row o-confirmationInvoice__rowTitle m-lg-2 mb-lg-4 mb-3 mt-lg-2 mt-4">
          <Span className="a-billingRequirements__title ml-lg-2 ml-4">¿Qué necesito para facturar?</Span>
        </div>
        <div className="o-confirmationInvoice__rowsFields mt-4 pb-3">
          {/*+molecule-list(optionsList)*/}
          {/*<OptionList value={optionsList} />*/}
          <ul className="m-billingRequirements__list">
            <li><Span className="a-billingRequirements__items">Ticket de compra (</Span><a class="a-billingRequirements__links" href="#">Código de facturación</a><Span className="a-billingRequirements__items">)</Span>
            </li>
            <li><Span className="a-billingRequirements__items">RFC (Registro Federal de Contribuyentes)</Span>
            </li>
            <li><Span className="a-billingRequirements__items">Correo electrónico (Opcional)</Span>
            </li>
          </ul>
        </div>
        <hr className="p-lg-0" />
        <div className="row o-billingRequirements__rowButtons mt-4">
          <div className="col-12">
            <FormButtons buttonsOptions={buttonsPerson} />
          </div>
          <div class="row mt-lg-4 ml-1 o-billingRequirements__aplication"><Span class="a-billingRequirements__items">* Para solicitar la factura de un producto vendido por un proveedor externo da </Span>
          <a class="a-billingRequirements__links ml-1" href="#">click aqui</a>
            </div>

        </div>
      </div>

    )
  }
}
export default invoiceCreatePage;