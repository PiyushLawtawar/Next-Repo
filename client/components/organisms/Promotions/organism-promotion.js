import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text';
import Button from '../../atoms/Button/Button';
import Figure from '../../molecules/Figure/molecule-Figure';
import Router from 'next/router';
import map from 'lodash/map';
// import './organism-promotion.styl';
const OrganismPromotion = (props) => {
    const  redirect=(url)=>{
        var win = window.open(url, '_blank');
      win.focus();
    }

    const { staticPromotions } = props;   
    var atomValidity = {
        className: "a-blockElement a-blockElement--validity",
        type: "p"
    };
   
    return (
        <div className="o-promotions">
            <div className="o-promotions__card thirdParties">
                <Figure options={staticPromotions} />
                {/*3446 - Promotion description is not printed dynamically in static promotion page */}
                <AtomChunkText Type="p" className="a-blockElement -promotionDescription">{staticPromotions.text}</AtomChunkText>
            </div>
            <div className="o-promotions__moreInformacion">
                {/* <Button className="a-btn a-btn--primary -moreInformation" onClick={() => {Router.push(staticPromotions.pdfURL)}}>Más información</Button> */}
                <Button className="a-btn a-btn--primary -moreInformation" onClick={() => {redirect(staticPromotions.pdfURL)}}>Más información</Button> 
            </div>
            <div className="o-promotions__validity">
                <AtomChunkText Type={atomValidity.type} className={atomValidity.className}>{staticPromotions.date}</AtomChunkText>
            </div>
        </div>
    )

}
export default OrganismPromotion;
