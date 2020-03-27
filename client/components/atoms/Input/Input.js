import React from 'react';
//import './Input.styl';

export default React.forwardRef(({ className = "", label = "", type = "", placeholder = "", ...props }, ref) => {
    const syntheticEvent = props.onChange || props.onClick || props.onBlur || props.onFocus || props.onKeyDown || props.onKeyPress || props.onKeyUp;

    return (
        <input
            ref={ref}
            // id={`${id}`}
            className={`${className}`}
            label={`${label}`}
            type={`${type}`}
            ref={props.reference}
            checked={(props.checked === 'true' || props.checked === true) ? true : ((props.checked === 'false' || props.checked === false) ? false : null)}
            placeholder={`${placeholder}`}
            onChange={props.onChange}
            onblur={props.onblur}
            value={props.value}
            //readOnly={syntheticEvent ? false : true}
            {...props}
        />
    );
}
)