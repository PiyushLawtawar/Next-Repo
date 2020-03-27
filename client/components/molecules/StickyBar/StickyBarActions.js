//import './StickyBar.styl'

/*include ../../atoms/Paragraph/atom-paragraph
include ../../molecules/MixinMolecules/mixin-molecules
include ../../atoms/Buttons/atom-buttons 
include molecule-sticky-bar-qty.pug*/


import Paragraph from '../../atoms/Paragraph/Paragraph'; 
import Button from '../../atoms/Button/Button'; 
//import Paragraph from '../../atoms/Paragraph/Paragraph'; 
import StickyBarQty from '../../molecules/StickyBar/StickyBarQty';


export default (props) => {

   let Agregarbtn =  props.staticLabels && props.staticLabels['pdpPage.Agregar_mi_bolsa.text'] || 'pdpPage.Agregar_mi_bolsa.text'; 
  let hydbtn = props.staticLabels && props.staticLabels['pdpPage.Comprar_y_obtener.text'] || 'pdpPage.Comprar_y_obtener.text'; 
  let stikybtnval = '';
  if(props.productType == 'Digital')
  {
    stikybtnval = hydbtn;
  } else stikybtnval = Agregarbtn;
//console.log("props===",props)
return (
       <div className={props.stickyAction}>
                <div className="row m-0">
                  {props.productType == 'Digital' ?
                    <div className="col-5 p-0 offset-5">
                      <div className={props.addButton}>
                          <Button className={props.primaryBtn} ripple="" handleClick={props.handleAddToMyBag}>{stikybtnval}</Button>
                      </div>
                    </div>
                    :
                    <React.Fragment>
                      <div className="col-2 p-0">
                        <div className={props.qtyLabel}>
                                        <Paragraph>Cantidad:
                                        </Paragraph>
                        </div>
                      </div>
                      <div className="col-5 p-0">
                          <StickyBarQty onBlurQty={props.onBlurQty} removeValOnClick={props.removeValOnClick} changeQty={props.changeQty} qty={props.qty} inputQty={props.inputQty}/>
                      </div>
                      <div className="col-5 p-0">
                        <div className={props.addButton}>
                            <Button className={props.primaryBtn} ripple="" handleClick={props.handleAddToMyBag}>{stikybtnval}</Button>
                        </div>
                      </div>
                    </React.Fragment>
                  }
                </div>
              </div>

);
}