function(doc) {
  if (doc.state && doc.state != 'archive' ) {
        emit([doc.state], doc);
    }
}
