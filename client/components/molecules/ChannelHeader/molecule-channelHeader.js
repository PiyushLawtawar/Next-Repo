import React, { Component, Fragment } from 'react';
import Image from '../../atoms/Tagimage/Image';
import { parentContext } from '../../../contexts/parentContext'
// import ChannelHeader from '../../../components/molecules/ChannelHeader/MoleculeChannelHeader';



class MoleculeChannelHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <parentContext.Consumer>
                <React.Fragment>
                    <div className="m-channelHeader container col-12 a-channel__header">          
                        {/*<img src="../../../assets/images/atomo-icono-chanel-regular-mobile.svg" alt="chanel"></img>*/}
                        <h1>fkgvlflkkl
                            </h1>
                    </div>
                </React.Fragment>
            </parentContext.Consumer>
        )
    }
}
export default MoleculeChannelHeader;








