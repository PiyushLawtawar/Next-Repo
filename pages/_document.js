import Document, { Head, Main, NextScript } from 'next/document';
// import Head from 'next/head';
import Helmet from 'react-helmet';
import { withRouter } from 'next/router';
import { getAssetsPath } from '../client/helpers/utilities/utility';
// import appConfig from '../lib/config/appconfig';


class LiverpoolDocument extends Document {
  static async getInitialProps (...args) {
    const documentProps = await super.getInitialProps(...args)
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return { ...documentProps, helmet: Helmet.renderStatic() }
  }

  // should render on <html>
  get helmetHtmlAttrComponents () {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  // should render on <body>
  get helmetBodyAttrComponents () {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  // should render on <head>
  get helmetHeadComponents () {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map(el => this.props.helmet[el].toComponent())
  }
    render() {
        const site = this.props.__NEXT_DATA__.query.site || 'lp';
        let enableChatbotFlag = true;
        if(this.props.__NEXT_DATA__ && this.props.__NEXT_DATA__.props && this.props.__NEXT_DATA__.props.pageProps
            && this.props.__NEXT_DATA__.props.pageProps.flags){
                enableChatbotFlag = this.props.__NEXT_DATA__.props.pageProps.flags.enableChatbotFlag;
        }
        const hostname = (this.props.__NEXT_DATA__ && this.props.__NEXT_DATA__.query && this.props.__NEXT_DATA__.query.data && this.props.__NEXT_DATA__.query.data.hostname) ||'';
        let AssetsPath = getAssetsPath(( typeof window !=='undefined' ?window :undefined), hostname, process)
        return (
            <html lang="es" {...this.helmetHtmlAttrComponents}>
                <Head>
                    {this.helmetHeadComponents}
                    <meta name='viewport' content='viewport-fit=cover, width=device-width,user-scalable=no, initial-scale=1.0, maximum-scale=1,user-scalable=0' />
                    <meta name="format-detection" content="telephone=no"></meta>
                    <script type="text/javascript" src={AssetsPath+"/static/js/lazyload.min.js"}></script>
                </Head>

                <body className={site} {...this.helmetBodyAttrComponents}>
                    <Main site={site} />
                    <NextScript />
                   {enableChatbotFlag?
                    (process.env.CHATBOT_URL?<script defer src={process.env.CHATBOT_URL}></script>
                    :
                    process.env.CHATBOT_APP && process.env.CHATBOT_APP==='true'?<script defer src={AssetsPath+"/static/js/chatbot_Laucher.js"} ></script>:""
                    )
                    :""
                }
                </body>
            </html>
        );
    }
}

export default withRouter(LiverpoolDocument);
