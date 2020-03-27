//import './AlertsOnModal.styl'

export default (props) => {
  const { showAlert = false, alertType = '', alertText = '', alertClass = ''} = props.options || {};
  return (
    <div className="row">
      <div className="col-12">
        <div className={`${alertClass} ${alertType}` + (showAlert? ' show':'')}>{alertText}</div>
      </div>
    </div>
  );
}