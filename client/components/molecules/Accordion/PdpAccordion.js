import React from 'react';
//import './Accordion.styl';
export default class PdpAccordin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: (props.isopenStatus === 'show' ? true : false )
        };

    }

    handleExpansion() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }


    render() {
        const {isOpen} = this.state
        let isopenStatus = '';
        if(this.props.isopenStatus == "hide")
        {
            isopenStatus ='show';
        }
        let bodyClassName = this.props.bodyClass || 'card-body pt-0 pb-lg-0';
        if (isOpen) {
            bodyClassName += ' in-left';
        } else {
            bodyClassName += ' out-right';
        }
        let padding = this.props.forcePadding === true ? {padding:"0px"} : {}
        return (
           <div className="card nav-item">
                    <div className="card-header d-flex justify-content-between align-items-center" data-target="#target" aria-expanded={isOpen} aria-controls="target" id="object" onClick={this.handleExpansion.bind(this)} >
                        <h3 className="labelClassname" >{this.props.headText}
                        </h3><i className="icon-arrow_down"></i>
                    </div>
                    <div className={isOpen ? 'show-accord' : 'hide-accord'} aria-labelledby="object" id="target" style={padding}>
                        <div className={bodyClassName}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
         
            )
    }
}
