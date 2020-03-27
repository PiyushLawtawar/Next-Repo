
import React from 'react';
import Icons from '../../atoms/Icons/Icons';
import Popover from "../../molecules/Popover/PopoverHelpingText";
import CustomTooltip from '../../atoms/CustomTooltip/CustomTooltip';
// import './moleculeProgressBar.styl'

class MoleculeProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dynamic_popover_status_obj: {},
        }
    }

    mouseOverLinks = (key) => {
        const { dynamic_popover_status_obj } = this.state;
        dynamic_popover_status_obj[key] = true;
        this.setState({ dynamic_popover_status_obj })
    }

    mouseOutLinks = (key) => {
        const { dynamic_popover_status_obj } = this.state;
        dynamic_popover_status_obj[key] = false;
        this.setState({ dynamic_popover_status_obj })
    }
    render() {
        const { dynamic_popover_status_obj } = this.state;
        const messages = '';
        const commerceItems = this.props.orderSearched;
        const SomsDatacommerceItems = this.props.SomsData;
        const router = this.props.router;
        const isSomsOrder = router && router.isSomsOrder;
        const staticLabels=this.props.staticLabels;
        // console.log('staticLabels', staticLabels)
       const somscurrentStatus = 'Stage2';  //24036 starts here
        const currentStatus = commerceItems && commerceItems[0].currentStatus || SomsDatacommerceItems && SomsDatacommerceItems.itemStatus;
       let completes = 0;
      if(isSomsOrder && SomsDatacommerceItems){
           if(currentStatus !== undefined && SomsDatacommerceItems.stage4 ===currentStatus){
            completes = 4;
        }else if(currentStatus !== undefined && SomsDatacommerceItems.stage3 ===currentStatus){
            completes = 3;
        }else if(currentStatus !== undefined && SomsDatacommerceItems.stage2 ===currentStatus){
            completes = 2;
        }else if(currentStatus !== undefined && SomsDatacommerceItems.stage1 ===currentStatus){
            completes = 1
        }
      /*  if(SomsDatacommerceItems.stage4Date){
            completes = 4;
        }else if(SomsDatacommerceItems.stage3Date){
            completes = 3;
        }else if(SomsDatacommerceItems.stage2Date){
            completes = 2;
        }else if(SomsDatacommerceItems.stage1Date){
            completes = 1
        }*/  //24036 ends here
      }else {
        if(currentStatus === 'Stage1'){
            completes = 1;
        }else if(currentStatus === 'Stage2'){
            completes = 2;
        }else if(currentStatus === 'Stage3'){
            completes = 3;
        }else if(currentStatus === 'Stage4'){
            completes = 4
        }
      }

        const progressOptions = this.props.progressOptions || {};
        return (
           <React.Fragment>
                <div className="d-none d-lg-block">
                    <ul className="o-progressBar__indicator o-progressBar">
                            <li className={completes > 0 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleL"></span>
                                <div className="m-progressBar__divStatusIcon">
                                    <div className="m-progressBar__divStatus">
                                        <span className="a-progressBar__itemName">{commerceItems && commerceItems[0].stage1 ? commerceItems && commerceItems[0].stage1 : SomsDatacommerceItems && SomsDatacommerceItems.stage1}</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed1" onMouseOver={() => this.mouseOverLinks('session_panel1')} onMouseOut={() => this.mouseOutLinks('session_panel1')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking1"  
                                            />
                                         {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel1']} PopoverText={'!Tú pedido ya esta en proceso! Estamos validando tu compra y el inventario.'} arrowPosition={'107px'} popoverPosition="translate3d(109px, -55px, 0px)" />*/}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking1"
                                                trigger="hover"
                                                content={commerceItems && commerceItems[0].giftRegistryEventNumber ? "¡Tu regalo ha sido confirmado!, te mostraremos el avance de su envío" : "¡Tú pedido ya esta en proceso! Estamos validando tu compra y el inventario."}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                boxClass="">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divStatusDate">
                                    <span className="a-progressBar__date a-progressBar__itemName">{commerceItems && commerceItems[0].stage1Date ? commerceItems && commerceItems[0].stage1Date : SomsDatacommerceItems && SomsDatacommerceItems.stage1Date}</span>
                                </div>
                            </li>
                            <li className={completes > 1 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleC"></span>
                                <div className="m-progressBar__divStatusIconC">
                                    <div className="m-progressBar__divStatusC">
                                        <span className="a-progressBar__itemName">{commerceItems && commerceItems[0].stage2 ? commerceItems && commerceItems[0].stage2 : SomsDatacommerceItems && SomsDatacommerceItems.stage2}</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed2" onMouseOver={() => this.mouseOverLinks('session_panel2')} onMouseOut={() => this.mouseOutLinks('session_panel2')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking2"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel2']} PopoverText={'Estamos recolectando tu pedido para la entrega.'} arrowPosition={'107px'} popoverPosition="translate3d(79px, -35px, 0px)" /> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking2"
                                                trigger="hover"
                                                content={staticLabels && staticLabels["pwa.lineItemPage.EstamosTooltip3.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                boxClass="">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divStatusDateC">
                                    <span className="a-progressBar__date a-progressBar__itemName">{commerceItems && commerceItems[0].stage2Date? commerceItems && commerceItems[0].stage2Date : SomsDatacommerceItems && SomsDatacommerceItems.stage2Date}</span>
                                </div>
                            </li>
                            <li className={completes > 2 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleC"></span>
                                <div className="m-progressBar__divStatusIconC">
                                    <div className="m-progressBar__divStatusC">
                                        <span className="a-progressBar__itemName">{commerceItems && commerceItems[0].stage3 ? commerceItems && commerceItems[0].stage3 : SomsDatacommerceItems && SomsDatacommerceItems.stage3 }</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed3"  onMouseOver={() => this.mouseOverLinks('session_panel3')} onMouseOut={() => this.mouseOutLinks('session_panel3')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking3"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel3']} PopoverText={'Tu pedido esta listo, ya puedes pasar por el en nuestro módulo de Click & Collect'} arrowPosition={'107px'} popoverPosition="translate3d(79px, -55px, 0px)" /> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking3"
                                                trigger="hover"
                                                content={commerceItems && commerceItems[0].sellerName && commerceItems && commerceItems[0].sellerOperatorId ? 'Tu pedido ya salió y está en proceso de entrega.' : commerceItems && commerceItems[0].giftRegistryEventNumber ? 'Tu regalo ya salió y está en proceso de entrega.': staticLabels && staticLabels["pwa.lineItemPage.Click&CollectTooltip.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                boxClass="">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divStatusDateC">
                                    <span className="a-progressBar__date a-progressBar__itemName">{commerceItems && commerceItems[0].stage3Date ? commerceItems && commerceItems[0].stage3Date : SomsDatacommerceItems && SomsDatacommerceItems.stage3Date}</span>
                                </div>
                            </li>
                            <li className={completes > 3 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleR"></span>
                                <div className="m-progressBar__divStatusIconL">
                                    <div className="m-progressBar__divStatusL">
                                        <span className="a-progressBar__itemName">{commerceItems && commerceItems[0].stage4 ? commerceItems && commerceItems[0].stage4 : SomsDatacommerceItems && SomsDatacommerceItems.stage4 }</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed4"  onMouseOver={() => this.mouseOverLinks('session_panel4')} onMouseOut={() => this.mouseOutLinks('session_panel4')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking4"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel4']} PopoverText={'Liverpool agradece tu preferencia.'} arrowPosition={'158px'} popoverPosition="translate3d(3px, -35px, 0px)" /> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking4"
                                                trigger="hover"
                                                content={staticLabels && staticLabels["pwa.lineItemPage.preferenciaTooltip.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                boxClass="">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divStatusDateL">
                                    <span className="a-progressBar__date a-progressBar__itemName">{commerceItems && commerceItems[0].stage4Date ? commerceItems && commerceItems[0].stage4Date : SomsDatacommerceItems && SomsDatacommerceItems.stage4Date }</span>
                                </div>
                            </li>
                    </ul>
                </div>
                <div className="d-block d-lg-none">
                    <ul className="o-progressBar__indicator-mobile stacked o-progressBar">
                        <li className={completes > 0 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleC"></span>
                                {/*(class=progressOptions.completes ==1? ' a-progressBar__bubble__medium':'')*/}
                                <div className="m-progressBar__divStatusIcon--mobile">
                                    <div className="m-progressBar__divStatus--mobile">
                                        <span className="a-progressBar__itemName stacked-text">{commerceItems && commerceItems[0].stage1? commerceItems && commerceItems[0].stage1 : SomsDatacommerceItems && SomsDatacommerceItems.stage1 }</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed1m" onMouseOver={() => this.mouseOverLinks('session_panel1')} onMouseOut={() => this.mouseOutLinks('session_panel1')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking1_m"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel1']} PopoverText={'!Tú pedido ya esta en proceso! Estamos validando tu compra y el inventario.'} arrowPosition={'209px'} popoverPosition="translate3d(214px, -90px, 0px)"/>*/}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking1_m"
                                                trigger="click"
                                                content={commerceItems && commerceItems[0].giftRegistryEventNumber ? "¡Tu regalo ha sido confirmado!, te mostraremos el avance de su envío" : "¡Tú pedido ya esta en proceso! Estamos validando tu compra y el inventario."}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                borderColor="green"
                                                contentPadding="10px 15px"
                                                maxWidth="280px"
                                                boxClass="customBoxSizing">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divDate--mobile">
                                    <div className="m-progressBar__divDate2--mobile">
                                        <span className="a-progressBar__date a-progressBar__itemName m-progressBar__dateValue">{commerceItems && commerceItems[0].stage1Date ? commerceItems && commerceItems[0].stage1Date :SomsDatacommerceItems && SomsDatacommerceItems.stage1Date }</span>
                                    </div>
                                </div>
                            </li>
                        <li className={completes > 1 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleC"></span>
                                {/*(class=progressOptions.completes ==1? ' a-progressBar__bubble__medium':'')*/}
                                <div className="m-progressBar__divStatusIcon--mobile">
                                    <div className="m-progressBar__divStatus--mobile">
                                        <span className="a-progressBar__itemName stacked-text">{commerceItems && commerceItems[0].stage2 ? commerceItems && commerceItems[0].stage2 : SomsDatacommerceItems && SomsDatacommerceItems.stage2}</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed2m" onMouseOver={() => this.mouseOverLinks('session_panel2')} onMouseOut={() => this.mouseOutLinks('session_panel2')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking2_m"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel2']} PopoverText={'Estamos recolectando tu pedido para la entrega.'} arrowPosition={'205px'} popoverPosition="translate3d(216px, -87px, 0px)"/> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking2_m"
                                                trigger="click"
                                                content={staticLabels && staticLabels["pwa.lineItemPage.EstamosTooltip3.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                borderColor="green"
                                                contentPadding="10px 15px"
                                                maxWidth="280px"
                                                boxClass="customBoxSizing">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divDate--mobile">
                                    <div className="m-progressBar__divDate2--mobile">
                                        <span className="a-progressBar__date a-progressBar__itemName m-progressBar__dateValue">{commerceItems && commerceItems[0].stage2Date ? commerceItems && commerceItems[0].stage2Date : SomsDatacommerceItems && SomsDatacommerceItems.stage2Date }</span>
                                    </div>
                                </div>
                            </li>
                        <li className={completes > 2 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubble a-progressBar__bubbleC"></span>
                                {/*(class=progressOptions.completes ==1? ' a-progressBar__bubble__medium':'')*/}
                                <div className="m-progressBar__divStatusIcon--mobile">
                                    <div className="m-progressBar__divStatus--mobile">
                                        <span className="a-progressBar__itemName stacked-text">{commerceItems && commerceItems[0].stage3 ? commerceItems && commerceItems[0].stage3 : SomsDatacommerceItems && SomsDatacommerceItems.stage3 }</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed3m" onMouseOver={() => this.mouseOverLinks('session_panel3')} onMouseOut={() => this.mouseOutLinks('session_panel3')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking3_m"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel3']} PopoverText={'Tu pedido esta listo, ya puedes pasar por el en nuestro módulo de Click & Collect'} arrowPosition={'195px'} popoverPosition="translate3d(221px, -86px, 0px)"/> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking3_m"
                                                trigger="click"
                                                content={commerceItems && commerceItems[0].sellerName && commerceItems && commerceItems[0].sellerOperatorId ? 'Tu pedido ya salió y está en proceso de entrega.' : commerceItems && commerceItems[0].giftRegistryEventNumber ? 'Tu regalo ya salió y está en proceso de entrega.': staticLabels && staticLabels["pwa.lineItemPage.Click&CollectTooltip.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                borderColor="green"
                                                contentPadding="10px 15px"
                                                maxWidth="280px"
                                                boxClass="customBoxSizing">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divDate--mobile">
                                    <div className="m-progressBar__divDate2--mobile">
                                        <span className="a-progressBar__date a-progressBar__itemName m-progressBar__dateValue">{commerceItems && commerceItems[0].stage3Date ? commerceItems && commerceItems[0].stage3Date : SomsDatacommerceItems && SomsDatacommerceItems.stage3Date }</span>
                                    </div>
                                </div>
                            </li>
                        <li className={completes > 3 ? "m-progressBar__completed" : ""}>
                                <span className="a-progressBar__bubbleLastMobile a-progressBar__bubbleC"></span>
                                <div className="m-progressBar__divStatusIcon--mobile">
                                    <div className="m-progressBar__divStatus--mobile">
                                        <span className="a-progressBar__itemName stacked-text">{commerceItems && commerceItems[0].stage4 ? commerceItems && commerceItems[0].stage4 : SomsDatacommerceItems && SomsDatacommerceItems.stage4 }</span>
                                    </div>
                                    <div className="m-progressBar__divIcon">
                                        <div className="m-progressBar_helper" id="idConfirmed4m" onMouseOver={() => this.mouseOverLinks('session_panel4')} onMouseOut={() => this.mouseOutLinks('session_panel4')}>
                                            <Icons className="icon-help a-progressBar__iconHelp AllTextPopover"
                                                id="helperTextPopoverTracking4_m"
                                            />
                                            {/* <Popover showPopoverList={dynamic_popover_status_obj['session_panel4']} PopoverText={'Liverpool agradece tu preferencia.'} arrowPosition={'202px'} popoverPosition="translate3d(212px, -46px, 0px)"/> */}
                                            <CustomTooltip
                                                tooltipFor="helperTextPopoverTracking4_m"
                                                trigger="click"
                                                content={staticLabels && staticLabels["pwa.lineItemPage.preferenciaTooltip.lable"]}
                                                position="top"
                                                fontSize="12px"
                                                arrowSize="7px"
                                                borderSize="1px"
                                                borderColor="green"
                                                contentPadding="10px 15px"
                                                maxWidth="280px"
                                                boxClass="customBoxSizing">
                                            </CustomTooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-progressBar__divDate--mobile">
                                    <div className="m-progressBar__divDate2--mobile">
                                        <span className="a-progressBar__date a-progressBar__itemName m-progressBar__dateValue">{commerceItems && commerceItems[0].stage4Date ? commerceItems && commerceItems[0].stage4Date : SomsDatacommerceItems && SomsDatacommerceItems.stage4Date }</span>
                                    </div>
                                </div>
                            </li>
                    </ul>
                </div>
            </React.Fragment>

        )
    }
}
export default MoleculeProgressBar;