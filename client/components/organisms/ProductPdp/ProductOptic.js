import React from 'react';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import { ParagraphSameLevelBlockSpan } from '../../molecules/MixinMolecules/MixinMolecules';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            opticsPower: [], rgtopticsDiameter: [], rgtopticsBaseCurve: [], rgtopticsAxis: [], rgtopticsCylinder: [],
            opticsPower: [], lftopticsDiameter: [], lftopticsBaseCurve: [], lftopticsAxis: [], lftopticsCylinder: [],
            opticsPowerValue: "",
            iconClassRgt: "a-icon__opticOk -left icon-done", iconClassLeft: "a-icon__opticOk -left icon-done"
        }

        this.opticsPower = React.createRef();
        this.opticsDiameter = React.createRef();
        this.opticsBaseCurve = React.createRef();
        this.opticsAxis = React.createRef();
        this.opticsCylinder = React.createRef();
        this.productVarientsInfo = props && props.productDetails && props.productDetails.productVarientsInfo || {}
        this.labelTextObj = { opticsPower: "Poder (Pwr)", opticsBaseCurve: "Curva Base", opticsDiameter: "Adición", opticsAxis: "Eje", opticsCylinder: "Cilindro (Cyl)" }
    }

    getOpticList = (productVarientsInfo = this.productVarientsInfo, selectedValue = "", filterCriteria = "", bindingChild = "", side = "") => {

        let options = {
            pdpType: this.props.pdpType,
            labelText: this.labelTextObj[bindingChild],
            popoverContent: `Contenido del popover de ${this.labelTextObj[bindingChild]}`,
            custom: true,
            items: [],
            removeEmptyOption: true
        }
        let skewValue = productVarientsInfo.skuAttributeMap && Object.values(productVarientsInfo.skuAttributeMap) || []

        let skuValueFiltered = (selectedValue != "" && skewValue.length >= 1) ? skewValue.filter((eachSku) => eachSku[`ListingPage.${filterCriteria}.label`] == selectedValue) : skewValue
        if (bindingChild != "") {
            let powerList = skuValueFiltered.length >= 1 ? skuValueFiltered.map((eachSku) => {
                return {
                    "active": false,
                    "inputId": eachSku[`ListingPage.${bindingChild}.label`],
                    "value": eachSku[`ListingPage.${bindingChild}.label`],
                    "name": eachSku[`ListingPage.${bindingChild}.label`],
                }
            }) : []
            let uniqOpticList = powerList.map(e => e["value"]).map((e, j, final) => final.indexOf(e) === j && j).filter(e => powerList[e]).map(e => powerList[e]);
            options.items = uniqOpticList;
            for (let eachState in this.labelTextObj) {
                if (Object.keys(this.labelTextObj).indexOf(bindingChild) <= Object.keys(this.labelTextObj).indexOf(eachState))
                    this.state[side + eachState] = { items: [] }
            }

            this.setState({ [side + bindingChild]: options, opticsPowerValue: selectedValue })
        }

        let totalSelectedItemsLft = [];
        let totalSelectedItemsRgt = [];


        [...document.getElementsByClassName("lft")[0].getElementsByTagName("select")].forEach(
            (element, index, array) => {
                element.options[element.selectedIndex].value != "Selecciona" && totalSelectedItemsLft.push({ [element.id]: element.options[element.selectedIndex].value })
            }
        );
        [...document.getElementsByClassName("rgt")[0].getElementsByTagName("select")].forEach(
            (element, index, array) => {
                element.options[element.selectedIndex].value != "Selecciona" && totalSelectedItemsRgt.push({ [element.id]: element.options[element.selectedIndex].value })
            }
        );
        let opticDataSelected = {};


        if (totalSelectedItemsLft.length == 5) {

            opticDataSelected["Ojo Izquierdo"] = totalSelectedItemsLft;
            opticDataSelected["SkuPriceLft"] = this.getPriceLogic(skewValue, totalSelectedItemsLft, productVarientsInfo.skuAttributeMap)
            this.setState({ iconClassLeft: "a-icon__opticOk -left icon-done visible" });
        }
        else {
            if (this.state.iconClassLeft == "a-icon__opticOk -left icon-done visible")
                this.setState({ iconClassLeft: "a-icon__opticOk -left icon-done" })
        }

        if (totalSelectedItemsRgt.length == 5) {
            opticDataSelected["Ojo Derecho"] = totalSelectedItemsRgt;
            let skuPrice = this.getPriceLogic(skewValue, totalSelectedItemsRgt, productVarientsInfo.skuAttributeMap);
            opticDataSelected["SkuPriceRgt"] = !Object.keys(skuPrice).length ? opticDataSelected["SkuPrice"] : skuPrice
            this.setState({ iconClassRgt: "a-icon__opticOk -left icon-done visible" })
        }
        else {
            if (this.state.iconClassRgt == "a-icon__opticOk -left icon-done visible")
                this.setState({ iconClassRgt: "a-icon__opticOk -left icon-done" })
        }

        if (totalSelectedItemsRgt.length < 5 && totalSelectedItemsLft.length < 5) {
            opticDataSelected["SkuPriceLft"] = {}
            opticDataSelected["SkuPriceRgt"] = {}
        }


        (opticDataSelected["Ojo Izquierdo"] || opticDataSelected["Ojo Derecho"] || opticDataSelected["SkuPriceLft"] || opticDataSelected["SkuPriceRgt"]) && this.props.updateOpticData(opticDataSelected);
    }
    getPriceLogic = (skewValue, totalSelectedItems, skuAttributeMap) => {

        skewValue = [
            {
                "salePrice": "599.0",
                "texture": "LISO",
                "sizeSequence": "9999",
                "ListingPage.opticsPower.label": "89",
                "ListingPage.opticsColor.label": "95",
                "ListingPage.opticsDiameter.label": "555",
                "promoPrice": "599.0",
                "dimensionVariant": "FALSE",
                "material": "MEZCLILLA",
                "ListingPage.opticsAxis.label": "78",
                "ListingPage.opticsCylinder.label": "23",
                "listPrice": "599.0",
                "ListingPage.opticsBaseCurve.label": "555"
            },
            {
                "salePrice": "699.0",
                "texture": "LISO",
                "sizeSequence": "9999",
                "ListingPage.opticsPower.label": "121",
                "ListingPage.opticsColor.label": "788",
                "ListingPage.opticsDiameter.label": "888",
                "promoPrice": "699.0",
                "dimensionVariant": "FALSE",
                "material": "MEZCLILLA",
                "ListingPage.opticsAxis.label": "122121",
                "ListingPage.opticsCylinder.label": "12121",
                "listPrice": "699.0",
                "ListingPage.opticsBaseCurve.label": "8888"
            },
            {
                "salePrice": "599.0",
                "texture": "LISO",
                "sizeSequence": "9999",
                "ListingPage.opticsPower.label": "99",
                "ListingPage.opticsColor.label": "777",
                "ListingPage.opticsDiameter.label": "489",
                "promoPrice": "599.0",
                "dimensionVariant": "FALSE",
                "material": "MEZCLILLA",
                "ListingPage.opticsAxis.label": "77"
                , "ListingPage.opticsCylinder.label": "36",
                "listPrice": "599.0",
                "ListingPage.opticsBaseCurve.label": "987"
            }
        ]

        let SkuPrice = {}
        for (let sku in skuAttributeMap) {

            let skuid = ""
            let skuData = skuAttributeMap[sku];
            let matched = skuData[`ListingPage.opticsPower.label`] == totalSelectedItems[0].Pwl
                && skuData[`ListingPage.opticsBaseCurve.label`] == totalSelectedItems[1].Bcu
                && skuData[`ListingPage.opticsDiameter.label`] == totalSelectedItems[2].Dmt
                && skuData[`ListingPage.opticsAxis.label`] == totalSelectedItems[3].Axi
                && skuData[`ListingPage.opticsCylinder.label`] == totalSelectedItems[4].Cyl && skuData || ""
            skuid = matched != "" ? sku : ""
            SkuPrice = matched != "" && {
                list: matched.listPrice,
                sale: matched.salePrice,
                promo: matched.promoPrice,
                skuid: sku,
                numRecords: 1
            } || {};
            if (skuid != "") break;
        }
        return SkuPrice
    }
    componentDidMount() {
        this.getOpticList(this.productVarientsInfo, "", "", "opticsPower")
    }
    render() {
        const { opticsPower, rgtopticsBaseCurve, lftopticsBaseCurve, rgtopticsDiameter, lftopticsDiameter, rgtopticsAxis, lftopticsAxis, rgtopticsCylinder, lftopticsCylinder } = this.state
        return (

            <div className="row o-product__optionsOptic mt-4">
                <div className="col-12">
                    <Paragraph className="a-product__opticLabel">Select the graduation of your lenses</Paragraph>
                </div>
                <div className="col-6 mt-1 lft">

                    <ParagraphSameLevelBlockSpan iconClass={this.state.iconClassLeft} pclass="a-product__opticSelect" ptext="Ojo Izquierdo" spanClass="a-product__opticRequired" spanText="¿Qué graduación es?" />

                    <div className="m-product__optionsOpticContainer">
                        {opticsPower && opticsPower.items && opticsPower.items.length && opticsPower.items.length >= 1 ? <> <MaterialSelect refs={this.opticsPower} optionsName="" optionsId="Pwl" options={opticsPower} value={this.state.opticsPowerValueopticsPowerValue} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsPower", "opticsBaseCurve", "lft")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}

                        {(lftopticsBaseCurve && lftopticsBaseCurve.items && lftopticsBaseCurve.items.length && lftopticsBaseCurve.items.length >= 1) ? <> <MaterialSelect optionsId="Bcu" refs={this.opticsBaseCurve} options={lftopticsBaseCurve} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsBaseCurve", "opticsDiameter", "lft")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(lftopticsDiameter && lftopticsDiameter.items && lftopticsDiameter.items.length && lftopticsDiameter.items.length >= 1) ? <> <MaterialSelect optionsId="Dmt" refs={this.opticsDiameter} options={lftopticsDiameter} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsDiameter", "opticsAxis", "lft")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(lftopticsAxis && lftopticsAxis.items && lftopticsAxis.items.length && lftopticsAxis.items.length >= 1) ? <> <MaterialSelect optionsId="Axi" refs={this.opticsAxis} options={lftopticsAxis} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsAxis", "opticsCylinder", "lft")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(lftopticsCylinder && lftopticsCylinder.items && lftopticsCylinder.items.length && lftopticsCylinder.items.length >= 1) ? <> <MaterialSelect optionsId="Cyl" refs={this.opticsCylinder} options={lftopticsCylinder} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsCylinder", "", "lft")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}

                    </div>
                </div>
                <div className="col-6 mt-1 rgt">
                    <ParagraphSameLevelBlockSpan iconClass={this.state.iconClassRgt} pclass="a-product__opticSelect" ptext="Ojo Derecho" spanClass="a-product__opticRequired" spanText="¿Qué graduación es?" />
                    <div className="m-product__optionsOpticContainer">
                        {(opticsPower && opticsPower.items && opticsPower.items.length && opticsPower.items.length >= 1) ? <> <MaterialSelect optionsId="Pwl" refs={this.opticsPower} options={opticsPower} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsPower", "opticsBaseCurve", "rgt")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(rgtopticsBaseCurve && rgtopticsBaseCurve.items && rgtopticsBaseCurve.items.length && rgtopticsBaseCurve.items.length >= 1) ? <> <MaterialSelect optionsId="Bcu" refs={this.opticsBaseCurve} options={rgtopticsBaseCurve} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsBaseCurve", "opticsDiameter", "rgt")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(rgtopticsDiameter && rgtopticsDiameter.items && rgtopticsDiameter.items.length && rgtopticsDiameter.items.length >= 1) ? <> <MaterialSelect optionsId="Dmt" refs={this.opticsBaseCurve} options={rgtopticsDiameter} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsDiameter", "opticsAxis", "rgt")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(rgtopticsAxis && rgtopticsAxis.items && rgtopticsAxis.items.length && rgtopticsAxis.items.length >= 1) ? <> <MaterialSelect optionsId="Axi" refs={this.opticsAxis} options={rgtopticsAxis} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsAxis", "opticsCylinder", "rgt")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                        {(rgtopticsCylinder && rgtopticsCylinder.items && rgtopticsCylinder.items.length && rgtopticsCylinder.items.length >= 1) ? <> <MaterialSelect optionsId="Cyl" refs={this.opticsCylinder} options={rgtopticsCylinder} handleChange={(e) => this.getOpticList(this.productVarientsInfo, e, "opticsCylinder", "", "rgt")} />
                            <div class="m-mdc__selectHelper mdc-select-helper-line m-material_select-helper_line">
                                <p class="mdc-select-helper-text mdc-select-helper-text--validation-msg mdc-select-helper-text--persistent a-mdc__selectHelper" aria-hidden="true">
                                </p>
                            </div> </> : null}
                    </div>
                </div>
            </div>
        );
    }


}

