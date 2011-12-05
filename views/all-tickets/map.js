function(doc) {
  if (doc.title && doc.state != 'archive' ) {
    //~ doc.hierarchy = 2 ;  // doesnt work on https://klml.cloudant.com/dikid/_design/dikid/_rewrite/bunch/alltickets
    emit(doc._id, doc);
  }
}