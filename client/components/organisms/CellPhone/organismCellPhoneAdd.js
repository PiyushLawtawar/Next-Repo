import OrganismCellPhoneAddForm from '../../organisms/CellPhone/organismCellPhoneAddForm';
import BoxTitle from '../../molecules/BoxTitle/BoxTitle';

class OrganismCellPhoneAdd extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    const staticLabels = this.props.staticLabels;
    return (
      <div className="col-lg-9 m-column_mainContent">
        <div className="o-box -forms o-myAccount__cellphoneEdit">
          <BoxTitle icon={false} classe="m-0 a-box-title--forms" headLineText={staticLabels && staticLabels["pwa.breadcrum.addPhone.label"]}/>
          <OrganismCellPhoneAddForm staticLabels={staticLabels}/>
        </div>
      </div>
    );
  }
}
export default OrganismCellPhoneAdd;
