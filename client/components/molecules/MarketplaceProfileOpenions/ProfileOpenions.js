//import './ProfileOpenions.styl'
import Paragraph from '../../atoms/Paragraph/Paragraph';
import Link from '../../atoms/Link/Link';
import { H2 } from '../../atoms/HeadLines/Headlines';
import OpenionBlock from '../MarketplaceProfileOpenions/OpenionBlock';
import MarketplaceOpenion from '../MarketplaceProfileOpenions/MarketplaceOpenion';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class extends React.Component {
  constructor(props) {
    super(props)


  }


  render() {
    const oneStarRatings = this.props.marketPlaceData && this.props.marketPlaceData.oneStarRatings ? this.props.marketPlaceData.oneStarRatings : 0
    const twoStarRatings = this.props.marketPlaceData && this.props.marketPlaceData.twoStarRatings ? this.props.marketPlaceData.twoStarRatings : 0
    const threeStarRatings = this.props.marketPlaceData && this.props.marketPlaceData.threeStarRatings ? this.props.marketPlaceData.threeStarRatings : 0
    const fourStarRatings = this.props.marketPlaceData && this.props.marketPlaceData.fourStarRatings ? this.props.marketPlaceData.fourStarRatings : 0
    const fiveStarRatings = this.props.marketPlaceData && this.props.marketPlaceData.fiveStarRatings ? this.props.marketPlaceData.fiveStarRatings : 0
    const evaluationsInfoList = this.props.evaluationsInfoList
    const emptyEvaluationMsg = this.props.marketPlaceData && this.props.marketPlaceData.emptyEvaluationMsg ? this.props.marketPlaceData.emptyEvaluationMsg : ''
    const staticArray = this.props.pageSpecificStaticLabels && this.props.pageSpecificStaticLabels.staticLabelValues? this.props.pageSpecificStaticLabels.staticLabelValues[0].keyValues:this.props.pageSpecificStaticLabels;

     const estrellas = staticArray['mirakl.stars.label'];

    return (
      <React.Fragment>
        <div className="col-12">
          <H2 headLineClass="a-marketplace__opinionsTitle" headLineText={staticArray['mirakl.customer.opinions.label']} />
          <div className="row">
            <div className="col-lg-3 pr-lg-0 pb-5">
              <OpenionBlock spanText={`5 ${estrellas}`} text={fiveStarRatings} />
              <OpenionBlock spanText={`4 ${estrellas}`} text={fourStarRatings} />
              <OpenionBlock spanText={`3 ${estrellas}`} text={threeStarRatings} />
              <OpenionBlock spanText={`2 ${estrellas}`} text={twoStarRatings} />
              <OpenionBlock spanText={`1 ${estrellas}`} text={oneStarRatings} />

            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-8">


              {
                (evaluationsInfoList) ? !isEmpty(evaluationsInfoList) && map(evaluationsInfoList, (items, key) => {

                  return (
                    <MarketplaceOpenion key={key} ratting={items.grade} openionby={`${staticArray['mirakl.writtern.by.label']}  ${items.firstName}  ${items.lastName} ${items.commentDate}`} openion={items.comment} />

                  )
                }) : <h6>{emptyEvaluationMsg}</h6>

              } 
              { evaluationsInfoList && evaluationsInfoList.length > 5 &&
                 <div className="m-marketplace__viewMoreOpinions mt-3 mb-3">
                <Link className="a-marketplace__moreOpinions" href="#" id="moreOpinions" onClick={() => this.props.showMoreOpinions()} >{staticArray['mirakl.more.opinions']}</Link>
              </div>
              }

             

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}


