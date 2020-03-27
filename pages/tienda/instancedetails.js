import React from 'react';
import { withRouter } from 'next/router'

export default withRouter((props) => {

 
  return (
    <div>
        <div> <b>EA Instance Details</b> </div>
        <div>EA Status: {props.router.query.data.NODE_ENV || ''}</div>
        <div>EA Environment: {props.router.query.data.ENVIRONMENT || ''}</div>
        <div>EA Instance Name: {props.router.query.data.INSTANCE_NAME || ''}</div>
        <br/>
        <div> <b>AA Instance Details</b> </div>
        <div>AA Status: {(props.router.query.data && props.router.query.data.AADetails )? props.router.query.data.AADetails.NODE_ENV : ''}</div>
        <div>AA Environment: {(props.router.query.data && props.router.query.data.AADetails )?props.router.query.data.AADetails.ENVIRONMENT : ''}</div>
        <div>AA Instance Name: {(props.router.query.data && props.router.query.data.AADetails )? props.router.query.data.AADetails.INSTANCE_NAME : ''}</div>
        <br/>
        <div> <b>Service Instance Details</b> </div>
        <div>Oracel server: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData.server:''}</div>
        <div>x-oracle-dms-ecid: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData['x-oracle-dms-ecid']:''}</div>
        <div>x-oracle-dms-rid: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData['x-oracle-dms-rid']:''}</div>
        <div>lp-commerce-hostname: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData['lp-commerce-hostname']:''}</div>
        <div>x-atg-version: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData['x-atg-version']:''}</div>
        <div>via: {(props.router.query.data && props.router.query.data.globalServiceData )? props.router.query.data.globalServiceData.via :''}</div>
        <br/>
        <div> <b>Profile  Details</b> </div>
        <div>profile error code: {props.router.query.data.profile? props.router.query.data.profile.code : ''}</div>
        <div>profile error message: {props.router.query.data.profile? props.router.query.data.profile.message : ''}</div>
        <div>Profile ID: {props.router.query.data.profile? props.router.query.data.profile.profileId : ''}</div>
        <div>profile isProfileTransient: {props.router.query.data.profile? props.router.query.data.profile.transient : ''}</div>
        <div>profile activeDataCenter: {props.router.query.data.profile? props.router.query.data.profile.activeDataCenter : ''}</div>
        <div>profile server: {props.router.query.data.profile? props.router.query.data.profile.server : ''}</div>
       
        <br/>
        <div> <b>Order  Details</b> </div>
        <div>Order error code: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.code : ''}</div>
        <div>Order error message: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.message : ''}</div>
        <div>Order ID: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.orderId : ''}</div>
        <div>Order state: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.state : ''}</div>
        <div>Order currentSite: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.currentSite : ''}</div>
        <div>Order creationSite: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.creationSite : ''}</div>
        <div>Order creationDate: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.creationDate : ''}</div>
        <div>Order lastModifiedDate: {props.router.query.data.orderInfo? props.router.query.data.orderInfo.lastModifiedDate : ''}</div>
        
        <br/>
        <div> <b>Shipping Group  Details</b> </div>
        <div>Shipping Groups: {props.router.query.data.shippingGroupInfo? props.router.query.data.shippingGroupInfo : ''}</div>
        <br/>
        <div> <b>commerceItemsInfo  Details</b> </div>
        <div>commerceItemsInfos : {props.router.query.data.commerceItemsInfo? props.router.query.data.commerceItemsInfo : ''}</div>
        <br/>
        <br/>
    </div>
  );
});