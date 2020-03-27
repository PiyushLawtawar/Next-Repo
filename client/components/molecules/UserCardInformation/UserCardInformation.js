import Label from '../../atoms/Label/Label';
import Span from '../../atoms/Span/Span';

const isEvenOrOdd = (val) =>{
    let cardLengt = val;
    if(val%2 === 0){
      cardLengt = cardLengt - 3;
    }else{
      cardLengt = cardLengt - 2;
    }  
    return cardLengt;
}
export default (props) => {
// start defect 23406 again uncommented for 23622
    //let encrypt = "* ";
    let cardLengt = props.cardNumber && props.cardNumber.length;
    // let encrypt = "xxxx xxxx xxxx";
    let encrypt = "* ";
    if(cardLengt !== 16){
       cardLengt = isEvenOrOdd(cardLengt); 
       encrypt = encrypt.substr(-cardLengt);
    }
// end defect 23406
const { containerClass,titleClass, titleText, cardNumber, cardNumberClass,thirdText, thirdTextClass,isThereThirdText } = props.options || props;

return(
<div className={props.containerClass}>
    <Label className={props.titleClass} for={props.htmlfor}>{props.titleText}</Label>
    <Span className={props.cardNumberClass}>{encrypt} {props.cardNumber && props.cardNumber.substr(props.cardNumber.length - 4)}</Span>
    {
        (props.defaultCreditCardId === props.repositoryId)?  <Span className={props.thirdTextClass}>{props.thirdText}</Span> : null
    }
   
</div>

);
}
