//import './MixinMolecules.styl';
import React from 'react';
import Image from '../../atoms/Tagimage/Image';
import Link from '../../atoms/Link/Link';
import Label from '../../atoms/Label/Label';
import Icons from '../../atoms/Icons/Icons';
import Button from '../../atoms/Button/Button';
import Span from '../../atoms/Span/Span';
import Sup from '../../atoms/Sup/Sup';
import Input from '../../atoms/Input/Input';
import Strong from '../../atoms/Strong/Strong';
import { H1, H4 } from '../../atoms/HeadLines/Headlines';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { MenuMotion, ShowMotion } from '../../molecules/MenuMotion/MenuMotion';


export const Anchorimage = (props) => {

    return (
        <Link href={!isEmpty(props.href) ? props.href : '#'} onClick={() => {( props.handleClick ? props.handleClick() : null)}}>
            <Image className={props.headerlogo} src={props.src} />
        </Link>
    );
}

export const ParagraphAnchor = (props) => {

    return (
        <Paragraph className={props.classParagraph}>{props.textParagraph}
            <Link className={props.classAnchor} href={!isEmpty(props.href) ? props.href : '#'} {...props}>{props.textAnchor}</Link>
        </Paragraph>
    );
}
export const ParagraphIconSpan = (props) => {
    return (
        <Paragraph className={props.paragraphClass}>{props.paragraphText}
            <Icons className={props.iconClass} />
            <Span spanClassname={props.spanClass}>{props.spanText}</Span>
        </Paragraph>
    );
}

export const ParagraphSpanX4 = (props) => {

    return (
        <Paragraph className={props.classParagraph}>{props.textParagraph}
            <Span spanClassname={props.span1Class}>{props.span1Text}</Span>
            <Span spanClassname={props.span2Class}>{props.span2Text}</Span>
            <Span spanClassname={props.span3Class}>{props.span3Text}</Span>
            <Span spanClassname={props.span4Class}>{props.span4Text}</Span>
        </Paragraph>
    );
}

export const ParagraphSpan = (props) => {

    return (
        <Paragraph className={props.classParagraph}>{props.textParagraph}
            <Span spanClassname={props.spanClass}>{props.spanText}</Span>
        </Paragraph>
    );
}

export const ParagraphSpanX3 = (props) => {

    return (
        <Paragraph className={props.classParagraph}>{props.textParagraph}
            <Span spanClassname={props.span1Class}>{props.span1Text}</Span>
            <Span spanClassname={props.span2Class}>{props.span2Text}</Span>
            <Span spanClassname={props.span3Class}>{props.span3Text}</Span>
        </Paragraph>
    );
}

export const LabelAnchor = (props) => {
    return (
        <Label className={props.labelClass}>{props.labelText}
            <Link className={props.anchorClass} href={props.anchorLink}>{props.anchorText} </Link>
        </Label>
    );
}
export const LabelSpanSpan = (props) => {

    return (
        <Label className={props.labelClass}>{props.labelText}
            <Span spanClassname={props.span1Class}>{props.span1Text} </Span>
            <Span spanClassname={props.span2Class}>{props.span2Text} </Span>
        </Label>
    );
}

export const LabelSpan = (props) => {
    return (
        <Label className={props.labelClass}>{props.labelText}
            <Span spanClassname={props.spanClass}>{props.spanText} </Span>
        </Label>
    );
}

export const LabelSup = (props) => {

    return (
        <Label className={props.labelClass}>{props.labelText}
            <Sup>{props.supText}</Sup>
        </Label>
    );
}

export const HeadlineSpan = (props) => {

    return (
        <H4 headLineClass={props.headLineClass} headLineText={props.textHeadline} haveChildren={true}><Span spanClassname={props.spanClassname}>{props.text}</Span></H4>
    );
}


export const Buttonicon = (props) => {

    return (
        <Button className={props.classButton} {...props.btnAttributes} handleClick={props.handleClick}>
            {props.btnText}
            <Icons className={props.classIcon} />
        </Button>
    );
}

export const ButtonImgAndIcon = (props) => {

    const {
        bType = '',
        sText = '',
        sClass = '',
        btnModalAttributes = {},
        iconClass = '',
        imgSrc = '',
        imgAlt = '',
        imgClassName = '',
        divClass = '',
        btnText = '',
        btnClass = ''
    } = props.options;

    return (
        <div className={divClass}>
            <div className={btnClass} ripple="" {...btnModalAttributes} >
                <Image className={imgClassName} src={imgSrc} alt={imgAlt} />
                <Span className={sClass}>{sText}</Span>
                <Icons className={iconClass} />
            </div>
        </div>
    );
}

export const Spanicon = (props) => {

    return (

        <Span className={props.spanClassname}>{props.dropdowntext}
            <Icons className={props.downarrow} />
        </Span>

    );
}



export const ButtonSpanIcon = (props) => {

    return (
        <Button handleClick={props.handleClick} className={props.btnclass}><Span>{props.spanText}</Span><Icons className={props.bagclass} /></Button>
    );
}


export const AnchorSpanIcon = (props) => {

    return (
        <Link className={props.Linkclass} href={props.href}>{props.anchorText}<Span className={props.spanClassname}> {props.spanText}<Icons className={props.iconClass} /></Span>  </Link>
    );
}


export const AnchorSpan = (props) => {

    return (
        <Link onClick={props.onClick} className={props.typeaheadclass} asInfo={props.asInfo} href={props.href}>{props.anchorText} <Span>{props.spanText}</Span></Link>
    );
}




export const AnchorStrongLabel = (props) => {

    return (
        <Link className={props.typeaheadclass} href="#"><Strong>{props.strongText} </Strong><Label>{props.text}</Label></Link>
    );
}



export const AnchorLabelStrong = (props) => {

    return (
        <Link className={props.typeaheadclass} href="#"><Label>{props.text} </Label><Strong> {props.strongText}</Strong></Link>
    );
}

export const AnchorLabelIcon = (props) => {

    return (
        <Link className={props.typeaheadclass} href={props.href}><Label className={props.labelclass}>{props.text} </Label><Icons className={props.iconclass} /></Link>
    );
}

export const AnchorStrongLabelSpan = (props) => {

    return (
        <Link onClick={props.onClick} className={props.typeaheadclass} asInfo={props.asInfo} href={props.href}><Strong>{props.strongText} </Strong><Label>{props.text} </Label><Span> {props.spanText}</Span></Link>
    );
}



export const HeadlineIconSameLevel = (props) => {

    return (
        <div className="col-12 d-flex justify-content-between align-items-center o-clp-headingButton_text">
            <H1 headLineText={props.headLineText} headlineType={props.headlineType}></H1><Icons className={props.iconClass} />
        </div>

    );
}



export const AnchorIconSpan = (props) => {

    return (
        <Link className={props.Linkclass} href={props.href} {...props}>{props.anchorText} <Icons className={props.iconClass} /> <Span className={props.spanClassname}>{props.spanText}</Span></Link>
    );
}

export const AnchorIconSpanNew = (props) => {

    const { aText, aHref, aClass, anchorAttributes, iconPosition, iconClass, spanClass, spanText } = props.options;

    return (
        (iconPosition && iconPosition == 'right') ?
            <Link className={aClass} href={aHref} {...anchorAttributes} {...props}>{aText}<Span className={spanClass}>{spanText}</Span><Icons className={iconClass} /></Link>
            :
            <Link className={aClass} href={aHref} {...anchorAttributes} {...props}>{aText}<Icons className={iconClass} /><Span className={spanClass}>{spanText}</Span></Link>
    );
}


export const ButtonHeadIcon = (props) => {
    return (
        <Button className={props.btnclass} {...props} btntext={props.btntext}>{props.btntext}<Icons className={props.iconclass} /></Button>
    );
}

export const ButtonHeadlineIcon = (props) => {
    const { btnModalAttributes, iconClass, divClass, spanText, btnText, btnClass,html } = props.options;

    return (
        //  The below line is changed for defect of 20203
        <div className={btnClass} {...btnModalAttributes} onClick={props.onClick}>{html?<span dangerouslySetInnerHTML={{__html: btnText}}></span>:<Span>{btnText}</Span>}<Icons className={iconClass} /></div>

    );
}

export const DropdownQty = (props) => {
    const { pdpQty, showQtyDropdown, toggleQtyDropdown, onChangeQty, onBlurQty, collProdId = "",resetQty } = props.qtyDropdownInfo || {}

    return (

        <Link className="m-ProductQty__container m-ProductQty__container--small pdpDropdwonToClose" id="qtyDropdownDesktop" onClick={(e) => {e.preventDefault();toggleQtyDropdown()}} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded={showQtyDropdown ? 'true' : 'false'}>
            <div className="row m-0 pdpDropdwonToClose">
                <div className="col-9 p-0 pdpDropdwonToClose">
                    <Input className="a-ProductQty__input pdpDropdwonToClose" type="number" value={resetQty == "" ? resetQty : pdpQty} id={"a-ProductQty__inputDesktop" + collProdId} onBlur={(e) => onBlurQty(e)} onChange={(e) => onChangeQty(e.target.value)} {...props} />
                </div>
                <div className="col-3 p-0 pdpDropdwonToClose"><Icons className="icon-arrow_down pdpDropdwonToClose" />
                </div>
            </div>
        </Link>

    );
}



export const ParagraphWithSup = (props) => {

    return (
        <Paragraph className={props.className} href={props.href}>{props.text}<Sup supClassname={props.supClassname}>{props.supText}</Sup></Paragraph>
    );
}

export const ParagraphWithBlock = (props) => {

    return (
        (!isEmpty(props.htmlText)) ?
            <Paragraph className={props.blockclass} htmlText={props.htmlText} />
            :
            (isEmpty(props.htmlText)) ?
                <Paragraph className={props.blockclass} href={props.href}>{props.text} <Span className={props.spanClassname}>{props.spanText}</Span></Paragraph>
                : null
    );
}

export const ParagraphWithBlockNew = (props) => {
    const { bType = '', pText, pTextPosition, pClass, pPosition = '', paragraphAttributes, bText, bClass, bUrl, spanAttributes, supAttributes, iconAttributes, anchorAttributes, targetType } = props.options || {};

    return (

        (pPosition && pPosition == 'right') ?
            <Paragraph className={pClass} {...paragraphAttributes} onClick={props.HandleClick}>
                {
                    (bType && bType == 'icon') ?
                        <Icons className={bClass} {...iconAttributes} />
                        : null
                }
                {pText}
            </Paragraph>
            :
            <Paragraph className={pClass} {...paragraphAttributes} onClick={props.HandleClick}>
                {!pTextPosition && pText}
                {
                    (bType && bType == 'span') ?
                        <Span className={bClass} {...spanAttributes}>{bText}</Span>
                        :
                        (bType && bType == 'sup') ?
                            <Sup className={bClass} {...supAttributes}>{bText}</Sup>
                            :
                            (bType && bType == 'icon') ?
                                <Icons className={bClass} {...iconAttributes} />
                                :
                                (bType && bType == 'anchor') ?
                                    <Link className={bClass} href={bUrl} {...anchorAttributes} target={targetType || "_self"}>{bText}</Link>
                                    :
                                    (bType && bType == 'price') ?
                                        <React.Fragment>
                                            <Sup className={bClass} {...supAttributes}>{bText}</Sup>
                                            <Span>-</Span>
                                        </React.Fragment>
                                        :
                                        null
                }
                {pTextPosition && pTextPosition == 'right' && pText}
            </Paragraph>
    );
}

export const ParagraphGroup = (props) => {

    return (
        <Paragraph className={props.blockclass} href={props.href}>{props.text}</Paragraph>
    );
}


export const ParagraphGroups = (props) => {

    return (
        <Paragraph className={props.blockclass} href={props.href}>{props.text}</Paragraph>
    );
}

export const ParagraphSameLevelBlockSpan = (props) => {


    return (
        <div>
            {props.iconClass && <Icons className={props.iconClass} />}
            <Paragraph className={props.pclass}>{props.ptext} </Paragraph><Span className={props.spanClass}>{props.spanText}</Span>
        </div>
    );
}

export const AlertActionNew = (props) => {
    return (
        <React.Fragment>
            {!isEmpty(props.iconType) && <Icons className={props.iconType} />}
            <Icons onClick={props.onClick} className="icon-close mdc-snackbar__dismiss" title="Dismiss" />
        </React.Fragment>
    );
}

export const AlertAction = (props) => {
    // if(IconType) {
    return (
        <React.Fragment>
            {!isEmpty(props.iconType) && <Icons className={props.iconType} />}
            <Icons className={props.TypeclassName} title={props.title} onClick={props.onClick} />
        </React.Fragment>
        /* );
   }
         
   else return(
    <Icons className={props.className} title={props.title}/>*/


        /*
         <div>
              {(() => {
                if (someCase) {
                  return (
                    <div>someCase</div>
                  )
                } else if (otherCase) {
                  return (
                    <div>otherCase</div>
                  )
                } else {
                  return (
                    <div>catch all</div>
                  )
                }
              })()}
            </div>
          )*/


    );
}




export const MoleculeGroupInfo = (props) => {
    const { title, text, classTitle, classText } = props || {}

    return (
        <div className="m-pesnalData-info__group" {...props.groupInfoAttributes} >
            <Label className={classTitle}>{title}</Label>
            <Paragraph className={classText}>{text}</Paragraph>
        </div>
    );
}

export const FormButtons = (props) => {
    const buttonsOptions = props.buttonsOptions || {}

    return (
        <div className="m-form-buttons">
            <div className="row">
                {!isEmpty(buttonsOptions) && map(buttonsOptions, (btn, index) => {

                    let order_ = '';
                    let order = '';
                    if (index == 0) {
                        order_ = btn.order ? btn.order : 'order-2';
                        order = order_ + " order-lg-" + index;
                    }
                    if (index == 1) {
                        order_ = btn.order ? btn.order : 'order-1'
                        order = order_ + " order-lg-" + index
                    }
                    const size = btn.size ? btn.size : "col-lg";

                    return <div className={"col-12 " + order + " " + size}>
                        <button className={btn.btnClass} type={btn.typeButton} form={btn.Idform} onClick={btn.handleClick}>{btn.text}</button>
                    </div>
                })}
            </div>
        </div>
    );
}



export const CardWithText = (props) => {
    const { options, menuMotion } = props || {}

    return (
        <React.Fragment>
            {!isEmpty(options) && options.map((val, index) => {
                // console.log('sadasd')
                return (
                    <React.Fragment key={index}>
                        <div className="ol-12 col-lg-3 m-myAccount__cellphone">
                            <Paragraph className={val.labelClass}>{val.label}</Paragraph>
                            <Span className={val.textClass}>{val.text}</Span>
                        </div>

                    </React.Fragment>
                )
            })}
            {!isEmpty(menuMotion) &&
                <ShowMotion options={menuMotion} />
            }
        </React.Fragment>
    );
}
export const CardRow = (props) => {
    const { options, menuMotion } = props || {}

    return (
        <React.Fragment>
            {!isEmpty(options) && options.map((option, index) => {
                return (
                    <React.Fragment key={index}>
                        <div className="col-12 mb-4 mb-lg-0 m-account__cardInfo -cellphone">
                            <div className="m-account__cardDetails mb-lg-0">
                                <div className="row">
                                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                                        <Span className="a-account__cardInfoText">{option.shortname}</Span>
                                    </div>
                                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                                        <Span className="a-account__cardInfoText">{option.phoneNumber}</Span>
                                    </div>
                                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                                        <Span className="a-account__cardInfoText">{option.service}</Span>
                                    </div>
                                    <div className="col-12 col-lg-3 m-myAccount__cellphone">
                                        <Span className="a-account__cardInfoText">{'200 pesos'}</Span>
                                    </div>
                                    {!isEmpty(menuMotion) &&
                                        <ShowMotion options={menuMotion} />
                                    }
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )
            })}

        </React.Fragment>
    );
}


export const LiAnchorSpan = (props) => {
    return (
        <React.Fragment>
            <li className={props.pdplistclass}><Link className={props.anchorClassname} style={props.style} href={props.anchorUrl}>{props.anchorText} </Link></li>
            <Span spanClassname={props.spanClassname}>{props.spanText}</Span>
        </React.Fragment>
    );
}

export const anchorHeadlineDivIcon = (props) => {
    const { options } = props || {}
    return (
        <React.Fragment>
            <div className={options.divClass}>
                <Link {...options.anchorText} {...options.anchorUrl} {...options.anchorClass}{...options.textPosition}></Link>
                <div className={options.divClass2}>
                    <div>
                        <Span spanClassname={options.classSpan1}>{options.spanText1}</Span>
                    </div>
                    <div>
                        <Span spanClassname={options.classSpan2}>{options.spanText2}</Span>
                        <Span spanClassname={options.classSpan3}>{options.spanText3}</Span>
                    </div>
                </div>
                <Icons {...options.iconClass}{...options.iconAttributes} />
            </div>
        </React.Fragment>
    );
}

export const anchorHeadlineIcon = (props) => {
    const { options } = props || {}
    return (
        <React.Fragment>
            <div className={options.divClass}>
                <Link {...options.anchorText} {...options.anchorUrl} {...options.anchorClass}{...options.textPosition}></Link>
                <Icons {...options.iconClass}{...options.iconAttributes} />
            </div>
        </React.Fragment>
    );
}

