import Paragraph from '../../atoms/Paragraph/Paragraph';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import MaterialInputCheckBox from '../MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialInputRadio from '../MaterialInputRadio/MaterialInputRadio';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export const CheckboxRadioList = (props) => {
// export default (props) => {
    // const arr=[];
    const {
		mainDivClass = '',
		titleText = '',
		titleClass = '',
        ulCustomClass = '',
		listContainerClass = '',
		liType = '',
        labelText = '',
        inputId = '',
        checked = '',
		customListColCLass = '',
		liElements = [],
        onSelectGiftItem = null,
		captionTitle = '',
        captionClass = '',
        handleCheckboxChange = null
	} = props.options;
    return (
        <div className={mainDivClass}>
            {!isEmpty(titleText) &&
                <div className="row">
                    <div className="col-12 mb-2 mt-2">
                        <Paragraph className={titleClass}>{titleText}</Paragraph>
                    </div>
                </div>
            }
            <div className="row">
                <div className={customListColCLass}>
                    <div className={listContainerClass}>
                        <Ul className={ulCustomClass}>
                            {liType === 'radio' && map(liElements, (item, index) => {
                                    return <List key={index} className={item.liClass}>
                                            <MaterialInputRadio options={item} onSelectGiftItem={onSelectGiftItem ? () => onSelectGiftItem(index, item.gwpProductId, item.associatedSkuId, item.productType) : null}/>
                                        </List>
                            })}
                            {liType === 'checkbox' && map(liElements, (item, index) => {
                                return <List key={index}>
                                    <MaterialInputCheckBox options={item} text={item.labelText} id={item.inputId} onChange={handleCheckboxChange} checked={item.checked}/>
                                        </List>
                            })}
                        </Ul>
                    </div>
                </div>
                {!isEmpty(captionTitle) && 
                    <div className="col-12 mt-2 mb-3">
                        <Paragraph className={captionClass}>{captionTitle}</Paragraph>
                    </div>
                }
            </div>
        </div>
    );
}