/**
 *
 * Config file for PM2 integration
 *
 * @version $Id: $
 *
 */

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: 'config/.env'});
const instanceName = process.env.INSTANCE_NAME || 'local-ea';
const previewInstanceName = instanceName + '-preview';

const nodeArgs = process.env.NODE_ARGS || '--max-old-space-size=4096';
const maxMemoryRestart = process.env.MAX_MEMORY_RESTART || '3500M';

// If you want to set a different path in local dev machine, we can make this an environment variable as well.
const logPath = path.join(__dirname, '../../logs/');

module.exports = {
  apps: [

    /**
     * EA Application configuration section
     */

    {
      name: 'Frontend',
      script: path.join(__dirname, 'server/server.js'),
      instances: process.env.INSTANCES,
      exec_mode: 'cluster',
      output: path.join(logPath, instanceName, instanceName + '.out'),
      error: path.join(logPath, instanceName, instanceName + '.err'),
      log: path.join(logPath, instanceName, instanceName + '.log'),
      merge_logs: true,
      node_args: nodeArgs,
      log_date_format: 'YYYY-MM-DD HH:mm',
      max_memory_restart : maxMemoryRestart,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        INSTANCE_NAME: instanceName,
        SERVICE_PATH: process.env.SERVICE_PATH,
        PORT: process.env.PORT,
        APP_HOST: process.env.APP_HOST,
        SECURE_PORT:process.env.SECURE_PORT,
        TLS_KEY:process.env.TLS_KEY,
        TLS_CERT:process.env.TLS_CERT,
        TLS_CA:process.env.TLS_CA,
        WS_TLS_KEY:process.env.WS_TLS_KEY,
        WS_TLS_CERT:process.env.WS_TLS_CERT,
        WS_TLS_CA:process.env.WS_TLS_CA,
        PB_TLS_KEY:process.env.PB_TLS_KEY,
        PB_TLS_CERT:process.env.PB_TLS_CERT,
        PB_TLS_CA:process.env.PB_TLS_CA,
        PBK_TLS_KEY:process.env.PBK_TLS_KEY,
        PBK_TLS_CERT:process.env.PBK_TLS_CERT,
        PBK_TLS_CA:process.env.PBK_TLS_CA,
        PBT_TLS_KEY:process.env.PBT_TLS_KEY,
        PBT_TLS_CERT:process.env.PBT_TLS_CERT,
        PBT_TLS_CA:process.env.PBT_TLS_CA,
        WE_TLS_KEY:process.env.WE_TLS_KEY,
        WE_TLS_CERT:process.env.WE_TLS_CERT,
        WE_TLS_CA:process.env.WE_TLS_CA
      },
      env_dev: { },
      env_local: {
        NODE_ENV: 'production',
        APP_HOST:'localhost',
        PORT:8080,
        SERVICE_PATH:'http://172.16.213.83:8080',
        ENVIRONMENT:'sit',
        TLS_ENABLE:'true',
        COR_ID:'local',
        AUTH_KEY:'0DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
        SECURE_PORT: 8443,
        TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        WS_TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        WS_TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        WS_TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        PB_TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        PB_TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        PB_TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        PBK_TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        PBK_TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        PBK_TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        PBT_TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        PBT_TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        PBT_TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        WE_TLS_KEY: 'C:\\LP\\node_certs\\newatg.key',
        WE_TLS_CERT: 'C:\\LP\\node_certs\\newatg.crt',
        WE_TLS_CA: 'C:\\LP\\node_certs\\newatginter.crt',
        INSTANCE_NAME:'local-ea'
       },
      env_sit: {
        NODE_ENV: 'production',
        //SERVICE_PATH:'',
        ENVIRONMENT:'sit',
        TLS_ENABLE:'true',
        /*TLS_KEY:'/u01/oracle/atg/data/certificates/node/certificados/newatg.key',
        TLS_CERT:'/u01/oracle/atg/data/certificates/node/certificados/newatg.crt',
        TLS_CA:'/u01/oracle/atg/data/certificates/node/certificados/newatginter.crt',
        WS_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgWS.key',
        WS_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWS.crt',
        WS_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWS.crt',
        WE_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBWE.key',
        WE_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWE.crt',
        WE_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWE.crt',
        PB_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPB.key',
        PB_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPB.crt',
        PB_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPB.crt',
        PBT_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBT.key',
        PBT_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBT.crt',
        PBT_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBT.crt',
        PBK_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBK.key',
        PBK_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBK.crt',
        PBK_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBK.crt',*/
        COR_ID:'23f585945be2f'
        //AUTH_KEY:'DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
       },
      env_qa: {
        NODE_ENV: 'production',
        ENVIRONMENT:'qa',
        TLS_ENABLE:'true',
       /* TLS_KEY:'/u01/oracle/atg/data/certificates/node/certificados/newatg.key',
        TLS_CERT:'/u01/oracle/atg/data/certificates/node/certificados/newatg.crt',
        TLS_CA:'/u01/oracle/atg/data/certificates/node/certificados/newatginter.crt',
        WS_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgWS.key',
        WS_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWS.crt',
        WS_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWS.crt',
        WE_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBWE.key',
        WE_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWE.crt',
        WE_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWE.crt',
        PB_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPB.key',
        PB_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPB.crt',
        PB_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPB.crt',
        PBT_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBT.key',
        PBT_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBT.crt',
        PBT_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBT.crt',
        PBK_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBK.key',
        PBK_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBK.crt',
        PBK_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBK.crt',*/
        COR_ID:'23f585945be2f'
        //AUTH_KEY:'DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
       },
      env_prod: {
       /* NODE_ENV: 'production',
        ENVIRONMENT:'prod',
        TLS_ENABLE:'false',*/
      }
    },


    /**
     * EA Preview Application configuration section
     */
    {
      name: 'LP_Frontend_EA_Preview',
      script: path.join(__dirname, 'server/server.js'),
      instances: process.env.INSTANCES,
      exec_mode: 'cluster',
      output: path.join(logPath, previewInstanceName, previewInstanceName + '.out'),
      error: path.join(logPath, previewInstanceName, previewInstanceName + '.err'),
      log: path.join(logPath, previewInstanceName, previewInstanceName + '.log'),
      merge_logs: true,
      node_args: nodeArgs,
      log_date_format: 'YYYY-MM-DD HH:mm',
      max_memory_restart : maxMemoryRestart,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        INSTANCE_NAME: previewInstanceName,
        SERVICE_PATH: process.env.PREVIEW_SERVICE_PATH,
        PORT: process.env.PREVIEW_PORT,
        APP_HOST: process.env.APP_HOST,
        SECURE_PORT:process.env.PREVIEW_SECURE_PORT,
        TLS_KEY:process.env.TLS_KEY,
        TLS_CERT:process.env.TLS_CERT,
        TLS_CA:process.env.TLS_CA,
        WS_TLS_KEY:process.env.WS_TLS_KEY,
        WS_TLS_CERT:process.env.WS_TLS_CERT,
        WS_TLS_CA:process.env.WS_TLS_CA,
        PB_TLS_KEY:process.env.PB_TLS_KEY,
        PB_TLS_CERT:process.env.PB_TLS_CERT,
        PB_TLS_CA:process.env.PB_TLS_CA,
        PBK_TLS_KEY:process.env.PBK_TLS_KEY,
        PBK_TLS_CERT:process.env.PBK_TLS_CERT,
        PBK_TLS_CA:process.env.PBK_TLS_CA,
        PBT_TLS_KEY:process.env.PBT_TLS_KEY,
        PBT_TLS_CERT:process.env.PBT_TLS_CERT,
        PBT_TLS_CA:process.env.PBT_TLS_CA,
        WE_TLS_KEY:process.env.WE_TLS_KEY,
        WE_TLS_CERT:process.env.WE_TLS_CERT,
        WE_TLS_CA:process.env.WE_TLS_CA
      },
      env_dev: { },
      env_local: {
        NODE_ENV: 'production',
        APP_HOST:'localhost',
        PORT:8081,
        SERVICE_PATH:'http://172.16.213.83:8080',
        ENVIRONMENT:'sit',
        TLS_ENABLE:'false',
        COR_ID:'local-preview',
        AUTH_KEY:'0DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F',
        INSTANCE_NAME:'local-ea'
       },
      env_sit: {
        NODE_ENV: 'production',
        //SERVICE_PATH:'http://qropagsot07.liverpool.com.mx:8096',
         // SERVICE_PATH:'http://172.16.213.84:8081',
        // SERVICE_PATH:'http://172.16.213.83:8080',
        STATIC_ASSETS_PATH:'',
        ENVIRONMENT:'sit',
        TLS_ENABLE:'false',
       /* TLS_KEY:'/u01/oracle/atg/data/certificates/node/certificados/newatg.key',
        TLS_CERT:'/u01/oracle/atg/data/certificates/node/certificados/newatg.crt',
        TLS_CA:'/u01/oracle/atg/data/certificates/node/certificados/newatginter.crt',
        WS_TLS_KEY:'/u01/oracle/atg/data/certificates/node/pwaws.key',
        WS_TLS_CERT:'/u01/oracle/atg/data/certificates/node/pwaws.crt',
        WS_TLS_CA:'/u01/oracle/atg/data/certificates/node/pwaws.crt',
        WE_TLS_KEY:'/u01/oracle/atg/data/certificates/node/pwawe.key',
        WE_TLS_CERT:'/u01/oracle/atg/data/certificates/node/pwawe.crt',
        WE_TLS_CA:'/u01/oracle/atg/data/certificates/node/pwawe.crt',
        PB_TLS_KEY:'/u01/oracle/atg/data/certificates/node/pwapb.key',
        PB_TLS_CERT:'/u01/oracle/atg/data/certificates/node/pwapb.crt',
        PB_TLS_CA:'/u01/oracle/atg/data/certificates/node/pwapb.crt',
        PBT_TLS_KEY:'/u01/oracle/atg/data/certificates/node/pwapbt.key',
        PBT_TLS_CERT:'/u01/oracle/atg/data/certificates/node/pwapbt.crt',
        PBT_TLS_CA:'/u01/oracle/atg/data/certificates/node/pwapbt.crt',
        PBK_TLS_KEY:'/u01/oracle/atg/data/certificates/node/pwapbk.key',
        PBK_TLS_CERT:'/u01/oracle/atg/data/certificates/node/pwapbk.crt',
        PBK_TLS_CA:'/u01/oracle/atg/data/certificates/node/pwapbk.crt',*/
        COR_ID:'23f585945be2f'
        //AUTH_KEY:'DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F'
      },
      env_qa: {
        NODE_ENV: 'production',
        ENVIRONMENT:'qa',
        TLS_ENABLE:'false',
        /*TLS_KEY:'/u01/oracle/atg/data/certificates/node/certificados/newatg.key',
        TLS_CERT:'/u01/oracle/atg/data/certificates/node/certificados/newatg.crt',
        TLS_CA:'/u01/oracle/atg/data/certificates/node/certificados/newatginter.crt',
        WS_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgWS.key',
        WS_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWS.crt',
        WS_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWS.crt',
        WE_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBWE.key',
        WE_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgWE.crt',
        WE_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterWE.crt',
        PB_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPB.key',
        PB_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPB.crt',
        PB_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPB.crt',
        PBT_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBT.key',
        PBT_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBT.crt',
        PBT_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBT.crt',
        PBK_TLS_KEY:'/u01/oracle/atg/data/certificates/node/newatgPBK.key',
        PBK_TLS_CERT:'/u01/oracle/atg/data/certificates/node/newatgPBK.crt',
        PBK_TLS_CA:'/u01/oracle/atg/data/certificates/node/newatginterPBK.crt',*/
        COR_ID:'23f585945be2f'
       // AUTH_KEY:'DJK7uDwZx5O49dWfKE2tfuCPhr6Dqw%2F'
      },
      env_prod: {
      /*  NODE_ENV: 'production',
        ENVIRONMENT:'prod',*/
        TLS_ENABLE:'false'
      }
    }

  ]
};
