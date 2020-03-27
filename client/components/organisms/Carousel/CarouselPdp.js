import React from 'react';
import { OnImgError, getAssetsPath } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup, } from 'pure-react-carousel';
import { PDP_PLAY_IMG } from '../../../../client/config/constants';
import SlickSlider from "react-slick";

// import './Carousel.styl'
// import './PdpProductImg.styl'
import PhotoSwipe from 'react-photoswipe';
class CarouselPdp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            plpData: {},
            Bigimage: '',
            // 'https://ss628.liverpool.com.mx/xl/1071308843_10p.jpg',
            imgIndex: 0,
            isOpen: false,
            productSizeId: props.productSizeId,
            LImg: [],
            vedioFlag: false,
            linkFlag: false,
            WapImg: []

        };

        const visibleSlides = 6;
        const naturalSlideWidth = 220;
        const naturalSlideHeight = 266;
        const orientation = "vertical";
        this.onImgError = this.onImgError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.dynamicUrl = this.dynamicUrl.bind(this);
    }
    onImgError(e) {

        this.props.imageBreak && this.props.imageBreak(this.state.imageBreakFlag)
        const errImgElement = e.target;
        OnImgError(errImgElement, Path.onImgError);
    }

    checkURL(url) {
        try {
            if(typeof url !== 'string') {
                url = url.toLowerCase();
            }
        }catch(e){}
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
    dynamicUrl(carouselRecords = {}, productId, timeout) {
        //console.log("timeout===",timeout)
        let SortedImages = this.sortingImage(carouselRecords, productId, "th") /* added for 23682 */
        const { LImg } = this.state
        let isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
        let linkFlag = isHTML(this.props.vedioLinks)
        let frame = '';
        if (SortedImages[productId + "_th"] !== '' && SortedImages[productId + "_th"] !== null) {
            LImg.push({
                src: SortedImages[productId + "_th"],
                w: 800,
                h: 600,
                title: ''
            });
        }

        SortedImages = this.sortingImage(carouselRecords, productId, "gl")
        if (timeout != 0) {
            setTimeout(() => {

                Object.keys(SortedImages).forEach(key => {
                    let value = SortedImages[key];
                    if (value !== null && this.checkURL(value)) {
                        LImg.push({
                            src: value,
                            w: 800,
                            h: 600,
                            title: ''
                        })
                    }
                }, timeout | 0)
            });
        } else {
            Object.keys(SortedImages).forEach(key => {
                let value = SortedImages[key];
                if (value !== null && this.checkURL(value)) {
                    LImg.push({
                        src: value,
                        w: 800,
                        h: 600,
                        title: ''
                    })
                }
            })
        }

        if (linkFlag) {
            frame = '<div class="video-slide">' + this.props.vedioLinks + '</div>';
        } else {
            frame = '<div class="video-slide"><iframe src="' + this.props.vedioLinks + '" width=400 height=300 ></iframe></div>'
        }
        this.props.vedioLinks !== '' && this.props.vedioLinks !== null && LImg.length > 0 ? LImg.push({
            html: frame,
            w: 1200,
            h: 900,
            title: ''
        }) : ''
        let AssetsPath = '';
        if (typeof window !== 'undefined') {
            AssetsPath = getAssetsPath(window, undefined);
        }
        if (LImg.length == 0) {
            LImg.push({
                src: AssetsPath + '/static/images/filler_REC.gif',
                w: 1200,
                h: 900,
                title: ''
            })
        }
        //console.log("LImg===",LImg)
        return LImg
    }


    sortingImage = (carouselRecords, productId, type) => {
        //console.log("carousalRecord", carouselRecords)
        let glrecords = Object.keys(carouselRecords).filter(imagekey => imagekey.match("gl")).map(eachglimages => eachglimages.split("_")[2]).sort((a, b) => a - b)
        let orderedImage = {};
        if (type == 'th') {
            for (let image in carouselRecords) {
                if (image.match(productId + '_th')) { orderedImage[image] = carouselRecords[image] }
            }
        } else {
            glrecords.map(eachsortorder => { for (let image in carouselRecords) { if (image.match(productId + '_gl') && image.split("_")[1] == "gl" && image.split("_")[2] == eachsortorder) { orderedImage[image] = carouselRecords[image] } } })
        }



        // console.log("orderedImage", orderedImage);
        return orderedImage
    }

    dynamicUrlCollection = (imageArray) => {

        const { LImg } = this.state
        imageArray.map(image => {
            LImg.push({
                src: image,
                w: 1200,
                h: 900,
                title: ''
            })

        })
        return LImg
    }


    componentWillReceiveProps(nextProps) {
        const { carouselRecords, productId } = this.props

        if (nextProps.productSizeId !== undefined && nextProps.productSizeId !== this.props.productSizeId) {
            this.setState({ LImg: [] }, () => {
                const finalUrl = this.props.isCollection ? this.dynamicUrlCollection(nextProps.carouselRecords) : this.dynamicUrl(nextProps.carouselRecords, nextProps.productSizeId, 0)
                this.setState({
                    LImg: finalUrl,
                    Bigimage: finalUrl && finalUrl[0] && finalUrl[0].src,
                    productSizeId: nextProps.productSizeId

                })
            }

            );
            if (nextProps.isMobile) {
                //console.log(this.SlickSlider)
                setTimeout(function () { this.SlickSlider && this.SlickSlider.slickGoTo && this.SlickSlider.slickGoTo(0); }.bind(this), 1000);
            }
        }
        else {
            //console.log(this.state.imgIndex)
            
            let LImg = !isEmpty(this.state.LImg) && this.state.LImg || (nextProps.isCollection ? this.dynamicUrlCollection(nextProps.carouselRecords) : this.dynamicUrl(nextProps.carouselRecords, nextProps.productSizeId, 0))
            this.state.LImg = LImg;
            if (this.state.imgIndex == 0) // fix for defect id 23605
                this.state.Bigimage = LImg && LImg[0] && LImg[0].src;

        }

        // if (nextProps.pdpType == 'hybrid') {
        //     if (this.props.hybridProductId !== nextProps.hybridProductId) {
        //         this.setState({ LImg: [] }, () => {
        //             const finalUrl = this.dynamicUrl(nextProps.carouselRecords, nextProps.hybridProductId)
        //             // console.log("finalUrl==",finalUrl.sort());
        //             this.setState({
        //                 LImg: finalUrl,
        //                 Bigimage: finalUrl && finalUrl[0] && finalUrl[0].src

        //             })
        //         });
        //     }
        // }
    }

    componentDidMount() {
        // <480 =2 item
        // <960 =4 item
        // <1024 =5 item
        // <1366 =6 item
        const { carouselRecords, productId, isCollection, colorIDforImage, productSizeId } = this.props
        const { LImg } = this.state

        let id = colorIDforImage != "" ? colorIDforImage : productSizeId;
        isCollection ? this.dynamicUrlCollection(carouselRecords) : this.dynamicUrl(carouselRecords, id, 2000)
        //   console.log("LImg",LImg)
        if (LImg.length < 1) {
            isCollection ? this.dynamicUrlCollection(carouselRecords) : this.dynamicUrl(carouselRecords, this.state.productSizeId, 2000)
        }
        //console.log("screen.width = ", screen.width);

        this.setState({
            visibleSlide: screen.width <= 480 ? 6
                : screen.width <= 768 ? 6
                    : screen.width <= 960 ? 6
                        : screen.width <= 1080 ? 6
                            : screen.width <= 1366 ? 6
                                : 6,
            naturalSlideWidth: screen.width <= 480 ? 40
                : screen.width <= 768 ? 120
                    : screen.width <= 960 ? 8
                        : screen.width <= 1080 ? 120
                            : screen.width <= 1366 ? 220
                                : 266,
            naturalSlideHeight: screen.width <= 480 ? 40
                : screen.width <= 768 ? 110
                    : screen.width <= 960 ? 8
                        : screen.width <= 1080 ? 120
                            : screen.width <= 1366 ? 220
                                : 266,
            orientation: screen.width <= 480 ? 'vertical'
                : screen.width <= 768 ? 'vertical'
                    : screen.width <= 960 ? 'vertical'
                        : screen.width <= 1080 ? 'vertical'
                            : screen.width <= 1366 ? 'vertical'
                                : 'vertical',
            Bigimage: this.state.LImg && this.state.LImg[0] && this.state.LImg[0].src
        });
        window.onhashchange = () => {
            if(window.location.hash !== '#/Image'){
                this.handleClose();
            }
            if(window.location.hash !== '#/Modal' && this.props.closeAllModals){
                this.props.closeAllModals();
            }
        }        
    }
    changeImage = (image, index) => {

        this.setState({
            Bigimage: image,
            imgIndex: index,
            vedioFlag: false
        })
    }
    enableVedioLink = () => {

        this.setState({
            vedioFlag: true
        })
    }
    getThumbnailContent = () => {

        return this.setState({ Bigimage: LImg[0].src })
    }
    handleClose = () => {

        let LImg = !isEmpty(this.state.LImg) && this.state.LImg || (this.props.isCollection ? this.dynamicUrlCollection(this.props.carouselRecords) : this.dynamicUrl(this.props.carouselRecords, this.props.productSizeId, 0))
        this.state.LImg = LImg;
        this.setState({ isOpen: false, frmPhotoswipe: false })
    }
    OpenPhotoswipe = (e) => {
        window.location.hash = "#/";
        window.location.hash = "#/Image";
        let currtar = e && e.target && e.target.dataset && e.target.dataset.index
        if (currtar == undefined) {
            currtar = this.state.imgIndex
        }
        this.setState({ isOpen: true, imgIndex: parseInt(currtar) });
    }
    onMouseLeave() {
        //
        this.figureNode.style.display = 'none';
        this.figureNode.style.opacity = 0;
    }

    onMouseEnter(e, imageUrl) {
        //
        this.figureNode.style.display = 'block';
        this.figureNode.style.opacity = 1;
    }

    changeEvent = (e) => {
        // 
        e.target.click();
    }
    componentDidUpdate(prevProps) {
        const imgID = document.getElementById('image-real');
        let imgClassNames = '';
        if (!isEmpty(imgID)) {
            imgClassNames = document.getElementById('image-real').className || '';
        }
        const imgZoomRes = document.getElementById('image-zoom-result');
        if (!isEmpty(imgID) && !isEmpty(imgZoomRes) && imgClassNames.indexOf('added-event') === -1) {
            document.getElementById('image-real').classList.add('added-event');
            this.imageZoom('image-real', 'image-zoom-result');
        }
    }

    imageZoom = (imgID, resultID) => {

        try {
            let img;
            let lens;
            let result;
            let cx;
            let cy;
            img = document.getElementById(imgID);
            result = document.getElementById(resultID);
            /* Create lens: */
            lens = document.createElement("DIV");
            lens.setAttribute("class", "img-zoom-lens");
            lens.setAttribute("id", "img-zoom-lens-id");
            /* Insert lens: */
            img.parentElement.insertBefore(lens, img);
            /* Calculate the ratio between result DIV and lens: */
            cx = result.offsetWidth / lens.offsetWidth;
            cy = result.offsetHeight / lens.offsetHeight;
            /* Set background properties for the result DIV */
            // result.style.backgroundImage = "url('" + img.src + "')";
            // result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
            /* Execute a function when someone moves the cursor over the image, or the lens: */
            lens.addEventListener("mousemove", moveLens);
            img.addEventListener("mousemove", moveLens);

            /* And also for touch screens: */
            // lens.addEventListener("touchmove", moveLens);
            // img.addEventListener("touchmove", moveLens);

            lens.addEventListener("mouseenter", showZoom);
            lens.addEventListener("mouseout", hideZoom);
            function showZoom(e) {
                e.preventDefault();
                document.getElementById('img-zoom-lens-id').style.display = 'block';
                document.getElementById('image-zoom-result').style.display = 'block';
                document.getElementById('image-zoom-result').style.opacity = 1;
            }
            function hideZoom(e) {
                e.preventDefault();
                document.getElementById('img-zoom-lens-id').style.display = 'none';
                document.getElementById('image-zoom-result').style.display = 'none';
                document.getElementById('image-zoom-result').style.opacity = 0;
            }

            function moveLens(e) {
                document.getElementById('img-zoom-lens-id').style.display = 'block';
                var pos, x, y;
                /* Prevent any other actions that may occur when moving over the image */
                e.preventDefault();
                /* Get the cursor's x and y positions: */
                pos = getCursorPos(e);
                /* Calculate the position of the lens: */
                x = pos.x - (lens.offsetWidth / 2);
                y = pos.y - (lens.offsetHeight / 2);
                /* Prevent the lens from being positioned outside the image: */
                if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
                if (x < 0) { x = 0; }
                if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
                if (y < 0) { y = 0; }
                /* Set the position of the lens: */

                lens.style.left = x + "px";
                lens.style.top = y + "px";
                /* Display what the lens "sees": */
                let resultTmp = document.getElementById(resultID);
                cx = resultTmp.offsetWidth / lens.offsetWidth * .43;
                cy = resultTmp.offsetHeight / lens.offsetHeight * .6;

                resultTmp.style.backgroundImage = "url('" + img.src + "')";
                resultTmp.style.backgroundRepeat = 'no-repeat';
                resultTmp.style.backgroundSize = (img.width * cx) * .9 + "px " + (img.height * cy) * .9 + "px";
                resultTmp.style.backgroundPosition = "-" + (x * cx * .6) * .9 + "px -" + (y * cy) * .9 + "px";
            }
            function getCursorPos(e) {
                var a, x = 0, y = 0;
                e = e || window.event;
                /* Get the x and y positions of the image: */
                a = img.getBoundingClientRect();
                /* Calculate the cursor's x and y coordinates, relative to the image: */
                x = e.pageX - a.left;
                y = e.pageY - a.top;
                /* Consider any page scrolling: */
                x = x - window.pageXOffset;
                y = y - window.pageYOffset;
                return { x: x, y: y };
            }
        } catch (e) { console.error("Main image info: ", e) }
    }
    swipeOnchange = (changedValue) => {

        this.state.imgIndex = changedValue.getCurrentIndex()
        this.state.frmPhotoswipe = true
    }
    shouldComponentUpdate(props, state) {
        if (state.frmPhotoswipe != true) { return true } else { return false }
    }

    render() {

        let isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
        let linkFlag = isHTML(this.props.vedioLinks)
        //console.log("this.state.LImg===",this.state.LImg)
        const settings = {
            dots: true,
            lazyLoad: 'ondemand',
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0
        };

        let options = {
            index: this.state.imgIndex,
            escKey: true,
            shareEl: false,
            fullscreenEl: false,
            hasMasterSpinner: true,
            closeOnScroll: false,
            history: false
        };


        let endecaProductRecord = this.props.mainContent && this.props.mainContent.endecaProductInfo ? this.props.mainContent.endecaProductInfo.contents[0].mainContent[0].record : {};
        const headLineText = endecaProductRecord.productDisplayName ? endecaProductRecord.productDisplayName[0] : (endecaProductRecord.attributes && endecaProductRecord.attributes['product.displayName'][0]) || this.props.productInfo && this.props.productInfo.title && this.props.productInfo.title[0] || {}
        if (isEmpty(endecaProductRecord)) {
            endecaProductRecord = this.props;
        }
        let AssetsPath = '';
        if (typeof window !== 'undefined') {
            AssetsPath = getAssetsPath(window, undefined, process);
        }
        return (

            < React.Fragment >

                <CarouselProvider orientation={this.state.orientation} className={"o-product__image"} naturalSlideHeight={this.state.naturalSlideHeight} naturalSlideWidth={this.state.naturalSlideWidth} visibleSlides={this.state.visibleSlide} step={1} totalSlides={this.state.LImg.length}>
                    <figure className="o-gallery__pdp--desktop pzlcontainermain d-none d-lg-block retain-css-property-value">
                        <div className="pzlcontainerthumbs pzlContainerLeft" >
                            <ul id="listBeforeEtalage" >
                                <ButtonBack onMouseMove={(e) => this.changeEvent(e)}>Back</ButtonBack>
                                <Slider trayTag={'div'}>

                                    {!isEmpty(this.state.LImg) && map(this.state.LImg, (item, index) => {
                                        if (!item.html) {
                                            return (
                                                <li className={"img-viewer" + (this.state.imgIndex === index ? ' active-thumb' : '')} key={index} >
                                                    <Slide tag={'div'} index={0} >
                                                        <img className="lazyload pdpthumb" alt={headLineText} data-src={item.src} data-index={index} onClick={() => { (this.state.naturalSlideWidth === 120) ? this.changeImage(item.src, index) : null }} onMouseOver={() => this.changeImage(item.src, index)} onError={this.onImgError} width={600} height={400} />
                                                    </Slide>
                                                </li>
                                            )
                                        } else {
                                            return (<li className={"img-viewer" + (this.state.imgIndex === index ? ' active-thumb' : '')} key={index} >
                                                <Slide tag={'div'} index={0} >
                                                    <div class="pzlvideo" onClick={() => this.enableVedioLink()} onMouseOver={() => this.enableVedioLink()}>
                                                        <img className="lazyload pdpthumb" data-src={this.state.Bigimage} onError={this.onImgError} width={600} height={40} onClick={() => this.enableVedioLink()} />
                                                        <img src={AssetsPath + PDP_PLAY_IMG} data-index={index} alt={headLineText} title="icono_play" class="pzlthumbPlay" onClick={() => this.enableVedioLink()} />
                                                    </div>
                                                </Slide>
                                            </li>)
                                        }

                                    })
                                    }

                                    {/* })
                                } */}

                                </Slider>
                                <ButtonNext onMouseMove={(e) => this.changeEvent(e)}>Next</ButtonNext>
                            </ul>
                        </div>
                        {
                            this.state.vedioFlag ? linkFlag ? <div className="pzlcontainerviewer viewerImg" dangerouslySetInnerHTML={{ __html: this.props.vedioLinks }} onClick={(e) => this.OpenPhotoswipe(e)}></div> :
                                <div className="pzlcontainerviewer viewerImg" onClick={(e) => this.OpenPhotoswipe(e)}>
                                    <iframe src={this.props.vedioLinks} width={400} height={400} >
                                    </iframe></div> :
                                <div className="pzlcontainerviewer viewerImg" onClick={(e) => this.OpenPhotoswipe(e)}>

                                    <img alt={headLineText} id="image-real" ref={n => (this.imageNode = n)} src={this.state.Bigimage} onClick={(e) => this.OpenPhotoswipe(e)}
                                        onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                        onMouseLeave={this.onMouseLeave}
                                        onError={this.onImgError}
                                    />
                                </div>

                        }
                        <div className="pzlcontainerviewerzoom" id="image-zoom-result" ref={n => (this.figureNode = n)} style={{ backgroundImage: this.state.Bigimage }} >
                        </div>
                    </figure>
                </CarouselProvider>
                <div className="o-gallery__pdp--mobile d-block d-lg-none avoid-scroll-x avoid-bottom-space">
                    <div className="carouselGallery slick-initialized slick-slider slick-dotted">

                        <SlickSlider {...settings} ref={(c) => { this.SlickSlider = c; }}>
                            {!isEmpty(this.state.LImg) && map(this.state.LImg, (item, index) => {
                                if (!item.html) {
                                    return (
                                        <li className="img-viewer" key={index} >
                                            <img className="lazyload" data-index={index} alt={headLineText} src={item.src} onClick={(e) => this.OpenPhotoswipe(e)} onError={this.onImgError} />
                                        </li>
                                    )
                                } else {
                                    return (<li className="img-viewer"  >
                                        <div class="pzlvideomob"  >
                                            <img className="lazyload" id="pzlthumbPlaymob" src={this.state.Bigimage} onError={this.onImgError} data-index={index} onClick={(e) => this.OpenPhotoswipe(e)} />
                                            <img src={AssetsPath + PDP_PLAY_IMG} alt={headLineText} title="icono_play" data-index={index} class="pzlthumbPlaymob" onClick={(e) => this.OpenPhotoswipe(e)} />
                                        </div>

                                    </li>)
                                }



                            })
                            }
                        </SlickSlider>
                    </div>
                </div>


                <PhotoSwipe isOpen={this.state.isOpen} options={options} items={this.state.LImg} onClose={() => this.handleClose()} afterChange={this.swipeOnchange} />



            </React.Fragment >
        )
    }

}
export default CarouselPdp
