/**
 * Module Name : B&S Module
 * Functionality : This Component will help for reder Url Content HTML.
 * @exports  : UrlContent
 * @requires : module:React
 * @requires : module:lodash/isEmpty
 * @requires : module:helpers/utilities/utility#UtilityTypeText
 * Team : B&S Team
 * 
 */
import React from 'react';
import { UtilityTypeText,OnImgError } from '../../../helpers/utilities/utility';
import isEmpty from 'lodash/isEmpty';

/**
 * @class UrlContent
 * @classdesc Main function which will get exported and will get imported in other JS
 */
class UrlContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UrlContentHtml: props.UrlContentHtml || '',
            UrlContentHtmlData:{},
            hostname: props.hostname || ''
        }

    }

    /**
     * REACT life cycle Event. This will get fire when ever component Will Receive Props
     * @event componentWillReceiveProps
     * @param {*} nextProps 
     * @param {*} state 
     * 
     */
    componentWillReceiveProps(newProps,  state) {
        if (this.props.UrlContentHtml  !==  newProps.UrlContentHtml) {
            this.setState({ UrlContentHtml: newProps.UrlContentHtml })
        }
    }

    /**
     * REACT life cycle event. It will be called once the component is actually mounted to the DOM.
     * @event componentDidMount 
     * 
     */
    componentDidMount() {
         try {
            UtilityTypeText('https://assets'+window.location.hostname+this.state.UrlContentHtml, 'GET').then(response => {
                this.setState({
                    UrlContentHtmlData: response.data
                });
            });
        } catch (e) {
            return reply.response(e.message);
        }
     }

    /**
     * default render method to render html in REACT
     * @returns REACT HTML
     */
    render() {

       const data=this.state.UrlContentHtmlData;
        return (
            <React.Fragment>
                {!isEmpty(data)?
                     <div dangerouslySetInnerHTML={{ __html: data  }}/>
                    :null}
            </React.Fragment>
        )
    }
}


export default UrlContent;
