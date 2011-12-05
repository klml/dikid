function(doc) {
  if (doc.prio && doc.state != 'archive' ) {
        emit([doc.prio], doc);
    }
}
