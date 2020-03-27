import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import Icons from "../../atoms/Icons/Icons";
import { Buttonicon } from "../../molecules/MixinMolecules/MixinMolecules";
import { parentContext } from '../../../contexts/parentContext';
import isEmpty from 'lodash/isEmpty';

//import './SearchBarMobileModal.styl'

class SearchBarMobileModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { searchTerm, onChangeSearchbar, handleTypeheadHide, onKeypress, clearSearchbar } = this.props;

        return (
            <div className="m-header__searchBarMobile-modal">
                <div className="row align-items-center no-gutters">
                    <div className="col-auto text-left">
                        {/*  <button className="search-bar-mobile-back input-group-text" ripple="ripple"><i className="icon-back"></i>
                        <div className="ripple--container"></div></button>*/}

                        <Buttonicon classButton="search-bar-mobile-back input-group-text" classIcon="icon-back" handleClick={handleTypeheadHide} />

                    </div>

                    <div className="col text-center pt-2 pb-2">
                        <Input className="form-control search-bar-mobile" autoFocus type="text" placeholder="Buscar ..." value={searchTerm} onKeyPress={onKeypress} onChange={onChangeSearchbar} />
                    </div>
                    {
                        !isEmpty(searchTerm) &&
                        <div className="col-auto text-right">
                            <Buttonicon classButton="search-bar-mobile-close input-group-text" classIcon="icon-close" handleClick={clearSearchbar} />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default SearchBarMobileModal;