 
 
 export default ({figcaptionClass='', txt='', ...props }) => {
  return (
    <figcaption className={`${figcaptionClass}`} {...props }>{txt}</figcaption>
  );
}