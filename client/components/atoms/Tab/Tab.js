import React from 'react';
//import './Tab.styl';
import Span from '../../atoms/Span/Span';
import Button from '../../atoms/Button/Button';


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
                extraClass
      },
    } = this;

        let className = '';

        if (activeTab === label) {
            className += ' mdc-tab--active';
        }

        return (

                            <Button className={`mdc-tab ${className + ' '+extraClass} `} ripple="" role="tab" aria-selected="true" tabIndex="0" data-open="description" onClick={onClick} id="mdc-tab-3">
                                <Span className="mdc-tab__content">
                                    <Span className="mdc-tab__text-label">{label}</Span>
                                </Span>
                                <Span className="mdc-tab-indicator mdc-tab-indicator--active">
                                          <Span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></Span>
                                </Span>
                                <Span className="mdc-tab__ripple mdc-ripple-upgraded"></Span>
                            </Button>
                       
        )
    }
}