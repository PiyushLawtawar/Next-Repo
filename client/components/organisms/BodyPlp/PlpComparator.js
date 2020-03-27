import React from 'react';
import Button from "../../atoms/Button/Button";
import Headlines from "../../atoms/HeadLines/Headlines";
import Icons from "../../atoms/Icons/Icons";
import Span from "../../atoms/Span/Span";
import Comparator from '../Comparator/comparator';

//import './BodyPlp.styl';

export default (props) => {
    return (
        <React.Fragment>
            <div className="row d-none d-lg-block">
                <div className="col-12 p-2 pt-4 p-lg-1">
                    <div className="card-columns o-listing__compare">
                        {props.renderCards}
                    </div>
                </div>
            </div>
            <div className="row mt-4 d-none d-lg-block mb-5">
                <div className="col-12 pt-4 pl-1 pr-1">
                    <Comparator {...props} handleShowOnlyDiff={props.handleShowOnlyDiff} showOnlyDifferences={props.showOnlyDifferences} />
                </div>
            </div>
        </React.Fragment>
    )
}