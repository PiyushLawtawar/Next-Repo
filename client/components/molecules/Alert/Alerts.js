import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icons from "../../atoms/Icons/Icons";
import Link from '../../atoms/Link/Link';
import { AlertActionNew } from '../../molecules/MixinMolecules/MixinMolecules';

import './Alert.styl'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = { close: false }
  }
  componentDidMount() {
    const { type = '' } = this.props.options || {};
    let success = type.includes('-success')
    if (success) {
      setTimeout(() => {
        this.setState({ close: success });
      }, 5000)
    }
  }
  render() {

    const { type = '', text = '', pClass = '', iconType = '', id = '' ,step4alert='', link, alertToTop = ''} = this.props.options || {};

    return (
      <div className={`m-alert__container mdc-snackbar ${type} ${alertToTop} ${this.state.close ? 'd-none' : ''}`} id={id} style={this.props.style}>
        <div className={`mdc-snackbar__surface ${step4alert} `}>
          <div className="mdc-snackbar__label" role="status" aria-live="polite">
            <Paragraph className={pClass}>{text}</Paragraph>
            {link ?<a className="a-vendors__offerPrice ocm-link-wishlist" href={link}>Ir a mi lista de GUARDADO</a>:null}
          </div>
          <div className="mdc-snackbar__actions">
            <AlertActionNew iconType={iconType} onClick={() => this.setState({ close: !this.state.close })} />
          </div>
        </div>
      </div>
    );
  }
}