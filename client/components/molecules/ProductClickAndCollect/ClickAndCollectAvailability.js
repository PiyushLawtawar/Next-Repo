//import React from 'react';
/*import List from '../../atoms/List/List';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Image from '../../atoms/Tagimage/Image';*/

import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Paragraph from "../../atoms/Paragraph/Paragraph";

import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';

//import './ClickAndCollectAvailability.styl';

export default (props) => {


    let storeList = props.data.map((eachStores) => {
        const storeDetails = {
            radioId: eachStores.storeId,
            inputId: eachStores.storeId,
            labelText: eachStores.storeName,
            labelTextSpan: eachStores.inventoryStatus,
            nameInput: 'ccaddress'
        }
        return (<List key={eachStores.storeId} className="pt-2 pb-2">
            <div className="a-product__inputRadioStore"><MaterialInputRadio options={storeDetails} handleClick={props.handleStoreChange} /> </div>
        </List>)
    });
    return (
        storeList.length > 0 ?
            <Ul className="m-0 p-0">
                {storeList}
            </Ul>
            :

            <Paragraph className="a-product__paragraphClickAndCollectNotAvailable">No contamos con disponibilidad en tienda</Paragraph>

    );
}
