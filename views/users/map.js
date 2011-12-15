function(doc) {
  if (doc.users && doc.state != 'archive' ) {
     for (user in doc.users ) {
        emit([doc.users[user]], doc);
    }
  }
}