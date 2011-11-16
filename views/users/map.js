function(doc) {
  if (doc.users) {
     for (user in doc.users ) {
        emit(doc.users[user], doc);
    }
  }
};
