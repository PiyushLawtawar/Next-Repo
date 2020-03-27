//import './Paragraph.styl';
export default ({ text, className, ...props }) => {
    return (
        props.htmlText ?
        <p className={`${className}`} dangerouslySetInnerHTML={{__html:props.htmlText}} />
        :
            props.dangerouslySetInnerHTML ? 
            <p className={`${className}`} {...props } dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}>
                {props.children}
            </p>
            :
            <p className={`${className}`} {...props }>
                {props.children}
            </p>
    );
}


