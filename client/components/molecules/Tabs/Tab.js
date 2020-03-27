


/*include ../../molecules/Tabs/molecule-tab.pug
	include ../../molecules/ProductDetail/molecule-product-detail-web.pug*/









import React from 'react';
//import ProductSpecList from '../../molecules/ProductDetail/ProductSpecList';
import TabcheckOut from '../../atoms/Tab/TabcheckOut';
import ProductDetailWeb from '../../molecules/ProductDetail/ProductDetailWeb';

//import './Tab.styl'

export default class ProductSpecDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = { selectedTab: "description", activeTab: this.props.children[0].props.label, }
    }
    TabChange = (selectedTab) => {


        this.setState({ selectedTab: selectedTab.currentTarget.attributes['data-open'].value })
        // console.log('tab click coming here', selectedTab.currentTarget.attributes['data-open'].value)
    }
    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }
    render() {

        const {
            onClickTabItem,
            props: {
                children,
            },
            state: {
                activeTab,
            }
        } = this;
        return (
     
             
               

<React.Fragment>
                  
                        <div className={this.props.widthClass}>
                            <div className="mdc-tab-bar" role="tablist">
                                <div className="mdc-tab-scroller">
                                    <div className="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll">
                                        <div className="mdc-tab-scroller__scroll-content checkout">
                                            {children.map((child) => {
                                                const { label } = child.props;

                                                return (

                                                    <TabcheckOut
                                                        activeTab={activeTab}
                                                        key={label}
                                                        label={label}
                                                        onClick={onClickTabItem}
                                                    />

                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                            {/*<Tab onTabChange={this.TabChange} activeTab={this.state.selectedTab} />*/}
                        </div>
                    </div>
                   
                            <div className="o-cashTransferenceInfo d-block m-product__detail pt-4 pb-4 pl-3 pr-4 w-100">
                                <div className="o-personalInfo tabs-content" data-tab="description">
                                    {children.map((child) => {
                                        if (child.props.label !== activeTab) return undefined;
                                        return child.props.children;
                                    })}
                                </div>
                            </div>
                            {/*<ProductDetailWeb selectedTab={this.state.selectedTab} mainContent={this.props.mainContent} blockclass="a-product__spanProductDescriptionTab" blockText="Código de Producto:" spanClassname="a-product__spanProductDescriptionTab" spanText="1072472462" />*/}
                        
     
  </React.Fragment>            
       
        );
    }

}





