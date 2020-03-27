import OrganismCellPhoneEditForm from '../../organisms/CellPhone/organismCellPhoneEditForm';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';

class OrganismCellPhoneEdit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const staticLabels = this.props.staticLabels;
    return (
      <div className="col-lg-9 m-column_mainContent">
        <div className="o-box -forms o-myAccount__cellphoneEdit">
          <BoxTitle icon={false} classe="m-0 a-box-title--forms" headLineText={staticLabels && staticLabels["pwa.viewPhone.editar.label"]} />
           <OrganismCellPhoneEditForm staticLabels={staticLabels} />
        </div>
      </div>
    ); 
  }
}
export default OrganismCellPhoneEdit;