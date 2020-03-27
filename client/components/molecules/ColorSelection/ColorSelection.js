//import './ColorSelection.styl'

import Span from '../../atoms/Span/Span'
import Ul from '../../atoms/Ul/Ul'
import List from '../../atoms/List/List'
import Label from '../../atoms/Label/Label'
import Button from '../../atoms/Button/Button'
import Icons from '../../atoms/Icons/Icons'
import map from 'lodash/map';

/*include ../../atoms/Span/atom-span*/
export default (props) => {
    // console.log("skuAttributeMap", props.skuAttributeMap)
    var finalSortedSize = [];
    Object.keys(props.skuAttributeMap).forEach(key => {
        let size = props.skuAttributeMap[key];
        finalSortedSize.push({
            size: key,
            color: size.color,
            colorHexaCodeValue: size.colorHexaCodeValue
        })
    });
    return (
        <div className="col-3 m-offerList-colorSelection a-plp-color d-none d-lg-block mx-3 px-0">
            {
                props.colorAvaliability ? <Label className="m-offerList-label__opotions">Color: {props.colorName}</Label> : null

            }
            <Ul className="m-product__colorList">
                {
                    map(finalSortedSize, (item, index) =>
                        props.colorAvaliability ?
                            <List className={props.activeColorIndex === index ? 'a-productColor__item a-product__color active' : 'a-productColor__item a-product__color'}><Span spanClassname="atom-color" style={{ background: item.colorHexaCodeValue }}
                                onClick={(e) => props.getVariantsByColor('color', item.color, props.productId, index, item.size)} /></List> : null

                    )
                }
            </Ul>
            {/*
            <div className="col-10 m-colorSlection-scroll px-0">
                <List className="a-productColor__item a-product__color"><Span spanClassname="atom-color" data-color="#c91a34" style={{ background: "rgb(247, 160, 172)" }}/></List>
                    <List className="a-productColor__item a-product__color"><Span spanClassname="atom-color" data-color="#c91a34" style={{ background: "rgb(247, 160, 172)" }}/></List>
                    <List className="a-productColor__item a-product__color"><Span spanClassname="atom-color" data-color="#c91a34" style={{ background: "rgb(247, 160, 172)" }}/></List> 
                    <List className="a-productColor__item a-product__color"><Span spanClassname="atom-color" data-color="#c91a34" style={{ background: "rgb(247, 160, 172)" }}/></List>
                    <List className="a-productColor__item a-product__color"><Span spanClassname="atom-color" data-color="#c91a34" style={{ background: "rgb(247, 160, 172)" }}/></List> 
               
            </div>*/}
            {/*{
                props.colorAvaliability ? <Button className="col-2 a-plus__icon pl-0 mx-0 d-flex align-items-center" id="btnMoreColors"><Icons className="icon-sum" /></Button> : null
            }*/}
        </div>

    );
}