function(doc) {
  if (doc.duedate && doc.state != 'archive' ) {
        emit([doc.duedate], doc);
    }
}