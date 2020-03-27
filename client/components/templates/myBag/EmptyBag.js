import { parentContext } from '../../../contexts/parentContext';
import Header from '../../organisms/Header/Header';
import get from 'lodash/get';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Footer from '../headerFooter/headerFooter';
import OrganismTab from '../../organisms/tab/organism-tab'
import AtomButtons from '../../atoms/Buttons/atom-buttons.js'
import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text.js'
import { UserAgentDetails } from '../../../helpers/utilities/utility';
import Alert from '../../molecules/Alert/Alert';
import Router from 'next/router';
//import './empty.styl'
export default class EmptyBag extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabCounts: {
                myBagCount: 0,
                wishListCount: 0
            },
           // activeTab: 'mdc-tab-1',
            window: '',
            alert_status: false,
            loginSession: this.props.loginDetails,
            staticLables: this.props.staticLables
        };

    }
    // showTabContent = (id) => {
    //     this.setState({ activeTab: id });
    // }
    //Required for sWOGO functionalities
    getOrderId = () => {
        //always return empty string as order id because ATG service will return empty here
        return '';
    }
    //Required for sWOGO functionalities
    getSWOGOPageIdentifier = () => {
        const { isDesktop, isMobile } = UserAgentDetails(this.state.window);
        if (isMobile) {
            return "mobileBasket-0";
        }
        return "basket-0";
    }
    //Required for sWOGO functionalities
    getSkusInfoForSWOGO = () => {  // shared the cart all commerce items
        let items = [];
        //always empty array here
        return items;
    }
    componentDidMount() {

        //Required for sWOGO functionalities
        window.swogoDependencies = { getSkus: this.getSkusInfoForSWOGO, getPage: this.getSWOGOPageIdentifier, getOrderId: this.getOrderId };
        if (this.props.MyBag && this.props.MyBag.removedGCs && this.props.MyBag.removedGCs.length > 0) {
            this.show_alert()
        }

    }
      componentWillReceiveProps(nextProps) {
         if (nextProps.loginSession !== this.state.loginSession) {
              this.setState({ loginSession: nextProps.loginSession })

        }
    }

    dismiss_alert = () => {
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert") => {
        this.setState({ alert_status: true, alert_message, alert_Type });
        setTimeout(() => {
            this.setState({ alert_status: false });
        }, 3000)
    }
    render() {
        const loggedInSession = get(this.props, 'loginDetails.LoggedInSession', '');
        const staticLables=this.state.staticLables;
        const headerData = get(this.props.headerData, 'headerContent', '')
        const { tabCounts } = this.state;
        const header = {
            downarrow: "icon-arrow_down"
        }
        const organism = {
            name: "o-tabIcon",
            items: [
                { text: "Mi bolsa", isActive: true, withIcon: true, quantity: 2 },
                { text: "Guardados", isActive: false, withIcon: true, quantity: 0 }
            ]
        };
        const myButtonText = loggedInSession ? staticLables['pwa.cart.continueShopping.text'] : staticLables['pwa.loginPage.loginNewSmall.label'];
        const buttonData = { className: "a-btn a-btn--primary a-product__buttonBuy", text: staticLables['pwa.cart.continueShopping.text'] };
        const IniciarButton = { className: "a-btn a-btn--primary a-product__buttonBuy", text: myButtonText }
        const breakdownExpenses = { className: "a-inlineElement a-inlineElement--emptyMessage", text: staticLables['pwa.sfl.emptywishlist.wap.text'], type: "p" }
        const breakdownExpensesSavedTab = { className: "a-inlineElement a-inlineElement--emptyMessage", text: staticLables['pwa.sfl.noItem.text'], type: "p" };;
       
        return (
            <React.Fragment>
               

                {
                    (this.props.isShow) ?

                        <Alert {...this.props} alertTopClass={" m-alert__container mdc-snackbar -warning"} iconType="close" text={"You can not buy gift certificates at your table."} alert_status={this.state.alert_status} dismiss_alert={this.dismiss_alert} />

                        : null
                }

                    <React.Fragment>
                        {
                            (this.props.isShow) ?
                                <section className="container-fluid t-myBag">
                                    <div className="t-myBag__head">
                                        <OrganismTab Tab={organism} tabCounts={tabCounts} staticLables={this.props.staticLables} showTabContent={this.props.showTabContent} activeTab={this.props.activeTab} dismiss_alert={this.dismiss_alert}/>
                                    </div>
                                    <div className="t-myBag__cards">
                                        <div className="t-myBag__emptyList">
                                            {this.props.activeTab === "mdc-tab-1" ?
                                            <React.Fragment>
                                                <AtomChunkText Type={breakdownExpenses.type} className={breakdownExpenses.className}>{breakdownExpenses.text}</AtomChunkText>
                                                 <div className="t-myBag__continueToBuy" name="continueToBuyBottom">
                                                <AtomButtons buttonData={buttonData} onClick={() => { Router.push('/tienda/home', '/tienda/home') }} />
                                            </div>
                                            </React.Fragment>
                                                :
                                                <React.Fragment>
                                                {
                                                    (loggedInSession)?
                                                     <React.Fragment>
                                                       <AtomChunkText Type={breakdownExpenses.type} className={breakdownExpenses.className}>{breakdownExpenses.text}</AtomChunkText>
                                                       <div className="altMessage emptyMessage" dangerouslySetInnerHTML={{__html:  this.props.staticLables['pwa.sfl.noItem1.text']}}></div>
                                                     </React.Fragment>
                                                    :
                                                       <AtomChunkText Type={breakdownExpensesSavedTab.type} className={breakdownExpensesSavedTab.className}>Para guardar artículos en esta lista inicia sesión</AtomChunkText>
                                                }
                                                
                                                 <div className="t-myBag__continueToBuy" name="continueToBuyBottom">
                                               { 
                                                    loggedInSession?<AtomButtons buttonData={buttonData} onClick={() => { Router.push('/tienda/home', '/tienda/home') }} ></AtomButtons>
                                                    :<AtomButtons buttonData={IniciarButton} onClick={() => { Router.push('/tienda/login', '/tienda/login') }} ></AtomButtons>
                                                        }
                                            </div>
                                            </React.Fragment>
                                            }

                                        </div>
                                    </div>
                                </section>
                                :
                               <div className="t-myBag__cards">
                                    <div className="t-myBag__emptyList">
                                         {this.props.activeTab === "mdc-tab-2" ?
                                         <React.Fragment>
                                             {
                                                    (loggedInSession)?
                                                     <React.Fragment>
                                                       <AtomChunkText Type={breakdownExpenses.type} className={breakdownExpenses.className}>{breakdownExpenses.text}</AtomChunkText>
                                                       <div className="altMessage emptyMessage" dangerouslySetInnerHTML={{__html:  this.props.staticLables['pwa.sfl.noItem1.text']}}></div>
                                                     </React.Fragment>
                                                    :
                                                       <AtomChunkText Type={breakdownExpensesSavedTab.type} className={breakdownExpensesSavedTab.className}>Para guardar artículos en esta lista inicia sesión</AtomChunkText>
                                                }
                                          {/*<AtomChunkText Type={breakdownExpensesSavedTab.type} className={breakdownExpensesSavedTab.className}>{breakdownExpensesSavedTab.text}</AtomChunkText>*/}
                                        <div className="t-myBag__continueToBuy" name="continueToBuyBottom">
                                            {
                                                   loggedInSession?<AtomButtons buttonData={buttonData} onClick={() => { Router.push('/tienda/home', '/tienda/home') }} ></AtomButtons>
                                                    :<AtomButtons buttonData={IniciarButton} onClick={() => { Router.push('/tienda/login', '/tienda/login') }} ></AtomButtons>
                                                        }
                                        </div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                          <AtomChunkText Type={breakdownExpenses.type} className={breakdownExpenses.className}>{breakdownExpenses.text}</AtomChunkText>
                                        <div className="t-myBag__continueToBuy" name="continueToBuyBottom">
                                            {
                                                   loggedInSession?<AtomButtons buttonData={buttonData} onClick={() => { Router.push('/tienda/home', '/tienda/home') }} ></AtomButtons>
                                                    :<AtomButtons buttonData={IniciarButton} onClick={() => { Router.push('/tienda/login', '/tienda/login') }} ></AtomButtons>
                                                        }
                                        </div>
                                        </React.Fragment>
                                         }
                                    </div>
                                </div>
                        }
                        <parentContext.Consumer>
                            {({ showModal, loginDetails }) => (
                                <React.Fragment>

                                    <div className={Object.values(showModal).includes(true) === true ? 'modal-backdrop show' : ''}></div>
                                </React.Fragment>
                            )}
                        </parentContext.Consumer>
                    </React.Fragment>

            </React.Fragment>
        )
    }

}
