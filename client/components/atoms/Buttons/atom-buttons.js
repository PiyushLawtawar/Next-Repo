//- mixin atom-button(text, className)
//- 	button(class=className)&attributes(attributes)=text
//- 		block
//import './atom-buttons.styl'
export default (props) => {
	 const {className,text} = props.buttonData;
    return(
			<button className={className} {...props}>{text}</button>
  	);
}