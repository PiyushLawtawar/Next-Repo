import React from 'react';
import get from 'lodash/get';
import Router from 'next/router';
import MoleculePersonalDataInfo from '../../molecules/PersonalDataInfo/moleculePersonalDataInfo';
class OrganismPersonalData extends React.Component {
  
    render() {
        const staticLabels = this.props.staticLabels;

        return (
            <div className="col-lg-9 m-column_mainContent">
                <div className="o-box -forms d-none d-lg-block">
                    <MoleculePersonalDataInfo staticLabels={staticLabels} />
                </div>
            </div>
        )
    }
}

export default OrganismPersonalData;
