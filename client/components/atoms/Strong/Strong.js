//import './Strong.styl';

 export default ({strongText, ...props }) => {
  return ( 
    <strong>
       {props.children}
    </strong>
  );
}
