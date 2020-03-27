//- mixin my-bag-product-list(data,i)
//-   include ../../molecules/MyBag/molecule-product
//-   include ../../molecules/MenuMotion/molecule-menu-motion
//-   each v,i in data
//-     div(class=v.nameComponent+" "+v.nameComponent+"--"+v.modifierComponent)
//-       +molecule-product(v, i)
//-       div(class=v.nameComponent+"__motionMenu")
//-         +menuMotion(v, i)
import ProductList from '../../molecules/MyBag/molecule-product';
//import './productList.styl';
export default (props) => {

    return(
           <ProductList {...props}/>
    )
}




