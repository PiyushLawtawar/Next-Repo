
 export default ({text,clases, ...props }) => {
  return (
    <address className={`${clases}`}  {...props }>
     {text}
    </address>
  );
}
