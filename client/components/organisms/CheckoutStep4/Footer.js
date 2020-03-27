/**
* Module Name : Footer
* Functionality : Showing footer template.
* @exports : Footer
* @requires : module:React
* @requires : module:/atoms/Paragraph/Paragraph
* Team : Checkout Team
* Other information : Showing footer template as html which is actually coming as string tags.
* 
*/
import Paragraph from '../../atoms/Paragraph/Paragraph';

/**
* @class 
* @classdesc Main function which will get exported and will get imported in other JS
*/

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            email: '',
            password: '',
            repassword: '',
            lastName: '',
            birth: '',
            sessionActive: false,
            gender: '',

        };
    }

    /**
     * Method will show footer template
     * @function test
     * @author shreyansh.khare@zensar.com
     * @desc Showing footer template as html which is actually coming as string tags.
     * @param {object}
     * 
     */
     
    test = () => {
        return { __html: this.props.footerContent }
    }


  /**
   * REACT life cycle Event. This will get fire on load and on state update.
   * @event render 
   * 
   */
    render() {
        return (
            <React.Fragment>
                <div className="abc" dangerouslySetInnerHTML={this.test()} />
            </React.Fragment>
        )
    }
}