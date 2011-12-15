function(doc) {
  if (doc.punct && doc.state != 'archive' ) {
        emit([doc.punct], doc);
    }
}
