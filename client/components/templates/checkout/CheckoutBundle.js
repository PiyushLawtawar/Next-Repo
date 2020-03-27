import { H4, H5 } from '../../atoms/HeadLines/Headlines';
import Label from '../../atoms/Label/Label';
import Link from '../../atoms/Link/Link';
import Span from '../../atoms/Span/Span';
import HrTag from '../../atoms/HrTag/HrTag';
import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Tagimage/Image';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Icons from '../../atoms/Icons/Icons';
import MaterialInputCheckBox from '../../molecules/MaterialInputCheckBox/MaterialInputCheckBox';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { Anchorimage, ParagraphAnchor, AnchorLabelIcon, ParagraphSpan, HeadlineSpan, LabelSpanSpan, LabelSup, LabelSpan, AnchorSpanIcon, ParagraphIconSpan, AnchorIconSpanNew, LabelAnchor, ParagraphSpanX4, ParagraphSpanX3 } from '../../molecules/MixinMolecules/MixinMolecules';
import { InputText, InputHelperAssistant } from '../../molecules/MaterialInputText/MaterialInputText';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import Alerts from '../../molecules/Alert/Alerts';
import Flags from '../../molecules/Flag/Flags';
import {  getAssetsPath } from '../../../helpers/utilities/utility';

//include ../../configurations
//include ../../commons/head.pug


export default (props) => {

  const mBox = { "labelText": "Mujer", "labelClass": "m-pdp__productDigital", "labelPosition": "left", "nameInput": "sexo", "helperText": 'helper text', "helperTextId": 'helper-text-id', "required": 'false', "checked": 'false', "disabled": 'false' }
  let confirmation = {
    aHref: "#",
    aClass: "a-box__btnConfirm",
    iconClass: "icon-download pr-2",
    spanText: "Descargar confirmación"
  }

  let Alert = {
    type: '-success -alertCheckout',
    text: 'Tu pedido estará sujeto a cobro durante las próximas horas, te informaremos del avance',
    className: 'a-alert__text',
    iconType: 'a-alert__icon icon-done'
  }
  let warnings = {
    type: 'm-alert__container mdc-snackbar -alert -alertCheckout mdc-snackbar--open -static',
    text: 'Lo sentimos, tu compra no se pudo procesar correctamente, si requieres una aclaración favor de comunicarte con nosotros',
    className: 'a-alert__text',
    iconType: 'a-alert__icon icon-error'
  }
  let teléfono = {
    pText: 'Ventas por teléfono:',
    pClass: 'a-checkout__phoneText m-0',
    bType: 'anchor',
    bText: '5261 9999',
    bClass: "a-checkout__phoneID",
    href: "tel:+5252619999"
  }

  let warning = {
    type: '-warning -alertCheckout mdc-snackbar--open -static -noClose',
    text: 'Lo sentimos, tu compra no se pudo procesar correctamente, si requieres una aclaración favor de comunicarte con nosotros.',
    pClass: 'a-alert__text',
    iconType: 'a-alert__icon icon-warning'
  }
  let  AssetsPath = '../../..';
    if (typeof window !== 'undefined') {
      const path = getAssetsPath(window,undefined); 
      AssetsPath = (path && path !='' && path.length > 9)?path:'../../..';
    }

  return (
    <React.Fragment>
      <Alerts options={Alert} />
      <main>
        <div className="container-fluid -white">
          <div className="container p-0">
            <div className="row align-items-center no-gutters justify-content-lg-between justify-content-center pt-lg-4 pb-lg-4 pt-3 pb-3 -checkoutHeaderConfirmation">
              <div className="col-lg-auto col-6 text-center">
                <Link href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="174" height="41" viewBox="0 0 174 41" id="" className="a-header__logo -primaryLogo d-none d-lg-block replaced-svg">
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
                </Link>

                <Link href="#">
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
                </Link>

              </div>


              <div className="col-lg-auto col-6 d-none d-lg-flex">
                <div className="row">
                  <div className="col-auto">
                    <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph="Ventas por teléfono:" classAnchor="a-checkout__phoneID" href="tel:+5252619999" textAnchor="tel:+5252619999" />
                    <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph="Interior de la República:" classAnchor="a-checkout__phoneID" href="tel:018007135555" textAnchor="01 800 713 5555" />
                  </div>
                  <div className="col-auto">
                    <AnchorLabelIcon typeaheadclass="m-checkoutHelp" href="#" labelclass="a-checkoutHelp__text -primaryColor" text="Ayuda" iconclass="icon-help a-checkoutHelp__icon -primaryColor" />
                  </div>
                </div>
              </div>
            </div>

            <HrTag hrClass="d-none d-lg-block" />
            <div className="row align-items-end no-gutters justify-content-center pt-5">
              <div className="col-lg-auto col-6 pr-4">
                <Image className="a-checkout__svgBag" src={AssetsPath + "/static/images/atomo-icono-liverpool-bolsa-vector-desktop.svg"} alt="Bag" />
              </div>
              <div className="col-lg-5 col-6">
                <H5 headLineClass="a-checkout__nameHeading m-0 pb-2" headLineText="Ana Gutiérrez" />
                <Paragraph className="a-checkout__headingFace m-0 pb-2">Gracias por tu compra</Paragraph>
                <Paragraph className="a-checkout__headingFace m-0 pb-2">El equipo  de Liverpool agradece tu preferencia</Paragraph>
              </div>
            </div>
            <div className="row align-items-center justify-content-center pt-3 pb-5">
              <div className="col-12 text-lg-center text-left">
                <ParagraphSpanX4
                  classParagraph="m-resumePurchase m-0"
                  span1Class="a-checkout__resumePurchase"
                  span1Text="Recibirás en breve un mail con el resumen de tu compra a:"
                  span2Class="a-checkout__email"
                  span2Text="ana-ramira@gmail.com"
                  span3Class="a-checkout__resumePurchase"
                  span3Text="revisa tu bandeja de entrada y spam. "
                  span4Class="a-checkout__resumePurchase d-lg-none"
                  span4Text=" Conserva tu número de pedido para dar seguimiento a tu compra."
                />
              </div>
            </div>

            {/*visible in transfer page*/}
            <div className="row align-items-center justify-content-center pt-3 pb-5">
              <div className="col-lg-3 col-12">
                <Button className="a-btn a-btn--primary">Descargar ticket de pago</Button>
              </div>
              <div className="col-lg-auto col-12 text-center pt-3 pb-3">
                <Paragraph className="m-0 a-checkout__important">¡IMPORTANTE!</Paragraph>
              </div>
              <div className="col-lg-5 col-12">
                <ParagraphSpanX4
                  classParagraph="m-resumePurchase m-0"
                  span1Class="a-checkout__resumePurchase"
                  span1Text="Recibirás en breve un mail con el resumen de tu compra a: "
                  span2Class="a-checkout__email"
                  span2Text="ana-ramira@gmail.com "
                  span3Class="a-checkout__resumePurchase"
                  span3Text="revisa tu bandeja de entrada y spam. "
                  span4Class="a-checkout__resumePurchase"
                  span4Text=" Conserva tu número de pedido para dar seguimiento a tu compra."
                />
              </div>
            </div>

            {/*end of visible in transfer page*/}
          </div>

          {/*visible in payment fail page*/}
          <div className="container p-0">
            <div className="row align-items-center no-gutters justify-content-lg-between justify-content-center pt-lg-4 pb-lg-4 pt-3 pb-3 -checkoutHeaderConfirmation">
              <div className="col-lg-auto col-6 text-center">
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="174" height="41" viewBox="0 0 174 41" id="" className="a-header__logo d-none -primaryLogo d-lg-block replaced-svg">
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
                </svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="174" height="41" viewBox="0 0 174 41" id="" className="a-header__logo d-block d-lg-none replaced-svg">
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
                </a>
              </div>
              <div className="col-lg-auto col-6 d-none d-lg-flex">
                <div className="row">
                  <div className="col-auto">
                    <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph="Ventas por teléfono:" classAnchor="a-checkout__phoneID" href="tel:+5252619999" textAnchor="tel:+5252619999" />
                    <ParagraphAnchor classParagraph="a-checkout__phoneText m-0" textParagraph="Interior de la República:" classAnchor="a-checkout__phoneID" href="tel:018007135555" textAnchor="01 800 713 5555" />
                  </div>
                  <div className="col-auto">
                    <AnchorLabelIcon typeaheadclass="m-checkoutHelp" href="#" labelclass="a-checkoutHelp__text -primaryColor" text="Ayuda" iconclass="icon-help a-checkoutHelp__icon -primaryColor" />
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
                <Link className="a-box__invoice" href="#">Regresar a tienda</Link>
              </div>
            </div>
          </div>
        </div>
        {/*end of visible in payment fail page*/}
        <div className="container">
          <div className="row">
            <div className="col-12">
              <HeadlineSpan headLineClass="a-checkout__purchaseDetail -headingMargin" textHeadline="Detalles de tu compra: " spanClassname="-bold" text="28 Septiembre de 2018" />
            </div>
          </div>
          <div className="row align-items-center justify-content-between mb-3">
            <div className="col-6">
              <Label className="a-checkout__titleResume">Tus productos</Label>
            </div>
            <div className="col-3 text-right d-none d-lg-block">
              <Link className="a-checkout__btnOptions icon-download pr-3" href="#" onclick="sendAlertSuccess()"></Link>
              <Link className="a-checkout__btnOptions icon-print" href="#"></Link>
            </div>
          </div>



          {/*Alert Visible in card fail page*/}

          <Alerts options={warning} />

          {/*end of Alert Visible in card fail page*/}


          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-pendingDelivery" span2Text="La fecha estimada de entrega no aplica para paquetes" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-1">Bundle 3 WT19VSB</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity">Contenido:</Label>
                      <Label className="a-box__resume -resumeTitle mb-lg-1">Producto 1 WT19VSB</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Código de producto: 8975635368</Label>
                      <Label className="a-box__resume -resumeTitle mb-lg-1">Producto 2 WT19VSB</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Código de producto: 8975635368</Label>
                      <Label className="a-box__resume -resumeTitle mb-lg-1">Producto 3 WT19VSB</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Código de producto: 8975635368</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="No aplica Promoción" span1Class="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$0" supText="00" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*Product List Visible in card fail page*/}


          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$0" supText="00" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*end of Product List Visible in card fail page*/}

          {/* Product List Visible in card pending delivery page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="3 de octubre - 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-pendingDelivery" span2Text="La fecha estimada de entrega no aplica para paquetes" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*End of Product List Visible in card pending delivery page*/}

          {/*product list visible in checkout cards*/}
          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto">
                      <Label className="a-box__resume d-block">Número de Referencia: 0391001181435191620825896</Label>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-4"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-4">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__normalPrice" labelText="$249" supText="00" />
                    </div>
                    <div className="col-8 col-lg-2 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-2">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto">
                      <Label className="a-box__resume d-block">Número de Referencia: 0391001181435191620825896</Label>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-4"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-4">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__normalPrice" labelText="$249" supText="00" />
                    </div>
                    <div className="col-8 col-lg-2 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-2">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*end of product list visible in checkout cards*/}

          {/*product list visible in checkout cie-item 1*/}


          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="08 de enero-10 de enero | El tiempo estimado de entrega sólo aplica a pagos inmediatos" />
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="039" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="08 de enero-10 de enero | El tiempo estimado de entrega sólo aplica a pagos inmediatos" />
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="039" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*end of product list visible in checkout cie-item1*/}

          {/* Product List Visible in click and collect page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="3 de octubre - 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-pendingDelivery" span2Text="Pronto tendremos la fecha de entrega de este producto" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*End of Product List Visible in click and collect page*/}


          {/*Product list visible in consolidation page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="3 de octubre - 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                  <hr />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>



                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="3 de octubre - 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*end of Product list visible in consolidation page*/}

          {/*Product list visible in checkout-4 create account page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="3 de octubre - 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*end of Product list visible in checkout-4 create account page*/}

          {/*product list visible for downloadable page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">Referencia Digital: 039170726</Label>
                      <Label className="a-box__resume -digital d-block">Descarga Digital</Label>

                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>
                      <Label className="a-box__downloadDigital pt-2">Código de descarga:</Label>
                      <LabelAnchor labelClass="a-box__downloadDigital pb-2" labelText="9201049324-12334-1213-1214" anchorClass="a-box__moreInfo pl-lg-2 pl-0" anchorLink="#" anchorText="Más información" />
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*end of product list visible for downloadable page*/}

          {/*product list visible for checkout fail page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">Referencia Digital: 039170726</Label>
                      <Label className="a-box__resume -digital d-block">Descarga Digital</Label>

                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>
                      <Label className="a-box__downloadDigital pt-2">Código de descarga:</Label>
                      <LabelAnchor labelClass="a-box__downloadDigital pb-2" labelText="9201049324-12334-1213-1214" anchorClass="a-box__moreInfo pl-lg-2 pl-0" anchorLink="#" anchorText="Más información" />
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega:  " span2Class="-digital" span2Text="3 de octubre- 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>
                      <Label className="a-box__downloadDigital pt-2">Código de descarga:</Label>
                      <LabelAnchor labelClass="a-box__downloadDigital pb-2" labelText="9201049324-12334-1213-1214" anchorClass="a-box__moreInfo pl-lg-2 pl-0" anchorLink="#" anchorText="Más información" />
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*end of product list visible for checkout fail page*/}

          {/*product list visible for checkout gift page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega:  " span2Class="-digital" span2Text="3 de octubre- 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>

                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega:  " span2Class="-digital" span2Text="3 de octubre- 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2 d-block">Vaso decorado con tapa térmica</Label>

                      <Flags flagitemclass="m-flag-item -defaultFlag" flagtext="Regalo" />
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>

                    </div>
                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">

                      <LabelSup labelClass="a-box__normalPrice" labelText="$0" supText="01" />
                    </div>
                    <div className="col-8 col-lg-3 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>


                    <div className="col-2">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$0.01" supText="" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*end of product list visible for checkout gift page*/}
          {/*product list visible in checkout gift registry*/}
          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <ParagraphSpanX3
                        classParagraph=""
                        span1Class="a-box__resume"
                        span1Text="No. de evento: 039170726"
                        span2Class="a-box__resume pl-3 pr-3 d-lg-inline-block d-none"
                        span2Text="|"
                        span3Class="a-box__resume d-block d-lg-inline-block"
                        span3Text="Nombre del festejado: Ana Gutiérrez"
                      />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>

                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between">
                    <div className="col-12">
                      <Label className="a-box__resume d-block">Mensaje de Mesa de Regalos</Label>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12">
                      <Label className="a-box__resume d-block">Muchas Felicidades les deseo lo mejor en esta fiesta tan especial.</Label>
                    </div>
                  </div>

                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*end of product list visible in checkout gift registry*/}

          {/*product list visible in checkout Partial page*/}

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <Label className="a-box__resume d-block">No. de pedido: 039170726</Label>
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega:  " span2Class="-digital" span2Text="3 de octubre- 6 de octubre" />
                    </div>
                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>

                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Terminal: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="31" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="39" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-center justify-content-between mb-3 mt-5">
              <div className="col-lg-6 col-12">
                <Label className="a-checkout__titleResume -failPayment">Artículos no cobrados</Label>
              </div>
              <div className="col-lg-3 col-12 pt-lg-0 pt-3">
                <Button className="a-btn a-btn--tertiary">Guardar para más tarde</Button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Alerts options={warnings} />
              </div>
            </div>

          </div>

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>

                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </div>


          {/*end of product list visible in checkout Partial page*/}


          {/*product list visible in checkout payment fail page*/}
          <div className="m-productList">
            <div className="row align-items-center justify-content-between mb-3 mt-5">
              <div className="col-lg-6 col-12">
                <Label className="a-checkout__titleResume -failPayment">Artículos no cobrados</Label>
              </div>
              <div className="col-lg-3 col-12 pt-lg-0 pt-3">
                <Button className="a-btn a-btn--tertiary">Guardar para más tarde</Button>
              </div>
            </div>
          </div>

          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-3">Tipo de compra: Digital</Label>

                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </div>
          {/*end of product list visible in checkout payment fail page*/}

          {/*Product list Visible in tiempo-aire page*/}
          <div className="row">
            <div className="col-12">
              <HeadlineSpan headLineClass="a-checkout__purchaseDetail -headingMargin" textHeadline="Detalles de tu compra: " spanClassname="-bold" text="28 Septiembre de 2018" />
            </div>
          </div>
          <div className="row align-items-center justify-content-between mb-3">
            <div className="col-6">
              <Label className="a-checkout__titleResume">Tus recargas</Label>
            </div>
            <div className="col-3 text-right d-none d-lg-block">
              <Link className="a-checkout__btnOptions icon-download pr-3" href="#" onclick="sendAlertSuccess()"></Link>
              <Link className="a-checkout__btnOptions icon-print" href="#"></Link>
            </div>
          </div>


          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-end">

                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-4"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">

                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-4">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Recarga Telcel 200 pesos</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Teléfono: 5513459263</Label>
                    </div>
                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__normalPrice" labelText="$249" supText="00" />
                    </div>
                    <div className="col-8 col-lg-2 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-2">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>


                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>





            <div className="row align-items-center justify-content-end mb-4 mt-4">
              <div className="col-3 text-right d-none d-lg-block">
                <Link className="a-checkout__btnOptions icon-download pr-3" href="#" onclick="sendAlertSuccess()"></Link>
                <Link className="a-checkout__btnOptions icon-print" href="#"></Link>
              </div>
            </div>



            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-end">

                    <div className="col-12 col-lg-auto">
                      <HrTag hrClass="d-lg-none d-block" />
                      <div className="row align-items-cente">
                        <div className="col-6 col-lg-auto">
                          <Label className="a-box__productTitle d-inline-block">Código de facturación: NJKNSDAAUYE674847</Label>
                        </div>
                        <div className="col-6 col-lg-auto text-right">
                          <Link className="a-box__invoice pr-3" href="#">Factura ahora</Link>
                          <Icons className="icon-arrow_right -small" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-4"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-2"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">

                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-4">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Recarga Telcel 200 pesos</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Teléfono: 5513459263</Label>
                    </div>
                    <div className="col-4 col-lg-2 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__normalPrice" labelText="$249" supText="00" />
                    </div>
                    <div className="col-8 col-lg-2 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-2">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>


                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="No. de Boleta: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="0392064039170" />
                    </div>
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Autorización Bancaría: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/*end of Product list Visible in tiempo-aire page*/}

          {/*product list visible in checkout transfer*/}


          <div className="m-productList">
            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="08 de enero-10 de enero | El tiempo estimado de entrega sólo aplica a pagos inmediatos" />
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="039" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <div className="m-box -noBottomBorders">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-12 col-lg-auto">
                      <LabelSpanSpan labelClass="a-box__resume d-block" span1Text="Fecha estimada de entrega: " span2Class="-digital" span2Text="08 de enero-10 de enero | El tiempo estimado de entrega sólo aplica a pagos inmediatos" />
                    </div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />

                  <div className="row align-items-center justify-content-between d-none d-lg-flex">
                    <div className="col-2"><Label className="a-box__detailTitle">Producto</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Nombre</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Precio</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Cantidad</Label></div>
                    <div className="col-3"><Label className="a-box__detailTitle">Promoción</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Descuento</Label></div>
                    <div className="col-1"><Label className="a-box__detailTitle">Total</Label></div>
                  </div>
                  <HrTag hrClass="a-productList__separator" />
                  <div className="row align-items-start">
                    <div className="col-4 col-lg-2">
                      <Image className="a-box__image" src="https://ss550.liverpool.com.mx/lg/1078924438.jpg" alt="Product" />
                    </div>
                    <div className="col-8 col-lg-3">
                      <Label className="a-box__resume -resumeTitle mb-lg-2">Lego Marvel Superhéroes 2</Label>
                      <Label className="a-box__productQuantity">Código de producto: 8975635368</Label>
                      <Label className="a-box__productQuantity mb-lg-2">Tipo de compra: Digital</Label>
                    </div>
                    <div className="col-4 col-lg-1 offset-4 offset-lg-0">
                      <LabelSup labelClass="a-box__linePrice" labelText="$499" supText="00" />
                      <LabelSup labelClass="a-box__normalPrice" labelText="$299" supText="00" />
                    </div>
                    <div className="col-8 col-lg-1 offset-4 offset-lg-0">
                      <LabelSpanSpan labelClass="a-box__quantity" span1Text="Cantidad:  " span1Class="d-inline-block d-lg-none" span2Text="1" />
                    </div>
                    <div className="col-3">
                      <LabelSpan labelClass="a-box__medium d-none d-lg-block" spanText="de descuento - Prepuesto Liverpool" labelText="50% " spanClass="a-box__promotionText" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__normalPrice d-none d-lg-block" labelText="$299" supText="50" />
                    </div>
                    <div className="col-1">
                      <LabelSup labelClass="a-box__totalPrice d-none d-lg-block" labelText="$249" supText="50" />
                    </div>
                  </div>
                </div>
                <div className="m-box mt-lg-2 mt-0 -noTopBorders">
                  <div className="row align-items-center justify-content-between d-flex d-lg-none">
                    <HrTag hrClass="w-100 mb-3" />
                    <div className="col-12">
                      <AnchorSpanIcon Linkclass="a-checkout__moreInfo d-block" href="#" spanText="Mas información" iconClass="icon-arrow_down" />
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-between d-lg-flex d-none moreInfoWrap pt-3 pt-lg-0">
                    <div className="col-lg-auto col-6">
                      <LabelSpan labelClass="a-box__resumeDetail" labelText="Tienda: " spanClass="a-box__resumeDetail -bold d-block d-lg-inline-block" spanText="039" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row align-items-center justify-content-end mt-3">
              <div className="col-xl-2 col-lg-3 col-12">
                <Button className="a-btn a-btn--primary">Descargar ticket de pago </Button>
              </div>
            </div>

          </div>



          {/*product list visible in checkout transfer*/}





          <div className="row align-items-start mt-3">
            <div className="col-lg-6 col-12">
              <div className="row align-items-center mt-4">
                <div className="col-lg-6 col-12">
                  <Paragraph className="a-checkout__titleSection m-0 pb-3">Dirección de entrega:</Paragraph>
                </div>
              </div>
              <div className="m-box mb-3">
                <Paragraph className="a-box__cardTitle">Entrega a domicilio</Paragraph>
                <Paragraph className="a-box__cardNumber mb-1">Casa Ana</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Paragraph>
              </div>

              {/*visible for click and collect page only*/}

              <div className="m-box mb-3">
                <Paragraph className="a-box__cardTitle">Recoger en tienda</Paragraph>
                <Paragraph className="a-box__cardNumber mb-1">0031 LIV Liverpool Galerias Monterrey</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">Av José Eleuterio Glez. 30 Int, Vista Hermosa, 64620, Monterrey
                  </Paragraph>
              </div>
              {/*end of visible for click and collect page only-store pickup instead of home delivery*/}
              {/*visible for drive thru page only*/}
              <div className="m-box mb-3">
                <LabelSpan labelClass="a-box__cardTitle" labelText="Recoge en tienda: " spanClass="-driveThru d-lg-inline-block d-block" spanText="Click and collect Drive Thru" />
                <Paragraph className="a-box__cardNumber mb-1">Liverpool Galerías Insurgentes</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">Manuel López Cotilla 812, Del Valle Centro, 03100 Ciudad de México, México</Paragraph>
              </div>
              {/*end of visible for drive thru page*/}

              <div className="m-box d-none d-lg-block">
                <Paragraph className="a-box__legal m-0">En caso de que haya adquirido más de un artículo, es posible que le sean entregados por separado, agradecemos su comprensión.</Paragraph>
                <Paragraph className="a-box__legal m-0">En Liverpool, nos preocupamos por su seguridad, por lo que esta compra estará sujeta a un proceso de validación para la entrega de la mercancía.</Paragraph>
                <Paragraph className="a-box__legal m-0">La página aplica para garantía y devoluciones.</Paragraph>
                <Paragraph className="a-box__legal m-0">El comprobante de pago se envió a la dirección: baliverpool01@gmail.com</Paragraph>
                <Paragraph className="a-box__legal m-0">Te recordamos que este sitio es seguro.</Paragraph>
                <Paragraph className="a-box__legal m-0">Centro de Atención Telefónica: 52629999 y en el interior de la República: 01 800 713 55 55</Paragraph>
                <Paragraph className="a-box__legal m-0">Tienda 039</Paragraph>
                <Paragraph className="a-box__legal m-0">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3.</Paragraph>
                <Paragraph className="a-box__legal m-0">Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos.</Paragraph>
                <Paragraph className="a-box__legal m-0">C.P. 05348, Ciudad de México.</Paragraph>
                <Paragraph className="a-box__legal m-0">RFC: DLI931201MI9. Régimen General de Ley Personas Morales.</Paragraph>
              </div>
              {/*visible in checkout downlodable*/}

              <Paragraph className="a-checkout__reminder m-0 p-lg-3 pt-3 pb-3">
                *Recuerda que en compras digitales no contamos con cambios ni devoluciones,
                 al dar click en siguiente estás aceptando nuestros términos y condiciones así como nuestro aviso de privacidad
            </Paragraph>
              {/*end of visible in checkout downlodable*/}

            </div>
            <div className="col-lg-6 col-12">
              <div className="row align-items-center mt-4">
                <div className="col-lg-6 col-12">
                  <Paragraph className="a-checkout__titleSection m-0 pb-3">Forma de pago:</Paragraph>
                </div>
              </div>
              <div className="m-box mb-3">
                <Paragraph className="a-box__cardTitle">Liverpool Departamental</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">*1980</Paragraph>
              </div>

              {/*visible in transfer page*/}

              <div className="m-box mb-3">
                <Paragraph className="a-box__cardTitle">Transferencia</Paragraph>
                <ParagraphSpan classParagraph="a-box__cardNumber mb-1" textParagraph="Estatus: " spanClassname="-pendingDelivery" spanText="Pago Pendiente" />
                <Paragraph className="a-box__cardNumber mb-1">Vence: 13 de Dic 2019 / 23:59:59</Paragraph>
                <Paragraph className="a-box__cardNumber mb-1">Referencia: 1234-1234-1234-1234-1234</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">CLABE: 00000000000000001</Paragraph>
                <Paragraph className="a-box__cardNumber m-0">Banco Destino: BBVA Bancomer</Paragraph>
              </div>

              {/*end of visible in transfer page*/}
              {/*visible in payment fail page-paypal*/}
              <div className="m-box mb-3">
                <Image className="a-box__image w-auto pt-3 pb-3" src={AssetsPath + "static/images/paypal-color.svg"} alt="Paypal" />
              </div>
              {/*end of visible in payment fail page-paypal*/}
              <div className="m-box mb-4">
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText="Resumen de mi bolsa" />
                  </div>
                </div>
                <HrTag hrClass="mb-3" />
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                    <Label className="a-box__resume">Subtotal (1 producto):</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume">$ 599.00</Label>
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                    <Label className="a-box__resume">Descuento:</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume">$ 100.00</Label>
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between mb-2">
                  <div className="col-auto">
                    <Label className="a-box__resume">Costo de envío:</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume">$ 0.00</Label>
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between mb-3">
                  <div className="col-auto">
                    <Label className="a-box__resume -totalLabel">Total:</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume -totalPrice">$ 499.00</Label>
                  </div>
                </div>
              </div>
              {/*summary visible in tiempo-aire page*/}

              <div className="m-box mb-4">
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-12">
                    <H5 headLineClass="a-box__heading" headLineText="Resumen de mi bolsa" />
                  </div>
                </div>
                <HrTag hrClass="mb-3" />
                <div className="row no-gutters align-items-center justify-content-between">
                  <div className="col-auto">
                    <Label className="a-box__resume">Subtotal (1 recargas):</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume">$ 599.00</Label>
                  </div>
                </div>
                <div className="row no-gutters align-items-center justify-content-between mb-3">
                  <div className="col-auto">
                    <Label className="a-box__resume -totalLabel">Total:</Label>
                  </div>
                  <div className="col-auto">
                    <Label className="a-box__resume -totalPrice">$ 499.00</Label>
                  </div>
                </div>
              </div>

              {/*summary visible in tiempo-aire page*/}
              {/*visible in  checkout-create account */}
              <div className="m-box mb-4">
                <form>
                  <div className="col-12 text-center pb-3">
                    <H5 headLineClass="a-box__heading" headLineText="¡Compra más rápido, regístrate!" />
                  </div>
                  <div className="col-12 text-center pb-3">
                    <Paragraph className="a-box__cardNumber m-0">Te interesa registrarte para tus siguientes compras, hazlo ahora mismo, utiliza los datos ya ingresados.</Paragraph>
                  </div>
                  <div className="row align-items-start justify-content-between">
                    <div className="col-lg-6 col-12">

                      <InputHelperAssistant
                        inputId='nombre'
                        nameInput='nombre'
                        labelText='Nombre'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>

                      <InputHelperAssistant
                        inputId='correo'
                        nameInput='correo'
                        labelText='Correo electónico'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>
                      <InputHelperAssistant
                        inputId='password'
                        nameInput='password'
                        labelText='Contraseña'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>
                    </div>




                    <div className="col-lg-6 col-12">

                      <InputHelperAssistant
                        inputId='apellido'
                        nameInput='apellido'
                        labelText='Apellido'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>



                      <InputHelperAssistant
                        inputId='birth'
                        nameInput='birth'
                        labelText='Fecha de nacimiento'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>


                      <InputHelperAssistant
                        inputId='repassword'
                        nameInput='repassword'
                        labelText='Repetir Contraseña'
                        labelPosition='left'
                        text='Ej. Casa, Oficina...'
                        helperTextId='helper-nombreCorto'
                        
                        
                        type="text"
                        required
                      />
                      <div className="m-textField__helperText mdc-text-field-helper-line pb-3">
                        <Paragraph className="a-textField__helperText mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" id="helper-text-id">
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-start">
                    <div className="col-lg-6 col-12">
                      <div className="row align-items-center justify-content-center justify-content-lg-start">
                        <div className="col-auto col-lg-12 col-xl-auto">
                          <Paragraph className="a-checkout__headingTitle m-0">Sexo:
                            </Paragraph>
                        </div>
                        <div className="col-auto">
                          <MaterialInputRadio options={mBox} />
                        </div>
                        <div className="col-auto">
                          <MaterialInputRadio options={mBox} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 text-lg-left text-xl-right">
                      <MaterialInputCheckBox text="Mantener mi sesión activa" />
                      <Paragraph className="a-checkout__session">
                        <Span className="-underline ml-2 mr-1">Detalles</Span>
                        <Icons className="a-select__help icon-help" data-toggle="popover" title="" data-content="Prueba Texto" data-placement="top" data-trigger="focus" data-original-title="" />
                      </Paragraph>
                    </div>
                  </div>
                  <div className="row align-items-center justify-content-end">
                    <div className="col-lg-5 col-12 mt-3">
                      <Button className="a-btn a-btn--primary">Enviar</Button>
                    </div>
                  </div>
                </form>
              </div>
              {/*end of visible in  checkout-create account */}

            </div>
          </div>

          {/*Visible in checkout cie page-item 2*/}

          <div className="row align-items-start mt-3">
            <div className="col-12">
              <div className="m-box mb-3">
                <H4 headLineClass="a-box__heading" headLineText="Proceso para completar tu pedido" />
                <HrTag />
                <div className="row no-gutters align-items-center justify-content-between mt-3 mb-3">
                  <div className="col-auto">
                    <Paragraph className="a-box__cardTitle m-0">Convenio CIE: 0123456</Paragraph>
                  </div>
                  <div className="col-auto">
                    <Paragraph className="a-box__cardTitle m-0">Número de referencia: 123456789123</Paragraph>
                  </div>
                </div>
                <HrTag />
                <Paragraph className="a-box__resume m-0">Recuerda que con tu hoja de pedido podrás realizar tu pago en cualquier de los siguientes medios</Paragraph>
                <div className="row no-gutters align-items-start justify-content-center mt-3 mb-3">
                  <Image src={AssetsPath + "static/images/bancomer-logo.png"} alt="Logo" />
                  <Image src={AssetsPath + "static/images/7-eleven-logo-210-x-136.png"} alt="Logo" />
                  <Image src={AssetsPath + "static/images/spei-logo.png"} alt="Logo" />
                </div>
                <div className="row no-gutters align-items-start justify-content-center mt-3 mb-3" >
                  <Image src={AssetsPath + "static/images/download.png"} alt="Logo" />
                </div>
                <div className="row no-gutters align-items-start justify-content-between mt-3 mb-3">
                  <div className="col-lg-6 col-12 pr-3">
                    <Paragraph className="a-box__legal m-0 pb-3">• Cualquier sucursal o cajero automático BBVA Bancomer o desde su portal https://www.bancomer.com/, para lo cual deberás presentar impresa tu Hoja de Pedido o indicar:
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Número de la Referencia
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Importe exacto a pagar
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3 pb-3">• Convenio CIE: 120789
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• Realizar una transferencia electrónica desde cualquier otro banco a Bancomer a través de SPEI, indicando los siguientes datos:
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Número de la Referencia
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Importe exacto a pagar
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Convenio CIE: 120789
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3 pb-3">• CLABE: 12983719283198273
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• En cualquier tienda 7-Eleven de la República Mexicana, presentando tu hoja de pedido impresa o indicando el Número de la Referencia y el importe exacto a pagar:
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Tu pago podrás realizarlo únicamente en efectivo
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• El importe máximo de tu Referencia no podrá ser mayor a $10,000.00 pesos
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3 pb-3">• En estos comercios se te cobrará una comisión adicional de $9,000.00 pesos
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• Deberás de realizar tu pago dentro del tiempo establecido en la fecha de vencimiento que marca tu referencia; de no realizarlo dentro de este plazo tu pedido será cancelado automáticamente. Podrás realizar tu pago conforme a los horarios establecidos en la institución financiera. Liverpool recibirá de la institución financiera el registro de tu pago los días martes a sábado.
                      </Paragraph>
                  </div>
                  <div className="col-lg-6 col-12 pl-3">
                    <Paragraph className="a-box__legal m-0 pb-3">• La presente hoja de pedido no podrá ser utilizada después de la fecha de vencimiento indicada.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• Al imprimir esta hoja asegúrate de imprimirla al 100% de su tamaño (no reducción, ni ampliación), de preferencia con una impresora láser, y procura no doblarla ya que puede ocasionar problemas de lectura del código de barras por los scaners. Te recomendamos verificar que los datos proporcionados sean correctos ya que servirán para la entrega de tu producto.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• Te recordamos que es necesario conservar el comprobante de pago original, el cual deberá coincidir con el monto total de tu compra, en caso contrario, DISTRIBUIDORA LIVERPOOL, S.A. DE C.V. se reserva el derecho de realizar la entrega hasta en tanto no le sea acreditado el pago correspondiente.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• Se deberá de pagar el importe exacto de tu pedido.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• La mercancía solicitada queda sujeta a la disponibilidad del inventario al momento de recibir tu pago.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pb-3">• En caso de requerir un reembolso:
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3">• Llama al Centro de Atención telefónica al 5262-9999 o del Interior de la República sin costo al 01 800 713 5555, en donde un asesor te apoyará para realizar el cambio y/o devolución.
                      </Paragraph>
                    <Paragraph className="a-box__legal m-0 pl-3 pb-3">• Ten a la mano tu confirmación de compra (email que recibiste cuando realizaste tu compra).
                      </Paragraph>
                  </div>
                </div>
              </div>

              <div className="row align-items-center d-flex d-lg-none">
                <div className="col-lg-4 col-12 text-center">
                  <Paragraph className="m-0"><i className="icon-lock pr-2"></i><span>Todas nuestras transacciones son seguras </span>
                  </Paragraph>
                </div>
                <div className="col-12 text-justify">
                  <Paragraph className="a-box__legal m-0 pt-3">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3. Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos. C.P. 05348, Ciudad de México.RFC: DLI931201MI9. Régimen General de Ley Personas Morales., Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
                  <Paragraph className="a-box__legal m-0 pt-3">Lugar de expedición: Liverpool Santa Fe, Av. Vasco de Quiroga, 3800 Col. Santa Fe Cuajimalpa, Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/*end of Visible in checkout cie page-item 2*/}


          <div className="m-box mb-4 -boxUnshatter p-lg-0">
            <div className="row align-items-center justify-content-start flex-column-reverse flex-lg-row">
              <div className="col-lg-5 col-12 text-left d-none d-lg-block">
                <ParagraphIconSpan paragraphClass="m-0" iconClass="icon-lock pr-2" spanText="Todas nuestras transacciones son seguras" />
              </div>
              <div className="col-lg-4 col-12 text-center d-lg-none d-block">
                <AnchorIconSpanNew options={confirmation} />
              </div>
              <HrTag hrClass="w-100 mt-3 mb-3 d-lg-none d-block" />
              <div className="col-xl-2 col-lg-3 offset-lg-1 offset-xl-3">
                <Button className="a-btn a-btn--tertiary" onclick="sendAlertSuccess()">Ir a mis pedidos</Button>
              </div>
              <div className="col-xl-2 col-lg-3 pb-3 pb-lg-0">
                <Button className="a-btn a-btn--primary" onclick="sendAlertSuccess()">Continuar comprando</Button>
              </div>

            </div>
          </div>

          <div className="row align-items-center d-flex d-lg-none">
            <div className="col-lg-4 col-12 text-center">
              <ParagraphIconSpan paragraphClass="m-0" iconClass="icon-lock pr-2" spanText="Todas nuestras transacciones son seguras" />
            </div>
            <div className="col-12 text-justify">
              <Paragraph className="a-box__legal m-0 pt-3">Distribuidora Liverpool S.A. de C.V. Prolongación Vasco de Quiroga 4800, Torre 2, Piso 3. Colonia Santa Fe Cuajimalpa. Delegación Cuajimalpa de Morelos. C.P. 05348, Ciudad de México.RFC: DLI931201MI9. Régimen General de Ley Personas Morales., Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
              <Paragraph className="a-box__legal m-0 pt-3">Lugar de expedición: Liverpool Santa Fe, Av. Vasco de Quiroga, 3800 Col. Santa Fe Cuajimalpa, Cuajimalpa de Morelos, CDMX, C.P.05348
                    </Paragraph>
            </div>
          </div>

        </div>
      </main>
    </React.Fragment>
  );
}