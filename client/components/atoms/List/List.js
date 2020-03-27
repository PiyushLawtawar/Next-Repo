//import './List.styl';



export default ({className="",label,text,placeholder, ...props }) => {
    return (
         <li className={`${className}`} {...props}>  {props.children} </li>
    );
}



