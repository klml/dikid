function(doc) {
  if (doc.queues) {
     for (queue in doc.queues ) {
        emit([doc.queues[queue]], doc);
    }
  }
};
