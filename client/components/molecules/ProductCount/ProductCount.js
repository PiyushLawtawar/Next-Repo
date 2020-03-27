import Paragraph from '../../atoms/Paragraph/Paragraph';
import Span from '../../atoms/Span/Span';

export default (props) => {
  const {paraText, productCount} = props;
  return (
      <Paragraph className="a-plp-results-title">
        <Span>{productCount}</Span> {paraText}
      </Paragraph>
  );
}