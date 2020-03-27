import React from 'react';
import Label from '../../atoms/Label/Label';
import Span from '../../atoms/Span/Span';
import Stars from '../../molecules/Stars/molecule-stars';
import Button from '../../atoms/Button/Button';
import Ratings from '../../molecules/Ratings/Ratings';
import Link from '../../atoms/Link/Link';
// import './organismTrackingRating.styl';

class OrganismTrackingRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            rating: '',
            commerceItems: [],
            focus: false
        }
    }

    componentDidMount() {
        this.setState({ commerceItems: this.props && this.props.commerceItems && this.props.commerceItems[0] })
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    handleClick = (rating) => {
        this.setState({ rating: rating })
    }

    onCustomerRating = () => {
        let payload = {
            "trackingNumber": this.props.trackingNumber,
            "comment": this.state.value,
            "rating": this.state.rating
        }
        if (this.props.trackingNumber && this.state.value && this.state.rating) {
            this.props.onCustomerRating(payload);
        }

    }

    onFocus = () => {
        this.setState({ focus: true })
    }

    onBlur = (e) => {
        this.setState({ focus: false })
    }

    render() {
        const commerceItems = this.props.commerceItems;
        const staticLabels = this.props.staticLabels;
        // console.log('staticLabels',staticLabels)
        const ratingInfo = {
            ratingAvg: commerceItems[0].customerRating,
            ratingCount: commerceItems[0].customerRating

        };

        const trackingOrder_Rating_type = this.props.mobile ? 'mobile' : 'desktop';


        return (
            <React.Fragment>
                {trackingOrder_Rating_type == 'desktop' ?
                    <div>
                        <div className="o-box d-none d-lg-block o-trackingRatings__box">
                            <div className="container o-trackingRatings__container">
                                {commerceItems[0].customerRating === 0 && commerceItems[0].customerComment === null &&
                                    <React.Fragment>
                                        <div className="row">
                                            <span className="o-trackingRatings__company">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sellerTitle"]} {commerceItems[0].sellerName}</span>
                                            <Label className="o-trackingRatings__required">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.requiredData"]}</Label>
                                        </div>

                                        <div className="row">
                                            <Link className="o-trackingRatings__infoSeller" href={"/tienda/vendedor/" + commerceItems[0].sellerOperatorId}>
                                                {staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sellerMoreInfo"]}
                                    </Link>
                                        </div>
                                        <div className="row o-trackingRatings__evaluateRow">
                                            <span className="o-trackingRatings__requiredIcon">*</span>
                                            <span className="o-trackingRatings__evaluate">Califica al vendedor</span>

                                            <Stars ratingInfo={ratingInfo} handleClick={this.handleClick} orderTracking classname="o-trackingRatings__stars" />
                                        </div>
                                        <div className="row o-trackingRatings__textfield">
                                            <div className="o-findGiftTable__items thirdParties"></div>
                                            <div className={`mdc-text-field mdc-text-field--textarea ${this.state.focus ? 'mdc-text-field--focused' : ''}`} onFocus={this.onFocus} onBlur={this.onBlur}>
                                                <div className="mdc-text-field-character-counter">{this.state.value.length} / 140</div>
                                                <textarea className="mdc-text-field__input m-tracking__ratingTextarea" id="textarea" rows="4" cols="40" maxlength="140" onChange={this.handleChange} value={this.state.value}></textarea>
                                                <div className={`mdc-notched-outline mdc-notched-outline--upgraded ${this.state.focus || this.state.value ? 'mdc-notched-outline--notched' : ''}`}>
                                                    <div className="mdc-notched-outline__leading"></div>
                                                    <div className="mdc-notched-outline__notch" style={{'width': this.state.focus ? '278px' :''}}>
                                                        <label className={`mdc-floating-label ${this.state.focus || this.state.value ? "mdc-floating-label--float-above" : ""}`} for="textarea">El producto llegó en excelentes condiciones y en la fecha</label>
                                                    </div>
                                                    <div className="mdc-notched-outline__trailing"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row o-trackingRatings__btn">
                                            <div className="col-lg-3 col-md-4">
                                                {this.state.value.length > 4 && this.state.rating > 0 ?
                                                    <Button className="a-btn a-btn--primary a-btn__trackingRatings" onClick={this.onCustomerRating}>{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sendRating"]}</Button> :
                                                    <Button className="a-btn a-btn--primary a-btn__trackingRatings" disabled >{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sendRating"]}</Button>
                                                }
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }
                                {commerceItems[0].customerComment && commerceItems[0].customerRating &&
                                    <div className="container o-trackingRatings__evaluatedContainer ">
                                        <div className="row">
                                            <span className="o-trackingRatings__evaluatedCompany">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.qualifiedTo"]} {commerceItems[0].sellerName}</span>
                                        </div>
                                        <div className="row o-trackingRatings__evaluatedRow">
                                            <Ratings ratingInfo={ratingInfo} classname='o-trackingRatings__stars--evaluated' />
                                        </div>
                                        <div className="row o-trackingRatings__textfield">
                                            <span className="o-trackingRatings__evaluatedText">{commerceItems[0].customerComment}</span>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                    :
                    < div>
                        <div className="o-box o-trackingRatings__box--mobile">
                            {commerceItems[0].customerRating === 0 && commerceItems[0].customerComment === null &&
                                <div className="container o-trackingRatings__container--mobile">

                                    <div>
                                        <div className="o-trackingRatings__divRow--mobile">
                                            <span className="o-trackingRatings__company--mobile">{commerceItems[0].sellerName}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="div o-trackingRatings__divRow--mobile">
                                            <Link className="o-trackingRatings__infoSeller"  href={"/tienda/vendedor/" + commerceItems[0].sellerOperatorId}>
                                                {staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sellerMoreInfo"]}
                                        </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="o-trackingRatings_divMandatory">
                                            <Label className="o-trackingRatings__required--mobile">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.requiredData"]}</Label>
                                        </div>
                                    </div>

                                    <div className="row o-trackingRatings__evaluateRow--mobile">
                                        <span className="o-trackingRatings__requiredIcon--mobile">*</span>
                                        <span className="o-trackingRatings__evaluate--mobile">Califica al vendedor</span>
                                    </div>

                                    <div className="row o-trackingRatings__evaluateStars--mobile">

                                        <Stars ratingInfo={ratingInfo} handleClick={this.handleClick} orderTracking classname="o-trackingRatings__stars"/>
                                    </div>


                                    <div className="row o-trackingRatings__textfield">
                                        <div className="o-findGiftTable__items thirdParties">
                                        </div>
                                        <div className={`mdc-text-field mdc-text-field--textarea ${this.state.focus ? 'mdc-text-field--focused' : ''}`} onFocus={this.onFocus} onBlur={this.onBlur}>
                                            <div className="mdc-text-field-character-counter">{this.state.value.length} /140</div>
                                            <textarea className="mdc-text-field__input m-tracking__ratingTextarea m-tracking__ratingTextarea1" onChange={this.handleChange} value={this.state.value} id="textarea" rows="4" cols="40" maxlength="140"></textarea>
                                            <div className={`mdc-notched-outline mdc-notched-outline--upgraded ${this.state.focus || this.state.value ? 'mdc-notched-outline--notched' : ''}`}>
                                                <div className="mdc-notched-outline__leading"></div>
                                                <div className="mdc-notched-outline__notch">
                                                    <label className={`mdc-floating-label ${this.state.focus || this.state.value ? "mdc-floating-label--float-above" : ""}`}for="textarea" >El producto llegó en excelentes condiciones y en la fecha</label>
                                                </div>
                                                <div className="mdc-notched-outline__trailing"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            }

                            {commerceItems[0].customerComment && commerceItems[0].customerRating &&
                                <div className="container o-trackingRatings__evaluatedContainer">
                                    <div className="o-trackingRatings__divRow--mobile">
                                        <span className="o-trackingRatings__evaluatedCompany--mobile">{commerceItems[0].sellerName}</span>
                                    </div>

                                    <div className="row">
                                        <span className="o-trackingRatings__evaluatedCompany">{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.qualifiedTo"]} {commerceItems[0].sellerName}</span>
                                    </div>

                                    <div className="row o-trackingRatings__evaluatedRow">

                                        <Ratings ratingInfo={ratingInfo} classname='o-trackingRatings__stars--evaluated' />
                                    </div>

                                    <div className="row o-trackingRatings__textfield">
                                        <span className="o-trackingRatings__evaluatedText">{commerceItems[0].customerComment}</span>
                                    </div>
                                </div>}

                        </div>
                        {commerceItems[0].customerRating === 0 && commerceItems[0].customerComment === null &&
                            <div className="row o-trackingRatings__btn">
                                <div className="col-lg-12">
                                    {this.state.value.length > 4 && this.state.rating > 0 ?
                                        <Button className="a-btn a-btn--primary a-btn__trackingRatings--mobile" onClick={this.onCustomerRating}>{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sendRating"]}</Button> :
                                        <Button className="a-btn a-btn--primary a-btn__trackingRatings--mobile" disabled onClick={this.onCustomerRating}>{staticLabels && staticLabels["pwa.OrderHistoryPage.ship.sendRating"]}</Button>
                                    }
                                </div>
                            </div>}
                    </div>}
            </React.Fragment>
        )
    }
}
export default OrganismTrackingRating;