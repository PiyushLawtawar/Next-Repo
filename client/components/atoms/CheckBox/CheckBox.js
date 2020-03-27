//import './CheckBox.styl';

 export default ({type,className, ...props }) => {
    return (
        <input type="CheckBox" className={`${className}`} {...props } >
          
        </input>
    );
}