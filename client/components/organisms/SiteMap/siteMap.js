import { H1 } from '../../atoms/HeadLines/Headlines';
import Link from '../../atoms/Link/Link';
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Router from 'next/router';
import { Validate } from '../../../helpers/utilities/Validate';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

const siteMap = (props) => {
  const getSiteMapData = props.siteMapData;
  const dataList = getSiteMapData && getSiteMapData.SiteMapData && getSiteMapData.SiteMapData.siteMapDataContent;
  let carArr = dataList && dataList.L1Categories || [];
  if(!isEmpty(carArr) && Array.isArray(carArr) && carArr.length > 0) {
    carArr = carArr.sort((a, b) => (a.Name > b.Name) ? 1: -1);
  }
  return (
    <React.Fragment>
      <main>
        <div className="organism container-fluid o-main-container o-one-column">
          <div className="container p-0">
            <div className="row d-none d-lg-block"></div>
            <div className="row m-0">
              <div className="col">
                <div className="container o-sitemap">
                  <div className="row">
                    <div className="card-columns">
                      {
                        map(carArr, (item, index) => {
                          let l2CategoryList = item.L2CategoriesInfoBrand;
                          if(!isEmpty(l2CategoryList)) {
                            l2CategoryList = l2CategoryList.sort((a, b) => (a.Name > b.Name) ? 1: -1);
                          }
                          return (

                            <div className="card" key={index}>
                              <div className="card-body">
                                <h1 className="card-title a-sitemap__title">
                                  <Link href={'/tienda' + item.categoryURL}>{item.Name}</Link>
                                </h1>
                                {
                                  map(l2CategoryList, (item2, i) => {
                                    return (
                                        <Link key={`${index}${i}`} href={'/tienda' + item2.categoryURL} className="a-sitemamp__category">{item2.Name}</Link>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
export default siteMap;