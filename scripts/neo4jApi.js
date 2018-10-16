require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');

//var Blacklist = require('./models/Blacklist');
//var BlacklistItem = require('./models/BlacklistItem');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "admin"));

function createNewUser() {

}

function getBlacklist(userID) {
  var session = driver.session();
  return session
    .run(
      "MATCH (user: User {email:{userID}})-[:HAS_BLACKLIST]->(blacklist:Blacklist) \
      OPTIONAL MATCH (blacklist)-[:HAS_ITEM]->(blacklistItem:BlacklistItem) \
      RETURN collect([blacklistItem.title, blacklistItem.url]) AS items"
      {userID}
    )
    .then(result => {
      session.close();

      if (_.isEmpty(result.records))
        return null;

      var record = result.records[0];
      return new BlacklistItem(record.get('title'), record.get('url'));
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function addBlacklistItem() {
  var session = driver.session();
  var urlInput = $("#url").find("input[name=url]").val();
  return session
    .run(
      "MATCH (blacklist: Blacklist {Title: 'testlist'}) \
      CREATE (blacklist)-[:HAS_ITEM]->(newBlacklistItem: blacklistItem {url: urlInput})"
      {urlInput}
    )
    .then(result => {
      session.close();
      return null;
    })
    .catch(error => {
      session.close();
      throw error;
    });
}
