import Image from '../../atoms/Tagimage/Image';
//import './ProductImage.styl';

export default (props) => {
    const { imgClass, imgAlt, imgTitle, imgSrc } = props.options;
    return (
        <div className="m-product__image">
            <figure><Image className={imgClass} alt={imgAlt} title={imgTitle} src={imgSrc} /></figure>
        </div>
    );
}