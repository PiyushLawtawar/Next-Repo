import React from 'react'
import StickyBarCollectionsProduct from '../../organisms/StickyBar/StickyBarCollectionsProduct';
import Slider from 'react-slick'

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addedProduct: []
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ addedProduct: nextProps.addedProduct })
    }
    render() {
        
        let itemtoShow = this.props.devices && this.props.devices.isIpad ? 2 : 3
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow:  this.state.addedProduct.length < itemtoShow ? this.state.addedProduct.length : itemtoShow,
            slidesToScroll: 1,
            className: "m-carousel sticky__product__gallery",
        };
        
        return (
            <div className="m-gallery " >
                <Slider {...settings}>
                    {this.state.addedProduct.map((product, index) => <StickyBarCollectionsProduct key={index} details={product} productDeSelection={this.props.productDeSelection} />)}
                </Slider>
            </div>
        );
    }

}
