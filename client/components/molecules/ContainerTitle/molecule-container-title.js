import { H1 } from '../../atoms/HeadLines/Headlines';
//import './molecule-container-title.styl';

export default (props) => {
        const {text, type, className} = props.MoleculeList;
        return (  
        <div className="m-createAccount__container-title">
            <H1 headLineText={text} headLineClass={className}/>
        </div>
    );
    
    
}