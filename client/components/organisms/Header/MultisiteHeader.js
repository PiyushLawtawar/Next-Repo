import Link from '../../atoms/Link/Link'
import Icons from "../../atoms/Icons/Icons";
import isEmpty from 'lodash/isEmpty';

export default (props) => {
  const { isLoggedIn, showPromotionBanner, topBanner } = props;
  return (
    <div className="o-container__fluid container-fluid wrap-boutiques d-none d-lg-block">
      {
        isLoggedIn === 'No' && !isEmpty(topBanner) && !isEmpty(topBanner[0]) &&
        <Link className="a-promotions__btn" id="promotions__btn" onClick={props.handlePromotionBanner}>
          <Icons className="a-promotions__icon icon-draghandle" />
        </Link>
      }
      <div className="o-container container p-0">
        <div className="m-boutiques-links">
          <div className="o-row row justify-content-between">
            <div className="o-col col-lg-8">
              <div className="o-row row">
                {props.TopLeftLinks && props.TopLeftLinks.map((item, index) =>
                  <div className="o-col col-lg-auto" key={index} ><Link className="a-boutique__link strong" target="_blank" rel="noreferrer" href={item.url}>{item.name}</Link></div>
                )}
              </div>
            </div>
            <div className="o-col col-lg-4">
              <div className="o-row row justify-content-end">
                {props.TopRightLink && props.TopRightLink.map((item, index) =>
                  <div className="o-col col-lg-auto" key={index} ><Link className="a-boutique__link strong" target="_blank" rel="noreferrer" href={item.url}>{item.name}</Link></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
