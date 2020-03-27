import React from 'react';
import { OnImgError } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { CarouselProvider, Slider, Slide, ButtonBack, Image, ImageWithZoom, ButtonNext, Dot, DotGroup, ButtonPlay, WithStore } from 'pure-react-carousel';
import { Card } from '../../molecules/Card/Card';
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
        };

        const visibleSlides = 6;
        const naturalSlideWidth = 220;
        const naturalSlideHeight = 266;
        const orientation = "vertical";
        this.onImgError = this.onImgError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.dynamicUrl = this.dynamicUrl.bind(this);
    }
    onImgError (e) {
        this.props.imageBreak(this.state.imageBreakFlag)
        const errImgElement = e.target;
        OnImgError(errImgElement, Path.onImgError);
    }


    dynamicUrl(carouselRecords = {}, productId) {
        
        const {LImg} = this.state
        Object.keys(carouselRecords).forEach(key => {
            if (key.match(productId + '_th') || key.match(productId + '_gl')) {
                let value = carouselRecords[key];
                LImg.push({
                    src: value,
                    w: 1200,
                    h: 900,
                    title: ''
                })
            }

        });
        return LImg
    }

    // componentDidUpdate() {
    //     const {carouselRecords} = this.props     
    //     this.dynamicUrl(carouselRecords, this.state.productSizeId)

    // }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {carouselRecords, productId} = this.props
        if (nextProps.productSizeId !== undefined && nextProps.productSizeId !== this.state.productSizeId) {
            this.setState({ LImg: [] }, () => {
                const finalUrl = this.dynamicUrl(carouselRecords, nextProps.productSizeId)
                this.setState({
                    LImg: finalUrl
                })
            }

            );

        }
    }
    componentDidMount() {
        // <480 =2 item
        // <960 =4 item
        // <1024 =5 item
        // <1366 =6 item
        const {carouselRecords, productId} = this.props
        const {LImg} = this.state
        this.dynamicUrl(carouselRecords, productId)
        //   console.log("LImg",LImg)
        if (LImg.length < 1) {
            this.dynamicUrl(carouselRecords, this.state.productSizeId)
        }

        this.setState({
            visibleSlide: screen.width <= 480 ? 1
                : screen.width <= 768 ? 1
                    : screen.width <= 960 ? 1
                        : screen.width <= 1080 ? 1
                            : screen.width <= 1366 ? 6
                                : 6,
            naturalSlideWidth: screen.width <= 480 ? 40
                : screen.width <= 768 ? 110
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
            orientation: screen.width <= 480 ? 'horizontal'
                : screen.width <= 768 ? 'horizontal'
                    : screen.width <= 960 ? 'horizontal'
                        : screen.width <= 1080 ? 'horizontal'
                            : screen.width <= 1366 ? 'vertical'
                                : 'vertical',
            Bigimage: this.state.LImg && this.state.LImg[0] && this.state.LImg[0].src
        });
    }
    changeImage = (image, index) => {
        this.setState({
            Bigimage: image,
            imgIndex: index
        })
    }
    getThumbnailContent = () => {
        return this.setState({ Bigimage: LImg[0].src })
    }
    handleClose = () => {
        this.setState({ isOpen: false })
    }
    OpenPhotoswipe = (e) => {
        this.setState({ isOpen: true, imgIndex: this.state.index });
    }
    onMouseLeave() {
        this.imageNode.style.display = 'none';
        this.figureNode.style.display = 'none';
        this.pzlefectblur.style.opacity = 0;
        this.pzlarealup.style.opacity = 0;
        // this.figureNode.style.backgroundImage = 'none';
        // this.figureNode.style.backgroundPosition = '50% 50%';//width: 135%; height: 100%; left: 602.406px; display: none; opacity: 0;

    }

    onMouseEnter(e, imageUrl) {
        // this.imageNode.style.display = 'none';
        //  this.figureNode.style.backgroundImage = `url(${imageUrl})`;
        this.figureNode.style.width = '135%';
        this.figureNode.style.height = '100%';
        this.figureNode.style.left = '602.406px';
        this.figureNode.style.display = 'block';
        this.figureNode.style.opacity = 1;
        this.imageNode.style.display = 'block';
        this.pzlefectblur.style.opacity = 0.7;
        this.pzlarealup.style.opacity = 0.7;
        this.pzlarealup.style.width = '100px';
        this.pzlarealup.style.height = '100px';
        this.figureNode.style.opacity = 1;
        //  this.imgViewer.style.width='100px';
        //  this.imgViewer.style.height='100px';
    }

    onMouseMove(e) {
        if (e.nativeEvent) {
            const zoomer = e.currentTarget;

            const xx = e.nativeEvent.x - (zoomer.offsetWidth / 2);
            const yy = e.nativeEvent.y - (zoomer.offsetHeight / 2);

            const x = (e.nativeEvent.offsetX / zoomer.offsetWidth) * 800;
            const y = (e.nativeEvent.offsetY / zoomer.offsetHeight) * 800;

            // // zoomer.style.backgroundPosition = `${x}% ${y}%`;
            //  zoomer.style.marginLeft= x;
            //  zoomer.style.marginTop = y;

            this.pzlarealup.style.left = xx + 'px';
            this.pzlarealup.style.top = yy + 'px';

            this.imgViewer.style.marginLeft = '-' + x + 'px';
            this.imgViewer.style.marginTop = '-' + y + 'px';
            this.imageNode.style.marginLeft = '-' + x + 'px';
            this.imageNode.style.marginTop = '-' + y + 'px';

        }
    }
    changeEvent = (e) => {
        e.target.click();
    }

    render() {


        let options = {
            index: this.state.imgIndex,
            escKey: true,
            shareEl: false,
            fullscreenEl: false,
            hasMasterSpinner: true
        };
        //console.log("ButtonNext :::-----> ", this.state.LImg);
        return (

            <React.Fragment>


                <CarouselProvider orientation={this.state.orientation} className={"o-product__image"} naturalSlideHeight={this.state.naturalSlideHeight} naturalSlideWidth={this.state.naturalSlideWidth} visibleSlides={1} step={1} totalSlides={this.state.LImg.length}>
                    <figure className="o-gallery__pdp--desktop pzlcontainermain d-none d-lg-block">
                        <div className="pzlcontainerthumbs pzlContainerLeft" >
                            <ul id="listBeforeEtalage" >
                                <ButtonBack onMouseMove={(e) => this.changeEvent(e)}>Back</ButtonBack>
                                <Slider trayTag={'div'}>
                                    {!isEmpty(this.state.LImg) && map(this.state.LImg, (item, index) => {
                                        return (
                                            <li className="img-viewer" key={index} >
                                                <Slide tag={'div'} index={0} >
                                                    <img src={item.src} onMouseOver={() => this.changeImage(item.src, index)} onError={this.onImgError} width={600} height={400} />
                                                </Slide>
                                            </li>
                                        )
                                    })
                                    }
                                </Slider>
                                <ButtonNext onMouseMove={(e) => this.changeEvent(e)}>Next</ButtonNext>
                            </ul>
                        </div>
                        <div className="pzlcontainerviewer viewerImg" >

                            {/*<div className="image-magnify">
                                                <div className="image-magnify__image-container">
                                                    <figure
                                                    className="zoom isZoomable"
                                                    ref={n => (this.figureNode = n)}
                                                    onMouseMove={this.onMouseMove}
                                                    onMouseLeave={this.onMouseLeave}
                                                    onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                                    onClick={this.OpenPhotoswipe}
                                                    >
                                                    <img ref={n => (this.imageNode = n)} src={this.state.Bigimage} />
                                                    </figure>
                                                </div>
                                            </div>*/}
                            <img ref={n => (this.imageNode = n)} src={this.state.Bigimage} onClick={this.OpenPhotoswipe}
                                onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                onMouseMove={this.onMouseMove}
                                onMouseLeave={this.onMouseLeave}
                                onError={this.onImgError}
                                id='Bigimage'
                            />
                            <div className="pzlefectblur" ref={n => (this.pzlefectblur = n)}
                                onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                onMouseLeave={this.onMouseLeave}
                                onMouseMove={this.onMouseMove}
                                onClick={this.OpenPhotoswipe}
                            >
                            </div>
                            <div className="pzlarealup" ref={n => (this.pzlarealup = n)}
                                onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                onMouseLeave={this.onMouseLeave}>
                                <img src={this.state.Bigimage} className="img-viewer"
                                    ref={n => (this.imgViewer = n)}
                                    onMouseEnter={e => this.onMouseEnter(e, this.state.Bigimage)}
                                    onMouseLeave={this.onMouseLeave}


                                />
                            </div>
                            {/*<PhotoSwipeGallery items= {items}  thumbnailContent={() => this.getThumbnailContent(this.state.Bigimage)}/>*/}
                            {/*<PhotoSwipe isOpen={false}options={0} items={items} onClose={() => this.state.handleClose()}/>*/}
                        </div>
                        <div className="pzlcontainerviewerzoom" ref={n => (this.figureNode = n)}
                            onMouseMove={this.onMouseMove}
                            onMouseLeave={this.onMouseLeave}>
                            <img ref={n => (this.imageNode = n)} src={this.state.Bigimage} onError={this.onImgError} />
                        </div>
                    </figure>
                    <div className="o-gallery__pdp--mobile d-block d-lg-none">
                        <div className="carouselGallery slick-initialized slick-slider slick-dotted">
                            <div className="slick-list draggable">
                                <Slider trayTag={'div'}>
                                    {!isEmpty(this.state.LImg) && map(this.state.LImg, (item, index) => {
                                        return (
                                            <li className="img-viewer" key={index} >
                                                <Slide tag={'div'} index={0}>
                                                    <img src={item.src} onMouseOver={() => this.changeImage(item.src, index)} onClick={this.OpenPhotoswipe} onError={this.onImgError} />
                                                </Slide>
                                            </li>
                                        )
                                    })
                                    }
                                </Slider>
                            </div>
                        </div>
                        {this.state.LImg && this.state.LImg.length > 1 ?
                            <ul className="slick-dots" role="tablist">
                                <DotGroup className="slick-active" role="presentation" />
                            </ul> : null}
                    </div>
                    <PhotoSwipe isOpen={this.state.isOpen} options={options} items={this.state.LImg} onClose={() => this.handleClose()} />
                </CarouselProvider>


            </React.Fragment>
        )
    }

}
export default CarouselPdp