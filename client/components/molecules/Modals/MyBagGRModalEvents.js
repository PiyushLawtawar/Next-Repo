import React from 'react';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import MyBagModalHeader from './MyBagModalHeader';
import ModalHeader from '../Modals/ModalHeader';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import { ParagraphGroup } from "../../molecules/MixinMolecules/MixinMolecules";
import ClickAndCollectAvailability from '../../molecules/ProductClickAndCollect/ClickAndCollectAvailability';
import { Utility, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import ProductSpecDetail from '../../organisms/ProductSpecs/ProductSpecDetail';
import { parentContext } from '../../../contexts/parentContext';
import { OnImgError } from '../../../helpers/utilities/utility';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            curEventId:""
        }
    }

   itemEventId = (value) => {
        this.setState({
            curEventId: value
        })

    }
  onImgError =(e) =>{
        const errImgElement= e.target;
        OnImgError(errImgElement, Path.onImgError);
  }
    render() {
     //   console.log(this.props.gREventsData,'gREventsData')
        const data =this.props.gREventsData;
        const modalHeader = {
            title: 'Regresar',
            titleType: 'link',
            headlineAttributes: {
                "id": "availability-modal"
            },
            close: true,
            back: false,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            headerClass:'o-resultGiftTable__head'
        };
        
        let  AssetsPath = '';
        if (typeof window !== 'undefined') {
            AssetsPath = getAssetsPath(window,undefined);  
        }else{
            AssetsPath = getAssetsPath(undefined,this.props.hostname,process); 
        }
         return (
            <React.Fragment>
                    <MyBagModalHeader modalHeader={modalHeader} ModalpopUpBack="MyBagGRModal" ModalpopUp={this.props.ModalpopUp} eventScroll={true} gRModel={true}/>
                 <div className="o-resultGiftTable__body">
                      <p className="a-blockElement a-blockElement--enphasis">Resultados de búsqueda</p>
                      <p className="a-inlineElement">Selecciona el evento y a tus invitados</p>
                        <div className="o-resultGiftTable__list">
                        {
                                !isEmpty(data) && map(data && data.events, (item, index) => {
                                    return (
                                        <parentContext.Consumer>
                                            {({ OpenModal,closeModal }) => (
                                            <div  key={index} className={index==0?"o-resultGiftTable__items o-resultGiftTable__items--fisrtResult":'o-resultGiftTable__items'}  gREventsData={this.props.gREventsData} onClick={()=>{this.props.gREventsOwners(this.props.gREventsData,item.eventId),this.itemEventId(item.eventId), this.props.gRModalTwo(this.props.gRTwo),OpenModal('MyBagGRModal3'),closeModal('MyBagGRModal2')}}>
                                                    <figure className="m-imageResultGiftTable"><img src={item.eventImageURL || AssetsPath + '/static/images/avatar@2x.png' } alt={item.eventType} onError={this.onImgError}/></figure>
                                                    <div className="o-resultGiftTable__itemsDescription selectCelebrated">
                                                        <label className="a-inlineElement a-inlineElement--enphasis -block">{item.eventType}</label>
                                                        <label className="a-inlineElement ">Número de evento {item.eventId}</label>
                                                        <label className={"a-inlineElement margin-l-2 " + (index==0?"-block":'')}>Fecha del evento {item.eventDate}</label>
                                                    </div>
                                                    <i className="a-text icon-arrow_right"></i>
                                                </div>
                                            )}
                                        </parentContext.Consumer>

                                    )
                                })
                            }
                        </div>
                    </div>
            </React.Fragment>
         )
    }
}
