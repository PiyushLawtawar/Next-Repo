
import Span from '../../atoms/Span/Span';
import Image from '../../atoms/Tagimage/Image';

class OrganismInvoiceTabs extends React.Component {
    constructor(props) {
        // console.log('..................OrganismInvoiceTabs...................', props)
        super(props);
        this.personTypeBtn = React.createRef();
        this.foreignBtn = React.createRef();
        this.activeContainerClass = 'o-invoice__tabs o-invoiceOptionContainer__selector--selected';
        this.inactiveContainerClass = 'o-invoiceOptionContainer__selector';
        this.activeSpanClass = 'a-invoiceOptionContainer__optionText--selected';
        this.inactiveSpanClass = 'a-invoiceOptionContainer__optionText';
    }
    render() {
        const options = this.props.options;
        return (
            <div className='row'>
                <div className={"col-12 p-2 " + options.classGeneralCol}>
                    <div className={"col-4 pr-0 pl-0 " + options.classBtns} id={options.Idbtn1}>
                        <div id="1" className={options.classContainers + ' ' + (this.props.showPhysicalOrMoralPersonFields === true ? this.activeContainerClass : this.inactiveContainerClass)} onClick={() => { this.props.selectedInvoiceTab('showPhysicalOrMoralPersonFields') }} ref={this.personTypeBtn}>
                            <Span id="1" spanClassname={this.props.showPhysicalOrMoralPersonFields === true ? this.activeSpanClass : this.inactiveSpanClass}>{options.spanText1}</Span>
                            <Span spanClassname={options.classTooltips}></Span>
                        </div>
                    </div>
                    <div className={"col-4 pr-0 pl-0 " + options.classBtns} id={options.Idbtn2}>
                        <div id="2" className={options.classContainers + ' ' + (this.props.showForeignFields === true ? this.activeContainerClass : this.inactiveContainerClass)} onClick={() => { this.props.selectedInvoiceTab('showForeignFields') }} ref={this.foreignBtn}>
                            <Span id="2" spanClassname={this.props.showForeignFields === true ? this.activeSpanClass : this.inactiveSpanClass}>{options.spanText2}</Span>
                            <Span spanClassname={options.classTooltips}></Span>
                        </div>
                    </div>
                    <div className={"col-4 pr-0 pl-0 " + options.classBtns} id={options.Idbtn3}>
                        <div id="3" className={options.classContainers + ' ' + (this.props.showCreditPropertyFields === true ? this.activeContainerClass : this.inactiveContainerClass)} onClick={() => { this.props.selectedInvoiceTab('showCreditPropertyFields') }}>
                            <Span id="3" spanClassname={this.props.showCreditPropertyFields === true ? this.activeSpanClass : this.inactiveSpanClass} onClick={this.showFields}>{options.spanText3}</Span>
                            <Span spanClassname={options.classTooltips}></Span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default OrganismInvoiceTabs;