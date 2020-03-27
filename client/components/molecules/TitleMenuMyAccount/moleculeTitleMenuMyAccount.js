import Headlines from '../../atoms/HeadLines/Headlines';
import { H1 } from "../../atoms/HeadLines/Headlines";

class TitleMenuMyAccount extends React.Component {
    render() {

        return (
            <div className="row d-lg-none m-myAccount-aside-title--mobile">
                {this.props.title === this.props.preferencesHeading ?
                    <div id="asideHeading" className="col-12">
                        <H1 headLineText={this.props.title} />
                    </div> :
                    <div className="col-12">
                        <H1 headLineText={this.props.title} />
                    </div>}
            </div>
        )
    }
}

export default TitleMenuMyAccount;


