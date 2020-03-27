import Paragraph from '../../atoms/Paragraph/Paragraph';
import Button from '../../atoms/Button/Button';
import Link from '../../atoms/Link/Link';
import MoleculeAirTimeSummary from '../../molecules/AirTimeSummary/MoleculeAirTimeSummary'

class OrganimsAirTimeSummary extends React.Component {
    FinishRechargeService = () => {
        this.props.finishRechargeForAirTime();
    }

    render() {
        const staticLabels = this.props.staticLabels && this.props.staticLabels;
        return (
            <React.Fragment>
                <div className="o-box mb-5 d-none d-lg-block">
                    <MoleculeAirTimeSummary rechargeSubTotal={this.props.rechargeSubTotal} staticLabels={staticLabels} rechargeTotal={this.props.rechargeTotal}/>
                </div>
                <div className="row">
                    <div className="col-12 d-none d-lg-block">
                        <Button className="a-btn a-btn--primary a-airTime-end__recharge" onClick={this.FinishRechargeService}>{staticLabels && staticLabels["pwa.airtimeCheckoutPage.buyButton.text"]}</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-none d-lg-block">
                        <div dangerouslySetInnerHTML={{ __html: staticLabels && staticLabels["pwa.airTimeRechargePage.termsAndCondition.message"] }} >
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default OrganimsAirTimeSummary;
