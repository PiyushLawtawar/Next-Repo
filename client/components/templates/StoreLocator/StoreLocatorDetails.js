import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { H1 } from '../../atoms/HeadLines/Headlines';
import StoreLocatorDetails from '../../molecules/StoreLocatorDetails/StoreLocatorDetails';
import get from 'lodash/get'

export default (props) => {
    const { storeDetails } = props;
    const storeName =  get(storeDetails, 'storeDetails.StoreDetails[1].name', '');  
    return (
        <React.Fragment>
            <H1 headLineClass="m-storeLocator-title__mobile d-flex justify-content-between d-lg-none align-items-center" headLineText={storeName} />
            <StoreLocatorDetails storeDetails={props.storeDetails} />
        </React.Fragment>

    );
}