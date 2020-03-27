
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';

export default (props) => {

    //console.log("fnc", props.changeQty)
    return (
        <div className="m-stickyBar__qtyInputs">
            <Button className="a-btn a-btn--qty -minus" ripple="" handleClick={(e) => { let qtyValue = document.getElementById('a-stickyBar__inputQty').value; /*console.log("qtyValue", qtyValue);*/ qtyValue > 1 ? props.changeQty(qtyValue,e.target.innerHTML) : null }}>-
        </Button>
            <Input className="a-stickyBar__inputQty" type="text" value={props.qty} id="a-stickyBar__inputQty" onBlur ={(e) => props.onBlurQty(e)} onClick={props.removeValOnClick} onChange={(e) => { e.target.value >= 1 || e.target.value == "" ? props.changeQty(document.getElementById('a-stickyBar__inputQty').value, "") : null }} />
            <Button className="a-btn a-btn--qty -add" ripple="" handleClick={(e) => props.changeQty(document.getElementById('a-stickyBar__inputQty').value, e.target.innerHTML)}>+
        </Button>
        </div>

    );
}