//import './Icons.styl';

 export default ({className='', ...props }) => {
  return (
    <i className={`${className}`} {...props } onClick={props.onClick}/>  
  );
}
