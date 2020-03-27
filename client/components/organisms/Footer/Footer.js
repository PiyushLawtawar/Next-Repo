import React, { Component } from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph'
import {ParagraphAnchor} from '../../molecules/MixinMolecules/MixinMolecules'

class Footer extends Component {
  componentDidMount() {
    this.resetFooterPosition();
    window.addEventListener('resize', this.resetFooterPosition);
  }

  resetFooterPosition () {
    var footer = document.querySelector(`footer`);
      var bodyElem = document.querySelector(`#__next`);
      var footerDetails = footer.getBoundingClientRect();
      var bodydetails = bodyElem.getBoundingClientRect();
      var viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
      var bodyDiff = 0;
      if (viewportHeight > bodydetails.height) {
        bodyDiff = (viewportHeight - bodydetails.height);
        footer.style.top = viewportHeight - footerDetails.height + 'px';
        bodyElem.style.height = parseInt(window.getComputedStyle(bodyElem).height.replace(/px/g,''), 10) + bodyDiff + 'px'; //bodyElem.style.height + (viewportHeight - footerDetails.height) + 'px';
      } else {
        footer.style.removeProperty('top');
        bodyElem.style.removeProperty('height');
      }
  }
  render() {
    return(
        <footer className="mt-5" style={{"position": "sticky", "width": "100%"}}>
          <div className="container">
            <nav className="row align-items-center justify-content-between pt-4 pb-4">
              <div className="col-12 col-lg-auto text-center">
                    <Paragraph className="a-footer__contact -checkout pb-3 pb-lg-0">Cambios, devoluciones y cancelaciones</Paragraph>
              </div>
              <div className="col-12 col-lg-auto text-center">
                    <Paragraph className="a-footer__contact -checkout pb-3 pb-lg-0">Preguntas frecuentes</Paragraph>
              </div>
              <div className="col-12 col-lg-auto text-center">
                <ParagraphAnchor classParagraph="a-footer__contact -checkout d-lg-inline-block d-block" textParagraph="Ventas por teléfono" classAnchor="a-footer__contact -checkout" href="tel:52569999" textAnchor="5256-9999 "/>
                <ParagraphAnchor classParagraph="a-footer__contact -checkout d-lg-inline-block d-bloc" textParagraph="/ Interior de la República " classAnchor="a-footer__contact -checkout" href="tel:52569999" textAnchor=" 01 800 713 5555"/>
              </div>
            </nav>
          </div>
          <div className="container-fluid m-footer__misc">
            <div className="col-12 col-lg-12 text-center">
                  <Paragraph className="a-footer__misc">Precio en rojo aplica el descuento más alto, las promociones pueden diferir de las publicadas en tienda.</Paragraph>
                  <Paragraph className="a-footer__misc">2018 Liverpool / Todos los derechos reservados D.R. ®</Paragraph>
            </div>
          </div>
        </footer>
    );
  }
}
export default Footer;