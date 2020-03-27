import './organismCellPhone.styl';
import MoleculeCellPhone from '../../molecules/CellPhone/MoleculeCellPhone';

class CellPhone extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
      <div className="o-box d-lg-block o-myAccount__cellphone">
          <MoleculeCellPhone staticLabels={this.props.staticLabels}/>
      </div>
    );
  }
}
export default CellPhone;





