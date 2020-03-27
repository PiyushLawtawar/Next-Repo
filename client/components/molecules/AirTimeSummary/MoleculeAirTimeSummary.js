import Paragraph from '../../atoms/Paragraph/Paragraph';
import { H2 } from '../../atoms/HeadLines/Headlines';
import { getPriceInFormat } from '../../../helpers/utilities/utility';

class MoleculeAirTimeSummary extends React.Component {
  render() {
    const rechargeSubTotal = this.props.rechargeSubTotal;
    const staticLabels = this.props.staticLabels && this.props.staticLabels;

    return (
      <div className="col-12">

        <div className="row">
          <div className="col-12">
            <H2 className="a-airTime-sub__title -summary" headLineText={staticLabels["pwa.airtimeCheckoutPage.rechargeSummary.text"]} />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-2">
            <hr />
          </div>
        </div>

        <div className="row">
          <div className="col-8">
            <Paragraph className="a-box__resume">{staticLabels["pwa.airtimeCheckoutPage.subTotal.text"] + "( " + this.props.rechargeTotal + ' ' + staticLabels["pwa.airtimeCheckoutPage.reload.text"] + "): "}</Paragraph>
          </div>
          <div className="col-4 text-right">
            <Paragraph className="a-box__resume">${getPriceInFormat(rechargeSubTotal)}</Paragraph>
          </div>
        </div>

        <div className="row">
          <div className="col-8">
            <Paragraph className="a-box__resume -totalLabel">{staticLabels["pwa.airtimeCheckoutPage.total.text"]}</Paragraph>
          </div>
          <div className="col-4 text-right">
            <Paragraph className="a-box__resume -totalPrice">${getPriceInFormat(rechargeSubTotal)}</Paragraph>
          </div>
        </div>

      </div>
    );
  }
}
export default MoleculeAirTimeSummary;