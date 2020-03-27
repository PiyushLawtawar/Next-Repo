//import './PaymentSectionHeader.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';

/*mixin molecule-payment-section-header(options)
    div(class = options.containerClass)
        +atom-paragraph(options.sectionHeaderText, options.sectionHeaderClass)
        if options.secondaryText
            +atom-paragraph(options.secondaryText, options.secondaryTextClass)*/

export default (props) => {
const { sectionHeaderText, sectionHeaderClass,secondaryText, secondaryTextClass } = props.options || props;
return(

<React.Fragment>
<Paragraph className={`${sectionHeaderClass}`}>{sectionHeaderText}</Paragraph>

{secondaryText &&
   <Paragraph className={`${secondaryTextClass}`}>{secondaryText}</Paragraph>
}
</React.Fragment>
);    
}