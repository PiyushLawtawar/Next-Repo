import React from 'react';
import isEmpty from 'lodash/isEmpty';
import MaterialSelect from '../../molecules/MaterialSelect/MaterialSelect';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import MaterialInputRadio from '../../molecules/MaterialInputRadio/MaterialInputRadio';
import get from 'lodash/get';
//import './PdpProductHybrid.styl'

const getOptionList = function (option) {
    //start of 23819
    let fullOption = [];
    let leftOption = [];
    let resultOption = option.length && option.length > 0 && option.map(item => {
        let itemArray = item.split('|');
        return { "name": itemArray[0], "imageUrl": itemArray[1], "status": itemArray[2], "value": itemArray[5], "selected":itemArray[5] == "Active" ? "selected":"" }
    })
    if (resultOption && resultOption.length && resultOption.length > 0){
       for(let k in resultOption){
           if(resultOption[k]['status'] ==='Active'){
            fullOption.push(resultOption[k]) 
           }else{
            leftOption.push(resultOption[k])  
           }           
       }       
       leftOption.sort((a,b) => (a.name > b.name)? 1: -1 ) ;
       for(let ii in leftOption){
        fullOption.push(leftOption[ii]) 
       }
    }
    return fullOption
    //end of 23819
};

const generateRadioList = function (option, price="", fisico,Descarga) {
let disableoption = '',splitoneoption ='',disableRadio=false;
    if(option && option.length == '1') {
       splitoneoption=option[0].split('|');
       splitoneoption[0] == 'Physical' ? disableoption = 'Digital' : disableoption = 'Physical'
       disableRadio=true
        option.push(disableoption+"|null|null|null|2|null||||"+disableRadio)
       
    }
    let resultRadioButton = option && option.length && option.length > 0 && option.map((item, key) => {
       
        let itemArray = item.split('|');
        itemArray[3] =   (itemArray[3] != 'null') ? " $"+itemArray[3] : '';
        let hybridType = `${itemArray[0] == "Physical" ? fisico:itemArray[0]}${itemArray[0] == "Digital" ? itemArray[3] : itemArray[3]}`
        return { "labelText": hybridType ,labelTextSpan:itemArray[0] == "Digital" ? Descarga:"" ,"active": itemArray[2] === 'Active' && true, "amount": itemArray[3], "inputId": itemArray[5], "nameInput": "delivery", "radioId": `delivery${key}`,"labelClass":itemArray[0] == "Digital" ? "o-pdp__productDigital--Down":'',"labelSpanClass":"o-product__digitalType","disabled": itemArray[9] ? true : false}
    })
       if(resultRadioButton.length === 2) {
        const digitalLabel = resultRadioButton[0].labelText || '';
        if(digitalLabel.indexOf('Digital') >= 0) {
            let tmpObj = resultRadioButton[0];
            resultRadioButton[0] = resultRadioButton[1];
            resultRadioButton[1] = tmpObj;
        }
    }
    
    return resultRadioButton
}

export default (props) => {
    let hybridData = get(props.mainContent, "endecaProductInfo.contents[0].mainContent[0].record.attributes", {})
    let platformOption = hybridData.platform || []
    let editionOption = hybridData.edition || ""
    let bmpOption = hybridData.bmp || ""
    let validityOption = hybridData.validity || ""
    let licenseOption = hybridData.license || ""
    let languageOption = hybridData.language  || ""
    let formatOption = hybridData.format  || ""
    let labelText = props.staticLabels //get(props.mainContent, "staticLabels.staticLabelValues[0].keyValues", "") /*changes made for Pdp staticlabel issue start */
    let radioModeOption = hybridData.deliveryMode  || ""
    let fisico = labelText["pdpPage.PhysicalHeader.label"] || "Fisico"
    let Descarga = labelText["pdpPage.DigitalProduct.label"] || "pdpPage.DigitalProduct.label"
  
    let price = get(props, "priceToShow.price.discount.val", "")
    let radioMode = radioModeOption != "" && generateRadioList(radioModeOption, price, fisico,Descarga)
    
    let platform = {
        labelText: labelText['pdpPage.PlatformHeader.label'],
        labelId: 'platform',
        selected: true,
        optionList:  getOptionList(platformOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }
    let edition = {
        labelText: labelText['pdpPage.EditionHeader.label'],
        labelId: 'edition',
        selected: true,
        optionList: getOptionList(editionOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }
    let bmp = {
        labelText: labelText['pdpPage.FormatHeader.label'],
        labelId: 'bmp',
        selected: true,
        optionList: getOptionList(formatOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }
    let validity = {
        labelText: labelText['pdpPage.ValidityHeader.label'],
        labelId: 'validity',
        selected: true,
        optionList: getOptionList(validityOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }
    let license = {
        labelText: labelText['pdpPage.LicenseHeader.label'],
        labelId: 'license',
        selected: true,
        optionList: getOptionList(licenseOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }
    let language = {
        labelText: labelText['pdpPage.LanguageHeader.label'],
        labelId: 'language',
        selected: true,
        optionList: getOptionList(languageOption),
        pdpType:"hybrid",
        removeEmptyOption:true
    }

    // console.log()

    return (
        <React.Fragment>
            <div className="row o-product__optionsHybrid">
                {!isEmpty(platform.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                    <MaterialSelect options={platform} handleChange={props.getHybridPDPData} />
                </div>
                }
                {!isEmpty(edition.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                    <MaterialSelect options={edition} handleChange={props.getHybridPDPData} />
                </div>
                }
                 {!isEmpty(bmp.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                   <MaterialSelect options={bmp} handleChange={props.getHybridPDPData} />
                </div>
                 }
                {!isEmpty(validity.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                    <MaterialSelect options={validity} handleChange={props.getHybridPDPData} />
                </div>
                }
                {!isEmpty(license.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                    <MaterialSelect options={license} handleChange={props.getHybridPDPData} />
                </div>
                }
                {!isEmpty(language.optionList) &&
                <div className="col-12 col-lg-6 o-product__optionsHybrid--MarginBottom">
                    <MaterialSelect options={language} handleChange={props.getHybridPDPData} />
                </div>
                }
            </div>
            <div className="row">
                <div className="col-12">
                    <Paragraph className="a-product__paragraphProductDownloadable">Tipo de compra:</Paragraph>
                </div>
                <div className="col-12 hybridradio">
                    {radioMode && radioMode.map((item,i) => {
                        return <MaterialInputRadio key={i} options={item} handleClick={props.getHybridPDPData} />
                    })}
                </div>
            </div>
           {/* {props.productType == "Digital" ? <a className="a-product__anchorProductDownloadCode" href="#" data-toggle="modal" data-target="#download-modal"><span className="m0">¿Cómo funcionan los códigos de descarga?</span><i className="icon-help a-pdpHybrid_icon"></i></a>: ""} */}
        </React.Fragment>
    );
}