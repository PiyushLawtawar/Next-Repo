
import Tab from '../../molecules/Tab/Tab';
import ProductPromoContentWeb from '../../molecules/ProductPromo/ProductPromoContentWeb';
import PdpAccordion from '../../molecules/Accordion/PdpAccordion';

export default (props) => {
	return (

		<div className="o-product__productSpecsPromos" id="o-product__productSpecsPromos">
			<PdpAccordion forcePadding={true} bodyClass="card-body pt-0 pb-lg-4" headText={props.staticLabels && props.staticLabels['pdpPage.offersNpromotions.label'] || "pdpPage.offersNpromotions.label"} isopenStatus="show"> {/*changes made for Pdp staticlabel issue --  addedd s to staticlabel,, && modified the class to pb-lg-4 for bug id 22455 */}
				<ProductPromoContentWeb productPromotion={props.productPromotion} promotionInfo={props.promotionInfo} blockclass="a-product__paragraphProductPromo m-0 a-product__spec" spanClassname="a-product__productPromoDescription" text="25%:" spanText="de descuento - Presupuesto Liverpool" />
			</PdpAccordion>

		</div>

	);
}