import React from 'react';
import map from 'lodash/map';
import Paragraph from '../../atoms/Paragraph/Paragraph';


export default (props) => {
    const { listType, listClass, listElements } = props.listOptions;
    return (
        <React.Fragment>
            {listType == 'li' ?
                <ul className={listClass}>
                    {map(listElements, (item, index) => {
                        return (
                            <li key={index}>
                                <Paragraph className={item.class}>{item.text}</Paragraph>
                            </li>
                        )
                    })}
                </ul> :
                <ol className={listClass}>
                    {map(listElements, (item, index) => {
                        return (
                            <li key={index}>
                                <Paragraph className={item.class}>{item.text}</Paragraph>
                            </li>
                        )
                    })}
                </ol>}
        </React.Fragment>
    );
}

