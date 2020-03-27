import LoginBox from '../../organisms/LoginBox/LoginBox';
import { parentContext } from '../../../contexts/parentContext';
import CheckoutHeaderFooter from '../../organisms/Header/CheckoutHeaderFooter';
import LoginHeader from '../../organisms/Header/LoginHeader'

export default (props) => {
  return (

    <parentContext.Consumer>
      {({ loginDetails, domainName, setFooterData, snbfooterData, checkoutHeaderFooterData, setCheckoutHeaderFooterData }) => (
        <CheckoutHeaderFooter onlyFooter={true} footerData={props.footerData} checkoutHeaderFooterData={checkoutHeaderFooterData} setCheckoutHeaderFooterData={setCheckoutHeaderFooterData} >
          <main className="o-main t-columnCenter">
            <LoginHeader headerData={props.headerData} domainName={domainName} {...props} />
            <div className="o-content__columnCenter--fluid container-fluid p-0">
              <div className="o-content__columnCenter container p-0 d-lg-flex justify-content-center align-items-center">
                <div className="o-main-content col-12 col-lg-4 p-0 p-lg-3 d-lg-flex justify-content-center align-items-center mt-lg-4">
                  <LoginBox {...props} domainName={domainName} loginDetails={loginDetails} />
                </div>
              </div>
            </div>
          </main>
        </CheckoutHeaderFooter>
      )
      }
    </parentContext.Consumer>
  );
}
