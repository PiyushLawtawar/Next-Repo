import {HeadlineIconSameLevel} from '.././molecules/MixinMolecules/MixinMolecules';
import { GetLinkData } from '../../helpers/utilities/utility';
import Button from '.././atoms/Button/Button';
import Link from  "../atoms/Link/Link";
export default (props) => {
  const { categoryName, viewUrl } = props.data || {};

  const catUrl = viewUrl || '';
  const inputData = {
      catId: catUrl.split('/').pop(),
      catName: catUrl.split('/')[1],
      always: "PLP",
      pageName: 'CLP'
  } 
  const { href, asInfo } = GetLinkData(inputData);

  return (
    <div className="d-lg-none o-clp-headingButton">
      <Button>
        <div className="container-fluid">
          <div className="container p-0">
            <div className="row">            
               <Link href={href} asInfo={asInfo}>  <HeadlineIconSameLevel headLineText={categoryName} iconClass="icon-arrow_right"/>  </Link>            
            </div>
          </div>
        </div>
      </Button>
    </div>
  );
}