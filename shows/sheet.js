function(doc, req) {
  // top two lines have to come first or else parent references in the ddoc
  // which are created by calls to require will break JSON.stringify.
  var name, stub, ddoc = this,
    mustache = require("vendor/couchapp/lib/mustache"),
    wiki = require("lib/wiki"),
    data = {
      ddoc : JSON.stringify(require("vendor/couchapp/lib/code").ddoc(ddoc), function(key, value) {
        return (key == "parent") ? undefined : value;
      }),
      docid : JSON.stringify(req.id),
      _id : req.id,
      path : "../page/"+req.id,
      site_title : this.couchapp.name
    };
    
    
  if (doc) {
    if (doc.markdown) {
      data.body = wiki.encode(doc.markdown);
    }
    data.title = doc.title;
    
    // for notzp, automatic?
    data._rev = doc._rev;
    data.markdown = doc.markdown;
    data.log = doc.log;

    data.type = doc.type;
    data.rel = doc.rel; 
    data.prio = doc.prio; 
    data.state = doc.state; 
    data.punct = doc.punct; 
    data.queue = doc.queue; 
    data.user = doc.user; 
    data.ddate = doc.ddate;
    
    if ( doc.type.length > 5 ) { // TODO TODO !!! das muss auf doc.type = "ticket" lauten
        data.isticket = true;
    } else {
        data.isticket = false;
    }
    
    data.title_json = JSON.stringify(doc.title);
    data.begin = "";

    data.atts = [];

    if (doc._attachments) {
      for (name in doc._attachments) {
        if (name.indexOf("rev") != 0) {
          stub = doc._attachments[name];
          data.atts.push({
            name : name,
            uri : ["","pages", req.id, name].map(encodeURIComponent).join('/'),
            type : stub.content_type
          });
        }
      }
    }
    if (data.atts.length > 0) {
      data.has_atts = true;
    }
  } else {
    data.title = "Create page: "+req.id;
    data.title_json = JSON.stringify(data.title);
    data.begin = "/edit";
  }
  return mustache.to_html(ddoc.templates.page, data, ddoc.templates.partials);
}
