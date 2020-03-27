/**
 * Module Name : Breadcrumb Module.
 * Functionality : Breadcrumb implimentation on each page. This Component will help for reder Breadcrumb content in required pages.
 * @exports  : Breadcrumb HTML Content
 * @requires : module:atoms/Link/Link#Link
 * @requires : module:atoms/List/List#List
 * @requires : module:atoms/Ul/Ul#Ul
 * @requires : module:atoms/Icons/Icons#Icons
 * @requires : module:lodash/isEmpty
 * @requires : module:lodash/map
 * Team : B&S, My Account Team.
 * 
 */
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
//import './Breadcrumb.styl';
//import Image from '../../atoms/Tagimage/Image';
import Link from '../../atoms/Link/Link';
import List from '../../atoms/List/List';
import Ul from '../../atoms/Ul/Ul';
import Icons from '../../atoms/Icons/Icons';
export default (props) => {
                                                /* production observation#158 */
    const { label, breadcrumbData = {}, searchTerm = '',termFromService ='', isPdp = false, isClp = false, isWishList = '', isMyAccount = false , Invoice = false } = props.breadcrumbInfo || {}; // changes for 23389 breadcrumb null check 
     
    return (
        <div className="container-fluid">
            <div className="container">
                <div className="row p-0">
                    <div className="m-breadcrumb">
                        <Ul className="m-breadcrumb-list">
                            <List>
                                <Link className="a-breadcrumb__label" href="/tienda/home">Home</Link><span className="a-breadcrumb" ><Icons className="icon-arrow_right" /></span>
                            </List>
                            {  /* production observation#158 */
                                isEmpty(termFromService) ? breadcrumbData && !isEmpty(breadcrumbData) && map(breadcrumbData, (item, index) => { // changes for 23389 breadcrumb null check 
                                    let categoryId = item.properties && item.properties["category.repositoryId"] || "";
                                    let url = item.navigationState || "/";
                                    let txt = item.label || '';
                                    if (isPdp) {
                                        categoryId = item.categoryId || '';
                                        url = item.categoryUrl || '';
                                        txt = item.categoryName || '';
                                    }
                                    let asInfo = '/tienda' + url.substr(0, url.lastIndexOf('/') + 1) + categoryId;
                                    let href = `/tienda/twoColumnCategoryPage?categoryId=${categoryId}`;
                                    if (isClp) {
                                        asInfo = '/tienda' + item.viewAllUrl;
                                        url = item.viewAllUrl;
                                        const arr_url = url.split('/');
                                        categoryId = arr_url[arr_url.length - 1];
                                        href = `/tienda/twoColumnCategoryPage?categoryId=${categoryId}`;
                                        txt = item.categoryName || '';
                                    }
                                    if (isMyAccount) {
                                        asInfo = '/tienda' + item.navigationState;
                                        href = '/tienda' + item.navigationState;
                                    }
                                    if(Invoice){
                                        asInfo = item.navigationState;
                                        href = item.navigationState;
                                    }
                                    if (props.removeIconAtLast == true) {
                                        return (index === 1) ?
                                                    <List key={index}>
                                                        <Link className="a-breadcrumb__label" href='#'>{txt}</Link><span className="a-breadcrumb" ><Icons className="icon-arrow_right iconSmallText" /></span>
                                                    </List>
                                                    :
                                                        breadcrumbData.length !== index + 1 ? 
                                                        <List key={index}>
                                                            <Link classNameAnchor="a-breadcrumb__label" href={href} asInfo={asInfo}>{txt}</Link><span className="a-breadcrumb" ><Icons className="icon-arrow_right iconSmallText" /></span>
                                                        </List>
                                                        :
                                                        <List key={index} className="active">
                                                            <Link classNameAnchor="a-breadcrumb__label" href={href} asInfo={asInfo}>{txt}</Link>
                                                        </List>
                                    }
                                    else{
                                        if (!isMyAccount && index === 1) {
                                            return <List key={index}>
                                                <Link className="a-breadcrumb__label" href="#">{txt}</Link><span className="a-breadcrumb" ><Icons className="icon-arrow_right iconSmallText" /></span>
                                            </List>
                                        } else {
                                            return <List key={index}>
                                                <Link classNameAnchor="a-breadcrumb__label" href={href} asInfo={asInfo}>{txt}</Link><span className="a-breadcrumb" ><Icons className="icon-arrow_right iconSmallText" /></span>
                                            </List>
                                        }
                                    }

                                }) :
                                    <List className="active">
                                        <Link className="a-breadcrumb__label" href="#" >{termFromService}</Link> 
                                    </List>
                            }
                            {
                                isEmpty(termFromService) && !isEmpty(label) && isEmpty(isWishList) ? /* production observation#158 */
                                    <List className="active">
                                        <Link className="a-breadcrumb__label" href="#" id="abc">{label}</Link>
                                    </List> : null
                            }
                            {
                                !isEmpty(isWishList) && !isEmpty(label) ?
                                    <List className="active">
                                        <Link className="a-breadcrumb__label" href="#" id="abc1">{label}</Link>
                                    </List> : null
                            }
                        </Ul>
                    </div>
                </div>
            </div>
        </div>
    );
}