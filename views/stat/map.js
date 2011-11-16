function(doc) {
  if (doc.title) {
    emit(doc.prio, doc);
  }
};