import React from 'react';
import Header from '../../organisms/Header/Header';
import Footer from '../headerFooter/headerFooter';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { parentContext } from '../../../contexts/parentContext';
import { AtomChunkText } from '../../atoms/Tab/atom-chunk-text';
import Dropdown from '../../molecules/Dropdown/Dropdown';
import OrganismPromotion from '../../organisms/Promotions/organism-promotion';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

// import './promotions.styl';

class Promotions extends React.Component {
  constructor(props) {
    super(props);
    this.dropId = React.createRef();
    this.state = {
      dropdownMenu: false,
      sortSelected: "",
      tempstaticPromotions: '',
      promotionCategory: ''
    }
  }

  componentDidMount() {
    Utility(Path.getStaticPromotions, 'POST', {
      "categoryId": "",
      "viewAll": "true",
      "pageNo": ""
    }).then(response => {
      if(response && response.data && response.data.status && response.data.status.errorCode === "0"){
          this.setState({
            tempstaticPromotions: response.data.staticPromotions,
            promotionCategory: response.data.categoryPromotionCountMap
          })
      } else {
        //console.log('failure....!!!');
      }

    });
  }

  onDropdownToggle = () => {
    if (this.state.dropdownMenu === false) {
      this.setState({
        dropdownMenu: true
      })
    } else {
      this.setState({
        dropdownMenu: false
      })
    }
  }

  onSortSelect = (labelValue, undefined, labelId) => {
    let categoryId = labelId
    this.setState({
      sortSelected: labelValue,
      dropdownMenu: false,
    })
    Utility(Path.getStaticPromotions, 'POST', {
      "categoryId": labelId === 'todas' ? '': categoryId,
      "viewAll": "true",
      "pageNo": ""
    }).then(response => {
      //console.log('success');
      this.setState({
        tempstaticPromotions: response.data.staticPromotions,
        promotionCategory: response.data.categoryPromotionCountMap
      })
    });

  }

  render() {
    let breadcrumbInfo = {
      label: 'Promociones',
      breadcrumbData: {}
    };

    //for Dropdown values
    let tempDropdownData = [];
    let data = this.state.promotionCategory;

    for (var key in data) {
      let dropObject = {};
      dropObject.id = key;
      dropObject.label = data[key]
      tempDropdownData.push(dropObject);
    }
    const todas = {};
    todas['id'] = 'todas';
    todas['label'] = 'Todas';
    tempDropdownData.unshift(todas);
    const dropdownDetails = {
      dropdownText: "Todas",
      dropdownTextDesktop: "Todas",
      menuID: "sortby",
      typeOf: "buttons",
      resolution: "desktop",
      onSortSelect: this.onSortSelect,
      sortSelected: this.state.sortSelected,
      onDropdownToggle: this.onDropdownToggle,
      dropdownData: tempDropdownData,
      dropdownMenu: this.state.dropdownMenu,
    };

    var atom = { className: "a-inlineElement a-inlineElement--choiceCategoryTitle", text: "Selecciona por categoría:", type: "p" };
    
    //23446 - Promotion description is not printed dynamically in static promotion page
    let staticPromotions = [];    
    map(this.state.tempstaticPromotions, (item, index) => {
      const expirtyDate = item.validUpToDate;
      let tempFigInfo = {
        src: item.imageURL,
        imageAlt: 'Promotion',
        figureClass: 'm-promotionCard',
        txt: item.displayName,
        text: item.description,
        imageClassName: 'a-figure -promotionFigure',
        figCaptionClass: 'a-figCaption',
        date: !isEmpty(expirtyDate)? 'Válido al: '+ expirtyDate.split('-').reverse().join('/'): 'Válido al: ',
        pdfURL:item.pdfURL
      }
      staticPromotions.push(tempFigInfo);
    })

    return (
      <parentContext.Consumer>
        {({ loginDetails, headerData, handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, setFooterData, snbfooterData }) => (
          <React.Fragment>
            <Header
              loginDetails={loginDetails}
              handleTypeheadHide={handleTypeheadHide}
              handleTypeheadShow={handleTypeheadShow}
              handleMobileMenu={handleMobileMenu}
              showMobileMenu={showMobileMenu}
              showTypehead={showTypehead}
              headerData={headerData}
              pageName="promotions"
            />
            <main>
              <section className="container-fluid t-promotions">
                <div className="t-promotions__head">
                  <div className="t-promotions__title" name="titlePromotions">
                    <Breadcrumb breadcrumbInfo={breadcrumbInfo} />
                    <h1 className="t-promotions__headTitle">Conoce todas nuestras promociones</h1>
                    <AtomChunkText Type={atom.type} className={atom.className}>{atom.text}</AtomChunkText>
                    <div className="t-promotions__filter thirdParties" name="titlePromotions">
                      <Dropdown dropdownDetails={dropdownDetails} ref={this.dropId} />
                    </div>
                  </div>
                </div>
                <div className="t-promotions__cards">
                  <div className="t-promotions__productList">
                    {
                      map(staticPromotions, (item, index) => {
                        return (
                          //23446 - Promotion description is not printed dynamically in static promotion page
                          <OrganismPromotion staticPromotions={item} />
                        )
                      })
                    }
                  </div>
                </div>
              </section>
            </main>
            <Footer loginDetails={loginDetails} setFooterData={setFooterData} snbfooterData={snbfooterData} />
          </React.Fragment>
        )}
      </parentContext.Consumer>
    )
  }
}
export default Promotions;
