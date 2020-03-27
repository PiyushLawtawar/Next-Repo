import React from 'react';
import { withRouter } from 'next/router';
import { parentContext } from '../../client/contexts/parentContext';
import AirTime from '../../client/components/templates/AirTimeRecharge/airTime';

export default withRouter((props) => {
    return (
        <parentContext.Consumer>
            {({ loginDetails,headerData,data ,configurationData }) => {
                return (
                    <React.Fragment>
                        <AirTime
                            loginDetails={loginDetails}
                            headerData ={headerData}
                            props={props}
                            data={data}
                            configurationData={configurationData}
                        />
                    </React.Fragment>
                )
            }
            }
        </parentContext.Consumer>
    );
});