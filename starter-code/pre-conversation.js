


/**
 * Copyright IBM Corp. 2017
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const request= require('request');

/**
 * Here the user can edit the channel input message before send to Conversation module.
 *
 * @param  {JSON} params - input JSON sent by the channel module
 * @return {JSON}        - modified input JSON to be sent to the conversation module
// */
function main(params) {
  return new Promise((resolve, reject) => {
  

    if(params.raw_input_data.provider=='facebook' && params.raw_input_data.auth)
    {
      const auth = params.raw_input_data.auth;

      const getUrl = 'https://graph.facebook.com/v2.6/'+params.raw_input_data.facebook.sender.id

      return getFacebookUsername(
        params,
        getUrl,
        auth.facebook.page_access_token
        
      ).then(resolve).catch(reject)
       }
    else
    {
      
      return Promise.resolve(params);
      
      
      
    }
  
  
  
  


  

 });                     
  
}


function getFacebookUsername(params, getUrl, accessToken) {
  return new Promise((resolve, reject) => {
    
        request(
      {
        url: getUrl,
        qs: { access_token: accessToken },
        method: 'GET',
      },
      (error, response) => {
        if (error) {
          var params2= JSON.parse(JSON.stringify(params));
          params2.conversation.context.Fbusername=''
          reject(params2);
        }
        if (response) {
          if (response.statusCode === 200) {
            // Facebook expects a "200" string/text response instead of a JSON.
            // With Cloud Functions if we have to return a string/text, then we'd have to specify
            // the field "text" and assign it a value that we'd like to return. In this case,
            // the value to be returned is a statusCode.
            var params2= JSON.parse(JSON.stringify(params));
            var Fbusername = JSON.parse(response.body).first_name
            params2.conversation.context.Fbusername=Fbusername
            resolve(params2);
          }
          else
          {
            var params2= JSON.parse(JSON.stringify(params));
            params2.conversation.context.Fbusername=''
            reject(params2);
          }
          
        }
        else
        {
          var params2= JSON.parse(JSON.stringify(params));
          params2.conversation.context.Fbusername=''
          reject(params);
        }
        
        
      }
    );
   



   


  });
}

module.exports = main;
