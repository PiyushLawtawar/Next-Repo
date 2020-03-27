import BoxTitle from '../../molecules/BoxTitle/BoxTitle';
import Alert from '../../molecules/Alert/Alert';
import MoleculeformUpdatePersonalData from '../../molecules/FormUpdatePersonalData/molecule-formUpdatePersonalData';

class OrganismupdatePersonalData extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
       
        const staticLabels = this.props.staticLabels;
        return (
            <div className="col-lg-9 m-column_mainContent">
                <div className="o-box -forms ">
                    <MoleculeformUpdatePersonalData staticLabels={staticLabels} />
                </div>
            </div>
        )
    }
}
export default OrganismupdatePersonalData;