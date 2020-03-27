import { Path } from '../../../helpers/config/config';
import { OnImgError, getAssetsPath } from '../../../helpers/utilities/utility';
import isEmpty from 'lodash/isEmpty';

const showNoImage = (e) => {
    const imgElement = e.target || {};
    OnImgError(imgElement, Path.onImgError);
}

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    getLoader = () => {
        const { loaded } = this.state;
        const { imageLoader } = this.props;
        const extraClass = this.props.extraClass || '';
        let  AssetsPath = getAssetsPath(( typeof window !=='undefined' ?window :undefined),undefined)  

        if (!loaded) {
            return <img id="loadImage" className={extraClass} src = {!isEmpty(imageLoader)? imageLoader: AssetsPath + '/static/images/imageLoading.svg'} />
        }
        return null;
    }

    onLoadImage = () => {
        this.setState({ loaded: true });
    }

    render() {
        const { alt, src, showLoader, id,nonclickable, className = '' } = this.props;
        if (showLoader === 'true' || showLoader) {
            return (
                <React.Fragment>
                    {this.getLoader()}
                    {typeof nonclickable !=='undefined' && nonclickable==='true' ?
                    <img src={src} alt={alt} id={id} onError={(e) => showNoImage(e)} onLoad={() => this.onLoadImage()} className={className}  />:
                    <img src={src} alt={alt} id={id} onError={(e) => showNoImage(e)} onLoad={() => this.onLoadImage()} className={className} onClick={this.props.onClick} />}
                </React.Fragment>
            )
        }
        return <img src={src} alt={alt} {...this.props} onError={(e) => showNoImage(e)} />
    }
}

export default Image;

// export default ({ src, alt, ...props }) => {
//     return (
//         <img src={src} alt={alt} {...props} onError={(e) => showNoImage(e)} />
//     );
// }
