import Header from '../../organisms/Header/Header';
import NoProducts from '../../organisms/ErrorContainer/NoProducts';
import { parentContext } from '../../../contexts/parentContext';
import CheckoutHeaderFooter from '../../organisms/Header/CheckoutHeaderFooter';

export default (props) => {
    return (
        <parentContext.Consumer>
            {({ handleMobileMenu, headerData, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, searchbarClicked, handleSearchBarShow, handleSearchBarHide, departmentData, setDepartmentData }) => {
                return <CheckoutHeaderFooter onlyFooter={true}>
                    <Header
                        loginDetails={loginDetails}
                        handleTypeheadHide={handleTypeheadHide}
                        handleTypeheadShow={handleTypeheadShow}
                        handleMobileMenu={handleMobileMenu}
                        showMobileMenu={showMobileMenu}
                        showTypehead={showTypehead}
                        pageName="twocolumnpage"
                        headerData={headerData}
                        searchbarClicked={searchbarClicked}
                        handleSearchBarShow={handleSearchBarShow}
                        handleSearchBarHide={handleSearchBarHide}
                        setDepartmentData={setDepartmentData}
                        departmentData={departmentData}
                    />
                    <NoProducts />
                </CheckoutHeaderFooter>
            }}
        </parentContext.Consumer>
    )
}



