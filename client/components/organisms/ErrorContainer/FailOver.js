import { getAssetsPath } from '../../../helpers/utilities/utility';

export default (props) => {
    let  AssetsPath = '../../..';
	if (typeof window !== 'undefined') {
		const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';  
	}
    return (
        <main>
            <div className="organism container-fluid o-main-container o-one-column">
                <div className="container p-0">
                    <div className="row d-none d-lg-block">
                    </div>
                    <div className="row m-0">
                        <div className="col-lg-8 offset-lg-2 col">
                            <div className="o-errorPageContainer">
                                <h1 className="a-errorPage-title">Volveremos pronto
                              </h1>
                                <p className="a-errorPage-paragraph -error">Descuida, tu navegador funciona correctamente
                              </p>
                                <div className="a-errorPage-imageContainer"><img className="a-errorPage-image" src={AssetsPath + "/static/images/Trabajando-FailOver.gif"} alt="Volveremos pronto" />
                                </div>
                                <div className="a-errorPage-paragraphFooter">
                                    <p className="a-errorPage-paragraph -errorFooter">Seguimos trabajando para que puedas seguir realizando tus compras, en breve serás redireccionado a Liverpool.com.mx
                                </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}