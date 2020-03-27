
import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import {Buttonicon} from "../../molecules/MixinMolecules/MixinMolecules";
import isEmpty from 'lodash/isEmpty';
//import './Searchbar.styl'
export default (props) => {
//  console.log(props.type,'data')

 
    return (
        <div className={props.searchclass}>
            <div className="input-group">
                <Input className={!isEmpty(props.inputClassName) ? props.inputClassName: `form-control search-bar plp-no__results`} label="Buscar ..."  type={props.type ? props.type :"text"} placeholder={props.placeholder} onKeyPress={props.onKeypress} value={props.searchTerm} onClick={props.handleSearchBarShow} onChange={props.onChangeSearchbar} maxLength={props.maxLength}/>               
                <div className="input-group-append">
                        <Buttonicon handleClick={props.redirectToSearchPage} classButton="input-group-text" classIcon={props.searchbarClicked ? 'icon-zoom icon-color': 'icon-zoom'}/>
                 </div>
            </div>
        </div>
    );
}








