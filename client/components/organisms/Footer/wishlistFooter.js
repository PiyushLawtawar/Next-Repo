//import './Footer.styl';
import Paragraph from '../../atoms/Paragraph/Paragraph'
import {ParagraphAnchor} from '../../molecules/MixinMolecules/MixinMolecules'

export default (props) => {
// console.log('..footerData..',props.footerData);  
const footerContent = (props.footerData && props.footerData.footerContent[0]) ? props.footerData.footerContent[0] : {};
const horizontalLink1 = footerContent.horizontalLink1 || [];
        const horizontalLink2 = footerContent.horizontalLink2 || [];
        const horizontalLink3 = footerContent.horizontalLink3 || [];
        const bottomHTML = footerContent.bottomHTML || {}  ;
return(
    <footer className="mt-5">
      <div className="container">
        <nav className="row align-items-center justify-content-between pt-4 pb-4">
          <div className="col-12 col-lg-auto text-center">
                <Paragraph className="a-footer__contact -checkout pb-3 pb-lg-0">{horizontalLink1[0].text}</Paragraph>
          </div>
          <div className="col-12 col-lg-auto text-center">
                <Paragraph className="a-footer__contact -checkout pb-3 pb-lg-0">{horizontalLink2[0].text}</Paragraph>
          </div>
          <div className="col-12 col-lg-auto text-center">
            <ParagraphAnchor classParagraph="a-footer__contact -checkout d-lg-inline-block d-block" textParagraph={horizontalLink3[0].text} classAnchor="a-footer__contact -checkout" href={horizontalLink3[1].url} textAnchor={horizontalLink3[1].text}/>
             <ParagraphAnchor classParagraph="a-footer__contact -checkout d-lg-inline-block d-bloc" textParagraph={horizontalLink3[2].text} classAnchor="a-footer__contact -checkout" href={horizontalLink3[3].url} textAnchor={horizontalLink3[3].text}/>
          </div>
        </nav>
      </div>
      <div className="container-fluid m-footer__misc">
        <div className="col-12 col-lg-12 text-center">
              <Paragraph className="a-footer__misc">{bottomHTML[0].text}</Paragraph>
              <Paragraph className="a-footer__misc">{bottomHTML[1].text}</Paragraph>
        </div>
      </div>
    </footer>
);
}

