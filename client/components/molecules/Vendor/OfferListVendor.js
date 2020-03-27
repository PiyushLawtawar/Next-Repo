import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';
import Link from '../../atoms/Link/Link';
//import './OfferListVendor.styl'
export default (props) => {
    return(
        <Paragraph className="m-vendor">
            <Link className={props.offerlink} href="#">{props.offerlinktext} </Link>
            <Link className={props.vendorname} href="#">{props.vendorlinktext}</Link>
            <Span className={props.vendornumber}  >{props.spanText} </Span>
            <Span className={props.vendoroptions}>({props.vendorspannumber} opiniones)</Span>
        </Paragraph>
    );
}
