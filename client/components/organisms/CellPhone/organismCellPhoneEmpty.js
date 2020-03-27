import MoleculeCellPhoneEmpty from '../../molecules/CellPhone/MoleculeCellPhoneEmpty';

class CellPhoneEmpty extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="col-lg-9 m-column_mainContent">
      <div className="o-box d-lg-block o-myAccount__cellphone -empty">
        <MoleculeCellPhoneEmpty />
        </div>
      </div>
    );
  }
}
export default CellPhoneEmpty;
