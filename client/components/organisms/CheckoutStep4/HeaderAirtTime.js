import Link from '../../atoms/Link/Link';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import HrTag from '../../atoms/HrTag/HrTag';
import Image from '../../atoms/Tagimage/Image';
import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Button from '../../atoms/Button/Button';
import Icons from '../../atoms/Icons/Icons';
import Span from '../../atoms/Span/Span';
import { Utility, logError, logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Alerts from '../../molecules/Alert/Alerts';
import { withRouter } from 'next/router';
import Router from 'next/router';


export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            headerData: {}
        }
    }
    getHeaderData = async () => {
        Utility(Path.headerInfo + "?page=checkout", 'GET').then(response => {
            if (response.status === 200 && response && response.data && response.data.headerContent && response.data.headerContent[0].orderConfirmation && response.data.headerContent[0].orderConfirmation[0]) {
                this.setState({
                    headerData: response && response.data && response.data.headerContent && response.data.headerContent[0].orderConfirmation && response.data.headerContent[0].orderConfirmation[0]
                })
                //  console.log('checkout header', this.state.headerData);
            }
        }, (error) => {
        });
    }
    componentWillMount() {
        this.getHeaderData();
    }

    redirectToHomePage = () => {
        let redirectionHost = window.location.origin + '/tienda/home';
        location.assign(redirectionHost);
        // Router.push({ pathname: '/tienda/home' });
    }

    render() {

        const { logo, rightLink1, rightLink2, rightLink3 } = this.state.headerData;
        const {isDesktop} = UserAgentDetails(window);
        //console.log('isDesktop',isDesktop);
        // console.log('this.state.headerData',this.state.headerData);
        //console.log("isDesktop---------------", isDesktop)

        let successData = this.props && this.props.itemDetails && this.props.itemDetails.success ? this.props.itemDetails.success : [];
        // console.log('props:::::',successData.deliveryInfo[0].packedList[0].digitalErrorMessage);
        let setDigitalErrorMsgFlag = false;
        let setMessage = '';
        if (successData !== []) {
            for (var i = 0; i < successData.length; i++) {
                if (successData[i] && successData[i].itemType && successData[i].itemType.toLocaleLowerCase() === "Digital".toLocaleLowerCase()) {
                    let dataPath = successData[i].deliveryInfo[0].packedList[0];
                    setDigitalErrorMsgFlag = true;
                    if(dataPath.digitalErrorMessage){
                    setMessage = dataPath.digitalErrorMessage;
                    }else{
                    setMessage = dataPath.cieWarningMessage + dataPath.userEmail;
                    }
                    

                }
            }
        }
        const { paymentDetail, itemDetails, deleveryAddressDetail, orderSuccessTotal, staticLabels, downloadPdf, alertToTop } = this.props;
        const headerContent = itemDetails.headerContentForPrint ? itemDetails.headerContentForPrint : {};
        const nightBox = this.props.nightBox;
        let warnings = {
            type: 'm-alert__container mdc-snackbar -success -alertCheckout mdc-snackbar--open',
            text: nightBox || '',
            className: 'a-alert__text',
            alertToTop,
            iconType: 'a-alert__icon icon-done'
        };
        let warningsDigitaleror = {
            type: 'm-alert__container mdc-snackbar -alert -alertCheckout mdc-snackbar--open',
            text: setMessage || '',
            className: 'a-alert__text',
            alertToTop,
            iconType: 'a-alert__icon icon-error'
        }
        // console.log('this ===========',this.props);
        return (
            <React.Fragment>
                <div className="container-fluid -white">

                    <div className="container p-0">

                        {(itemDetails && itemDetails.success && itemDetails.success.length === 0) ?

                            <div>
                                <div className="row align-items-center no-gutters justify-content-lg-between justify-content-center pt-lg-4 pb-lg-4 pt-3 pb-3 -checkoutHeaderConfirmation">
                                    <div className="col-lg-auto col-6 text-center">
                                        {staticLabels['pwa.orderConfirmation.headerDesktopLogo.Url'] !== undefined || staticLabels['pwa.orderConfirmation.headerMobileLogo.Url'] !== undefined ?
                                            <Image className="a-checkout__svgBag" src={isDesktop ? staticLabels['pwa.orderConfirmation.headerDesktopLogo.Url'] : staticLabels['pwa.orderConfirmation.headerMobileLogo.Url']} onClick={this.redirectToHomePage} alt="Bag" />
                                            : null
                                        }
                                        {/*<a className="a-header__logo -primaryLogo d-none d-lg-block" href="#">
                                            <svg xmlns={"http://www.w3.org/2000/svg"} width="174" height="41" viewBox="0 0 174 41">
                                                <g fill="#E10098" fill-rule="evenodd">
                                                    <path d="M21.444 22.446h-8.29c-.92 0-1.218-.58-1.218-1.373L11.93.9H9.018v22.926c0 .962.811 1.598 1.41 1.598h11.016v-2.977z"></path>
                                                    <path d="M21.444 26.558v2.983H6.727c-1.007 0-1.705-.772-1.705-1.77.01-1.173 0-26.873 0-26.873h2.901v23.806c0 1.045.444 1.854 1.687 1.854h11.834z"></path>
                                                    <path d="M1 .898h2.918V28.61c0 1.003.489 2.064 1.917 2.064h15.609v2.976H4.467C2.53 33.65 1 32.004 1 30.04V.899z"></path>
                                                    <path d="M13.023.898h2.917V17.17c0 .592.262 1.157 1.092 1.157h4.412v2.986h-6.939c-1.068 0-1.482-.695-1.482-1.488V.898z"></path>
                                                    <path d="M17.045 12.103h8.288c.923 0 1.22.581 1.22 1.373l.004 20.172h2.914V10.723c0-.96-.812-1.597-1.41-1.597H17.044l.001 2.977z"></path>
                                                    <path d="M17.043 7.99V5.007h14.718c1.007 0 1.706.772 1.706 1.771-.011 1.172 0 26.872 0 26.872h-2.902V9.844c0-1.046-.444-1.854-1.685-1.854H17.043z"></path>
                                                    <path d="M37.488 33.65H34.57V5.938c0-1.002-.49-2.063-1.918-2.063H17.043V.898h16.98c1.936 0 3.465 1.648 3.465 3.61V33.65z"></path>
                                                    <path d="M25.466 33.65h-2.918V17.38c0-.593-.263-1.158-1.09-1.158h-4.413v-2.987h6.937c1.067 0 1.484.697 1.484 1.49V33.65zM104.427 19.49c0-1.022.753-1.844 1.745-1.844h2.607v-3.013h-3.09c-2.35 0-4.207 1.954-4.207 4.36v14.655h2.947l-.002-14.158zM58.624 33.646h2.944V14.58h-2.944zM118.202 16.673c3.8 0 6.886 3.172 6.886 7.065 0 3.895-3.086 7.067-6.886 7.067-3.798 0-6.884-3.172-6.884-7.067 0-3.893 3.086-7.065 6.884-7.065zm16.73 0c3.799 0 6.89 3.172 6.89 7.065 0 3.895-3.091 7.067-6.89 7.067-3.798 0-6.89-3.172-6.89-7.067 0-3.893 3.092-7.065 6.89-7.065zm16.731 0c3.797 0 6.885 3.172 6.885 7.065 0 3.895-3.088 7.067-6.885 7.067-3.801 0-6.888-3.172-6.888-7.067 0-3.893 3.087-7.065 6.888-7.065zm-43.291 24.285h2.97V30.954c1.77 1.771 4.189 2.864 6.86 2.864 3.535 0 6.635-1.916 8.364-4.788 1.731 2.872 4.832 4.788 8.365 4.788 3.532 0 6.64-1.916 8.365-4.788 1.73 2.872 4.828 4.788 8.367 4.788 5.427 0 9.825-4.512 9.825-10.08 0-5.567-4.398-10.08-9.825-10.08-3.54 0-6.637 1.916-8.367 4.791-1.726-2.875-4.833-4.791-8.365-4.791-3.533 0-6.634 1.918-8.365 4.791-1.729-2.873-4.829-4.791-8.364-4.791-5.428 0-9.83 4.513-9.83 10.08v17.22zM90.204 16.568c2.966 0 5.659 1.934 6.644 4.953H83.55c.983-3.019 3.686-4.953 6.654-4.953m0 17.145c4.52 0 8.38-3.123 9.443-7.612H96.8c-.982 2.877-3.62 4.81-6.595 4.81-3.616 0-6.622-2.793-6.975-6.585h16.697v-.588c0-5.5-4.363-9.973-9.722-9.973-5.363 0-9.728 4.474-9.728 9.973 0 5.499 4.365 9.975 9.728 9.975M73.987 33.647l7.375-19.068h-3.361l-5.936 15.347-5.935-15.347h-3.358l7.373 19.068zM162.946 33.646h2.948V8.043h-2.948zM48.494 8.046v20.803c.01 1.035.593 1.843 1.744 1.843h7.238v2.953l-9.974-.002c-1.258 0-1.988-.788-1.988-1.929V8.046h2.98zM171.201 9.916c.262 0 .433-.102.433-.324 0-.196-.155-.319-.373-.319h-.545v.643h.485zm-.822-.934h.918c.52 0 .691.33.691.558 0 .349-.238.598-.588.617v.015c.177.062.307.247.479.531l.254.416h-.407l-.187-.333c-.264-.48-.363-.574-.617-.574h-.206v.907h-.337V8.982zm.849-.622c-.893 0-1.612.74-1.612 1.658 0 .917.72 1.663 1.612 1.663.893 0 1.622-.746 1.622-1.663 0-.919-.729-1.658-1.622-1.658zm0 3.652c-1.07 0-1.937-.893-1.937-1.994 0-1.102.867-1.984 1.937-1.984 1.075 0 1.944.882 1.944 1.984 0 1.101-.87 1.994-1.944 1.994zM58.62 11.103h2.948V8.046H58.62z"></path>
                                                </g>
                                            </svg></a>*/}
                                    </div>
                                    <div className="col-lg-auto col-6 d-none d-lg-flex">
                                        <div className="row">
                                            <div className="col-auto">
                                                {(rightLink1 && rightLink1[0] && rightLink2 && rightLink2[0]) ?
                                                    <React.Fragment>
                                                        <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph={rightLink1[0].name} classAnchor="a-checkout__phoneID" href={rightLink1[1].name} textAnchor=" 525261 9999" />
                                                        <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph={rightLink2[0].name} classAnchor="a-checkout__phoneID" href={rightLink2[1].name} textAnchor=" 01 800 713 5555" /> </React.Fragment> : null}
                                            </div>
                                            <div className="col-auto">
                                                {rightLink3 && rightLink3[0] &&
                                                    <AnchorLabelIcon typeaheadclass="m-checkoutHelp" href={rightLink3[0].url} labelclass="a-checkoutHelp__text -primaryColor" text=" Ayuda" iconclass="icon-help a-checkoutHelp__icon -primaryColor" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="d-none d-lg-block" />
                                <div className="row align-items-end no-gutters justify-content-center pt-5">
                                    <div className="col-lg-auto col-6 pr-4 text-center">
                                        <Icons className="icon-warning a-checkout__fail" />
                                    </div>
                                </div>
                                <div className="row align-items-center justify-content-center pt-3 pb-5">
                                    <div className="col-lg-4 col-12 text-center">
                                        <Paragraph className="a-checkout__headingFace m-0 pb-2">Lo sentimos, tu transacción no pudo ser procesada</Paragraph>
                                        <HrTag hrClass="w-100 mt-2 mb-2 d-lg-none d-block" />
                                        <Paragraph className="m-resumePurchase m-0">
                                        </Paragraph>
                                        <Span className="a-checkout__resumePurchase">Por favor inténtalo más tarde o puedes llamarnos a:</Span>
                                        <Paragraph className="a-checkout__email">Ventas por teléfono 5262 9999 / 01 800 713 555
                  </Paragraph>
                                        <Link className="a-box__invoice" href="#" onClick={this.redirectToHomePage}>Regresar a tienda</Link>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="row align-items-center no-gutters justify-content-lg-between justify-content-center pt-lg-4 pb-lg-4 pt-3 pb-3 -checkoutHeaderConfirmation">
                                    {/*<div dangerouslySetInnerHTML= {{__html: logo[0].imgUrl}} onClick={this.redirectToHomePage}></div>*/}
                                    <div className="col-lg-auto col-6 text-center">
                                        {staticLabels['pwa.orderConfirmation.headerDesktopLogo.Url'] !== undefined || staticLabels['pwa.orderConfirmation.headerMobileLogo.Url'] !== undefined ?
                                            <Image className="a-checkout__svgBag" src={isDesktop ? staticLabels['pwa.orderConfirmation.headerDesktopLogo.Url'] : staticLabels['pwa.orderConfirmation.headerMobileLogo.Url']} onClick={this.redirectToHomePage} alt="Bag" />
                                            : null
                                        }
                                        {/*<Link>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="174" height="41" viewBox="0 0 174 41" id="" className="a-header__logo d-block d-lg-none replaced-svg">
                                                <g fill="#FFF" fill-rule="evenodd">
                                                    <path d="M21.444 22.446h-8.29c-.92 0-1.218-.58-1.218-1.373L11.93.9H9.018v22.926c0 .962.811 1.598 1.41 1.598h11.016v-2.977z"></path>
                                                    <path d="M21.444 26.558v2.983H6.727c-1.007 0-1.705-.772-1.705-1.77.01-1.173 0-26.873 0-26.873h2.901v23.806c0 1.045.444 1.854 1.687 1.854h11.834z"></path>
                                                    <path d="M1 .898h2.918V28.61c0 1.003.489 2.064 1.917 2.064h15.609v2.976H4.467C2.53 33.65 1 32.004 1 30.04V.899z"></path>
                                                    <path d="M13.023.898h2.917V17.17c0 .592.262 1.157 1.092 1.157h4.412v2.986h-6.939c-1.068 0-1.482-.695-1.482-1.488V.898z"></path>
                                                    <path d="M17.045 12.103h8.288c.923 0 1.22.581 1.22 1.373l.004 20.172h2.914V10.723c0-.96-.812-1.597-1.41-1.597H17.044l.001 2.977z"></path>
                                                    <path d="M17.043 7.99V5.007h14.718c1.007 0 1.706.772 1.706 1.771-.011 1.172 0 26.872 0 26.872h-2.902V9.844c0-1.046-.444-1.854-1.685-1.854H17.043z"></path>
                                                    <path d="M37.488 33.65H34.57V5.938c0-1.002-.49-2.063-1.918-2.063H17.043V.898h16.98c1.936 0 3.465 1.648 3.465 3.61V33.65z"></path>
                                                    <path d="M25.466 33.65h-2.918V17.38c0-.593-.263-1.158-1.09-1.158h-4.413v-2.987h6.937c1.067 0 1.484.697 1.484 1.49V33.65zM104.427 19.49c0-1.022.753-1.844 1.745-1.844h2.607v-3.013h-3.09c-2.35 0-4.207 1.954-4.207 4.36v14.655h2.947l-.002-14.158zM58.624 33.646h2.944V14.58h-2.944zM118.202 16.673c3.8 0 6.886 3.172 6.886 7.065 0 3.895-3.086 7.067-6.886 7.067-3.798 0-6.884-3.172-6.884-7.067 0-3.893 3.086-7.065 6.884-7.065zm16.73 0c3.799 0 6.89 3.172 6.89 7.065 0 3.895-3.091 7.067-6.89 7.067-3.798 0-6.89-3.172-6.89-7.067 0-3.893 3.092-7.065 6.89-7.065zm16.731 0c3.797 0 6.885 3.172 6.885 7.065 0 3.895-3.088 7.067-6.885 7.067-3.801 0-6.888-3.172-6.888-7.067 0-3.893 3.087-7.065 6.888-7.065zm-43.291 24.285h2.97V30.954c1.77 1.771 4.189 2.864 6.86 2.864 3.535 0 6.635-1.916 8.364-4.788 1.731 2.872 4.832 4.788 8.365 4.788 3.532 0 6.64-1.916 8.365-4.788 1.73 2.872 4.828 4.788 8.367 4.788 5.427 0 9.825-4.512 9.825-10.08 0-5.567-4.398-10.08-9.825-10.08-3.54 0-6.637 1.916-8.367 4.791-1.726-2.875-4.833-4.791-8.365-4.791-3.533 0-6.634 1.918-8.365 4.791-1.729-2.873-4.829-4.791-8.364-4.791-5.428 0-9.83 4.513-9.83 10.08v17.22zM90.204 16.568c2.966 0 5.659 1.934 6.644 4.953H83.55c.983-3.019 3.686-4.953 6.654-4.953m0 17.145c4.52 0 8.38-3.123 9.443-7.612H96.8c-.982 2.877-3.62 4.81-6.595 4.81-3.616 0-6.622-2.793-6.975-6.585h16.697v-.588c0-5.5-4.363-9.973-9.722-9.973-5.363 0-9.728 4.474-9.728 9.973 0 5.499 4.365 9.975 9.728 9.975M73.987 33.647l7.375-19.068h-3.361l-5.936 15.347-5.935-15.347h-3.358l7.373 19.068zM162.946 33.646h2.948V8.043h-2.948zM48.494 8.046v20.803c.01 1.035.593 1.843 1.744 1.843h7.238v2.953l-9.974-.002c-1.258 0-1.988-.788-1.988-1.929V8.046h2.98zM171.201 9.916c.262 0 .433-.102.433-.324 0-.196-.155-.319-.373-.319h-.545v.643h.485zm-.822-.934h.918c.52 0 .691.33.691.558 0 .349-.238.598-.588.617v.015c.177.062.307.247.479.531l.254.416h-.407l-.187-.333c-.264-.48-.363-.574-.617-.574h-.206v.907h-.337V8.982zm.849-.622c-.893 0-1.612.74-1.612 1.658 0 .917.72 1.663 1.612 1.663.893 0 1.622-.746 1.622-1.663 0-.919-.729-1.658-1.622-1.658zm0 3.652c-1.07 0-1.937-.893-1.937-1.994 0-1.102.867-1.984 1.937-1.984 1.075 0 1.944.882 1.944 1.984 0 1.101-.87 1.994-1.944 1.994zM58.62 11.103h2.948V8.046H58.62z"></path>
                                                </g>
                                            </svg>
                                        </Link>*/}

                                    </div>


                                    <div className="col-lg-auto col-6 d-none d-lg-flex">
                                        <div className="row">
                                            <div className="col-auto">
                                                {(rightLink1 && rightLink1[0] && rightLink2 && rightLink2[0]) ?
                                                    <React.Fragment>
                                                        <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph={rightLink1[0].name} classAnchor="a-checkout__phoneID" href={rightLink1[1].name} textAnchor=" 525261 9999" />
                                                        <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph={rightLink2[0].name} classAnchor="a-checkout__phoneID" href={rightLink2[1].name} textAnchor=" 01 800 713 5555" /> </React.Fragment> : null}
                                            </div>
                                              <div className="col-auto">
                                            {rightLink3 && rightLink3[0] &&
                                                <AnchorLabelIcon typeaheadclass="m-checkoutHelp" href={rightLink3[0].url} labelclass="a-checkoutHelp__text -primaryColor" text=" Ayuda" iconclass="icon-help a-checkoutHelp__icon -primaryColor" />
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <HrTag hrClass="d-none d-lg-block" />
                                <div className="row align-items-end no-gutters justify-content-center pt-5">
                                    {/*{nightBox !== undefined ? <Alerts options={warnings} /> : null}*/}
                                    {setDigitalErrorMsgFlag ? <Alerts options={warningsDigitaleror} /> : null}
                                    <div className="col-lg-auto col-6 pr-4">
                                        {
                                            staticLabels['pwa.orderConfirmation.myBag.bagUrl'] !== undefined ?
                                                <Image className="a-checkout__svgBag" src={staticLabels['pwa.orderConfirmation.myBag.bagUrl']} alt="Bag" /> : null
                                        }
                                    </div>
                                    <div className="col-lg-5 col-6">
                                        <H5 headLineClass="a-checkout__nameHeading m-0 pb-2" headLineText={(deleveryAddressDetail.firstName ? deleveryAddressDetail.firstName : '') + ' ' + (deleveryAddressDetail.lastName ? deleveryAddressDetail.lastName : '')} />
                                        {/*<Paragraph className="a-checkout__headingFace m-0 pb-2">Gracias por tu compra</Paragraph>*/}
                                        {/*<Paragraph className="a-checkout__headingFace m-0 pb-2">El equipo  de Liverpool agradece tu preferencia</Paragraph>*/}
                                        <Paragraph className="a-checkout__headingFace m-0 pb-2">{staticLabels && staticLabels['pwa.orderConfirmationPage.thanksMsg1.text']?staticLabels['pwa.orderConfirmationPage.thanksMsg1.text']: 'Gracias por tu compra'}</Paragraph>
                                        <Paragraph className="a-checkout__headingFace m-0 pb-2" >{staticLabels && staticLabels['pwa.orderConfirmationPage.liverpoolagradectu.text']?staticLabels['pwa.orderConfirmationPage.liverpoolagradectu.text'] : 'El equipo  de Liverpool agradece tu preferencia'}</Paragraph>
                                    </div>
                                </div>
                                <div className="row align-items-center justify-content-center pt-3 ">
                                    <div className="col-12 text-lg-center text-left">
                                        <ParagraphSpanX4
                                            classParagraph="m-resumePurchase m-0"
                                            span1Class="a-checkout__resumePurchase"
                                            span1Text="Recibirás en breve un mail con el resumen de tu compra a:"
                                            span2Class="a-checkout__email"
                                            span2Text={this.props.email}
                                            span3Class="a-checkout__resumePurchase"
                                            span3Text=" revisa tu bandeja de entrada y spam. "
                                            span4Class="a-checkout__resumePurchase d-lg-none"
                                            span4Text=" Conserva tu número de pedido para dar seguimiento a tu compra."
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            (paymentDetail && paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === 'Transferencia'.toLowerCase())
                                || (paymentDetail && paymentDetail['Forma de pago'] && paymentDetail['Forma de pago'].trim().toLowerCase() === 'Efectivo'.toLowerCase())
                                ?
                                <div className="row align-items-center justify-content-end mt-3">
                                    <div className="col-lg-3 col-12">
                                        <button className="a-btn a-btn--primary" onClick={downloadPdf}>Descargar ticket de pago</button>
                                    </div>

                                    <React.Fragment>
                                        <div className="col-lg-auto col-12 text-center pt-3 pb-3">
                                            <p className="m-0 a-checkout__important">¡IMPORTANTE!</p>
                                        </div>
                                        <div className="col-lg-5 col-12">
                                            <p className="m-resumePurchase m-0"><span className="a-checkout__resumePurchase" dangerouslySetInnerHTML={{ __html: staticLabels['pwa.openPay.solicitud1.text'] }}></span> <span className="a-checkout__email">{orderSuccessTotal.expirationTime}</span> <span className="a-checkout__resumePurchase" dangerouslySetInnerHTML={{ __html: staticLabels['pwa.openPay.solicitud2.text'] }}></span>
                                            </p>
                                        </div></React.Fragment>

                                </div> :
                                <div className="row align-items-center justify-content-center pt-3 pb-5">
                                    {/*<div className="col-lg-3 col-12">
                                    <Button className="a-btn a-btn--primary" onClick={downloadPdf}>Descargar ticket de pago</Button>
                                </div>*/}
                                </div>
                        }
                    </div>
                </div>
            </React.Fragment>

        )
    }
}
