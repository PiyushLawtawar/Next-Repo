import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import  {  getPriceInFormat  }  from  '../../../helpers/utilities/utility';
import Span from '../../atoms/Span/Span';


class orderDetailsTotal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const staticLabels = this.props.staticLabels;
        const details = this.props.details;
        const somsOrderdetails = this.props.somsOrderdetails;       
        const DateOfPurchase = details && details.orderDetails && details.orderDetails.DateOfPurchase;
        const orderTotal = details && details.orderDetails && details.orderDetails.orderTotal;

        return (
            <React.Fragment>
                {somsOrderdetails && somsOrderdetails.IsSomsOrder ?

                    <div className="m-orderDetail__total m-orderDetail__card">
                        <div className="row m-row">
                            <div className="col-12 col-lg-3 m-col">
                                {somsOrderdetails && somsOrderdetails.dateOfPurchase && <Paragraph className="m-orderDetail__date">{staticLabels && staticLabels["pwa.OrderHistoryPage.purchase.submitted.label"]}
                                        {somsOrderdetails.dateOfPurchase && <Span className="a-orderDetail__dateValue"> {somsOrderdetails.dateOfPurchase}</Span>}
                                    </Paragraph>}
                            </div>
                           <div className="col-12 col-lg-3 m-col">
                                <Paragraph className="m-orderDetail__total">{staticLabels && staticLabels["pwa.OrderHistoryPage.total.lable"]}
                                    {somsOrderdetails && somsOrderdetails.total && <Span className="a-orderDetail__totalValue"> ${getPriceInFormat(somsOrderdetails.total)}</Span>}
                                </Paragraph>
                            </div>
                             <div className="col-12 col-lg-3 offset-lg-3 m-col">
                                <Paragraph className="m-orderDetail__total">{staticLabels && staticLabels["pwa.OrderHistoryPage.orderNum.lable"]}
                                    {somsOrderdetails && somsOrderdetails.OrderId && <Span className="a-orderDetail__dateValue">{somsOrderdetails.OrderId}</Span>}
                                </Paragraph>
                            </div>
                        </div>
                    </div>

                    :
                    <div className="m-orderDetail__total m-orderDetail__card">
                        <div className="row m-row">
                            <div className="col-12 col-lg-3 m-col">
                                {DateOfPurchase && <Paragraph className="m-orderDetail__date">{staticLabels && staticLabels["pwa.OrderHistoryPage.purchase.submitted.label"]}
                                    {DateOfPurchase && <Span className="a-orderDetail__dateValue"> {DateOfPurchase}</Span>}
                                </Paragraph>}
                            </div>
                            <div className="col-12 col-lg-3 offset-lg-6 m-col">
                                <Paragraph className="m-orderDetail__total">{staticLabels && staticLabels["pwa.orderDetailsPage.headertotal.lable"]}
                                    {orderTotal && <Span className="a-orderDetail__totalValue"> ${getPriceInFormat(orderTotal)}</Span>}
                                </Paragraph>
                            </div>
                        </div>
                    </div>}
            </React.Fragment>
        )
    }
}
export default orderDetailsTotal;