//import './StickyBar.styl'

/*include ../../atoms/Anchor/atom-anchor*/

import Link from "../../atoms/Link/Link";

import Ul from "../../atoms/Ul/Ul";
import isEmpty from 'lodash/isEmpty'
import List from "../../atoms/List/List";

const setScroll = (elemId, props = {}, elem) => {
  if (element != 'undefined') {
    var element = document.getElementById(elemId);
    const offset = 115;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;


    window.scrollTo({
      top: offsetPosition,
    });

    props && !isEmpty(props) && props.funChangeTabs(elem ? elem.currentTarget.innerHTML : "")


  }

  // document.getElementById(elemId).scrollIntoView({behavior: "smooth", block: "start"})
}

export default (props) => {
  const propList = props.List || [];
  const { staticLabels = {}, getModalDatas = {} } = props; /*changes for showing policies in stickybar  */
  const policies = !isEmpty(getModalDatas) && getModalDatas.productPolicies || "";  /*changes for showing policies in stickybar  */
  const optionList = propList.length > 0 ? props.List.map((ListValues, i) => <List key={i}><Link className={props.stickyLink} href={props.href} >{ListValues}</Link>
  </List>) : ""
  return (
    <div className="m-stickyBar__options">
      <Ul>
        {props.tabDesc == 1 &&
          <li><Link className="a-stickyBar__link -desc" href="#" onClick={(e) => setScroll("o-product__productSpecsDetails", props, e)}>{staticLabels && staticLabels["PD.desc.text"] || "PD.desc.text"}</Link>
          </li>
        }
        {props.tabCarac == 1 &&
          <li><Link className="a-stickyBar__link -specs" href="#" onClick={(e) => setScroll("o-product__productSpecsDetails", props, e)}>{staticLabels && staticLabels["pdpPage.characteristic.label"] || "pdpPage.characteristic.label"}</Link>
          </li>
        }
        {/*changes for showing policies in stickybar - start  */}
        {policies && policies != "" && <li><Link className="a-stickyBar__link -specs" href="#" onClick={(e) => setScroll("o-product__productSpecsDetails", props, e)}>{staticLabels && staticLabels["pdpPage.Políticas.label"] || "Políticas"}</Link>
        </li>}
       
        <li><Link className="a-stickyBar__link -promos" href="#" onClick={(e) => setScroll("o-product__productSpecsPromos", props)}>{staticLabels && staticLabels["pdpPage.offersNpromotions.label"] || "pdpPage.offersNpromotions.label"}</Link>
        </li>
         {/*changes for showing policies in stickybar - end  */}
        {/*{optionList}*/}
      </Ul>
    </div>

  );
}