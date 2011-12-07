function(doc) {
  if (doc.title && doc.state != 'archive' ) {
    var _doc =  JSON.parse(JSON.stringify(doc)); 
    _doc.hierarchy = 2 ;
    emit(_doc._id, _doc);
  }
}