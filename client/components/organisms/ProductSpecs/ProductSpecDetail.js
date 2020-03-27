import React from 'react';
import Tab from '../../atoms/Tab/Tab';


export default class ProductSpecDetail extends React.Component {
    constructor(props) {
        super(props)

        let firstActiveChild = this.props.children && this.props.children.filter(tab => tab != null);
        let defaultActiveChild = firstActiveChild && firstActiveChild[0] && firstActiveChild[0].props && firstActiveChild[0].props.label || ""
        this.state = { selectedTab: "description", activeTab: defaultActiveChild }


    }
    TabChange = (selectedTab) => {
        this.setState({ selectedTab: selectedTab.currentTarget.attributes['data-open'].value })
    }
    onClickTabItem = (tab) => {
        if (tab && tab != "") {
            this.setState({ activeTab: tab });
        }
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
            <section>
                <div className="o-product__productSpecsDetails" id="o-product__productSpecsDetails">
                    <div className="">
                        <div className={this.props.widthClass}>
                            <div className="mdc-tab-bar" role="tablist">
                                <div className="mdc-tab-scroller">
                                    <div className="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll" style={{ overflowX: "hidden" }} >
                                        <div className="mdc-tab-scroller__scroll-content">
                                            {children.map((child, index) => {
                                                const { label = "" } = child != null && child.props;

                                                if (child != null) {
                                                    return (

                                                        <Tab
                                                            activeTab={activeTab}
                                                            key={label}
                                                            label={label}
                                                            extraClass={'class-' + (index + 1)}
                                                            onClick={onClickTabItem}
                                                        />

                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {children.map((child, i) => {
                        if (child != null && child.props.label && child.props.label !== activeTab) return undefined; 
                       if(child != null)
                       {
                        return (<div key={i} className="row">
                            <div className="col">
                                <div className={this.props.childClass}>
                                    <div className="tabs-content" data-tab="description">
                                        {
                                            child != null && child.props.children
                                        }
                                    </div>
                                </div>
                            </div>  
                            </div>)
                       } 
                            
                    })}
                </div>
            </section>
        );
    }

}





