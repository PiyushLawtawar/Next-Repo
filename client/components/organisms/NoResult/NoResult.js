import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { withRouter } from 'next/router';
import Router from 'next/router';
import { MIN_TYPEHEAD_LENGTH } from '../../../../client/config/constants';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { H1 } from '../../atoms/HeadLines/Headlines';
import Strong from '../../atoms/Strong/Strong';
import Searchbar from "../../molecules/Searchbar/Searchbar";

class NoResult extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            inputVal: ''
        }
    }

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({inputVal: value});
    }

    onKeypress = (event) => {
        const code = event.keyCode || event.which;
        const { value } = event.target;
        if (code === 13 && value.length >= MIN_TYPEHEAD_LENGTH) {
            this.redirectToUrl('', value);
        }
    }

    handleClick = () => {
        const { inputVal } = this.state;
        if(inputVal.length >= MIN_TYPEHEAD_LENGTH) {
            this.redirectToUrl('', inputVal);
        }
    }

    redirectToUrl = (e, value) => {
        if(!isEmpty(e)) {
            e.preventDefault();
        }
        const href = `/tienda/twoColumnCategoryPage?s=${value}`;
        const asInfo = `/tienda?s=${value.split(" ").join("+").toLowerCase()}`;
        Router.push(href, asInfo);
    }

    render() {
        const { breadcrumbInfo, suggestedSearch, searchTerm, searchbarClicked, handleSearchBarShow, handleSearchBarHide } = this.props;
        const { inputVal } = this.state;
        return (
            <div className="organism container-fluid o-main-container o-one-column" onClick={handleSearchBarHide}>
                <div className="container p-0">
                    <div className="row d-none d-lg-block">
                        <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                    </div>
                    <div className="row m-0">
                        <div className="col">
                            <div className="row">
                                <div className="col-12 p-2 pt-2 pl-lg-0 pt-lg-1">
                                    
                                  <h1 className="a-headline__results d-none d-lg-block">Tu Búsqueda <strong>"{searchTerm}" </strong>arrojó <strong>"0" </strong>resultados

                                </h1>
                                </div>
                            </div>
                            <div className="row justify-content-center mt-4 mb-5">
                                <div className="col-11 col-lg-8 o-content__noResults">
                                    <h1 className="a-headline__results d-block d-lg-none mb-4">Tu Búsqueda <strong>"{searchTerm}" </strong>arrojó <strong>"0" </strong>resultados

                                </h1>
                                    <Paragraph className="a-headline__noResults">¿Quisiste decir
                                    {
                                        !isEmpty(suggestedSearch) && map(suggestedSearch, (item, index) => {
                                            let label = ` "${item.label}"`;
                                            if(index > 0) {
                                                label = `,${label}`;
                                            }
                                            return <Link key={index} onClick={(e) => this.redirectToUrl(e, item.label)} href="#"><strong>{label}</strong></Link>
                                            // return <strong>{label}</strong>
                                        })
                                    } ?
                                </Paragraph>
                                    <Paragraph className="a-title__searchPLP mt-5">Busca de nuevo
                                </Paragraph>
                                    <Searchbar placeholder="Nueva búsqueda ..." searchbarClicked={searchbarClicked} handleSearchBarShow={handleSearchBarShow} searchclass="m-header__searchBar" redirectToSearchPage={this.handleClick} searchTerm={inputVal} onKeypress={this.onKeypress} onChangeSearchbar={this.handleChange} />
                                    <Paragraph className="a-title__searchAdvice mt-5">Consejos de Búsqueda
                                    </Paragraph>
                                    <Paragraph className="a-subtitle__searchAdvice">- Usa palabras más simples y revisa tu ortografía.
                                    </Paragraph>
                                    <Paragraph className="a-subtitle__searchAdvice">- Busca términos más genéricos (ej. "blanco" o "algodón")
                                    </Paragraph>
                                    <Paragraph className="a-title__help mt-5">¿Necesitas más ayuda?
                                    </Paragraph>
                                    <Paragraph className="a-subtitle__help">Llama al 01 800 713 5555 desde el interior de la República o al 52629999 en el área metropolitana
                                    </Paragraph>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(NoResult);
