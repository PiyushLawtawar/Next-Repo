
import Button from "../../atoms/Button/Button";
import Icons from "../../atoms/Icons/Icons";
//import './ButtonGoTop.styl';

export default (props) => (
    <div className="m-button__goTop" id="goToTop" style={{opacity:1}}>
        <Button className={getButtonCssClass(props.chanelBrandJSON)} handleClick={props.handleGoToTop}>
            <Icons className={getArrowCssClass(props.chanelBrandJSON)}  />
        </Button>
    </div>
)
const getButtonCssClass=(chanelBrandJSON)=>{
   let css = 'a-btn__goTop';   
   if(chanelBrandJSON && chanelBrandJSON['buttonGoTop_css_class'] && typeof chanelBrandJSON['buttonGoTop_css_class'] !=='undefined' && chanelBrandJSON['buttonGoTop_css_class'].trim().length !==0) {
     return chanelBrandJSON['buttonGoTop_css_class'];
   }
   return css;
}
 const getArrowCssClass=(chanelBrandJSON)=>{
    let css = 'icon-arrow_up';   
    if(chanelBrandJSON && chanelBrandJSON['iconArrowUp_css_class'] && typeof chanelBrandJSON['iconArrowUp_css_class'] !=='undefined'&& chanelBrandJSON['iconArrowUp_css_class'].trim().length !==0) {
      return chanelBrandJSON['iconArrowUp_css_class'];
    }
    return css;
 }
