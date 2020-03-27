import { H1 } from "../../atoms/HeadLines/Headlines";
import isEmpty from 'lodash/isEmpty';
import CardBody from './CardBody';

//import './CardList.styl';

export default (props) => {
    const titleValue = props.leftNavContent && props.leftNavContent.displayName;
    
    return (
        <div className="m-card-list--aside">
            <div className="m-card-title--aside">
                <H1 className="a-card-title" headLineText={titleValue} />
                <CardBody leftNavContent={props.leftNavContent} />
            </div>
              
        </div>
    );
}

