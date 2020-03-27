import { withRouter } from 'next/router';
import Router from 'next/router';
import { MIN_TYPEHEAD_LENGTH } from '../../../../client/config/constants';


class NoProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: ''
        }
    }

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({ inputVal: value });
    }
    onKeypress = (event) => {
        const code = event.keyCode || event.which;
        const { value } = event.target;
        if (code === 13 && value.length >= MIN_TYPEHEAD_LENGTH) {
            this.redirectToUrl(value);
        }
    }

    handleClick = () => {
        const { inputVal } = this.state;
        if (inputVal.length >= MIN_TYPEHEAD_LENGTH) {
            this.redirectToUrl(inputVal);
        }
    }

    redirectToUrl = (value) => {
        const href = `/tienda/twoColumnCategoryPage?s=${value}`;
        const asInfo = `/tienda?s=${value.split(" ").join("+").toLowerCase()}`;
        Router.push(href, asInfo);
    }

    render() {
        const { inputVal } = this.state;
        return (
            <main>
                <div className="organism container-fluid o-main-container o-one-column">
                    <div className="container p-0">
                        <div className="row d-none d-lg-block">
                        </div>
                        <div className="row m-0">
                            <div className="col-lg-8 offset-lg-2 col">
                                <div className="o-errorPageContainer">
                                    <h1 className="a-errorPage-title">Lo sentimos...
                              </h1>
                                    <p className="a-errorPage-paragraph">Por el momento no tenemos productos en esta categoría
                              </p>
                                    <p className="a-errorPage-paragraph--again">Intenta con otra búsqueda
                              </p>
                                    <div className="m-header__searchBar m-errorPage__searchBar">
                                        <div className="input-group">
                                            <input className="form-control a-storeLocator-aside__search" type="text" placeholder="Intenta con una búsqueda" aria-label="Intenta con una búsqueda" onChange={this.handleChange} value={inputVal} onKeyPress={this.onKeypress} />
                                            <div className="input-group-append" onClick={this.handleClick}>
                                                <button className="input-group-text"><i className="icon-zoom search-icon"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="a-errorPage-paragraph -helpText">¿Necesitas más ayuda?
                              </p>
                                    <p className="a-errorPage-paragraph -helpTextNoProducts">- Llama al 01 800 713 5555 desde el interior de la república ó al 52629999 en el área metropolitana.
                              </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default NoProducts;