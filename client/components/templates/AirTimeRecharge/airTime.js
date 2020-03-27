import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../headerFooter/headerFooter';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { parentContext } from '../../../contexts/parentContext';
import EventListener from 'react-event-listener';
import Alert from '../../molecules/Alert/Alert';
import OrganimsAirTimeSummary from '../../organisms/AirTimeRechargeSummary/organimsAirTimeSummary';
import OrganimsAirTimePayment from '../../organisms/AirTimeRechargePayment/organimsAirTimePayment';
import OrganimsAirTimeCellphones from '../../organisms/AirTimeRechargeCellphones/organimsAirTimeCellphones';
import moleculeModalLogin from '../../molecules/Modals/moleculeModalLogin';
import { Utility, GTMallPages, GetCookie } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import map from 'lodash/map';
class AirTime extends React.Component {
  constructor(props) {
    super(props);
    this.temp = React.createRef();
    this.state = {
      alert_status: '',
      alert_message: '',
      alertToTop: '',
      show: '',
      data: '',
      labelsData: '',
      creditCardsData: '',
      phonesData: '',
      defaultCreditCardId: '',
      showAirTimePayCard: false,   //show the payment method section
      //for summary 
      selectedAirtimeSKUs: [],
      selectedPhones: [],
      expirationMonth: '',
      expirationYear: '',
      creditCardCVVNumber: '',
      selectedCreditCardNickName: '',
      rechargeSubTotal: '',
      desktopScreen: '',
      pageSessionId: '',
      FPSessionId: '',
      orgId: '',
      fingerPrintEndPoint: '',
      showExpMonthAndYearField: false,
      subTotalAmount: 0,
      errorCvv: false,
      errorYear: false,
      errorMonth: false,
      activeIndex: -1,
      rechargeTotal: 0
    }
    this.temp1 = []
    this.totalAmount = [];
    this.expiryMonthData = [];
    this.expiryYearData = [];
  }
  dismiss_alert = () => {
    this.setState({ alert_status: false })
  }

  show_alert = (alert_message) => {
    this.setState({ alert_status: true, alert_message });
    setTimeout(() => {
      this.setState({ alert_status: false });
    }, 3000)
  }

  scrollUp = () => {
    window.scrollTo(0, 0);
  }

  onBlur = (creditCardCvv) => {

    if (creditCardCvv) {
      this.setState({ errorCvv: false })
    } else {
      this.setState({ errorCvv: true })
    }
  }
  onBlurMonth = (month) => {

    if (month) {
      this.setState({ errorMonth: false })
    } else {
      this.setState({ errorMonth: true })
    }
  }
  onBlurYear = (year) => {

    if (year) {
      this.setState({ errorYear: false })
    } else {
      this.setState({ errorYear: true })
    }
  }

  getSelectedAirtimeSKUs = (airTime, phoneId, showTotal) => {
    let phone = phoneId;

    let key = phone;
    if (this.temp1.length < 1) {
      this.temp1.push({ [phone]: airTime });
    }

    const _t = this.temp1;
    let isFound = false;
    map(this.temp1, (item, index) => {
      if (Object.keys(item)[0] == phoneId && showTotal === true) {
        this.temp1[index][phone] = airTime;
        isFound = true;
      }
    })

    map(this.temp1, (item, index) => {
      if (item && Object.keys(item)[0] == phoneId && showTotal === false) {
        this.temp1.splice(index, 1)
        isFound = true;
      }
    })

    if (isFound === false && showTotal === true) {
      this.temp1.push({ [phone]: airTime });
    }

    let _selectedAirtimeSKUs = this.state.selectedAirtimeSKUs;
    _selectedAirtimeSKUs.push(airTime);
    this.setState({ selectedAirtimeSKUs: _selectedAirtimeSKUs })
  }

  // for calculating recharge
  showrechargeTotal = (showTotal) => {
    if (showTotal === true) {
      this.setState({
        rechargeTotal: this.state.rechargeTotal + 1
      })
    } else if (showTotal === false) {
      this.setState({
        rechargeTotal: this.state.rechargeTotal - 1
      })
    }
  }

  getselectedPhones = (selectedPhonesId) => {
    let _selectedPhonesId = this.state.selectedPhones;
    _selectedPhonesId.push(selectedPhonesId);
    this.setState({ selectedPhones: _selectedPhonesId })
  }

  getCreditCardMonth = (month) => {
    this.setState({ expirationMonth: month })
  }
  getCreditCardYear = (year) => {
    this.setState({ expirationYear: year })
  }
  getCreditCardCvv = (cvv) => {
    this.setState({ creditCardCVVNumber: cvv })
  }
  getselectedCreditCardType = (cardNickName) => {


    this.setState({ selectedCreditCardNickName: cardNickName })
  }


  getSubtotal = (subtotal, selectedPhonesId, showTotal) => {
    let amountObject = {};
    amountObject.phoneId = selectedPhonesId;
    amountObject.amount = subtotal;
    if (this.totalAmount.length < 1) {
      this.totalAmount.push(amountObject);
    }
    let isFound = false;
    map(this.totalAmount, (item, index) => {
      if (item.phoneId == selectedPhonesId && showTotal === true) {
        this.totalAmount[index].amount = subtotal;
        isFound = true;
      }
    })

    map(this.totalAmount, (item, index) => {
      if (item && item.phoneId == selectedPhonesId && showTotal === false) {
        this.totalAmount.splice(index, 1)
        isFound = true;
      }
    })


    if (isFound === false && showTotal === true) {
      this.totalAmount.push(amountObject);
    }
    let total = 0;
    this.totalAmount.map(item => {
      total = total + parseInt(item.amount);
    })
    this.setState({ rechargeSubTotal: total });
    // console.log('rechargeSubTotal', this.state.rechargeSubTotal)
  }

  //Function for show default credit card selected
  getDefaultCardType = (creditCardsData, defaultCreditCardId) => {
    map(creditCardsData, (creditData, index) => {
      if (creditData && creditData.repositoryId === defaultCreditCardId && creditData.creditCardType === 'LPC') {
        this.setState({ selectedCreditCardNickName: creditData.nickName })
        this.setState({
          showExpMonthAndYearField: true,
          activeIndex: 0
        });
      } else if (creditData && creditData.repositoryId === defaultCreditCardId) {

        this.setState({
          selectedCreditCardNickName: creditData.nickName,
          activeIndex: 0
        })

      }
    });
  }

  loadAirTimeData = () => {
    try {
      let payload = { "paymentSelection": true }
      Utility(Path.airtimecheckoutland, 'POST', payload).then(response => {
        if (response && response.data && response.data.s === "0" && response.data.creditCards && response.data.phones) {
          this.setState({
            creditCardsData: response.data.creditCards,
            defaultCreditCardId: response.data.defaultCreditCardId

          });
          this.getDefaultCardType(response.data.creditCards, response.data.defaultCreditCardId);
          this.setState({
            pageSessionId: response.data.pageSessionId
          })
          let airTimePhonesData = response.data.phones;
          const temp = [];
          map(airTimePhonesData, (phonesData, index) => {
            const data = {};
            data.name = phonesData.shortname ? phonesData.shortname : "";
            data.number = phonesData.phoneNumber;
            data.service = phonesData.service;
            data.repositoryId = phonesData.repositoryId;
            data.airTime = phonesData.airTime;
            temp.push(data);
          })
          this.setState({ phonesData: temp })

        } else if (response && response.data && response.data.errorCode && response.data.errorCode === '1002') {
          Router.push('/tienda/login')

        }
      }, (error) => {
        // console.error(e, "error");
      });
    } catch (e) {
      console.error(e, "error");
    }
  }

  componentDidMount() {
    // this.getAllPageEvent();
    this.staticLabels();
    this.loadAirTimeData();
    this.getConfiguration();

    if (screen.width > 992) {
      this.setState({
        desktopScreen: true
      })
    } else {
      this.setState({
        desktopScreen: false
      })
    }
  }

  handleWindowScroll = (e) => {
    this.handleScrollAlert(e);
  }

  handleScrollAlert = () => {
    try {
      if (window.scrollY >= 117) {
        this.setState({ alertToTopSticky: '', alertToTop: '-toTop' });
      }
      else {
        this.setState({ alertToTopSticky: '', alertToTop: '' });
      }
    } catch (e) { }
  }
    resetFooterPosition() {
    var footer = document.querySelector(`footer`);
      var bodyElem = document.querySelector(`#__next`);
      var footerDetails = footer.getBoundingClientRect();
      var bodydetails = bodyElem.getBoundingClientRect();
      var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
      var bodyDiff = 0;
      if (viewportHeight > bodydetails.height) {
        bodyDiff = (viewportHeight - bodydetails.height);
        footer.style.top = viewportHeight - footerDetails.height + 'px';
      //  bodyElem.style.height = parseInt(window.getComputedStyle(bodyElem).height.replace(/px/g,''), 10) + bodyDiff + 'px'; //bodyElem.style.height + (viewportHeight - footerDetails.height) + 'px';
      } else {
        footer.style.removeProperty('top');
        bodyElem.style.removeProperty('height');
      }
  }
  showAirTimePayCardFunction = () => {

  }
  finishRechargeForAirTime = () => {
    let phonesId = []
    let airtimeId = []

    map(this.temp1, (items) => {
      let temp = items;

      phonesId.push(Object.keys(temp)[0]);
      airtimeId.push(Object.values(temp)[0]);
    })

    if (this.state.creditCardCVVNumber) {
      this.setState({ errorCvv: false })
    } else {
      this.setState({ errorCvv: true })
    }
    if (this.state.expirationMonth) {
      this.setState({ errorMonth: false })
    } else {
      this.setState({ errorMonth: true })
    }
    if (this.state.expirationYear) {
      this.setState({ errorYear: false })
    } else {
      this.setState({ errorYear: true })
    }

    if (this.state.selectedPhones.length === 0) {
      this.show_alert(this.state.labelsData && this.state.labelsData["pwa.airtimeCheckoutPage.selectPhone_alert.text"]);
      this.scrollUp();
    }
    else if (!this.state.selectedCreditCardNickName) {
      this.show_alert(this.state.labelsData && this.state.labelsData["pwa.airtimeCheckoutPage.addPayment_method_alert.text"]);
      this.scrollUp();
    } else if ((!this.state.creditCardCVVNumber && !this.state.showExpMonthAndYearField) || (this.state.showExpMonthAndYearField && (!this.state.expirationMonth || !this.state.expirationYear || !this.state.creditCardCVVNumber))) {
    } else {
      try {
        let payload = {
          "selectedPhones": phonesId,
          "selectedAirtimeSKUs": airtimeId,
          "selectedCreditCardName": this.state.selectedCreditCardNickName,
          "creditCardVerificationNumber": this.state.creditCardCVVNumber,
          "isReliable": "true",
          "expirationMonth": this.state.expirationMonth,
          "expirationYear": this.state.expirationYear
        }

        Utility(Path.airtimecheckout, 'POST', payload).then(response => {
          if (response && response.data && response.data.s === "0") {
            Router.push(`/tienda/checkoutOrderConfirmationAirTime`)
          } else if (response.data && response.data.s === "1" && response.data.err && response.data.err !== '') {
            this.show_alert(response.data.err);
            this.scrollUp(0, 0);

          }
        }, (error) => {
          console.error('error', error);
        });
      } catch (e) {
        console.error('error', e);
      }
    }
  }

  finishRechargeForAirTimeMobile = () => {
    if (this.state.creditCardCVVNumber) {
      this.setState({ errorCvv: false })
    } else {
      this.setState({ errorCvv: true })
    }
    if (this.state.expirationMonth) {
      this.setState({ errorMonth: false })
    } else {
      this.setState({ errorMonth: true })
    }
    if (this.state.expirationYear) {
      this.setState({ errorYear: false })
    } else {
      this.setState({ errorYear: true })
    }
    if (!this.state.selectedCreditCardNickName) {
      this.show_alert(this.state.labelsData && this.state.labelsData["pwa.airtimeCheckoutPage.addPayment_method_alert.text"]);
      this.scrollUp();
    } else {
      this.finishRechargeForAirTime();
    }
  }

  showCVVFieldOrNot = (cardType, index) => {
    if (cardType === 'LPC') {
      this.updateActiveIndex(index);
      this.setState({
        showExpMonthAndYearField: true,
        creditCardCVVNumber: '',
        expirationMonth: '',
        expirationYear: '',
      })
    } else {
      this.updateActiveIndex(index);
      this.setState({
        showExpMonthAndYearField: false,
        creditCardCVVNumber: '',
        expirationMonth: '',
        expirationYear: '',
      })
    }
  }

  staticLabels = () => {
    let labels = this.props.data.labelData && this.props.data.labelData.staticLabelValues && this.props.data.labelData.staticLabelValues.filter(p => p.pageName == "pwa-airtimeCheckoutPage");
    const pageName = "?pageName=pwa-airtimeCheckoutPage";

    if (typeof labels === 'undefined' || labels.length === 0) {
      Utility(Path.staticLabelsFetch + pageName, 'GET').then(response => {
        labels = response && response.data && response.data.staticLabelValues && response.data.staticLabelValues[0].keyValues && response.data.staticLabelValues[0].keyValues;
        this.setState({
          labelsData: labels
        })
      }, (error) => {
      });
    } else {
      let _tdata = labels && labels[0].keyValues;
      this.setState({
        labelsData: _tdata
      });
    }
  }

  getConfiguration = async () => {
    try {
      /* Start fix for 24005 */
      let yearsOptions = [
        {
            name: "2019",
            value: "2019"
        },
        {
            name: "2020",
            value: "2020"
        },
        {
            name: "2021",
            value: "2021"
        },
        {
            name: "2022",
            value: "2022"
        },
        {
            name: "2023",
            value: "2023"
        },
        {
            name: "2024",
            value: "2024"
        },
        {
            name: "2025",
            value: "2025"
        },
        {
            name: "2026",
            value: "2026"
        },
        {
            name: "2027",
            value: "2027"
        },
        {
            name: "2028",
            value: "2028"
        },
        {
            name: "2029",
            value: "2029"
        },
    ]
/* Start fix for 24005 */
let monthsOptions = [
        {
            name: "01",
            value: "01"
        },
        {
            name: "02",
            value: "02"
        },
        {
            name: "03",
            value: "03"
        },
        {
            name: "04",
            value: "04"
        }
        ,
        {
            name: "05",
            value: "05"
        },
        {
            name: "06",
            value: "06"
        },
        {
            name: "07",
            value: "07"
        },
        {
            name: "08",
            value: "08"
        },
        {
            name: "09",
            value: "09"
        },
        {
            name: "10",
            value: "10"
        },
        {
            name: "11",
            value: "11"
        },
        {
            name: "12",
            value: "12"
        }
    ]
let monthsInSpanishOptions = [
        {
            name_text: "Ene",
            value: "01"
        },
        {
            name_text: "Feb",
            value: "02"
        },
        {
            name_text: "Mar",
            value: "03"
        },
        {
            name_text: "Abr",
            value: "04"
        }
        ,
        {
            name_text: "May",
            value: "05"
        },
        {
            name_text: "Jun",
            value: "06"
        },
        {
            name_text: "Jul",
            value: "07"
        },
        {
            name_text: "Ago",
            value: "08"
        },
        {
            name_text: "Sep",
            value: "09"
        },
        {
            name_text: "Oct",
            value: "10"
        },
        {
            name_text: "Nov",
            value: "11"
        },
        {
            name_text: "Dic",
            value: "12"
        }
    ]
    /* End fix for 24005 */
      //  change for getConfigration service Calls : Start
      let response = {}
      response.data = this.props.configurationData;
      if (typeof response.data === 'undefined') {
        response = await Utility(Path.fetchConfiguration, 'GET'); //.then(response => {
      }
      //  change for getConfigration service Calls : End
      if (response && response.data) {
        // start changes for 22849
         /* Start fix for 24005 */
        if(response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && 
          typeof response.data.configuration.liverpoolconfiguration.expirationMonth !== 'undefined' &&
          response.data.configuration.liverpoolconfiguration.expirationMonth && response.data.configuration.liverpoolconfiguration.expirationMonth.length > 0 &&
          typeof response.data.configuration.liverpoolconfiguration.expirationyear !== 'undefined' &&
          response.data.configuration.liverpoolconfiguration.expirationyear && response.data.configuration.liverpoolconfiguration.expirationyear.length > 0){
           //this.getConfiguration(configurationData)
        }else{
           response = await Utility(Path.fetchConfiguration, 'GET');
        }
        /* End fix for 24005 */
        // end changes for 22849

        // let expiryMonth = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.expirationmonth;
         /* Start fix for 24005 */
        let expirationMonthData = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.expirationMonth;
        let expiryMonth = typeof expirationMonthData !== 'undefined' && expirationMonthData && expirationMonthData.length>0 ? expirationMonthData : {};
        let expirationyearData = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.expirationyear
        let expirationyear = typeof expirationyearData !== 'undefined' && expirationyearData && expirationyearData.length>0 ? expirationyearData : yearsOptions;
         /* End fix for 24005 */
        // map(expiryMonth, (item, index) => {
        //   let data = {}
        //   data.value = item
        //   this.expiryMonthData.push(data);
        // })
        // this.expiryMonthData = Object.keys(expiryMonth).map(key => {
        //   const name_text = expiryMonth[key];
        //   return { value: key, name_text }
        // })
        // this.expiryMonthData = this.expiryMonthData.sort((a, b) => parseInt(a.value) - parseInt(b.value));

        this.expiryMonthData = Object.keys(expiryMonth).map(key => {
              const obj = expiryMonth[key];
              const value = Object.keys(obj)[0];
              const name = obj[value];
              return { name_text: name, value }
          })
        if(this.expiryMonthData.length===0){
          this.expiryMonthData = monthsOptions;
        }
        map(expirationyear, (item, index) => {
          let data = {}
          data.value = item
          this.expiryYearData.push(data);
        })

        let _FPSessionId = '', _orgId = '', _fingerPrintEndPoint = '';

        let cybersourcemerchantid = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.cybersourcemerchantid;

        _orgId = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.orgid;

        _fingerPrintEndPoint = response.data && response.data.configuration && response.data.configuration.liverpoolconfiguration && response.data.configuration.liverpoolconfiguration.cybfpurl;

        _FPSessionId = cybersourcemerchantid + this.state.pageSessionId;

        this.setState({
          orgId: _orgId,
          FPSessionId: _FPSessionId,
          fingerPrintEndPoint: _fingerPrintEndPoint
        })

      }
      // });   //  change for getConfigration service Calls : 
    } catch (e) {
      console.error(e, "error");
    }
  }

  showPaymentMethodForMobile = () => {
    if (this.state.selectedPhones.length === 0 && this.state.desktopScreen === false) {
      this.show_alert(this.state.labelsData && this.state.labelsData["pwa.airtimeCheckoutPage.selectPhone_alert.text"]);
      this.scrollUp();
      // this.temp && this.temp.current && this.temp.current.classList.add('');
    }
    else if (this.state.selectedAirtimeSKUs.length && this.state.selectedPhones.length !== 0 && this.state.desktopScreen === false) {
      this.setState({
        showAirTimePayCard: true,
        // show: "hide"
      })
      this.temp && this.temp.current && this.temp.current.classList.add('airTimeHide');
    }
    //For desktop
    else {
      this.temp && this.temp.current && this.temp.current.classList.add('airTimeHide');
      this.setState({
        showAirTimePayCard: true
      })
    }

  }

  updateActiveIndex = (activeIndex) => {
    this.setState({ activeIndex })
  }

  //GTM
  getAllPageEvent = () => {
    let logged = GetCookie('LoggedInSession')
    let payload = {
      "actPageTitle": document.title ? document.title : '',
      "loginStatus": logged ? 'Y' : 'N',
      "actURL": window.location.href,
      "userID": ''
    }
    GTMallPages(payload);
  }

  render() {
    const staticLabels = this.state.labelsData;

    let breadcrumbInfo = {
      label: staticLabels && staticLabels["pwa.airtimeCheckoutPage.cellphoneMinutes.text"],
      isMyAccount: true
    };
    const { alert_status, alert_message } = this.state;
    const FPSessionId = this.state.FPSessionId;
    const orgId = this.state.orgId;
    const fingerPrintEndPoint = this.state.fingerPrintEndPoint;

    // console.log('FPSessionId', FPSessionId);
    // console.log('orgId', orgId);
    // console.log('fingerPrintEndPoint', fingerPrintEndPoint);

    return (
      <parentContext.Consumer >
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, showModal, setDepartmentData, departmentData, setFooterData, snbfooterData, configurationData }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              pageName="myAccount"
              setDepartmentData={setDepartmentData}
              departmentData={departmentData}
            />
            <EventListener target="window" onScroll={this.handleWindowScroll} 
                    onResize={this.resetFooterPosition}
                    onLoad={this.resetFooterPosition}/>
            <main className="t-airTimeRecharge">
              <div className="m-airTime-alerSection">
                <Alert {...this.props} alertTopClass={"m-alert__container mdc-snackbar airTimeDefaultTop-mobile -alert " + this.state.alertToTop} iconType="close" text={alert_message} alert_status={alert_status} dismiss_alert={this.dismiss_alert} /*airTimeStyle={'static'}*/ />

              </div>
              <div className="container-fluid">
                <div className="container p-0">
                  <div className="row d-none d-lg-block">
                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                  </div>

                  <div className="row">
                    <div className="col-12 a-airTime-title--mobile">
                      <h1 className="a-airTime-title">{staticLabels && staticLabels["pwa.airtimeCheckoutPage.cellphoneMinutes.text"]}</h1>
                    </div>
                  </div>

                  <div className="row">
                    {/*<div className={"col-lg-5 " + this.state.show}>*/}
                    <div id="mobileAirTimeCellphone" className="col-lg-5 airTimeIpad" ref={this.temp}>
                      <OrganimsAirTimeCellphones
                        phonesData={this.state.phonesData}
                        showAirTimePayCardFunction={this.showAirTimePayCardFunction}
                        getSelectedAirtimeSKUs={this.getSelectedAirtimeSKUs}
                        getselectedPhones={this.getselectedPhones}
                        getSubtotal={this.getSubtotal}
                        loadAirTimeData={this.loadAirTimeData}
                        showPaymentMethodForMobile={this.showPaymentMethodForMobile}
                        desktopScreen={this.state.desktopScreen}
                        staticLabels={staticLabels}
                        showExpMonthAndYearField={this.state.showExpMonthAndYearField}
                        showrechargeTotal={this.showrechargeTotal}
                      />
                    </div>

                    <div className="col-lg-4">
                      <OrganimsAirTimePayment
                        creditCardsData={this.state.creditCardsData}
                        showAirTimePayCard={this.state.showAirTimePayCard}
                        getCreditCardMonth={this.getCreditCardMonth}
                        getCreditCardYear={this.getCreditCardYear}
                        getCreditCardCvv={this.getCreditCardCvv}
                        getselectedCreditCardType={this.getselectedCreditCardType}
                        finishRechargeForAirTimeMobile={this.finishRechargeForAirTimeMobile}
                        defaultCreditCardId={this.state.defaultCreditCardId}
                        staticLabels={staticLabels}
                        showCVVFieldOrNot={this.showCVVFieldOrNot}
                        showExpMonthAndYearField={this.state.showExpMonthAndYearField}
                        expiryMonth={this.expiryMonthData}
                        expiryYear={this.expiryYearData}
                        errorCvv={this.state.errorCvv}
                        errorYear={this.state.errorYear}
                        errorMonth={this.state.errorMonth}
                        onBlur={this.onBlur}
                        onBlurMonth={this.onBlurMonth}
                        onBlurYear={this.onBlurYear}
                        activeIndex={this.state.activeIndex}
                      />
                    </div>


                    <div className="col-lg-3">
                      <OrganimsAirTimeSummary
                        finishRechargeForAirTime={this.finishRechargeForAirTime}
                        rechargeSubTotal={this.state.rechargeSubTotal}
                        staticLabels={staticLabels}
                        rechargeTotal={this.state.rechargeTotal}
                      />
                    </div>
                  </div>


                </div>
              </div>
            </main>
            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData}
            />
            <div className={Object.values(showModal).includes(true) === true ? 'modal-backdrop show' : ''}></div>
            <p Style={"background:url(" + fingerPrintEndPoint + "/clear.png?org_id=" + orgId + "&session_id=" + FPSessionId + "&m=1)"}></p>
            <img src={fingerPrintEndPoint + "/clear.png?org_id=" + orgId + "&session_id=" + FPSessionId + "&m=2"} alt="" />
            <script src={fingerPrintEndPoint + "/check.js?org_id=" + orgId + "&session_id=" + FPSessionId} type="text/javascript"></script>
            <object type="application/x-shockwave-flash" data={fingerPrintEndPoint + ".swf?org_id=" + orgId + "&session_id=" + FPSessionId} width="1" height="1" id="thm_fp">
              <param name="movie" value={fingerPrintEndPoint + ".swf?org_id=" + orgId + "&session_id=" + FPSessionId} />
            </object>
          </React.Fragment>

        )}
      </parentContext.Consumer >
    )
  }
}
export default AirTime;
