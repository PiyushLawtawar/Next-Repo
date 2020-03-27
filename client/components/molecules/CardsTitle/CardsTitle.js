import { GetLinkData } from '../../../helpers/utilities/utility';
import Paragraph from  "../../atoms/Paragraph/Paragraph";
import Link from  "../../atoms/Link/Link";
//import './CardsTitle.styl';

export default (props) => {
    const { categoryName, viewUrl } = props.data || '';

    const catUrl = viewUrl || '';
    const inputData = {
        catId: catUrl.split('/').pop(),
        catName: catUrl.split('/')[1],
        always: "PLP",
        pageName: 'CLP'
    } 
    const { href, asInfo } = GetLinkData(inputData);

    return (
        <div className="m-cards-title mt-2 mb-4 my-0 my-lg-4">
            <div className="rectangle"></div>
            <Paragraph>{categoryName}</Paragraph>
            <Link href={href} asInfo={asInfo}>Ver todo</Link>
        </div>
    );
}