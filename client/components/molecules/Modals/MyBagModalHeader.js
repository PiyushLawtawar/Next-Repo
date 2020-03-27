import React from 'react';
import Link from '../../atoms/Link/Link'

import Icons from "../../atoms/Icons/Icons";
import { parentContext } from '../../../contexts/parentContext';

export default (props) => {
    const { title, titleType, headlineAttributes, close, buttonClass, buttonAttributes } = props.modalHeader;
    return (
         <React.Fragment>
         <div className={props.modalHeader&&props.modalHeader.headerClass?props.modalHeader.headerClass:" "}>
            <parentContext.Consumer>
                {({ closeModal, OpenModal }) => (
                     props&&props.toNonGR?
                      <React.Fragment>                   
                        <a className="a-inlineElement a-inlineElement--enphasis">
                            Ya no quiero regalar
                        </a>
                        <i className="a-text icon-close a-closeGiftModal" id="closeFindGiftTable" onClick={() => closeModal(props.ModalpopUp)}></i>
                    </React.Fragment>
                     :props&&props.editMSG?
                      <React.Fragment>                   
                        <a className="a-inlineElement a-inlineElement--enphasis">
                            Editar mensaje
                        </a>
                        <i className="a-text icon-close a-closeGiftModal" id="closeFindGiftTable" onClick={() => closeModal(props.ModalpopUp)}></i>
                    </React.Fragment>
                     :props&&props.gift?
                     <React.Fragment>                   
                        <a className="a-inlineElement a-inlineElement--enphasis">
                            Opciones de envoltura:
                        </a>
                        <i className="a-text icon-close a-closeGiftModal" id="closeFindGiftTable" onClick={() => closeModal(props.ModalpopUp)}></i>
                    </React.Fragment>
                     :
                    <React.Fragment>                   
                        <a className="a-inlineElement a-inlineElement--enphasis -back" href="#"onClick={() => {
                            OpenModal(props.ModalpopUpBack);
                            closeModal(props.ModalpopUp);props.handleSelectedNun && props.handleSelectedNun()
                            }}>
                            Regresar
                        </a>
                        <i className="a-text icon-close a-closeGiftModal" id="closeFindGiftTable" onClick={() => closeModal(props.ModalpopUp)}></i>
                    </React.Fragment>
                )}
            </parentContext.Consumer>
        </div>
                 {/*{    props&&props.eventScroll?
                      <React.Fragment>
                           <div className='o-giftWrap__head__event'>
                            <p className="a-blockElement a-blockElement--enphasis fiexed-header">Resultados de búsqueda</p>
                             <p className="a-inlineElement">Selecciona el evento y a tus invitados</p>
                         </div>
                     </React.Fragment>
                     :null
                  }*/}
         </React.Fragment>

    );
}