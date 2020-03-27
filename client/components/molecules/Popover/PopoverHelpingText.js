//import './Popover.styl';
import Router from 'next/router';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';


class PopoverHelpingText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let arrowPosition = {
      left: this.props.arrowPosition//"107px"
    }
    let popoverPosition = {
      transform: this.props.popoverPosition
    }
    return (
      <div className={`${"popover fade show bs-popover-top"} ${this.props.showPopoverList ? " show" : "d-none"}`} style={popoverPosition}>
        <div className="arrow" style={arrowPosition}></div>
        <h3 className="popover-header"></h3>
        <div className="popover-body">{this.props.PopoverText ? this.props.PopoverText : " "}</div>
      </div>
    );

  }
}

export default PopoverHelpingText;


