import ProductInformationCollection from '../ProductInformation/ProductInformationCollection';
import CarouselPdp from '../../organisms/Carousel/CarouselPdp';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty'
import { parentContext } from '../../../contexts/parentContext';
const moveToContainer = () => {
    var elmnt = document.getElementById("products-container");
    elmnt.scrollIntoView({ behavior: "smooth" });
}
const getCarousalData = (productData = {}, fullCollectionData = {}) => {

    let carousalData = [];
    let repoId = productData && !isEmpty(productData) && productData["sku.repositoryId"] && productData["sku.repositoryId"][0] || "";
    let skuimageMaps = fullCollectionData && !isEmpty(fullCollectionData) && fullCollectionData.collectionProductImagesInfo && fullCollectionData.collectionProductImagesInfo.skuImageMap || {}
    for (let skuImage in skuimageMaps) {

        let imageID = skuImage != "" && skuImage.split("_")[0];
        let imageType = skuImage != "" && skuImage.split("_")[1]
        if (imageID == repoId && imageType == "gl") {
            carousalData.push(skuimageMaps[skuImage]);
        }
    }

    let SortedImages = sortingImage(skuimageMaps, repoId) /* added for 23682 */

    return SortedImages
}
/* added for 23682 - start*/
const sortingImage = (carouselRecords, productId) => {

    let glrecords = Object.keys(carouselRecords).filter(imagekey => imagekey.match("gl") && imagekey.match(productId)).map(eachglimages => eachglimages.split("_")[2]).sort((a, b) => a - b)
    let orderedImage = {};
    for (let image in carouselRecords) { /*modifed to make th images first 23682 */
        if (image.match(productId + '_th')) { orderedImage[image] = carouselRecords[image] }
    }
    glrecords.map(eachsortorder => { for (let image in carouselRecords) { if (image.match(productId + '_gl') && image.split("_")[1] == "gl" && image.split("_")[2] == eachsortorder) { orderedImage[image] = carouselRecords[image] } } })

    return Object.values(orderedImage)
}
/* added for 23682  - end */

export default (props) => {
    const { gallery = '', info = '', purchase = '', ismodal = '', collections = '' } = props.collectionInfo || {};
    const { mainProductData = {}, fullCollectionData = {}, priceToShow, staticLabels, windowObject } = props
    //const carouselRecords = mainProductData && mainProductData["sku.galleriaImage"] || [Path.onImgError];
    let carousalData = getCarousalData(mainProductData, fullCollectionData)

    let thumbImage = mainProductData && mainProductData["sku.thumbnailImage"] || []; /*fixes for 23682 -- modified to product to sku images*/

    let mergedCarousalData = thumbImage.concat(carousalData)
    const carouselRecords = mergedCarousalData && mergedCarousalData.length > 0 ? mergedCarousalData : [Path.onImgError];

    let main = {};
    const screenWidth = windowObject && windowObject.screen && windowObject.screen.width

    return (
        <section className="o-product__detail">
            {/* TurnTo section */}
            <div className="container o-product__mainContainer">
                <main>
                    <parentContext.Consumer>
                        {({  closeAllModals  }) => (
                            <CarouselPdp carouselRecords={carouselRecords} productId={info.productCode} productInfo={info} isCollection={true} productSizeId={info.productCode} closeAllModals={closeAllModals}/>
                        )}
                    </parentContext.Consumer>
                    <div className="o-product__description">
                        <ProductInformationCollection share={screenWidth >= 990 || Math.abs(windowObject.orientation) === 90 ? true : false} windowObject={windowObject} productId={info.productCode} staticLabels={staticLabels} priceToShow={priceToShow} productInfo={info} mainProductData={mainProductData} mainContent={main} descriptionNeeded={true} /> {/* Changes for 23056 adddedd orientation check */ /*addedd s to staticlabel -- changes made for Pdp staticlabel issue */}
                    </div>
                </main>

                <div className="a-product__separator"></div>
                <aside className="o-product__purchase p-0 pt-lg-3 pr-lg-3 pl-lg-3">
                    {purchase === "button" &&
                        <div className="m-product__purchase__details pb-lg-4 d-none d-lg-block">
                            <button className=" a-btn a-btn--tertiary ripple" id="a-product-detail" onClick={moveToContainer}>Ver artículos</button>
                        </div>
                    }
                </aside>
            </div>
        </section>
    );

}