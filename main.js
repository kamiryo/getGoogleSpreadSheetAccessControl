
/*
【参考】
Node.jsでGoogle SpreadSheetsを操作してみよう。【GAS不使用】
https://dotstud.io/blog/google-spreadsheets-from-nodejs/

Google Sheets クイックスタートが5分でできない
https://qiita.com/kajirikajiri/items/e5de5e0d1f77eb304bec
*/

/*
【事前準備1:client_secret.jsonのDownload】
1.https://console.developers.google.com/start/api?id=sheets.googleapis.com
2.OAuth同意画面の作成
3.認証情報を作成 -> OAuthクライアントID
4.client_secret_xxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com.jsonのダウンロード
5.client_secret.jsonへリネーム

【事前準備2:npmの準備】
npm init -y
npm install googleapis google-auth-library
*/

/*
【アクセストークンの取得】
1.main.jsの実行
2.URLを入力
3.シートのユーザを入力
4.コードを入力
$ node main.js 
Authorize this app by visiting this url:  https://accounts.google.com/o/oauth2/v2/auth?********
Enter the code from that page here: *****************************************
TOKEN GET SUCCESS
Token stored to .sheets.googleapis.com-nodejs-quickstart.json
$
.client_secret.json
.access_token.json
*/

var fs = require('fs')
var readline = require('readline')
var { google } = require('googleapis')
var { OAuth2Client } = require('google-auth-library')

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
var TOKEN_PATH = '.access_token.json'

// client_secret.jsonの読み込み
fs.readFile('.client_secret.json', function processClientSecrets(
  err,
  content
) {
  if (err) {
    console.log('client_secret.jsonの読み込みエラー ' + err)
    return
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  authorize(JSON.parse(content), done)
})
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret
  var clientId = credentials.installed.client_id
  var redirectUrl = credentials.installed.redirect_uris[0]
  var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      callback(oauth2Client)
    }
  })
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url: ', authUrl)
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close()
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        return
      }
      oauth2Client.credentials = token
      storeToken(token)
      callback(oauth2Client)
    })
  })
}
/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
    if (err) return console.error(err)
    console.log('Token stored to', TOKEN_PATH)
  })
}
/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function done(auth) {
    console.log('TOKEN GET SUCCESS');
}