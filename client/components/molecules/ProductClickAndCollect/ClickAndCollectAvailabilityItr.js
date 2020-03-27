import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Paragraph from "../../atoms/Paragraph/Paragraph";

import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';

//import './ClickAndCollectAvailability.styl';

export default (props) => {
    
    const productType = props.productType || "";
    let storeList = props.data.map((eachStores) => {
        const storeDetails = {
            radioId: eachStores.storeId,
            inputId: eachStores.storeId,
            labelText: eachStores.storeName,
            labelTextSpan: eachStores.inventoryStatus,
            nameInput: 'ccaddress'
        }
        return (<List key={eachStores.storeId} className="pt-2 pb-2 pl-2">
            <div className="a-product__store " >
                <p className="m-0">{eachStores.storeName}</p>
                {productType.includes('Soft') ? null : <p className={eachStores.inventoryStatus=="No Exhibido"?"-errorSelectedCelebbrated m-0":"m-0"}>{eachStores.inventoryStatus}</p>}
                {productType.includes('Soft') && <p className="m-0">{eachStores.numberOfPieces} piezas</p> }
            </div>
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
