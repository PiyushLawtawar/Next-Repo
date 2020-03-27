//import './OfferListTable.styl'

/*include ../../molecules/MixinMolecules/mixin-molecules
include ../../atoms/Buttons/atom-buttons.pug
include ../../molecules/Vendor/molecule-offerListVendor
include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Span/atom-span.pug*/


import Button from '../../atoms/Button/Button';
import OfferListVendor from '../../molecules/Vendor/OfferListVendor';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import isEmpty from 'lodash/isEmpty';
import { ParagraphWithSup } from '../../molecules/MixinMolecules/MixinMolecules';
import { GetWithDecimal } from '../../../helpers/utilities/utility';

import map from 'lodash/map';


export default (props) => {
  const sellersOfferDetails = props.alloffers && props.alloffers.sellersOfferDetails && props.alloffers.sellersOfferDetails.length > 0 ? props.alloffers.sellersOfferDetails : ''
  // console.log("sellersOfferDetails", sellersOfferDetails);
  const zipcodeFlag = (props.postalZipCode && props.postalZipCode !=='')?true:false;
  const clickCollectFlag = (props.storeNumber && props.storeNumber !=='')?true:false;
  const haveAddressInfo = !isEmpty(props.selectedAddressInfo);
  return (

    <div className="o-offerListTable container">

      <table className="m-table table table-hover col-12">
        <thead className="m-table-thead col-12">
          <tr className="row d-lg-none">
            <th className="col-12 text-left">
              <h1 className="a-offer-list__noteTitle">Ofertas</h1>
              <Paragraph className="a-offer-list__noteText">Las promociones pueden variar según el vendedor</Paragraph>
            </th>
          </tr>
          <tr className="row d-none d-lg-flex">
            <th className="col d-flex justify-content-center align-items-center">Precio</th>
            {
              props.colorAvaliability ? <th className="col d-flex justify-content-center align-items-center">Color</th> : null
            }
            {
              props.sizeAvaliability ? <th className="col d-flex justify-content-center align-items-center">Talla</th> : null
            }

            {/*<th className="col d-flex justify-content-center align-items-center">Talla</th>*/}
            {/*<th className="col d-flex justify-content-center align-items-center">Textura</th>*/}
            {/*<th className="col d-flex justify-content-center align-items-center">Material</th>*/}
            <th className="col d-flex justify-content-center align-items-center">Vendedor</th>
            {
               (clickCollectFlag || zipcodeFlag) ?   <th className="col d-flex justify-content-center align-items-center">Fecha estimada de entrega</th>:''
            }
         
            <th className="col d-flex justify-content-center align-items-center"></th>
          </tr>
        </thead>
        <tbody className="m-table-tbody col-12">

          {
            map(sellersOfferDetails, (item, index) =>
            
              <tr className="m-table-tr row">
                <td className="d-flex flex-column align-self-center col-12 col-lg text-left text-lg-center m-table-td -prices">
                  <div className="m-card a-card-price">
                    {
                      item.listPrice !== item.promoPrice ? <ParagraphWithSup className="a-card-price" text={'$ ' + GetWithDecimal(item.listPrice, '2').val} supText={GetWithDecimal(item.listPrice, '2').decimal} /> : ''
                    }


                  </div>
                  <div className="m-card a-card-discount">
                    {
                      item.promoPrice !== undefined ? <ParagraphWithSup className="a-card-discount" text={'$ ' + GetWithDecimal(item.promoPrice, '2').val} supText={GetWithDecimal(item.promoPrice, '2').decimal} /> : <ParagraphWithSup className="a-card-discount" text={'$ ' + GetWithDecimal(item.salePrice, '2').val} supText={GetWithDecimal(item.salePrice, '2').decimal} />

                    }


                  </div>
                </td>
                {
                  props.colorAvaliability ? <td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td d-none d-lg-block">{props.colorName}</td>
                    : null
                }
                {
                  props.sizeAvaliability ? <td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td d-none d-lg-block">{props.sizeName}</td>
                    : null
                }
                {/*<td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td d-none d-lg-block">Chica</td>*/}
                {/*<td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td d-none d-lg-block">Lisa</td>*/}
                {/*<td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td d-none d-lg-block">Seda</td>*/}
                <td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td" onClick={() => { props.redirectToSeller(item.sellerId) }}>
                  <OfferListVendor offerlink="a-offer-vendor__name d-lg-none" offerlinktext="vendido por" vendorlinktext={item.sellerName} vendorname="a-offer-vendor__name" vendornumber="a-offer-vendor__number" spanText={item.sellerRating} redirectToSeller={props.redirectToSeller} vendoroptions="a-offer-vendor__opinions" vendorspannumber={item.totalReviews} />
                </td>
                {
                  (clickCollectFlag || zipcodeFlag || haveAddressInfo)?
                <td className="d-flex flex-column align-self-center col-12 col-lg text-left text-lg-center m-table-td"><span className="d-lg-none">Fecha estimada de entrega: </span><span className="a-offerList-date--green">{clickCollectFlag?item.leadTimeForCnC:item.leadTimeForSL}</span></td>:''
                }
            
                <td className="d-flex align-self-center col-12 col-lg text-left text-lg-center m-table-td">
                  
                    <Button className="a-btn a-btn--primary" ripple="" handleClick={(e) => { props.addToCart(item) }} >Agregar a mi bolsa
                                    </Button>
                  
                </td>
              </tr>
            )
          }
          <tr className="m-table-tr row justify-content-center">
            <td className="col-12 m-table-td">
              {/*<Paragraph>Este producto no está disponible, selecciona otra caracteristica.
                                  </Paragraph>*/}
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  );
}
