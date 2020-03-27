
import ErrorContainerNoJavaScript from '../../organisms/ErrorContainer/ErrorContainerNoJavaScript';
import LoginHeader from '../../organisms/Header/LoginHeader';
export default (props) => {
return( 
<React.Fragment>
    <LoginHeader />

  <div className="organism container-fluid o-main-container o-one-column">
        <div className="container p-0">
          <div className="row d-none d-lg-block">
          </div>
           <div className="row m-0">
             
            <div className="col-lg-8 offset-lg-2 col">
               <ErrorContainerNoJavaScript />
            </div>
          </div>
          </div>
          </div>
</React.Fragment>
);
}

