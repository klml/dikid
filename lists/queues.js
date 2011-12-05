function() {
  var row, ddoc = this,
    mustache = require("vendor/couchapp/lib/mustache"),
    markdown = require("vendor/couchapp/lib/markdown"),
    data = {
      pagetitle : "queues", // rewrite.title, TODO
      site_title : this.couchapp.name,
      tickets : []
    };

  provides("html", function() {
    while (row = getRow()) {
      log(row);
      data.tickets.push(row.value)
    }
    send(mustache.to_html(ddoc.templates.bunch, data, ddoc.templates.partials));
  });
};
