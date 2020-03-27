import LoginHeader from '../../organisms/Header/LoginHeader'
import FailOver from '../../organisms/ErrorContainer/FailOver';
import { parentContext } from '../../../contexts/parentContext';

export default (props) => {
    return (
        <parentContext.Consumer>
            {({ headerData }) => {
                return <React.Fragment>
                    <LoginHeader headerData={headerData} />
                    <FailOver />
                </React.Fragment>
            }}
        </parentContext.Consumer>
    )
}



