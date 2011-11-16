function(doc) {
  if (doc.title && doc.state != "archive" ) {
    emit(doc._id, doc);
  }
};