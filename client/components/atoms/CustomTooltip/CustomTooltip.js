import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { UserAgentDetails } from '../../../helpers/utilities/utility';

class CustomTooltip extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.toolTipTriggerElement = {};
    this.sourceElementProps = {};
    this.targetElementProps = {};
    this.documentElementProps = {};
    this.sourceElement = {};
  }

  init() {

    // this.targetElement = document.getElementById(this.props.tooltipFor);
    this.trigger = this.props.trigger || 'click';
    this.tooltipId = `tt-${this.props.tooltipFor}-dynamicTooltip`;

    // setup CSS value overrides
    this.backgroundColor = (this.props.backgroundColor || '#ffffff');
    this.borderColor = (this.props.borderColor || '#6b6b6b');
    this.borderRadius = (this.props.borderRadius || '4px');
    this.borderSize = (this.props.borderSize || '2px');
    this.fontSize = (this.props.fontSize || '12px');
    this.contentPadding = (this.props.contentPadding || '10px');
    this.arrowSize = (this.props.arrowSize || '8px');
    this.textColor = (this.props.textColor || '#330223');
    this.fontFamily = (this.props.fontFamily || 'var($regular)');
    this.maxWidth = (this.props.maxWidth || '295px');
    this.adjustedPosition = '0'; // This needs to be updated if tooltip going beyond body width
  }

  setCSSProps(sourceElement) {
    // setup CSS vars
    var styleVars = sourceElement.style;

    styleVars.setProperty('--ns-bg-color', this.backgroundColor);
    styleVars.setProperty('--ns-border-color', this.borderColor);
    styleVars.setProperty('--ns-border-radius', this.borderRadius);
    styleVars.setProperty('--ns-border-size', this.borderSize);
    styleVars.setProperty('--ns-padding', this.contentPadding);
    styleVars.setProperty('--ns-text-color', this.textColor);
    styleVars.setProperty('--ns-font-size', this.fontSize);
    styleVars.setProperty('--ns-font-family', this.fontFamily);
    styleVars.setProperty('--ns-arrow-size', this.arrowSize);
    styleVars.setProperty('--ns-max-width', this.maxWidth);
    styleVars.setProperty('animation', '0.3s ease-in-out 0s 1 normal forwards running fadeIn');

    styleVars.setProperty('--ns-border-after-width', this.arrowSize);
    styleVars.setProperty('--ns-border-before-width', ((this.getValue(this.arrowSize) - this.getValue(this.borderSize)) + 'px'));


    //   // console.log(styleVars.cssText);
  }

  getValue(original) {
    return parseInt(original.replace(/px/g, ''), 10);
  }

  getOffsetAndDimension(element) {
    // // console.log(element);
    let elementProps = {
      id: element.id || '',
      position: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        middle: 0,
        center: 0
      },
      dimension: { width: 0, height: 0 }
    };
    let rect = element.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop,
      width = element.offsetWidth,
      height = element.offsetHeight;
    let elementComputedStyle = window.getComputedStyle(element),
        marginLeft = this.getValue(elementComputedStyle.marginLeft) || 0,
        marginRight = this.getValue(elementComputedStyle.marginRight) || 0;

    elementProps.position.top = rect.top + scrollTop;
    elementProps.position.left = rect.left + scrollLeft;
    elementProps.position.bottom = rect.top + scrollTop + height;
    elementProps.position.right = rect.left + scrollLeft + width;

    elementProps.dimension.width = width;
    elementProps.dimension.height = height;

    elementProps.position.middle = (elementProps.position.top + (elementProps.dimension.height / 2));
    elementProps.position.center = (elementProps.position.left + (elementProps.dimension.width / 2));
    return elementProps;
  }

  componentDidMount() {
    this.agent = UserAgentDetails(window);
    var $this = document.querySelector(`#${this.tooltipId}`); // ReactDOM.findDOMNode(this);
    this.toolTipElem = document.getElementById(this.tooltipId);
    this.targetElement = document.getElementById(this.props.tooltipFor); // this.toolTipTriggerElement
    this.attachTrigger(this.toolTipElem);
    // if ($this.parentNode.nodeName.toLowerCase() !== 'main') {
    document.querySelector('#__next').appendChild($this);
    // }
  }

  closeAllTooltips() {
    document.querySelectorAll('.tooltip').forEach((tooltip) => {
      tooltip.classList.remove('show');
      tooltip.classList.add('hide')
    });
  }

  overridePosition(calculatedPosition) {
    let viewportWidth = (window.innerWidth || document.documentElement.clientWidth),
      viewportHeight = (window.innerHeight || document.documentElement.clientHeight),
      targetRelPos = this.targetElement.getBoundingClientRect(),
      differencePositionRight = 0,
      differencePositionLeft = 0,
      differencePositionTop = 0,
      differencePositionBottom = 0,
      calulatedArrowPosition = 0;
    // console.log('111111111111111111111111111');
    // console.log(calculatedPosition);
    // console.log(this.targetElementProps);
    // console.log(this.targetElement.getBoundingClientRect());
    // console.log('222222222222222222222222');

    differencePositionRight = ((viewportWidth - 15) - calculatedPosition.position.right);
    differencePositionLeft = (calculatedPosition.position.left - 15);
    // console.log(differencePositionRight, differencePositionLeft);
    differencePositionBottom = ((viewportHeight - 5) - calculatedPosition.position.bottom);
    differencePositionTop = ((targetRelPos.y - 5) - (calculatedPosition.dimension.height + this.getValue(this.props.arrowSize)));
    // console.log('differencePositionRight >> ', differencePositionRight)
    if (differencePositionRight < 15) { // tooltip going outside right edge of viewport
      calculatedPosition.position.left = calculatedPosition.position.left + differencePositionRight;
      calculatedPosition.position.center = (calculatedPosition.position.left + (calculatedPosition.dimension.width / 2));

      // calulatedArrowPosition =  ((this.targetElementProps.position.center - calculatedPosition.position.left) - (this.getValue(this.arrowSize) ));
      calulatedArrowPosition =  (((calculatedPosition.dimension.width /2)- differencePositionRight) - (this.getValue(this.arrowSize) /2 ) - 15);
      if (this.agent.isMobile) {
        calulatedArrowPosition = calulatedArrowPosition - (this.getValue(this.arrowSize) / 2);
      }

      this.toolTipElem.style.left = calculatedPosition.position.left + 'px';
      this.toolTipElem.style.setProperty('--ns-diffrence-position-top-bottom', Math.round(differencePositionRight) + 'px');
      this.toolTipElem.style.setProperty('--ns-tooltip-center', calulatedArrowPosition + 'px');
    } else if (differencePositionLeft < 0) { // tooltip going outside right edge of viewport
      calculatedPosition.position.left = 0 - differencePositionLeft;
      calculatedPosition.position.center = (calculatedPosition.position.left + (calculatedPosition.dimension.width / 2));

      calulatedArrowPosition = ((this.targetElementProps.position.center - calculatedPosition.position.left)  - (this.getValue(this.arrowSize) /2 ) - 15);
      if (this.agent.isMobile) {
        calulatedArrowPosition = calulatedArrowPosition + 15;
      }

      this.toolTipElem.style.left = calculatedPosition.position.left + 'px';
      this.toolTipElem.style.setProperty('--ns-diffrence-position-top-bottom', Math.round(differencePositionLeft) + 'px');
      this.toolTipElem.style.setProperty('--ns-tooltip-center', calulatedArrowPosition + 'px');
    }

    if (differencePositionTop < 0) {
      this.toolTipElem.classList.remove('up');
      this.toolTipElem.classList.add('down');
      calculatedPosition.position.top = (this.targetElementProps.position.bottom + this.getValue(this.props.arrowSize));
      this.toolTipElem.style.top = calculatedPosition.position.top + 'px';
    } else if (differencePositionBottom < 0) {
      this.toolTipElem.classList.remove('down');
      this.toolTipElem.classList.add('up');
      calculatedPosition.position.top = (this.targetElementProps.position.top - (this.getValue(this.props.arrowSize) + calculatedPosition.dimension.height));
      this.toolTipElem.style.top = calculatedPosition.position.top + 'px';
    }
    // console.log(calculatedPosition);
  }

  setTooltipelementProps = (sourceElement) => {
    sourceElement.classList.remove('hide');
    let toolTipElem = document.getElementById(this.tooltipId);
    let calculatedArrowPosition = 0;
    this.setCSSProps(toolTipElem);
    this.targetElementProps = this.getOffsetAndDimension(this.targetElement);
    this.sourceElementProps = this.getOffsetAndDimension(sourceElement);
    this.documentElementProps = this.getOffsetAndDimension(document.documentElement);

    switch (this.props.position.toLowerCase()) {
      case 'bottom':
        this.sourceElementProps.position.left = (this.targetElementProps.position.center - (this.sourceElementProps.dimension.width / 2));
        this.sourceElementProps.position.top = this.targetElementProps.position.bottom + this.getValue(this.arrowSize);
        this.sourceElementProps.position.center = ((this.targetElementProps.position.center - this.sourceElementProps.position.left) - ((this.getValue(this.arrowSize) ) / 2));
        // Set arrow properties
        sourceElement.classList.add('down');
        sourceElement.classList.remove('up');
        break;
      case 'top':
        this.sourceElementProps.position.left = (this.targetElementProps.position.center - (this.sourceElementProps.dimension.width / 2));
        this.sourceElementProps.position.top = (this.targetElementProps.position.top - (this.sourceElementProps.dimension.height + this.getValue(this.arrowSize)));
        this.sourceElementProps.position.center = ((this.targetElementProps.position.center - this.sourceElementProps.position.left) - ((this.getValue(this.arrowSize)) / 2));
        // Set arrow properties
        sourceElement.classList.add('up');
        sourceElement.classList.remove('down');
        break;
      case 'left':
        this.sourceElementProps.position.left = (this.targetElementProps.position.left - (this.sourceElementProps.dimension.width + this.getValue(this.arrowSize)));
        this.sourceElementProps.position.top = (this.targetElementProps.position.middle - (this.sourceElementProps.dimension.height / 2));
        // Set arrow properties
        sourceElement.classList.add('left');
        break;
      case 'right':
        this.sourceElementProps.position.left = (this.targetElementProps.position.right + this.getValue(this.arrowSize));
        this.sourceElementProps.position.top = (this.targetElementProps.position.middle - (this.sourceElementProps.dimension.height / 2));
        // Set arrow properties
        sourceElement.classList.add('right');
        break;
      default:
        break;
    }

    this.sourceElementProps.position.right = this.sourceElementProps.position.left + this.sourceElementProps.dimension.width;
    this.sourceElementProps.position.bottom = this.sourceElementProps.position.top + this.sourceElementProps.dimension.height;

    sourceElement.style.top = this.sourceElementProps.position.top + 'px';
    sourceElement.style.left = this.sourceElementProps.position.left + 'px';

    calculatedArrowPosition = (this.sourceElementProps.position.center - 15);
    sourceElement.style.setProperty('--ns-tooltip-center', calculatedArrowPosition + 'px');
    // sourceElement.style.setProperty('--ns-tooltip-center', this.sourceElementProps.position.center + 'px');

    this.overridePosition(this.sourceElementProps);
    // sourceElement.style.top = sourceElementStyles.top + 'px';
    // sourceElement.style.left = sourceElementStyles.left + 'px';
    sourceElement.classList.add('hide');
  }

  attachTrigger(element) {
    let closeIcon = element.querySelector('.tooltip-close');
    this.targetElement.style.cursor = "pointer";
    if (this.agent.isMobile) {
      this.trigger = 'click';
    }

    switch (this.trigger) {
      case 'hover':
        this.targetElement.onfocus = (e) => { this.handleFocusAndHover(e, element) };
        this.targetElement.onmouseover = (e) => { this.handleFocusAndHover(e, element) };

        this.targetElement.onblur = (e) => { this.handleBlur(e, element) };
        this.targetElement.onmouseout = (e) => { this.handleBlur(e, element) };
        closeIcon.classList.add('hide');
        break;
      case 'click':
      default:
        this.targetElement.addEventListener("click", (e) => { this.handleClick(e, element) });
        closeIcon.classList.remove('hide');
        break;
    }

    // attach event for close icon
    closeIcon.addEventListener("click", (e) => {
      element.classList.add('hide');
      element.classList.remove('show');
      this.handleWindowResizeAndScroll();
    });
  }
  stopBubbling(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  handleFocusAndHover(evt, elem) {
    evt.preventDefault();
    this.setTooltipelementProps(elem);
    elem.classList.remove('hide');
    elem.classList.add('show');
      this.handleWindowResizeAndScroll();
  }
  handleBlur(evt, elem) {
    elem.classList.remove('show');
    elem.classList.add('hide');
      this.handleWindowResizeAndScroll();
  }
  handleClick(evt, elem) {
    this.stopBubbling(evt);
    // 22288 fix start
     if (this.agent.isMobile) {
       document.body.addEventListener('click', this.closeAllTooltips);
    }
    // 22288 fix end
    if (elem.classList.contains('hide')) {
      this.closeAllTooltips();
      this.setTooltipelementProps(elem);
      elem.classList.remove('hide');
      elem.classList.add('show');
      document.body.addEventListener('click', this.closeAllTooltips);
    } else {
      elem.classList.remove('show');
      elem.classList.add('hide');
      document.body.removeEventListener('click', this.closeAllTooltips);
    }
    this.handleWindowResizeAndScroll();
  }

  handleWindowResizeAndScroll() {
    var tooltips = document.querySelectorAll('.tooltip');
    if (tooltips.length > 0) {
      window.addEventListener("resize", this.closeAllTooltips);
      window.addEventListener("scroll", this.closeAllTooltips);
    } else {
      window.removeEventListener("resize", this.closeAllTooltips);
      window.removeEventListener("scroll", this.closeAllTooltips);
    }
  }

  render() {
    const classList = `tooltip ${this.props.boxClass} hide`;
    return (
      <React.Fragment>
        <span ref={t => this.tooltipOne = t}
          style={{
            position: "absolute",
            zIndex: '9999'
          }}
          id={this.tooltipId}
          className={classList}>
          <section className="tooltip-close hide"></section>
          <section id={`${this.tooltipId}-content`} className="tooltip-text" dangerouslySetInnerHTML={{ __html: this.props.content }}></section>
        </span>
      </React.Fragment>
    );
  }
}

export default CustomTooltip;
