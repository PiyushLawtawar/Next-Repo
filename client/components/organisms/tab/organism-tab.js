//- mixin organism-tab(organism)
//-   div(class=organism.name, name="tabList")
//-     div(class="mdc-tab-bar "+organism.name+"__bar" role="tablist")
//-       div(class="mdc-tab-scroller "+organism.name+"__scroller")
//-         div(class="mdc-tab-scroller__scroll-area "+organism.name+"__area")
//-           div(class="mdc-tab-scroller__scroll-content "+organism.name+"__content")
//-             each v,i in organism.items
//-               - var molecule = { name : "m-buttonTab", text : v.text, isActive : v.isActive, withIcon : v.withIcon, quantity : v.quantity };
//-               include ../../molecules/tab/molecule-tab-button
//-               +molecule-tab-button(molecule)
import map from 'lodash/map';
import MoleculeTabButton from '../../molecules/Tab/molecule-tab-button'
//import './organism-tab.styl'
export default (props) => {
    const organism =(props.Tab)
    const ButtonTab = { className : "m-buttonTab", text : 'text', isActive : 'isActive', withIcon : 'withIcon', quantity : 'quantity' };
    return(    
        <div className="t-myBag__headTabs">
            <div className={organism.name} name="tabList">
                <div className={"mdc-tab-bar"+organism.name+"__bar"} role="tablist">
                    <div className={"mdc-tab-scroller"+organism.name+"__scroller"}>
                        <div className={"mdc-tab-scroller__scroll-area" +organism.name+"__area"}>
                            <div className={"mdc-tab-scroller__scroll-content " + organism.name + "__content"}>
                            
                                <MoleculeTabButton {...props}/>
                                     
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}