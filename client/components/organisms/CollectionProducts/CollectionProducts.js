import { ProductContainer } from '../../organisms/Container/Container';

//import './CollectionProducts.styl';

export default (props) => {
    const {productSelection, mainProductData, productDeSelection, show_alert, fullCollectionData, staticLabels, deslectionFromSticky, selectedData = [],ITR_Eligibility, configurationData, limitedPiecesSkusData } = props;
    let collectionProductInfo = fullCollectionData && fullCollectionData.productInfo || {}

    let containerInfo = {
        title: {
            text1: 'Artículos agregados ',
            selectedQty: selectedData.length,
            text2: ' de ',
            totalQty: Object.keys(fullCollectionData.productsInfo).length
        },
        hr: 'true'
    };

    return (
        <div className="o-collection__products">
            <ProductContainer 
            windowObject = {props.windowObject}
            containerInfo={containerInfo}
            mainProductData={mainProductData} 
            collectionData={props.collectionData} 
            productSelection={productSelection} 
            productDeSelection={productDeSelection}
            fullCollectionData={fullCollectionData}
            show_alert={show_alert}
            staticLabels={staticLabels}
            configurationData={configurationData}
            limitedPiecesSkusData={limitedPiecesSkusData}
            deslectionFromSticky={deslectionFromSticky}
            ITR_Eligibility ={ITR_Eligibility}
            addMultipleItemToCart={props.addMultipleItemToCart}
            orientation={props.orientation}
            />
        </div>
    );
}
