

//import './Headlines.styl';



export const H1= ({headLineText, headLineHTMLText, headLineType,headLineClass='', haveChildren=false, ...props }) => {
    /* Defect 22065: "headLineHTMLText" props added and true block added for dangerouslySetInnerHTML in below return statement */
    return (
        headLineHTMLText ?
        <h1 className={`${headLineClass}`} {...props } dangerouslySetInnerHTML={{__html:headLineHTMLText}} />
        :
        <h1 className={`${headLineClass}`} {...props } >
            {headLineText}
            {haveChildren && props.children}
        </h1>
    );
}


export const H2= ({ headLineText,headLineType,headLineClass, haveChildren=false, ...props }) => {
    return (
        <h2 className={`${headLineClass}`} {...props } >
            {headLineText}
            {haveChildren && props.children}
        </h2>
    );
}

export const H3= ({ headLineText,headLineType,headLineClass, ...props }) => {
    return (
        <h3 className={`${headLineClass}`} {...props } >
            {headLineText}
        </h3>
    );
}

export const H4= ({ headLineText,headLineType,headLineClass,haveChildren=false, ...props }) => {
    return (
        <h4 className={`${headLineClass}`} {...props } >
            {headLineText}
             {haveChildren && props.children}
        </h4>
    );
}

export const H5= ({ headLineText, headLineHTMLText, headLineType,headLineClass, ...props }) => {
    /* Defect 22065: "headLineHTMLText" props added and true block added for dangerouslySetInnerHTML in below return statement */
    return (
        headLineHTMLText ?
        <h5 className={`${headLineClass}`} {...props } dangerouslySetInnerHTML={{__html:headLineHTMLText}} />
        :
        <h5 className={`${headLineClass}`} {...props } >
            {headLineText}
        </h5>
    );
}

export const H6= ({ headLineText,headLineType,headLineClass, ...props }) => {
    return (
        <h6 className={`${headLineClass}`} {...props } >
            {headLineText}
        </h6>
    );
}

