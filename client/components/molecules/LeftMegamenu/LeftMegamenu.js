import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import Ul from '../../atoms/Ul/Ul';
import List from '../../atoms/List/List';
import Link from '../../atoms/Link/Link';
import Icons from "../../atoms/Icons/Icons";
import { GetLinkData } from '../../../helpers/utilities/utility';
//import './LeftMegamenu.styl';

const LeftMegamenu = (props) => {
    const { loginDetails, wapLinks } = props;
    const LoggedInSession = loginDetails && loginDetails.LoggedInSession;
    let firstNameval = loginDetails && loginDetails['cartHeaderResponse'] && loginDetails['cartHeaderResponse']['cartHeaderDetails'] && loginDetails['cartHeaderResponse']['cartHeaderDetails']['firstName'] || "";
    let cartheaderdetails = loginDetails && loginDetails['cartHeaderResponse'] && loginDetails['cartHeaderResponse']['cartHeaderDetails'] || {}
    const firstName = LoggedInSession ? (!isEmpty(cartheaderdetails) ? firstNameval : '') : '';
    const firstName_full = LoggedInSession ? (!isEmpty(cartheaderdetails) ? cartheaderdetails['firstName_full'] ||'' : '') : '';
    const loginText = LoggedInSession && firstNameval ? `Hola ${firstName_full}` : 'Iniciar Sesión';
    return (
        <div className={props.showMobileMenu ? 'o-megamenu__mobile d-lg-none menu-drawer' : 'o-megamenu__mobile d-lg-none'}>
            <nav className="m-megamenu__menuList">
                <div className="o-container container p-3">

                    <Ul className={props.showMobileDeptMenu ? 'nav-mobile-menu d-none' : 'nav-mobile-menu'}>
                        <List className="m-megamenu__section">
                            <div className="m-row row">
                                <div className="m-col col-12">
                                    {
                                        LoggedInSession ?
                                            <span className="a-header__navMobileLink -primary-style">{loginText}</span>
                                            : <Link className="a-header__navMobileLink -primary-style" href="/tienda/login">{get(wapLinks, '[0]["iniciarSession"][0]["text"]', 'Iniciar Sesión')}</Link>
                                    }
                                </div>
                            </div>
                        </List>
                        <hr />
                        <List onClick={props.handleMobileDeptMenu} className="m-megamenu__section">
                            <div className="m-row row">
                                <div className="m-col col-12">
                                    <Link className="a-header__navMobileLink mobile-category-action" href="#">{!isEmpty(props.megaMenuTitleName[0]) ? props.megaMenuTitleName[0].title : ''}
                                        <Icons className="icon-arrow_right" />
                                    </Link>
                                </div>
                            </div>
                        </List>
                        <hr />
                        {
                            !isEmpty(wapLinks) ? map(wapLinks[0].accLinks, (links, index) => {
                                if(links.name == 'Mis pedidos' || links.name == 'Mi cuenta' || links.name == 'Tiempo aire' ) {
                                    return <List key={index} className="m-megamenu__section" onClick={props.handleMobileMenu}>
                                        <div className="m-row row">
                                            <div className="m-col col-12" onClick={() => props.redirectToURL(links.url,links.name)}>
                                                  <Link className="a-header__navMobileLink" href='javascript:void(0);' >{links.text}</Link>
                                            </div>
                                        </div>
                                    </List>
                                }
                                if(links.name === '¿No eres {0}? Salir de aquí' && LoggedInSession) {
                                    let text = links.text;
                                    text = text.replace('{0}', firstName_full);
                                    return <List key={index} className="m-megamenu__section">
                                    <div className="m-row row">
                                        <div className="m-col col-12" onClick={props.handlelogout}>
                                            <Link className="a-header__navMobileLink" href='#' >{text}</Link>
                                        </div>
                                    </div>
                                </List>
                                }
                                    return <List key={index} className="m-megamenu__section" onClick={props.handleMobileMenu}>
                                        <div className="m-row row">
                                            <div className="m-col col-12">
                                                  <Link className="a-header__navMobileLink" href={links.url} >{links.text}</Link>
                                            </div>
                                        </div>
                                    </List>
                            }) : null
                        }
                    </Ul>

                    <Ul className={!props.showMobileDeptMenu ? 'nav-mobile-category d-none' : 'nav-mobile-category'}>
                        <List onClick={props.handleMobileDeptMenu}>
                            <div className="row">
                                <div className="col-12">
                                    <Link className="a-header__navMobileLink mobile-subcategory-action" href="#">{!isEmpty(props.megaMenuTitleName[0]) ? props.megaMenuTitleName[0].title : ''}
                                        <Icons className="icon-arrow_left" />
                                    </Link>
                                </div>
                            </div>
                        </List>
                        <hr />
                        {
                            !isEmpty(props.deptMenuData) && !isEmpty(props.deptMenuData.l1Categories) && props.deptMenuData.l1Categories.length > 0 ? map(props.deptMenuData.l1Categories, (item, index) => {
                                const catUrl = item.url || '';
                                const inputData = {
                                    catId: catUrl.split('/').pop(),
                                    catName: catUrl.split('/')[2],
                                    pageName: 'CLP',
                                    always: typeof item.showPLP !== 'undefined' && item.showPLP? 'plp': ''
                                }
                                const { href, asInfo } = GetLinkData(inputData);
                                return <List key={index} className="m-megamenu__section">
                                    <div className = "m-row row" >
                                        <div className = "m-col col-12" >
                                            <Link className="a-header__navMobileLink" href="#" onClick={(e) => props.categoryLinkAjax(e, href, asInfo, 'wap')}>{item.name}
                                            </Link>
                                        </div>
                                    </div>
                                </List>
                            }) : null
                        }
                    </Ul>
                </div>
            </nav>
        </div>
    )
}

export default LeftMegamenu;
