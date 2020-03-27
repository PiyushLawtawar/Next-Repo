import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import ListingProducts from '../../organisms/ListingProducts/ListingProducts';
import Pagination from '../../molecules/Pagination/Pagination';
import Dropdown from '../../molecules/Dropdown/Dropdown';
import ChangeView from '../../molecules/ChangeView/ChangeView';
import ProductCount from '../../molecules/ProductCount/ProductCount';
import MarketplaceLabel from '../../molecules/MarketplaceLabel/MarketplaceLabel';
import Link from '../../atoms/Link/Link';
import Image from '../../atoms/Tagimage/Image';
//import './BodyPlp.styl';

export default (props) => {

    const paginationClass = {
        UL: "pagination justify-content-md-center justify-content-lg-end m-pagination",
        LI: "page-item",
        aLink: "page-link"
    };

    const productListDetails = props.productListDetails || {};
    const { isSellerListing, plpSellerName, sellerLocation } = productListDetails.plpSellerInfo || {}
    const { dropdownDetails, viewModeDetails, productComparatorDetails } = props.navData || {};
    const selectedCardsCount = getSelectedCardsCountForComare(productComparatorDetails.productComparatorObj);
    const plpBannerContent = props.plpBannerContent || {};
    const additionalClass = (!isEmpty(plpBannerContent.htmlContent)) ? 'clear-both' : '';
    return (
        <main className="col-lg-9 m-column_mainContent">
            {isSellerListing && !isEmpty(plpSellerName) &&
                <div className="row m-title__marketplace">
                    <div className="col-lg-12 p-0">
                        <MarketplaceLabel plpSellerName={plpSellerName} sellerLocation={sellerLocation} />
                    </div>
                </div>
            }
            {( plpBannerContent && (!isEmpty(plpBannerContent.htmlContent) || !isEmpty(plpBannerContent.imgUrl)) ) &&
                <div className = "d-block d-lg-block m-plp-models marginBottom" >
                    {!isEmpty(plpBannerContent.htmlContent) &&
                        <div dangerouslySetInnerHTML={{__html:plpBannerContent.htmlContent}} />
                    }
                    {!isEmpty(plpBannerContent.imgUrl) &&
                        <Image alt={plpBannerContent.altName} src={plpBannerContent.imgUrl} showLoader="true" nonClickable="true" />
                    }
                </div>
            }
            <div className={"row " + additionalClass}>
                <div className="col-lg-12 d-none d-lg-block pr-1 pr-1 pl-lg-1 pr-lg-1">
                    <div className="d-flex align-items-center">
                        <div className="col-lg-4 col-xl-3 mb-4 pr-2 pl-0">
                            <Dropdown  dropdownDetails={dropdownDetails} forDesktop="true" />
                        </div>
                        <div className="col-lg-8 col-xl-9 d-flex justify-content-end mb-4">
                            {/*{
                                selectedCardsCount>=2 &&
                                <Link classNameAnchor="a-plp__moodview" href="/tienda/comparator" asInfo="/tienda/comparator"> Comparar </Link>
                            }*/}
                            <ChangeView classAnchor={ "a-plp__moodview" + (props.plpListView ? ' inactive':'') } idAnchor="a-gridview" clickFunction={viewModeDetails.showGridView} classIcon="icon-vistagrid" />
                            <ChangeView classAnchor={ "a-plp__moodview" + (props.plpListView ? '':' inactive') } idAnchor="a-listview" clickFunction={viewModeDetails.showListView} classIcon="icon-vistalista" />
                            <ProductCount paraText="Productos" productCount={productListDetails.totalNumRecords}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 p-2 pt-4 p-lg-1">
                    <ListingProducts domainName={props.domainName} plpListView={props.plpListView} agentDetails={props.agentDetails} productListDetails={productListDetails} productComparatorDetails={productComparatorDetails} selectedCardsCount={selectedCardsCount} redirectToPdp={props.redirectToPdp} chanelBrandJSON={props.chanelBrandJSON} flags={props.flags}/>
                </div>
            </div>
            <div className="row mt-4">
                <Pagination currentPage={props.page} totalRecords={Number(productListDetails.totalNumRecords)} recordsPerPage={Number(productListDetails.recordsPerPage)} paginationClass={paginationClass} onChangePage={productListDetails.onChangePage} />
            </div>
        </main>
    );
}

const getSelectedCardsCountForComare = (productComparatorObj) => {
    let count = 0;
    for(var key in productComparatorObj){
        if(productComparatorObj[key]){
            count++;
        }
    }
    return count;
}
