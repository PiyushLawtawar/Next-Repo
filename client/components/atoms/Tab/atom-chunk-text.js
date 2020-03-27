//- mixin atom-chunk-text(atom)
//-   if atom.type == "label"
//-     label(class=atom.materialClass ? atom.materialClass+" "+atom.name : atom.name) #{atom.text}
  
//-   if atom.type == "i"
//-     i(class="a-text "+atom.name) #{atom.text}
  
//-   if atom.type == "span"
//-     span(class=atom.materialClass ? "a-text "+atom.materialClass+" "+atom.name : "a-text "+atom.name) #{atom.text}

//-   if atom.type == "a"
//-     if atom.id
//-       a(class=atom.name, href="#", id=atom.id) #{atom.text}
//-     else
//-       a(class=atom.name, href="#") #{atom.text}


//-   if atom.type == "p"
//-     if atom.currency
//-       p(class=atom.materialClass ? atom.materialClass+" "+atom.name : atom.name) #{atom.currency} #{atom.text}
//-         sup(class="-decimal") #{atom.sub}
//-     else
//-       p(class=atom.materialClass ? atom.materialClass+" "+atom.name : atom.name) #{atom.text}

//- mixin atom-chunk-text-icon(atom)
//-   if atom.type == "label"
//-     if atom.isActive
//-       label(class=atom.materialClass ? atom.materialClass+" "+atom.name+" "+atom.name+"--selected" : atom.name+" "+atom.name+"--selected") #{atom.text}
//-     else
//-       label(class=atom.materialClass ? atom.materialClass+" "+atom.name+" "+atom.name+"--unselected" : atom.name+" "+atom.name+"--unselected") #{atom.text}
  
//-   if atom.type == "span"
//-     if atom.isActive
//-       span(class=atom.materialClass ? atom.materialClass+" "+atom.name+" "+atom.name+"--selected" : atom.name+" "+atom.name+"--selected") #{atom.text}
//-     else
//-       span(class=atom.materialClass ? atom.materialClass+" "+atom.name+" "+atom.name+"--unselected" : atom.name+" "+atom.name+"--unselected") #{atom.text}





//import './atom-chunk-text.styl'

export const AtomChunkText = (props) => {
  
    return (
 
            (props.Type == 'label') ?
            <label className={props.className}>{props.children}</label>
                :
                (props.Type == 'i') ?
                <i className={props.className}>{props.children}</i>
                    :
                    (props.Type == 'span') ?
                    <span className={props.className}>{props.children}</span>
                        :
                        (props.Type == 'a') ?                                
                                <a className={props.className}>{props.children}</a>
                            :
                            (props.Type == 'p') ?
                            <p className={props.className}>{props.children}</p>
                                :
                                null
              
        
    )
}
