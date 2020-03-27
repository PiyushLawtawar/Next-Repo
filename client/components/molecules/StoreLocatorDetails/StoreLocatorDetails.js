//import './StoreLocatorDetails.styl'
import Button from '../../atoms/Button/Button';
import Label from '../../atoms/Label/Label';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import get from 'lodash/get';

export default (props) => {
    const { storeDetails } = props;
    const storeValue = get(storeDetails, 'storeDetails.StoreDetails[1]', {});
    const lat = get(storeDetails, 'storeDetails.GeoCoordinates[1].lpLatitude', '');
    const long = get(storeDetails, 'storeDetails.GeoCoordinates[1].lpLongitude', '');
    const additionalServices = get(storeValue, 'additionalServices', '');
    const generalDetails = get(storeValue, 'generalDetails', '');
    const phone = get(storeValue, 'phone', '');  
    const redirectToGoogleMap = () => {
        window.open("https://maps.google.com/maps?daddr="+lat+","+long+"&amp;ll=");
    }
    return (
        <React.Fragment>
            <div className="col-12 col-lg-4 offset-lg-4">
                <div className="o-box -store__details">
                    <Label className="a-store_detail-label" for="">Dirección:</Label>
                    {/* <Paragraph className="a-store_detail-paragraph">Tuxtla Oriente, Carretera Chiapa de Corzo, Col. El Retiro, Tuxtla Gutiérrez, Chiapas, México, C.P. 29040</Paragraph>
                    <Label className="a-store_detail-label" for="">Horario:</Label>
                    <Paragraph className="a-store_detail-paragraph">Lunes a domingo de 11:00 a 21:00 hrs.</Paragraph> */}
                    <div dangerouslySetInnerHTML={{__html:generalDetails}} />
                    <Label className="a-store_detail-label" for="">Servicios:</Label>
                    <Ul>
                        {/* <List>Restaurante</List>
                        <List> Centro de diseño de interiores</List> */}
                        <div dangerouslySetInnerHTML={{__html:additionalServices}} />
                    </Ul>
                </div>
            </div>
            <div className="col-12 col-lg-4 offset-lg-4">
                <Button onClick={redirectToGoogleMap} className="a-btn a-btn--primary a-btn-details__storeLocator">¿Como llegar?</Button>
                <a href={`tel:${phone}`}><Button className="a-btn a-btn--tertiary a-btn-details__storeLocator"> Llamar a tienda</Button></a>
            </div>
        </React.Fragment>
    );
}
