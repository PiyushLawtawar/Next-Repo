

/*include ../../atoms/Headlines/atom-headlines.pug
include ../../atoms/Paragraph/atom-paragraph.pug
include ../../atoms/Span/atom-span.pug
include ../MixinMolecules/mixin-molecules.pug
*/

import { H2 } from '../../atoms/HeadLines/Headlines'
import Paragraph from '../../atoms/Paragraph/Paragraph'
import Span from '../../atoms/Span/Span'
import { ParagraphWithBlock, ParagraphGroup } from '../../molecules/MixinMolecules/MixinMolecules'

//import './ProductSpecList.styl'


export default (props) => {
    let endecaData = props.mainContent.endecaProductInfo.contents[0].mainContent[0].record
    let longDescription =  endecaData.attributes ? endecaData.attributes['product.longDescription'][0] : endecaData['product.longDescription'][0]
    let dynamicAttribute = endecaData.attributes && endecaData.attributes['product.dynamicAttribute'] ? endecaData.attributes['product.dynamicAttribute'][0] : endecaData['product.dynamicAttribute'] ? endecaData['product.dynamicAttribute'][0] : ""
    
    return (


        <div className="m-product__detail pt-4 pb-4 pl-4 pr-4 product.longDescription">
          { props.selectedTab == "description"? <div className="tabs-content " data-tab="description">
                <div dangerouslySetInnerHTML={{__html:longDescription} }/>
                {/*<ParagraphWithBlock blockclass={props.blockclass} text={props.blockText} spanClassname="a-product__spanProductDescriptionTab" spanText="1072472462" />
                <ParagraphGroup blockclass="m-0 a-product__paragraphProductDescriptionTab" text="Chamarra Givenchy con bolsillos laterales" />
                <ParagraphGroup blockclass="m-0 a-product__paragraphProductDescriptionTab" text="Playera con logo de la marca en parte inferior izquierda, cuello redondo, costuras planas y suaves" />*/}
            </div>: null}

            {props.selectedTab == "specs" ? <div className="tabs-content" data-tab="specs">
                <div dangerouslySetInnerHTML={{__html:dynamicAttribute} }/>
                {/*<ParagraphWithBlock blockclass={props.blockclass} text={props.blockText} spanClassname={props.spanClassname} spanText="1072472462" />*/}
            </div>: null}
                        {props.selectedTab == "politics" ? <div className="tabs-content" data-tab="politics">
                <div>politics</div>
                {/*<ParagraphWithBlock blockclass={props.blockclass} text={props.blockText} spanClassname={props.spanClassname} spanText="1072472462" />*/}
            </div>: null}
        </div>

    );
}