import React from 'react';
import { parentContext } from '../../../contexts/parentContext';
import { Utility, getBrandName } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
// import { DepartmentMenu } from './megaMenu/department';
import isEmpty from 'lodash/isEmpty';
import Router from 'next/router';
import map from 'lodash/map';
import Link from '../../atoms/Link/Link';
import EventListener from 'react-event-listener';
class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      footerContent: {},
      homePageContent: {},
      accordion: {},
      loginDetails: props.loginDetails
    }
  }
  componentDidMount() {
     this.resetFooterPosition();
    //  window.addEventListener('resize', this.resetFooterPosition);
    // this.getFooterData(this.props.loginDetails)
    // this.setState({ loginDetails: this.props.loginDetails })
  }

  resetFooterPosition() {
    // var footer = document.querySelector(`footer`);
    // var bodyElem = document.querySelector(`#__next`);
    // var footerDetails = footer.getBoundingClientRect();
    // var bodydetails = bodyElem.getBoundingClientRect();
    // var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    // var bodyDiff = 0;
    // if (viewportHeight > bodydetails.height) {
    //   bodyDiff = (viewportHeight - bodydetails.height);
    //   footer.style.top = viewportHeight - footerDetails.height + 'px';
    //   bodyElem.style.height = parseInt(window.getComputedStyle(bodyElem).height.replace(/px/g, ''), 10) + bodyDiff + 'px'; //bodyElem.style.height + (viewportHeight - footerDetails.height) + 'px';
    // } else {
    //   footer.style.removeProperty('top');
    //   bodyElem.style.removeProperty('height');
    // }


    // var footer = document.querySelector(`footer`);
    // var bodyElem = document.querySelector(`main`);
    // if(!bodyElem){
    //   bodyElem = document.querySelector(`#__next`)
    // }
 	  // var header = document.querySelector(`header`);
    // var footerDetails = footer.getBoundingClientRect();
    // var headerDetails = header.getBoundingClientRect();
    // var bodydetails =  bodyElem.getBoundingClientRect();
    // var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
    // var bodyDiff = 0;
    // if (viewportHeight > (bodydetails.height + headerDetails.height + footerDetails.height)) {
    //   bodyDiff = (viewportHeight - bodydetails.height - headerDetails.height - footerDetails.height);
    //   footer.style.top = bodyDiff + 'px';
    //   //bodyElem.style.height = bodydetails.height + bodyDiff + 'px'; //bodyElem.style.height + (viewportHeight - footerDetails.height) + 'px';
    // } else {
    //   footer.style.removeProperty('top');
    //   bodyElem.style.removeProperty('height');
    // }
    const footer = document.querySelector('footer');
    let windowHeight = document.documentElement.clientHeight;
    let srcollHeight = document.documentElement.scrollHeight;

    
        if (window.outerWidth >= 992) {
          srcollHeight > windowHeight ? footer.classList.remove('fixedFooter') : footer.classList.add('fixedFooter')
        }
        else {
          footer.classList.remove('fixedFooter')
        }
  
 
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.loginDetails && this.props.loginDetails.cartHeaderResponse) !== (nextProps.loginDetails && nextProps.loginDetails.cartHeaderResponse)) {
      this.getFooterData(nextProps.loginDetails)
      this.setState({ loginDetails: nextProps.loginDetails })
    }
  }
  componentDidMount() {
    const { snbfooterData, loginDetails } = this.props;
    if (snbfooterData) {
      this.getFooterData(loginDetails)
      this.setState({ loginDetails: this.props.loginDetails })
    }
  }
  getFooterData = (loginDetails) => {
    let guest = "&isguest=";
    let LoggedInSession = loginDetails && loginDetails.LoggedInSession || "";
    if (!LoggedInSession || typeof LoggedInSession === 'undefined') {
      LoggedInSession = false;
    }
    guest = guest + (LoggedInSession ? 'false' : 'true');
    const { snbfooterData, setFooterData } = this.props;
    if (!isEmpty(snbfooterData)) {
      this.setState({ footerContent: snbfooterData });
    } else {
      Utility(Path.footerInfo + '?page=BS' + guest, 'GET').then(response => {
        const footerContent = response.data && response.data.footerContent && response.data.footerContent[0] || {};
        this.setState({ footerContent });
        setFooterData(footerContent);
      });
    }
  }
  toggleClass = (e, i) => {
    this.setState(prevState => {
      const accordion = {};
      accordion[e] = !prevState.accordion[e];
      return { accordion }
    })
    // this.setState({accordion})
    // const currentState = this.state.active;
    // this.setState({ active: !currentState });
  };
  handlelogout = async (e) => {
    let brandName = 'LP'
    if (window) {
      brandName = getBrandName(window).brand;
    }
    let payload = {
      "channel": "WEB",
      "brandName": brandName
    };
    e.preventDefault()
    Utility(Path.logout, 'POST', payload).then(response => {
      if (response.data && response.data.status && response.data.status.status === "failure") {
        this.show_alert(response.data.status.errorMessage);
      } else if (response.status === 200) {
        window.sessionStorage.removeItem("gtm");
        if (window) {
          window.location.href = '/';
        }
      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
    return false;
  }

  handlelogoutTmp = () => {
    let brandName = 'LP'
    if (window) {
      brandName = getBrandName(window).brand;
    }
    let payload = {
      "channel": "WEB",
      "brandName": brandName
    };
    Utility(Path.logout, 'POST', payload).then(response => {
      if (response.data && response.data.status && response.data.status.status === "failure") {
        this.show_alert(response.data.status.errorMessage);
      } else if (response.status === 200) {
        window.sessionStorage.removeItem("gtm");
        if (window) {
          window.location.href = '/';
        }
      }
    }, (error) => {
      console.error("Error ==== :: ", error);
    });
    return false;
  }

  getCookie = (name) => {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }
  redirectToURL = (url, name) => {
    var EnglishNameMyAccount = url.split('/')[3];
    let logged = this.getCookie('LoggedInSession')
    if ((name.toLowerCase() === 'tiempo aire') && logged === null) {
      Router.push('/tienda/login'  + "?pageName=" + EnglishNameMyAccount)
    } else {
      Router.push(url);
    }
  }
  render() {
    var IniciarSesiónText;
    // if (this.props.staticMetaTagsLabelPage) {
    //   var staticLabel = this.props.staticMetaTagsLabelPage;
    //   if (JSON.stringify(staticLabel) !== JSON.stringify({})) {

    //       var keyValues = (staticLabel[0].keyValues);
    //       console.log(keyValues,keyValues['homePage.iniciar.label'], 'keyValues')
    //       IniciarSesiónText = keyValues['homePage.iniciar.label'];

    //   } else {
    //     IniciarSesiónText = "Iniciar Sesión";
    //   }
    // } else {
    //   IniciarSesiónText = "Iniciar Sesión";
    // }
    IniciarSesiónText = "Iniciar Sesión";
    const data = this.state.footerContent || '';
    const { accordion } = this.state;
    const LoggedInSession = this.props.loginDetails && this.props.loginDetails.LoggedInSession || "";
    const { loginDetails, footerClassName } = this.props;
    const firstName = (loginDetails && loginDetails.cartHeaderResponse && loginDetails.cartHeaderResponse.cartHeaderDetails && loginDetails.cartHeaderResponse.cartHeaderDetails.firstName) || '';
    const lastName = (loginDetails && loginDetails.cartHeaderResponse && loginDetails.cartHeaderResponse.cartHeaderDetails && loginDetails.cartHeaderResponse.cartHeaderDetails.lastName) || '';
    const firstName_full = (loginDetails && loginDetails.cartHeaderResponse && loginDetails.cartHeaderResponse.cartHeaderDetails && loginDetails.cartHeaderResponse.cartHeaderDetails.firstName_full) || '';
    const fullName = `${firstName_full} ${lastName}`;
    const footerLoginText = LoggedInSession && firstName ? `¿No eres ${firstName_full}` : IniciarSesiónText;
    // if (this.props.loginDetails) {
    //   this.getFooterData(this.props.loginDetails)
    //   this.setState({ loginDetails: this.props.loginDetails })
    // }

    return (
       <React.Fragment>
                <EventListener
                    target="window"
                    onResize={this.resetFooterPosition}
                    onLoad={this.resetFooterPosition}
                />
      <footer className={footerClassName} style={{ "position": "sticky", "width": "100%", "bottom": "0px" }}>
        <div className="container">
          <div className="row">
            {
              LoggedInSession ?
                <div className="col-12 text-center pt-3 pb-3" onClick={(e) => this.handlelogout(e)}>
                  <span className="a-footer__linkSession">{footerLoginText}</span>
                  <a className="a-footer__linkSession" href="">? Cerrar sesión</a>
                </div>
                :
                <div className="col-12 text-center pt-3 pb-3">
                  <a className="a-footer__linkSession" href="/tienda/login">{footerLoginText}</a>
                </div>
            }
            {
              LoggedInSession ?
                <div className="col-12 text-center pt-3 pb-3" style={{ display: 'none' }} onClick={this.handlelogoutTmp}>
                  <span className="a-footer__linkSession">Am not</span>
                  <a className="a-footer__linkSession" href="javascript:void(0);">? Testing Logout</a>
                </div>
                : null
            }

          </div>
          <div className="row align-items-top">
            <div className="col-12 pb-3 pb-lg-5">
              <hr />
            </div>
            <div className="col-12 col-lg-8">
              <nav>
                <div className="row">
                  <div className="card-columns w-100">
                    <div className="col-12 col-lg order-1">
                      {
                        !isEmpty(data) && !isEmpty(data.verticalLink1) && map(data.verticalLink1, (verticalData, index) => {
                          return <div className="card m-footer__accordion" key={index} onClick={this.toggleClass.bind(this, `active1${index}`)}>
                            <div className="card-header d-flex justify-content-between align-items-center" data-toggle="collapse" data-target={`#collapseSupport${index}`} aria-expanded={this.state.accordion[`active1${index}`]} aria-controls={`#collapseSupport${index}`} id={`support${index}`}>
                              <h3 className="a-footer__sectionTitle">{verticalData.name}
                              </h3><i className="icon-arrow_down d-block d-lg-none"></i>
                            </div>
                            <div className={this.state.accordion[`active1${index}`] ? 'collapse show' : "collapse"} aria-labelledby={`support${index}`} id={`#collapseSupport${index}`}>
                              <div className="card-body pt-0 pb-lg-0">
                                <ul className="m-0">
                                  {!isEmpty(verticalData) && !isEmpty(verticalData.links) && map(verticalData.links, (item, index) => {
                                    let linkName = item.name;
                                    linkName = linkName.toLowerCase();
                                    return (
                                      <li className="p-0" key={index}>
                                        {/*<a className="a-footer__link" href={item.url}>{item.text}</a>*/}
                                        {
                                          linkName === 'tiempo aire' ?
                                            <a className="a-footer__link" href='javascript:void(0);' onClick={() => this.redirectToURL(item.url, item.name)}>{item.text}</a> :
                                            item['displayStyle'] === 'Link' ? <a className="a-footer__link" rel="noreferrer" href={item.url}>{item.text}</a> : item.text
                                        }
                                      </li>
                                    )
                                  })
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        })
                      }
                    </div>
                    <div className="col-12 col-lg order-2">
                      {
                        !isEmpty(data) && !isEmpty(data.verticalLink2) && map(data.verticalLink2, (verticalData, index) => {
                          return <div className="card m-footer__accordion" key={index} onClick={this.toggleClass.bind(this, `active2${index}`)}>
                            <div className="card-header d-flex justify-content-between align-items-center" data-toggle="collapse" data-target={`#collapseRefundAndCancel${index}`} aria-expanded={this.state.accordion[`active2${index}`]} aria-controls={`#collapseRefundAndCancel${index}`} id={`refundAndCancel${index}`}>
                              <h3 className="a-footer__sectionTitle">{verticalData.name}
                              </h3><i className="icon-arrow_down d-block d-lg-none"></i>
                            </div>
                            <div className={this.state.accordion[`active2${index}`] ? 'collapse show' : "collapse"} aria-labelledby={`refundAndCancel${index}`} id={`#collapseRefundAndCancel${index}`}>
                              <div className="card-body pt-0 pb-lg-0">
                                <ul className="m-0">
                                  {!isEmpty(verticalData) && !isEmpty(verticalData.links) && map(verticalData.links, (item, index) => {
                                    let linkName = item.name;
                                    linkName = linkName.toLowerCase();
                                    return (
                                      <li className="p-0" key={index}>
                                        {
                                          linkName === 'tiempo aire' ?
                                            <a className="a-footer__link" href='javascript:void(0);' onClick={() => this.redirectToURL(item.url, item.name)}>{item.text}</a> :
                                            item['displayStyle'] === 'Link' ? <a className="a-footer__link" rel="noreferrer" href={item.url}>{item.text}</a> : item.text
                                        }
                                      </li>
                                    )
                                  })
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        })
                      }
                    </div>
                    <div className="col-12 col-lg order-3">
                      {
                        !isEmpty(data) && !isEmpty(data.verticalLink3) && map(data.verticalLink3, (verticalData, index) => {
                          return <div className="card m-footer__accordion" key={index} onClick={this.toggleClass.bind(this, `active3${index}`)}>
                            <div className="card-header d-flex justify-content-between align-items-center" data-toggle="collapse" data-target={`#collapseAboutUss${index}`} aria-expanded={this.state.accordion[`active3${index}`]} aria-controls={`collapseAboutUs${index}`} id={`aboutUs${index}`}>
                              <h3 className="a-footer__sectionTitle">{verticalData.name}
                              </h3><i className="icon-arrow_down d-block d-lg-none"></i>
                            </div>
                            <div className={this.state.accordion[`active3${index}`] ? 'collapse show' : "collapse"} aria-labelledby={`aboutUs${index}`} id={`#collapseAboutUss${index}`}>
                              <div className="card-body pt-0 pb-lg-0">
                                <ul className="m-0">
                                  {!isEmpty(verticalData) && !isEmpty(verticalData.links) && map(verticalData.links, (item, index) => {
                                    let linkName = item.name;
                                    linkName = linkName.toLowerCase();
                                    return (
                                      <li className="p-0" key={index}>
                                        {/*<a className="a-footer__link" href={item.url}>{item.text}</a>*/}
                                        {
                                          linkName === 'tiempo aire' ?
                                            <a className="a-footer__link" href='javascript:void(0);' onClick={() => this.redirectToURL(item.url, item.name)}>{item.text}</a> :
                                            item['displayStyle'] === 'Link' ? <a className="a-footer__link" rel="noreferrer" href={item.url}>{item.text}</a> : item.text
                                        }
                                      </li>
                                    )
                                  })
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <div className="col-12 col-lg-4">
              <div className="row">
                <div className="col-12 pt-3 pt-lg-0 order-1">
                  <a className="a-footer__boletin" href={!isEmpty(data) && !isEmpty(data.newsLetter) && data.newsLetter.length && data.newsLetter[0] && data.newsLetter[0].header ? data.newsLetter[0].header : ''}>{!isEmpty(data) && !isEmpty(data.newsLetter) && data.newsLetter[0] && data.newsLetter[0].name}</a>
                </div>
                <div className="col-12 order-2 pt-3 text-center">
                  {!isEmpty(data) && !isEmpty(data.newsLetter) && map(data.newsLetter[0].links, (item, index) => {
                    if(item['displayStyle'] === "Social") {
                      return <a className="a-footer__socialMedia" href={item.url}><i className={"icon-" + (item.name || '').toLowerCase()}></i></a>
                    } else {
                      return <p className="a-footer__contact text-lg-left" dangerouslySetInnerHTML={{__html: item.text}}></p>
                    }
                  })
                  }
                </div>
                {/* <div className="col-12 text-center order-3 pb-4 pb-lg-0"> */}
                {/*{!isEmpty(data) && map(data.socialNetworking, (item, index) => {*/}
                {/* </div> */}
              </div>
            </div>
            <div className="col-12 pt-4 pt-lg-5">
              <hr />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-12 col-lg-4 text-lg-left text-center order-1 pt-4 pb-2 pt-lg-3 pb-lg-3">
              {!isEmpty(data) && !isEmpty(data.horizontalLink1) && map(data.horizontalLink1[0].links, (item, index) => {
                return (
                  <span className="a-footer__comments" key={index}>
                    {item['@type'] == "Link" ?
                      <a className="a-footer__comments" href={item.url}>{item.text}</a>
                      : "&nbsp;" + item.text}
                  </span>
                )
              })
              }
            </div>
            <div className="col-12 col-lg-4 text-center order-2 pb-4 pb-lg-0">
              {!isEmpty(data) && data.horizontalLink2 && map(data.horizontalLink2, (item, index) => {
                const len = data.horizontalLink2.length;
                return (
                  <React.Fragment key={index}>
                    <Link className="a-footer__disclaimers" rel="noreferrer" href={!isEmpty(item.url)? item.url: "#"} target="_blank">{item.text}</Link>
                    {(len - 1 !== index) && < span className="a-footer__slash" >/</span >}
                  </React.Fragment>
                )
              })
              }
            </div>
            <div className="col-12 col-lg-4 text-lg-right text-center order-3 pb-4 pb-lg-0">
              {!isEmpty(data) && map(data.socialNetworking, (item, index) => {
                return (
                  <React.Fragment key={index}>
                    <a className="a-footer__socialMedia" href={item.url}><i className={"icon-" + (item.name || '').toLowerCase()}></i></a>
                  </React.Fragment>
                )
              })
              }
            </div>
          </div>
        </div>
        <div className="container-fluid m-footer__misc">
          <div className="col-12 col-lg-12 text-center">
            {!isEmpty(data) && map(data.bottomHTML, (item, index) => {
              return (
                <p className="a-footer__misc" key={index}>{item.text}</p>
              )
            })
            }
          </div>
        </div>
      </footer>
       </React.Fragment>
    )
  }
}

Footer.defaultProps = {
  setFooterData: () => { },
  footerClassName: ''
}
export default Footer;
