function(doc) {
  if ( doc.state != 'archive' ) {
     for (user in doc.users ) {
        emit([doc.users[user]], doc);
    }
  }
}