//mport './Tab.styl'
import React from 'react';
//import './Tab.styl';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';


export default class extends React.Component {
   
    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

   render(){

        const {
            onClick,
            props: {
        activeTab,
                label,
      },
    } = this;

        let className = '';

        if (activeTab === label) {
            className += ' mdc-tab--active';
        }

        return (

                            <div className="mdc-tab col-4 m-paymentOptionContainer__selector check" ripple="" role="tab" aria-selected="true" tabIndex="0" data-open="description" onClick={onClick} id="mdc-tab-3">
                                <span className="mdc-tab__content">
                                    <span className="check-label">{label}</span>
                                </span>
                                <span className="mdc-tab-indicator mdc-tab-indicator--active">
                                          <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                </span>
                                <span className="mdc-tab__ripple mdc-ripple-upgraded"></span>
 {Image &&
     <Image />
  }
                            </div>
  
   
                       
        )
    }
}