import isEmpty from 'lodash/isEmpty';

class productExtraInfo extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        
        const { extraInformationWeb, extraInformationWap } = this.props.extraInfoDetails || {}
        return (
            <div className="col-8 offset-2 p-4">
                { !isEmpty(extraInformationWeb) ?
                    <div dangerouslySetInnerHTML={{ __html: extraInformationWeb }}></div>
                    :
                        !isEmpty(extraInformationWap) ?
                        <div dangerouslySetInnerHTML={{ __html: extraInformationWap }}></div>
                        : null
                }
            </div>
        );
    }
}
export default productExtraInfo;