

//import './Color.styl';

 export default ({color,supClassname, ...props }) => {
  return (
    <Color className={`${supClassname}`} color={color} {...props }>
      <a href={href} background={color} />
    </Color>
  );
}
