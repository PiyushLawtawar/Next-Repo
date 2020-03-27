import React from 'react';
import LazyLoad from 'react-lazyload';

const Lazy = (props) => {
    const { height, offset, once } = props;
    return (
        <LazyLoad height={height} offset={offset} once={once}>
            {props.children}
        </LazyLoad>
    )
}

Lazy.defaultProps = {
    height: 100,
    offset: 0,
    once: true
}

export default Lazy;