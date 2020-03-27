import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
//import './Link.styl';

export default ({ href, asInfo, classNameAnchor, ...props }) => {
    let prefetchFalse = {};
    if(href && (href === "#" || typeof href === "undefined")){
          href = "javascript:void(0)";
          prefetchFalse = { prefetch: false };
    }
    let myProps = props;
    let myOnClick = props.onClick;
    delete myProps.onClick;
    
    return (
        <React.Fragment>
            {!isEmpty(asInfo) && myProps.prefetch === false ?
                      <Link href={href} as={asInfo} prefetch={false}>
                            <a className={classNameAnchor}>
                                {props.children} 
                            </a>
                      </Link>
                      :
                      !isEmpty(asInfo) ?
                      <Link href={href} as={asInfo}>
                            <a className={classNameAnchor}>
                                {props.children} 
                            </a>
                      </Link> : null

                
            }
            {isEmpty(asInfo) && href && myProps.prefetch === false ?
                <Link href={href} prefetch={false}>
                    <a {...myProps} onClick={(e) => { if(typeof myOnClick === "function") { if(href === "javascript:void(0)"){ e.preventDefault(); } myOnClick(e)}} }>
                        {props.children}
                    </a>
                </Link>:
                isEmpty(asInfo) && href  ?

                 <Link href={href} {...prefetchFalse}>
                    <a {...myProps} onClick={(e) => { if(typeof myOnClick === "function") { if(href === "javascript:void(0)"){ e.preventDefault(); } myOnClick(e)}} }>
                       {props.children}
                    </a>
                </Link> : null
            }
            {isEmpty(asInfo) && !href &&
                <React.Fragment>
                    <a {...myProps}  onClick={(e) => { if(typeof myOnClick === "function") { if(href === "javascript:void(0)"){ e.preventDefault(); } myOnClick(e)}} } style={props.style || {cursor:'pointer'}}>
                        {props.children}
                    </a>
                </React.Fragment>
            }
        </React.Fragment>
    );
}
