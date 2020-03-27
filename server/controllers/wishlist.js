const { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper } = require('../../server/nextwrapper');
const utilities = require('../helpers/Utility.js');
const appProperties = require('../../client/config/appProperties.js')

module.exports = {
    displayWishlistItems: async (req, reply, app) => {
         try {
            let wishListDetailsApi = utilities.getFinalServiceURL(appProperties.displaywishlistitems_santa,req);
            let wishListData = await utilities.serviceReq(req, wishListDetailsApi, 'POST', {"wishListId":req.query.wishListId});
            wishListData.data.wishListId=req.query.wishListId;
            let wishListPageRes = await defaultHandlerWrapper(app, { wishlistPageContent: wishListData.data, hostname: req.info.hostname })(req,"/tienda/wishlist");
            return reply.response(wishListPageRes).header('set-cookie', wishListData.headers['set-cookie']);
        } catch (e) {
            return reply.response(e.message);
        }

    },
    removeItemFromWishlist: async (req, reply, app) => {
        try {
           let removeWishListDetailsApi = utilities.getFinalServiceURL(appProperties.removeitemfromwishlist_santa,req);
           const response = await utilities.serviceReq(req, removeWishListDetailsApi, 'POST',req.payload);
           return reply.response(response.data).header('set-cookie', response.headers['set-cookie']);
       } catch (e) {
           return reply.response(e.message);
       }
   },
   addmultiplewishlistitems: async (req, reply, app) => {
       try {
          let addItemsWishListApi = utilities.getFinalServiceURL(appProperties.addmultiplewishlistitems_santa,req);
          const response = await utilities.serviceReq(req, addItemsWishListApi, 'POST',req.payload);
          return reply.response(response.data).header('set-cookie', response.headers['set-cookie']);
      } catch (e) {
          return reply.response(e.message);
      }

  }
}
