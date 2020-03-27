import React from 'react';
import Icons from '../../atoms/Icons/Icons';
import Link from '../../atoms/Link/Link';
//import './molecule-menu-motion.styl';

export const MenuMotion = (props) => {

    return (

        <div className="menuMotion dropleft">
            <Link className="a-box__actionAddress dropdown-toggle" href="#" onClick={props.openOptions} role="button" id="address0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <Icons className="icon-more_vert"></Icons>
            </Link>
            <div className={"dropdown-menu " + (props.options_visibility && 'show')} aria-labelledby="address0">
                <Link className="a-menuMotion__link dropdown-item ripple-motion -gift" href="#">Ya no quiero regalar</Link>
                <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#" onClick={props.edit}>Editar mensaje</Link>
                <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#">Nueva búsqueda</Link>
                <Link className="a-menuMotion__link dropdown-item ripple-motion" href="#" onClick={props.remove}>Eliminar</Link>
            </div>
        </div>

    )
}
// position absolute
// will-change transform
// top 0px
// left 0px
// transform translate3d(-162px, 2px, 0px)
export class ShowMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.node = React.createRef();
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    handleOutsideClick = (e) => {
        if (this.node && this.node.current && !this.node.current.contains(e.target)) {
            this.setState({ show: false })
        }
    }
    toggleShow = () => {
        this.setState({ show: !this.state.show })
    }
    render() {
        const {options} = this.props;
        return (
            <div ref={this.node} className="menuMotion dropleft">
                <Link className="a-box__actionAddress dropdown-toggle" role="button" id="address1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleShow}>
                    <Icons className="icon-more_vert" />
                </Link>
                <div className={this.state.show ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="address1">
                    {options && options.length ? options.map((option,optionIndex) => 
                    <Link key={optionIndex} onClick={() => { this.toggleShow(); option.onClick() }} className="a-menuMotion__link dropdown-item ripple-motion">{option.text}</Link>) : null}
                    {/*<Link onClick={() => console.log('click hua')} className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion">Editar</Link>*/}
                </div>

            </div>
        );
    }
}

export const RemoveMotion = (props) => {
    return (
        <div className="menuMotion dropleft">
            <Link className="a-box__actionAddress dropdown-toggle" href="#" role="button" id={props.skuId} data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false" onClick={props.isShowMotionFun} ><i className="icon-more_vert"></i></Link>
            <div className={(props.isShowMotion) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby={props.skuId} x-placement="left-start" >
                <Link className="a-menuMotion__link trigger-link-1 dropdown-item ripple-motion" onClick={() => props.remove(props.skuId, props.wishlistId)}>Remove</Link>
            </div>
        </div>

    );
} 
