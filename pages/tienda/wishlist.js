import React from 'react';
import { withRouter } from 'next/router'
//import '../../assets/stylus/global.styl';
import Wishlist from '../../client/components/templates/wishlist/wishlist';
export default withRouter((props) => {
  // Get site query parameter, default is lp
  const site = (props.router && props.router.query && props.router.query.site) || 'wishlist';
  // Header API Call
  // const dataFromAPICall = require('../../lib/config/datasource/header.json');
  const articleDetails = {
    text: "WishList Page",
    headerStyle: "a-paragraph__primary"
  };
  return (
    <React.Fragment>
     <Wishlist headerData={props.router.query.data}
      Wishlist = {props.router && props.router.query && props.router.query.data && props.router.query.data.wishlistPageContent}
      />
    </React.Fragment>
  );
});
