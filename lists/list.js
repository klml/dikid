function() {
  var row, ddoc = this,
    mustache = require("vendor/couchapp/lib/mustache"),
    markdown = require("vendor/couchapp/lib/markdown"),
    data = {
      pagetitle : "blurb of",
      site_title : this.couchapp.name,
      tickets : []
    };

  provides("html", function() {
    while (row = getRow()) {
      log(row);
      //~ data.tickets.push(row.value)
      data.tickets.push({
        _id : row.value._id,
        _rev : row.value._rev,
        markdown : row.value.markdown,
        parents : row.value.parents,
        //~ parentslength : row.value.parents.length,
        state : row.value.state,
        users : row.value.users,
        queues : row.value.queues,
        title : row.value.title,
        prio : row.value.prio,
        duedate : row.value.duedate,
        type : row.value.type,
      });
    }
    send(mustache.to_html(ddoc.templates.list, data, ddoc.templates.partials));
  });
};
