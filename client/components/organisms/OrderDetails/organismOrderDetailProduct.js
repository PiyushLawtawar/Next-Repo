import React from 'react';
import MoleculeFigure from '../../molecules/Figure/molecule-Figure';
import MoleculeOrderDetailStatus from '../../molecules/OrderDetails/molecule-order-detail-status';
import MoleculeOrderDetailProduct from '../../molecules/OrderDetails/molecule-order-detail-product';
import Router from 'next/router';
import { Path } from '../../../helpers/config/config';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';
import './organismOrderDetail.styl';



class orderDetailProduct extends React.Component {
    constructor(props) {
        super(props);
    }

    redirectToUrl = (displayName, productId) => {
        let productName = displayName.toLowerCase().replace(/ /g, '-');
        const url = '/tienda/pdp/' + productName + '/' + productId;
        Router.push(url);

    }
    render() {
        const staticLabels = this.props.staticLabels;
        const IsSomsOrder = this.props.IsSomsOrder;
        const product = this.props.product;
        const commerceItems = this.props.product && this.props.product.commerceItems;
        // console.log('commerceItems', product)

        return (
            <React.Fragment>

                {IsSomsOrder ?
                    <React.Fragment>
                        <div className="row o-row o-orderDetail__product">
                            <div className="col-4 m-col col-lg-3 px-0 px-lg-3">
                                {product.InventoryStatus ?
                                    <figure className="m-figure">
                                        <Image showLoader className="a-order__product__image" src={product.SmallImage ? product.SmallImage : Path.onImgError} alt={product.DisplayName} onClick={() => this.redirectToUrl(product.DisplayName, data.productId)} />
                                    </figure>
                                    :
                                    <React.Fragment>
                                        <figure className="product-notAvailable">
                                            <Image showLoader className="a-order__product__image" src={product.SmallImage ? product.SmallImage : Path.onImgError} alt={product.DisplayName} />
                                            <Paragraph className="prueba">No disponible </Paragraph>
                                        </figure>

                                    </React.Fragment>
                                }

                            </div>
                            <div className="col-8 m-col col-lg-9 px-lg-0">
                                <MoleculeOrderDetailProduct staticLabels={staticLabels} SomsproductOptions={product} IsSomsOrder={IsSomsOrder} />
                            </div>
                        </div>

                    </React.Fragment>

                    :
                    <React.Fragment>
                        {/*<MoleculeFigure staticLabels={staticLabels}  src={productDetails.src} imageAlt={productDetails.alt} imageClassName={productDetails.smallImage}/>*/}
                        {commerceItems && commerceItems.length > 0 ? commerceItems.map((data, index) =>
                            <div className="row o-row o-orderDetail__product" key={index}>
                                <div className="col-4 m-col col-lg-3 px-0 px-lg-3">
                                    {(data.inventoryStatus || data.productType ==='Digital' ) ? /*23996 */
                                        <figure className="m-figure">
                                            <Image showLoader className="a-order__product__image" src={data.smallImage ? data.smallImage : Path.onImgError} alt={data.displayName} onClick={() => this.redirectToUrl(data.displayName, data.productId)} />
                                        </figure>
                                        :
                                        <React.Fragment>
                                            <figure className="product-notAvailable">
                                                <Image showLoader className="a-order__product__image" src={data.smallImage ? data.smallImage : Path.onImgError} alt={data.displayName} />
                                                <Paragraph className="prueba">No disponible </Paragraph>
                                            </figure>
                                        </React.Fragment>
                                    }

                                </div>
                                <div className="col-8 m-col col-lg-9 px-lg-0">
                                    <MoleculeOrderDetailProduct key={index} staticLabels={staticLabels} productOptions={data} />
                                </div>
                            </div>
                        ) : ''}
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}
export default orderDetailProduct;
