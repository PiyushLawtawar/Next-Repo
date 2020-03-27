import Span from '../../atoms/Span/Span';
import { H1 } from '../../atoms/HeadLines/Headlines';
export default (props) => {
    return (
        <H1 className="a-headline__marketplace mb-4" headLineText={props.plpSellerName + " • "} haveChildren={true}><Span>{props.sellerLocation}</Span></H1>
    );   
}