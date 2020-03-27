//import './Label.styl';

 export default ({className='',text, ...props }) => {
  return (
    <label className={`${className}`} htmlFor={props.for || props.htmlFor} id={props.id} onClick={props.onClick} {...props}>
      {props.children}
    </label>
  );
}