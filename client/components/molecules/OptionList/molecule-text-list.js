//- mixin molecule-text-list(molecule)
//-   div(class=molecule.name)
//-     ul(class=molecule.name+"__list")
//-       each v,i in molecule.columns
//-         if i == 0
//-           li(class=molecule.name+"__items "+molecule.name+"__items"+molecule.modifier, name=molecule.el[i])
//-             - var atom = { name : "a-columnName", text : v, type : "span" };
//-             include ../../atoms/tab/atom-chunk-text
//-             +atom-chunk-text(atom)
//-         else
//-           li(class=molecule.name+"__items", name=molecule.el[i])
//-             - var atom = { name : "a-columnName", text : v, type : "span" };
//-             include ../../atoms/tab/atom-chunk-text
//-             +atom-chunk-text(atom)

import map from 'lodash/map';
import {AtomChunkText} from '../../atoms/Tab/atom-chunk-text.js'
//import './molecule-text-list.styl'
export default (props) => {
    const MyBagHeadersList = props.MyBagHeadersName
    const atom = { className : "a-columnName", type : "span" };
    return(
        <div className={MyBagHeadersList.name}>
                <ul className={MyBagHeadersList.name+"__list"}>
                                {
                                    map(MyBagHeadersList.columns, (item, i) => {
                                        return (
                                            i==0?
                                             <li className={MyBagHeadersList.name+"__items "+MyBagHeadersList.name+"__items"+MyBagHeadersList.modifier} key={i} name={MyBagHeadersList.el[i]}>
                                                  <AtomChunkText  Type={atom.type} className={atom.className}>{item}</AtomChunkText>
                                             </li>:
                                             (props.activeTab === 'mdc-tab-1')?
                                                <li className={MyBagHeadersList.name+"__items"} key={i} name={MyBagHeadersList.el[i]}>
                                                    <AtomChunkText Text={item} Type={atom.type} className={atom.className}>{item}</AtomChunkText>
                                                </li>   
                                             :

                                             (props.activeTab === 'mdc-tab-2' && item==='Precio')?   
                                             <li className={MyBagHeadersList.name+"__items"} key={i} name={MyBagHeadersList.el[i]}>
                                                  <AtomChunkText Text={item} Type={atom.type} className={atom.className}>{item}</AtomChunkText>
                                             </li>      
                                             : null                                     
                                        )
                                    })
                                }
                </ul>

        </div>
  );
}