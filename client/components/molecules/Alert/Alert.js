
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icons from "../../atoms/Icons/Icons";
import { AlertAction } from '../../molecules/MixinMolecules/MixinMolecules';

//import './Alert.styl'


export default (props) => {
  let airTimeStyleCSS = {
    top: props.airTimeStyle
  }
  const extraClass = (props.fromPDP && props.fromPDP === 'true') ? '' : ' -toTop';

  return (
    <div className={props.alertTopClass + (props.alert_status ? ' mdc-snackbar--open' : extraClass)} style={props.airTimeStyle && airTimeStyleCSS}>
      <div className="m-mdc__snackbarSurface mdc-snackbar__surface">
        <div className="m-mdc__snackbarLabel mdc-snackbar__label" role="status" aria-live="polite">{props.text}</div>
        <div className="m-mdc__snackbarActions mdc-snackbar__actions">
          <AlertAction
            className={props.className}
            TypeclassName="icon-close mdc-snackbar__dismiss"
            onClick={props.dismiss_alert}
            title={props.title}
            iconType={props.iconType}
          />
        </div>
      </div>
    </div>

  );
}